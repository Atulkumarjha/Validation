'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserIcon, PhoneIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { getCountryFlag } from '@/lib/geolocation';

interface UserData {
  id: string;
  name: string;
  phone: string;
  profileImage?: string;
  panNumber?: string;
  country?: string;
  ipAddress?: string;
  isPhoneVerified: boolean;
  isPanVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const user = JSON.parse(storedData);
        setUserData(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const getVerificationStatus = (isVerified: boolean) => {
    return isVerified ? (
      <div className="flex items-center text-green-600">
        <CheckCircleIcon className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Verified</span>
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        <XCircleIcon className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Not Verified</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No User Data Found</h1>
          <p className="text-gray-600 mb-6">Please login to view your dashboard.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h1>
          <p className="text-gray-600">Manage your profile and verification status</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {userData.profileImage ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={userData.profileImage}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h2>
              <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start">
                <PhoneIcon className="w-5 h-5 mr-2" />
                {userData.phone}
              </p>
              
              {userData.country && (
                <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start">
                  <GlobeAltIcon className="w-5 h-5 mr-2" />
                  <span className="mr-2">{getCountryFlag(userData.country)}</span>
                  {userData.country}
                </p>
              )}
              
              {userData.panNumber && (
                <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start">
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  PAN: {userData.panNumber}
                </p>
              )}

              <div className="text-sm text-gray-500">
                <p>Member since: {new Date(userData.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(userData.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Country Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Location Info</h3>
              <div className="flex items-center text-blue-600">
                <GlobeAltIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Detected</span>
              </div>
            </div>
            {userData.country ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getCountryFlag(userData.country)}</span>
                  <span className="text-lg font-medium text-gray-900">{userData.country}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Your location is automatically detected based on your IP address for security purposes.
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Location information not available
              </p>
            )}
          </div>

          {/* Phone Verification */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Phone Verification</h3>
              {getVerificationStatus(userData.isPhoneVerified)}
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Your phone number verification status determines your ability to access core features.
            </p>
            {!userData.isPhoneVerified && (
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Complete Phone Verification →
              </Link>
            )}
          </div>

          {/* PAN Verification */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">PAN Verification</h3>
              {getVerificationStatus(userData.isPanVerified)}
            </div>
            <p className="text-gray-600 text-sm mb-4">
              PAN verification is required for enhanced security and compliance features.
            </p>
            {!userData.isPanVerified && (
              <Link
                href="/pan-verification"
                className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Complete PAN Verification →
              </Link>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/login"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg text-center transition-colors"
            >
              <UserIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Update Profile</p>
            </Link>
            
            <Link
              href="/pan-verification"
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg text-center transition-colors"
            >
              <DocumentTextIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Verify Documents</p>
            </Link>
            
            <button
              onClick={() => {
                localStorage.removeItem('userData');
                window.location.href = '/';
              }}
              className="bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg text-center transition-colors"
            >
              <XCircleIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Logout</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
