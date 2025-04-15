import React from 'react';
import { Platform } from '@/types/Platform';
import { clsx } from 'clsx';

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
}

export function PlatformSelector({ selectedPlatform, onPlatformSelect }: PlatformSelectorProps) {
  const platforms: Platform[] = ['ios', 'android', 'macos', 'web'];

  const platformNames: Record<Platform, string> = {
    ios: 'iOS',
    android: 'Android',
    macos: 'macOS',
    web: 'Web'
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => onPlatformSelect(platform)}
          className={clsx(
            'flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors',
            selectedPlatform === platform
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          )}
        >
          {platformNames[platform]}
        </button>
      ))}
    </div>
  );
}