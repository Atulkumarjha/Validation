import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone and password are required' },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if phone is verified
    if (!user.isPhoneVerified) {
      return NextResponse.json(
        { error: 'Phone number not verified. Please complete signup process.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json(
      {
        message: 'Sign in successful',
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          isPhoneVerified: user.isPhoneVerified,
          isPanVerified: user.isPanVerified,
          lastLogin: user.lastLogin
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Sign in error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
