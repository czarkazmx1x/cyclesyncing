"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Signup() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  );
}
