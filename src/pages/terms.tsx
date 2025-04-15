import React from 'react';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { Shield, Lock, Scale } from 'lucide-react';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | AppCrafter</title>
        <meta 
          name="description" 
          content="Terms of Service for AppCrafter's developer tools and services. Learn about our usage terms, limitations, and policies."
        />
        <meta property="og:title" content="Terms of Service | AppCrafter" />
        <meta property="og:description" content="Terms of Service for AppCrafter's developer tools and services." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://appcrafter.dev/terms" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Terms of Service
          </h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 mb-8">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Safe & Secure</h3>
                  <p className="text-sm text-gray-600">Your data is processed locally and never stored on our servers</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg">
                  <Lock className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
                  <p className="text-sm text-gray-600">We don't collect personal information or track individual usage</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg">
                  <Scale className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Use</h3>
                  <p className="text-sm text-gray-600">Our tools are free for both personal and commercial use</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using AppCrafter's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <p className="mb-6">
                AppCrafter provides free online developer tools and utilities. Our services are provided "as is" and "as available" without any warranties, either express or implied. We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">You are responsible for any content you upload to our services</li>
                <li className="mb-2">You agree not to use our services for any illegal or unauthorized purpose</li>
                <li className="mb-2">You must not attempt to interfere with or disrupt our services</li>
                <li>You are responsible for maintaining the confidentiality of any credentials associated with your use of our services</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p className="mb-6">
                The content, features, and functionality of our services are owned by AppCrafter and are protected by international copyright, trademark, and other intellectual property laws. You retain all rights to any content you upload to our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitations of Liability</h2>
              <p className="mb-6">
                AppCrafter shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services. This includes but is not limited to loss of data, profits, or business opportunities.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
              <p className="mb-6">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on our website. Your continued use of our services after such modifications constitutes your acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="mb-6">
                If you have any questions about these Terms of Service, please contact us at support@appcrafter.dev.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
} 