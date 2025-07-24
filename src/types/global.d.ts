import { MongooseCache } from '@/types/mongoose';

declare global {
  var mongoose: MongooseCache | undefined;
  var tempSignupData: {
    [phone: string]: {
      name: string;
      password: string;
      otp: string;
      otpExpiry: string;
      country?: string;
      ipAddress?: string;
    };
  };
}

export interface MongoError extends Error {
  code?: number;
  name: string;
}

export interface ValidationError extends Error {
  name: 'ValidationError';
  errors: {
    [key: string]: {
      message: string;
      kind?: string;
      path?: string;
      value?: unknown;
    };
  };
}

export interface TempSignupData {
  name: string;
  password: string;
  otp: string;
  otpExpiry: string;
  country?: string;
  ipAddress?: string;
}
