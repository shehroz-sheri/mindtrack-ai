'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthButton from './AuthButton';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link 
              href="/"
              className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              MindTrack AI
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </Link>
              <Link
                href="/journal"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/journal' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Journal
              </Link>
              <Link
                href="/dashboard"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/dashboard' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              
              {pathname === '/' && (
                <>
                  {[
                    { label: 'How to Use', id: 'how-to-use' },
                    { label: 'Features', id: 'features' },
                    { label: 'Why It Matters', id: 'why-it-matters' },
                    { label: 'Impact', id: 'impact' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <AuthButton />
          </div>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}