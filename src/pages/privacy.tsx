import React from 'react';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { Shield, Lock, Eye } from 'lucide-react';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | AppCrafter</title>
        <meta 
          name="description" 
          content="Privacy Policy for AppCrafter's developer tools and services. Learn about how we handle your data and protect your privacy."
        />
        <meta property="og:title" content="Privacy Policy | AppCrafter" />
        <meta property="og:description" content="Privacy Policy for AppCrafter's developer tools and services." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://appcrafter.dev/privacy" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Privacy Policy
          </h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 mb-8">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Processing</h3>
                  <p className="text-sm text-gray-600">All data processing happens in your browser, not on our servers</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg">
                  <Lock className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Storage</h3>
                  <p className="text-sm text-gray-600">We don't store any of your personal data or uploaded files</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg">
                  <Eye className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
                  <p className="text-sm text-gray-600">Clear information about how our services handle your data</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="mb-6">
                At AppCrafter, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our services. We are committed to ensuring the security and protection of the personal information that we process, and to provide a compliant and consistent approach to data protection.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="mb-3">We collect minimal information to provide and improve our services:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Anonymous usage statistics through Google Analytics</li>
                <li className="mb-2">Technical information about your browser and device</li>
                <li>Error logs to improve our services</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="mb-6">
                The information we collect is used solely for the purpose of improving our services and understanding how users interact with our tools. We do not sell, rent, or share any information with third parties.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Processing</h2>
              <p className="mb-6">
                All data processing for our tools (such as image generation and file conversion) happens locally in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security of your content.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <p className="mb-6">
                We use essential cookies to ensure our website functions properly. We also use Google Analytics with anonymized IP addresses to understand how our services are used. You can opt out of non-essential cookies through your browser settings.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="mb-3">Under applicable data protection laws, you have the following rights:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">The right to access your personal data</li>
                <li className="mb-2">The right to rectification of inaccurate personal data</li>
                <li className="mb-2">The right to erasure of your personal data</li>
                <li className="mb-2">The right to restrict processing of your personal data</li>
                <li>The right to object to processing of your personal data</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Security Measures</h2>
              <p className="mb-6">
                We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk of processing. This includes using HTTPS encryption and following security best practices.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@appcrafter.dev.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
} 