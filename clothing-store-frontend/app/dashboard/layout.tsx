'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaShoppingCart, FaUserCircle, FaHistory, FaThLarge, FaSignOutAlt } from 'react-icons/fa';
import { CartProvider, useCart } from '@/hooks/useCart';

interface DashboardLayoutProps {
  children: ReactNode;
}


function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useCart(); // Use the cart hook

  // Client-side authentication check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/'); // Redirect to home/login if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navbar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="text-2xl font-bold mb-8 text-center">
          Clothing Store
        </div>
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <Link href="/dashboard/catalogue" className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${pathname === '/catalogue' ? 'bg-blue-600' : ''}`}>
                <FaThLarge className="mr-3" />
                Catalogue
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/dashboard/purchase-history" className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${pathname === '/purchase-history' ? 'bg-blue-600' : ''}`}>
                <FaHistory className="mr-3" />
                Purchase History
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/dashboard/profile" className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${pathname === '/profile' ? 'bg-blue-600' : ''}`}>
                <FaUserCircle className="mr-3" />
                Profile
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top App Bar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="relative">
            <Link href="/dashboard/cart" className="text-gray-600 hover:text-blue-600 transition-colors">
              <FaShoppingCart className="text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayoutWrapper({ children }: DashboardLayoutProps) {
  return (
    <CartProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </CartProvider>
  );
}