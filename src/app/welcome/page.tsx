'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  UserIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  RocketLaunchIcon,
  GiftIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { getCountryFlag } from '@/lib/geolocation';

interface UserData {
  id: string;
  name: string;
  phone: string;
  country?: string;
  isPhoneVerified: boolean;
  isPanVerified: boolean;
}

export default function WelcomePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Update time every second for dynamic greeting
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getWelcomeMessage = (name: string) => {
    const country = userData?.country;
    const countryFlag = country ? getCountryFlag(getCountryCode(country)) : '🌍';
    
    const messages = [
      `Welcome to your secure digital identity, ${name}! ${countryFlag}`,
      `${name}, your verification journey is complete! ${countryFlag}`,
      `You're all set for a seamless experience, ${name}! ${countryFlag}`,
      `${name}, you're ready to explore amazing features! ${countryFlag}`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getUserName = () => {
    return userData?.name || 'Valued User';
  };

  const getCountryCode = (countryName: string): string => {
    // Simple mapping for common countries
    const countryMap: Record<string, string> = {
      'India': 'IN',
      'United States': 'US',
      'United Kingdom': 'GB',
      'Canada': 'CA',
      'Australia': 'AU',
      'Germany': 'DE',
      'France': 'FR',
      'Japan': 'JP',
      'China': 'CN',
      'Brazil': 'BR',
      'Russia': 'RU',
      'South Korea': 'KR',
      'Italy': 'IT',
      'Spain': 'ES',
      'Mexico': 'MX',
      'Netherlands': 'NL',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Singapore': 'SG',
      'Malaysia': 'MY',
      'Thailand': 'TH',
      'Philippines': 'PH',
      'Indonesia': 'ID',
      'Vietnam': 'VN',
      'Bangladesh': 'BD',
      'Pakistan': 'PK',
      'Sri Lanka': 'LK',
      'Nepal': 'NP',
    };
    return countryMap[countryName] || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-40 animate-bounce"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6 shadow-2xl animate-pulse">
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎉 Congratulations!
            </h1>
            
            <div className="space-y-2 mb-6">
              <p className="text-2xl text-gray-700 font-medium">
                {getGreeting()}, {getUserName()}!
              </p>
              <p className="text-xl text-gray-600">
                {getWelcomeMessage(getUserName())}
              </p>
              {userData?.country && (
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-lg text-gray-600">
                    Joining us from{' '}
                    <span className="font-semibold text-blue-600">
                      {getCountryFlag(getCountryCode(userData.country))} {userData.country}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2 text-yellow-500 mb-8">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-6 h-6 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>

          {/* Verification Steps Completed */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
            <div className="text-center mb-6">
              <SparklesIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-gray-900">Verification Journey Complete!</h2>
              <p className="text-gray-600">You&apos;ve successfully completed all verification steps</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-green-800 mb-1">Profile Setup</h3>
                <p className="text-sm text-green-600">Account Created</p>
                <div className="mt-2">
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-1">OTP Verified</h3>
                <p className="text-sm text-blue-600">Phone Confirmed</p>
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-800 mb-1">PAN Verified</h3>
                <p className="text-sm text-purple-600">Identity Confirmed</p>
                <div className="mt-2">
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 text-center border border-indigo-200">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BuildingLibraryIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-indigo-800 mb-1">Bank Added</h3>
                <p className="text-sm text-indigo-600">Payment Ready</p>
                <div className="mt-2">
                  <div className="w-full bg-indigo-200 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits & Next Steps */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* What You Can Do Now */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <RocketLaunchIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">What You Can Do Now</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Secure Transactions</h4>
                    <p className="text-sm text-gray-600">Make payments and transfers with confidence</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Access Premium Features</h4>
                    <p className="text-sm text-gray-600">Unlock advanced tools and services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Enhanced Security</h4>
                    <p className="text-sm text-gray-600">Multi-layer verification protection</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Priority Support</h4>
                    <p className="text-sm text-gray-600">Get help whenever you need it</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Welcome Offer */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl shadow-xl p-8 border-2 border-yellow-200">
              <div className="flex items-center mb-6">
                <GiftIcon className="w-8 h-8 text-orange-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Welcome Bonus, {getUserName()}!</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">🎁</span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Congratulations, {getUserName()}!</h4>
                <p className="text-gray-700 mb-4">
                  You&apos;ve earned special benefits for completing your verification:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white bg-opacity-60 rounded-lg p-2">
                    ✨ Premium features for 30 days
                  </div>
                  <div className="bg-white bg-opacity-60 rounded-lg p-2">
                    🚀 Priority customer support
                  </div>
                  <div className="bg-white bg-opacity-60 rounded-lg p-2">
                    💰 Zero transaction fees this month
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Ready to Get Started, {getUserName()}?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
              >
                🏠 Go to Dashboard
              </Link>
              <Link
                href="/profile"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
              >
                👤 View Profile
              </Link>
              <Link
                href="/"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
              >
                🏡 Go Home
              </Link>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full border border-green-200">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              <span className="font-semibold text-sm">🔒 Your account is fully verified and secure</span>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Verification completed on {currentTime.toLocaleDateString()} at {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
