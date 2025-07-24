'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PhotoIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function PanVerificationPage() {
  const router = useRouter();
  const [panImage, setPanImage] = useState<File | null>(null);
  const [panImagePreview, setPanImagePreview] = useState<string | null>(null);
  const [panNumber, setPanNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handlePanImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setPanImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPanImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePanNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // PAN format: AAAAA9999A (5 letters, 4 numbers, 1 letter)
    if (value.length <= 10) {
      setPanNumber(value);
    }
  };

  const validatePanNumber = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!panImage) {
      alert('Please upload your PAN card image');
      return;
    }

    if (!panNumber || !validatePanNumber(panNumber)) {
      alert('Please enter a valid PAN number (Format: AAAAA9999A)');
      return;
    }

    // Get user data from localStorage
    const userData = localStorage.getItem('userData');
    if (!userData) {
      alert('User session expired. Please login again.');
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    setIsLoading(true);
    setVerificationStatus('idle');

    try {
      const formData = new FormData();
      formData.append('phone', user.phone);
      formData.append('panNumber', panNumber);
      formData.append('panCardImage', panImage);

      const response = await fetch('/api/pan/verify', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'PAN verification failed');
      }

      setVerificationStatus('success');
      // Update localStorage with new user data
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Redirect to bank account page after a short delay
      setTimeout(() => {
        router.push('/bank-account');
      }, 2000);

    } catch (error: any) {
      console.error('Error verifying PAN:', error);
      setVerificationStatus('error');
      alert(error.message || 'PAN verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPanImage(null);
    setPanImagePreview(null);
    setPanNumber('');
    setVerificationStatus('idle');
  };

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">PAN Verified Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your PAN card has been successfully verified. Next, please add your bank account details to complete the setup.
            </p>
            <div className="space-y-3">
              <button
                onClick={resetForm}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                Verify Another PAN
              </button>
              <Link
                href="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* PAN Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">PAN Card Verification</h1>
            <p className="text-gray-600">Upload your PAN card image for identity verification</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PAN Card Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                PAN Card Image
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {panImagePreview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <Image
                        src={panImagePreview}
                        alt="PAN card preview"
                        width={300}
                        height={200}
                        className="rounded-lg shadow-md max-w-full h-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPanImage(null);
                          setPanImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <div className="text-sm text-gray-600">
                      <p>Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePanImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* PAN Number Input */}
            <div>
              <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <input
                type="text"
                id="panNumber"
                value={panNumber}
                onChange={handlePanNumberChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none uppercase font-mono"
                placeholder="AAAAA9999A"
                maxLength={10}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)
              </p>
              {panNumber && !validatePanNumber(panNumber) && panNumber.length === 10 && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  Invalid PAN format
                </p>
              )}
            </div>

            {/* Error Message */}
            {verificationStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">
                    PAN verification failed. Please check your details and try again.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !panImage || !validatePanNumber(panNumber)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying PAN...
                </div>
              ) : (
                'Verify PAN Card'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to login
            </Link>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Guidelines for PAN Card Upload:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Ensure the image is clear and readable</li>
            <li>• All four corners of the PAN card should be visible</li>
            <li>• Avoid glare or shadows on the card</li>
            <li>• File size should be less than 5MB</li>
            <li>• Supported formats: JPG, PNG</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
