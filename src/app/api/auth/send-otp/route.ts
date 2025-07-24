import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry to 10 minutes from now
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Update user with OTP
    await User.findByIdAndUpdate(user._id, {
      otpToken: otp,
      otpExpiry: otpExpiry
    });

    // In a real application, you would send the OTP via SMS service
    // For now, we'll log it and return it in the response for testing
    console.log(`OTP for ${phone}: ${otp}`);

    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    // await sendSMS(phone, `Your verification code is: ${otp}`);

    return NextResponse.json(
      {
        message: 'OTP sent successfully',
        // Remove this in production - only for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
