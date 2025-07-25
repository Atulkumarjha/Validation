import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { ValidationError } from '@/types/global';
import { getClientIpAddress, getCountryFromIp } from '@/lib/geolocation';

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

    // Get user's IP address and country
    const ipAddress = getClientIpAddress(request);
    const countryData = await getCountryFromIp(ipAddress);
    const country = countryData?.country || 'Unknown';

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

    // Store OTP data temporarily
    globalThis.tempSignupData = globalThis.tempSignupData || {};
    globalThis.tempSignupData[phone] = {
      name,
      password,
      otp,
      otpExpiry: otpExpiry.toISOString(),
      country,
      ipAddress
    };

    return NextResponse.json(
      {
        message: 'OTP sent successfully'
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
