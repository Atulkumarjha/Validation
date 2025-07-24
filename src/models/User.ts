import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  profileImage?: string;
  panNumber?: string;
  panCardImage?: string;
  country?: string;
  ipAddress?: string;
  isPhoneVerified: boolean;
  isPanVerified: boolean;
  otpToken?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profileImage: {
    type: String,
    default: null
  },
  panNumber: {
    type: String,
    sparse: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  panCardImage: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: null,
    trim: true,
    maxlength: [100, 'Country name cannot exceed 100 characters']
  },
  ipAddress: {
    type: String,
    default: null,
    trim: true
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isPanVerified: {
    type: Boolean,
    default: false
  },
  otpToken: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: IUser, ret: Record<string, unknown>) {
      delete ret.password;
      delete ret.otpToken;
      return ret;
    }
  }
});

// Indexes for better performance
UserSchema.index({ phone: 1 });
UserSchema.index({ panNumber: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
