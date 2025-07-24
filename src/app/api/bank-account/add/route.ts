import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BankAccount from '@/models/BankAccount';
import User from '@/models/User';
import { MongoError, ValidationError } from '@/types/global';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const {
      userId,
      phone,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      accountType
    } = await request.json();

    // Validate required fields
    if (!userId || !phone || !accountHolderName || !accountNumber || !ifscCode || !bankName || !branchName || !accountType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify user exists and is PAN verified
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isPanVerified) {
      return NextResponse.json(
        { error: 'PAN verification required before adding bank account' },
        { status: 403 }
      );
    }

    // Check if account number already exists
    const existingAccount = await BankAccount.findOne({ accountNumber });
    if (existingAccount) {
      return NextResponse.json(
        { error: 'Bank account with this account number already exists' },
        { status: 409 }
      );
    }

    // Create new bank account
    const bankAccount = new BankAccount({
      userId,
      phone,
      accountHolderName,
      accountNumber,
      ifscCode: ifscCode.toUpperCase(),
      bankName,
      branchName,
      accountType: accountType.toLowerCase(),
      isVerified: false // Will be verified later through bank verification process
    });

    const savedBankAccount = await bankAccount.save();

    // Return success response with masked account number
    return NextResponse.json(
      {
        message: 'Bank account added successfully',
        bankAccount: {
          id: savedBankAccount._id,
          userId: savedBankAccount.userId,
          phone: savedBankAccount.phone,
          accountHolderName: savedBankAccount.accountHolderName,
          maskedAccountNumber: savedBankAccount.maskedAccountNumber,
          ifscCode: savedBankAccount.ifscCode,
          bankName: savedBankAccount.bankName,
          branchName: savedBankAccount.branchName,
          accountType: savedBankAccount.accountType,
          isVerified: savedBankAccount.isVerified,
          createdAt: savedBankAccount.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Add bank account error:', error);
    
    const mongoError = error as MongoError;
    const validationError = error as ValidationError;
    
    if (mongoError.code === 11000) {
      return NextResponse.json(
        { error: 'Bank account with this account number already exists' },
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

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const phone = searchParams.get('phone');

    if (!userId && !phone) {
      return NextResponse.json(
        { error: 'User ID or phone number is required' },
        { status: 400 }
      );
    }

    // Build query
    const query: { userId?: string; phone?: string } = {};
    if (userId) query.userId = userId;
    if (phone) query.phone = phone;

    const bankAccounts = await BankAccount.find(query)
      .select('-accountNumber') // Exclude full account number for security
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        bankAccounts: bankAccounts.map(account => ({
          id: account._id,
          userId: account.userId,
          phone: account.phone,
          accountHolderName: account.accountHolderName,
          maskedAccountNumber: account.maskedAccountNumber,
          ifscCode: account.ifscCode,
          bankName: account.bankName,
          branchName: account.branchName,
          accountType: account.accountType,
          isVerified: account.isVerified,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt
        }))
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get bank accounts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
