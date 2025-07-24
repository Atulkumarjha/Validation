import mongoose, { Schema, Document } from 'mongoose';

export interface IBankAccount extends Document {
  userId: mongoose.Types.ObjectId;
  phone: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: 'savings' | 'current' | 'salary';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BankAccountSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    index: true
  },
  accountHolderName: {
    type: String,
    required: [true, 'Account holder name is required'],
    trim: true,
    minlength: [2, 'Account holder name must be at least 2 characters long'],
    maxlength: [100, 'Account holder name cannot exceed 100 characters']
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    unique: true,
    trim: true,
    minlength: [9, 'Account number must be at least 9 digits'],
    maxlength: [18, 'Account number cannot exceed 18 digits'],
    match: [/^\d+$/, 'Account number must contain only digits']
  },
  ifscCode: {
    type: String,
    required: [true, 'IFSC code is required'],
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code']
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
    maxlength: [100, 'Bank name cannot exceed 100 characters']
  },
  branchName: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true,
    maxlength: [100, 'Branch name cannot exceed 100 characters']
  },
  accountType: {
    type: String,
    required: [true, 'Account type is required'],
    enum: {
      values: ['savings', 'current', 'salary'],
      message: 'Account type must be savings, current, or salary'
    },
    lowercase: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
BankAccountSchema.index({ userId: 1, phone: 1 });
BankAccountSchema.index({ accountNumber: 1 }, { unique: true });
BankAccountSchema.index({ createdAt: -1 });

// Virtual for masking account number in responses
BankAccountSchema.virtual('maskedAccountNumber').get(function(this: IBankAccount) {
  if (this.accountNumber && this.accountNumber.length > 4) {
    const lastFour = this.accountNumber.slice(-4);
    const masked = '*'.repeat(this.accountNumber.length - 4);
    return masked + lastFour;
  }
  return this.accountNumber;
});

// Pre-save middleware to ensure data consistency
BankAccountSchema.pre('save', function(this: IBankAccount, next) {
  // Uppercase IFSC code
  if (this.ifscCode) {
    this.ifscCode = this.ifscCode.toUpperCase();
  }
  
  // Trim and format names
  if (this.accountHolderName) {
    this.accountHolderName = this.accountHolderName.trim();
  }
  if (this.bankName) {
    this.bankName = this.bankName.trim();
  }
  if (this.branchName) {
    this.branchName = this.branchName.trim();
  }
  
  next();
});

// Prevent multiple bank accounts for same user (optional business rule)
BankAccountSchema.index({ userId: 1 }, { unique: false }); // Allow multiple accounts per user

export default mongoose.models.BankAccount || mongoose.model<IBankAccount>('BankAccount', BankAccountSchema);
