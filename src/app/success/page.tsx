'use client';

import Link from 'next/link';
import { CheckCircleIcon, UserIcon, DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
            <CheckCircleIcon className="w-10 h-10 text-white" />
          </div>

          {/* Main Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verification Complete! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Congratulations! You have successfully completed the entire verification process.
          </p>

          {/* Verification Steps Completed */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Steps Completed:</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 text-green-600">
                <UserIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Profile Setup</span>
              </div>
              <div className="flex items-center space-x-3 text-green-600">
                <ShieldCheckIcon className="w-5 h-5" />
                <span className="text-sm font-medium">OTP Verification</span>
              </div>
              <div className="flex items-center space-x-3 text-green-600">
                <DocumentTextIcon className="w-5 h-5" />
                <span className="text-sm font-medium">PAN Verification</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">What&apos;s Next?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Access Dashboard</h4>
                <p className="text-sm text-blue-700">View your profile and manage your account settings.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Explore Features</h4>
                <p className="text-sm text-purple-700">Discover all the features available in your account.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/login"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Start New Verification
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Your verification status is now active. You can access all features of the platform.
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Verification completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
