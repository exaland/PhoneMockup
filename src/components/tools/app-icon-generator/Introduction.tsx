import React from 'react';
import { ArrowRight, Layers, Zap, Shield } from 'lucide-react';

export function Introduction() {
  const steps = [
    {
      icon: Layers,
      text: "Upload your 1024x1024 source image"
    },
    {
      icon: Zap,
      text: "Select your target platform"
    },
    {
      icon: Shield,
      text: "Get all required sizes instantly"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-8 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Create App Icons for All Platforms
      </h2>
      
      <div className="mb-8">
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Our free app icon generator helps developers and designers create perfect icons 
          for iOS, Android, macOS, and web applications. Generate all required sizes with 
          just a few clicks, maintaining perfect quality across all platforms.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center my-8">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <step.icon className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 max-w-[200px]">{step.text}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-6 h-6 text-gray-300" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Why use our generator?
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center text-blue-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Automatic size generation for all platforms
          </li>
          <li className="flex items-center text-blue-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Maintains perfect quality across all dimensions
          </li>
          <li className="flex items-center text-blue-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Secure local processing - your files never leave your browser
          </li>
        </ul>
      </div>
    </div>
  );
}