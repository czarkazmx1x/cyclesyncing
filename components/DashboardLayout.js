"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiCalendar, 
  FiCompass, 
  FiPieChart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUsers,
  FiHeart
} from 'react-icons/fi';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome, emoji: '🏠' },
    { name: 'Calendar', href: '/dashboard/calendar', icon: FiCalendar, emoji: '📅' },
    { name: 'Recommendations', href: '/dashboard/recommendations', icon: FiCompass, emoji: '💡' },
    { name: 'Insights', href: '/dashboard/insights', icon: FiPieChart, emoji: '📊' },
    { name: 'Community', href: '/dashboard/community', icon: FiUsers, emoji: '👭' },
    { name: 'Profile', href: '/dashboard/profile', icon: FiSettings, emoji: '⚙️' },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 z-40 flex ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-pink-100">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <FiHeart className="h-6 w-6 text-primary-500 mr-2" />
              <span className="text-2xl font-display font-bold gradient-text">CycleSync</span>
            </div>
            <nav className="mt-8 px-2 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-primary-50 to-pink-50 text-primary-700 border-l-4 border-primary-400'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-primary-600'
                  } group flex items-center px-2 py-3 text-base font-medium rounded-r-xl transition-all duration-300`}
                >
                  <span className="mr-3 text-xl">{item.emoji}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-sm border-r border-pink-100">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <FiHeart className="h-6 w-6 text-primary-500 mr-2" />
                <span className="text-2xl font-display font-bold gradient-text">CycleSync</span>
              </div>
              <nav className="flex-1 px-2 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-primary-50 to-pink-50 text-primary-700 border-l-4 border-primary-400'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-primary-600'
                    } group flex items-center px-3 py-3 text-sm font-medium rounded-r-xl transition-all duration-300`}
                  >
                    <span className="mr-3 text-xl">{item.emoji}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-100">
          <button
            type="button"
            className="px-4 border-r border-pink-100 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 md:hidden">CycleSync</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <button
                type="button"
                className="bg-white/80 p-2 rounded-full text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all duration-300"
              >
                <span className="sr-only">View notifications</span>
                <FiBell className="h-5 w-5" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <div>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="max-w-xs bg-gradient-to-br from-primary-100 to-pink-100 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-medium">S</span>
                    </div>
                  </button>
                </div>
                
                {showProfileMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-2xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-pink-100">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-primary-600 transition-colors duration-300"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-primary-600 transition-colors duration-300"
                    >
                      <FiLogOut className="inline-block w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}