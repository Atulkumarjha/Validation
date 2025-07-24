import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const phone = formData.get('phone') as string;
    const panNumber = formData.get('panNumber') as string;
    const panCardImage = formData.get('panCardImage') as File;

    if (!phone || !panNumber || !panCardImage) {
      return NextResponse.json(
        { error: 'Phone, PAN number, and PAN card image are required' },
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

    // Check if phone is verified
    if (!user.isPhoneVerified) {
      return NextResponse.json(
        { error: 'Phone number must be verified first' },
        { status: 400 }
      );
    }

    // Validate PAN number format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid PAN number format' },
        { status: 400 }
      );
    }

    // Check if PAN already exists for another user
    const existingPan = await User.findOne({ 
      panNumber: panNumber.toUpperCase(),
      _id: { $ne: user._id }
    });
    
    if (existingPan) {
      return NextResponse.json(
        { error: 'This PAN number is already registered with another account' },
        { status: 409 }
      );
    }

    // Convert image to base64 for storage (in production, use cloud storage)
    const bytes = await panCardImage.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${panCardImage.type};base64,${buffer.toString('base64')}`;

    // In a real application, you would:
    // 1. Upload image to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Verify PAN using government APIs
    // 3. Perform OCR to extract and verify PAN number from image
    
    // For demo purposes, we'll simulate verification success
    const isVerified = Math.random() > 0.2; // 80% success rate

    const updateData: any = {
      panNumber: panNumber.toUpperCase(),
      panCardImage: base64Image,
      isPanVerified: isVerified
    };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    );

    if (isVerified) {
      return NextResponse.json(
        {
          message: 'PAN verification successful',
          user: {
            id: updatedUser._id,
            name: updatedUser.name,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
            panNumber: updatedUser.panNumber,
            isPhoneVerified: updatedUser.isPhoneVerified,
            isPanVerified: updatedUser.isPanVerified
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'PAN verification failed. Please check your details and try again.' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('PAN verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
