import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Phone Mockup Logo"
                width={36}
                height={36}
                className="w-8 h-8"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#1c1f23]">
                Phone Mockup
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#10b981] font-medium transition-colors">
              Home
            </Link>
            <Link href="#mockup-tool" className="text-gray-700 hover:text-[#10b981] font-medium transition-colors">
              Phone Mockup
            </Link>
            <Link href="/screenshot-generator" className="text-gray-700 hover:text-[#10b981] font-medium transition-colors">
              Screenshot Generator
            </Link>

            <Link href="/appicon-generator" className="text-gray-700 hover:text-[#10b981] font-medium transition-colors">
              App Icon Generator
            </Link>
            <Link href="/privacy" className="text-gray-700 hover:text-[#10b981] font-medium transition-colors">
              Privacy
            </Link>
           

          </nav>
        </div>
      </div>
    </header>
  );
} 