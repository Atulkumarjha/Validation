import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getClientIpAddress, getCountryFromIp } from '@/lib/geolocation';

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

    // Capture IP address and update country information on signin
    try {
      const ipAddress = getClientIpAddress(request);
      const countryData = await getCountryFromIp(ipAddress);
      const country = countryData?.country || 'Unknown';
      
      console.log(`Sign-in - User IP Address: ${ipAddress}, User Country: ${country}`);
      
      // Update user's IP and country information if they have changed
      let shouldUpdate = false;
      if (user.ipAddress !== ipAddress) {
        user.ipAddress = ipAddress;
        shouldUpdate = true;
      }
      if (user.country !== country) {
        user.country = country;
        shouldUpdate = true;
      }
      
      // Update last login (always update this)
      user.lastLogin = new Date();
      shouldUpdate = true;
      
      if (shouldUpdate) {
        await user.save();
      }
    } catch (error) {
      console.error('Error capturing IP/Country during signin:', error);
      // Continue with signin even if IP/Country capture fails
      user.lastLogin = new Date();
      await user.save();
    }

    return NextResponse.json(
      {
        message: 'Sign in successful',
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          country: user.country,
          ipAddress: user.ipAddress,
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
