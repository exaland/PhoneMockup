import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand/Logo Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="text-xl font-bold text-[#1c1f23]">Phone Mockup</span>
            </Link>
            <p className="text-gray-600 mb-6 pr-8">
              Create professional device mockups for your app screenshots. Our free Phone Mockup tool helps you showcase your mobile apps with stunning 3D visualizations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#1c1f23] uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[#10b981] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#mockup-tool" className="text-gray-600 hover:text-[#10b981] transition-colors text-sm">
                  Phone Mockup
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-600 hover:text-[#10b981] transition-colors text-sm">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[#1c1f23] uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#10b981] transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#10b981] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Phone Mockup. Create free mobile device mockups for your app screenshots.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-[#10b981] hover:text-[#059669] text-sm font-medium transition-colors">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 