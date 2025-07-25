import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { MongoError, ValidationError } from '@/types/global';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { phone, otp, name, password } = await request.json();

    if (!phone || !otp || !name || !password) {
      return NextResponse.json(
        { error: 'Phone, OTP, name, and password are required' },
        { status: 400 }
      );
    }

    // Get temporary signup data
    const tempData = globalThis.tempSignupData?.[phone];
    if (!tempData) {
      return NextResponse.json(
        { error: 'No signup session found. Please start sign up again.' },
        { status: 400 }
      );
    }

    console.log('TempData for verification:', tempData);

    // Check if OTP has expired
    if (new Date() > new Date(tempData.otpExpiry)) {
      delete globalThis.tempSignupData[phone];
      return NextResponse.json(
        { error: 'OTP has expired. Please start sign up again.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (tempData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check if user already exists (double check)
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      delete globalThis.tempSignupData[phone];
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user with country and IP address
    const user = new User({
      name,
      phone,
      password: hashedPassword,
      country: tempData.country,
      ipAddress: tempData.ipAddress,
      isPhoneVerified: true, // Phone is verified through OTP
      isPanVerified: false
    });

    console.log('Creating user with data:', {
      name,
      phone,
      country: tempData.country,
      ipAddress: tempData.ipAddress
    });

    const savedUser = await user.save();

    // Clean up temporary data
    delete globalThis.tempSignupData[phone];

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: savedUser._id,
          name: savedUser.name,
          phone: savedUser.phone,
          country: savedUser.country || 'Unknown',
          ipAddress: savedUser.ipAddress || 'Unknown',
          isPhoneVerified: savedUser.isPhoneVerified,
          isPanVerified: savedUser.isPanVerified
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Verify signup OTP error:', error);
    
    const mongoError = error as MongoError;
    const validationError = error as ValidationError;
    
    if (mongoError.code === 11000) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

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
