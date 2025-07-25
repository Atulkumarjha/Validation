'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Set test user data in localStorage
    const testUserData = {
      id: "68830d66a7613db57176748b",
      name: "Fresh Start",
      phone: "6666777888",
      country: "India",
      ipAddress: "127.0.0.1",
      isPhoneVerified: true,
      isPanVerified: false,
      createdAt: "2025-07-25T04:51:50.622Z",
      updatedAt: "2025-07-25T04:51:50.622Z"
    };

    localStorage.setItem('userData', JSON.stringify(testUserData));
    
    // Redirect to dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}
