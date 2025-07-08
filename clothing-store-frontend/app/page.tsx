'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Our Clothing Store!</h1>
        <p className="text-gray-600 mb-8">Please log in or sign up to continue.</p>
        <div className="space-y-4">
          <Link href="/login" className="block w-full py-3 px-4 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition duration-300">
            Login
          </Link>
          <Link href="/signup" className="block w-full py-3 px-4 border border-orange-600 text-orange-800 font-semibold rounded-md hover:bg-orange-200 transition duration-300">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}