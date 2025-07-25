'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestWelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Set sample user data in localStorage
    const sampleUserData = {
      id: "6881df756204a63aa7c98a24",
      name: "Atul Kumar Jha",
      phone: "9876543210",
      country: "India",
      isPhoneVerified: true,
      isPanVerified: true
    };

    localStorage.setItem('userData', JSON.stringify(sampleUserData));

    // Redirect to welcome page after setting data
    setTimeout(() => {
      router.push('/welcome');
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Setting up your personalized welcome experience...</p>
      </div>
    </div>     
  );
}
