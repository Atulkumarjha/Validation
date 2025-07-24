import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { ValidationError } from '@/types/global';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { phone, name, password } = await request.json();

    if (!phone || !name || !password) {
      return NextResponse.json(
        { error: 'Phone, name, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry to 10 minutes from now
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Store temporary data in a simple way (in production, use Redis or similar)
    // For now, we'll create a temporary user document
    const tempUser = new User({
      name,
      phone,
      password, // Will be hashed later during registration
      otpToken: otp,
      otpExpiry: otpExpiry,
      isPhoneVerified: false,
      isPanVerified: false
    });

    // Don't save yet, just validate
    await tempUser.validate();

    // Store OTP data temporarily (in production, use Redis)
    globalThis.tempSignupData = globalThis.tempSignupData || {};
    globalThis.tempSignupData[phone] = {
      name,
      password,
      otp,
      otpExpiry: otpExpiry.toISOString()
    };

    // In a real application, you would send the OTP via SMS service
    console.log(`Sign-up OTP for ${phone}: ${otp}`);

    return NextResponse.json(
      {
        message: 'OTP sent successfully',
        // Remove this in production - only for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send signup OTP error:', error);
    
    const validationError = error as ValidationError;
    if (validationError.name === 'ValidationError') {
      const messages = Object.values(validationError.errors).map((err) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
