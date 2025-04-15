import React from 'react';
import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <div className="text-center max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
        Professional App Icon Generator
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Create perfect app icons for iOS, Android, macOS, and Web platforms in seconds. 
        One source image, all the sizes you need.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>100% Free</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>No Sign-up Required</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Instant Download</span>
        </div>
      </div>
    </div>
  );
}