import React from 'react';
import { Sparkles, Award, Zap } from 'lucide-react';

export function Hero() {
  const benefits = [
    {
      icon: Sparkles,
      text: "100% Free Forever"
    },
    {
      icon: Award,
      text: "No Sign-up Required"
    },
    {
      icon: Zap,
      text: "Instant Processing"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-4xl mx-auto px-4 py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Professional App Icon Generator
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Create perfect app icons for iOS, Android, macOS, and Web platforms in seconds. 
          One source image, all the sizes you need.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm"
            >
              <benefit.icon className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}