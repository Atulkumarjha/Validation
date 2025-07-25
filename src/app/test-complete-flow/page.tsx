'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestCompleteFlow() {
  const router = useRouter();

  useEffect(() => {
    // Set the actual user data from our test
    const testUserData = {
      id: "688320bba7613db5717674ab",
      name: "Complete Flow Test",
      phone: "5544332211",
      country: "United States",
      ipAddress: "203.0.113.195",
      isPhoneVerified: true,
      isPanVerified: false
    };

    localStorage.setItem('userData', JSON.stringify(testUserData));
    
    // Redirect to welcome page
    router.push('/welcome');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Redirecting to welcome page with country information...</p>
      </div>
    </div>
  );
}
