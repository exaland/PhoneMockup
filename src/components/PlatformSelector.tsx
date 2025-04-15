import React from 'react';
import { Platform, platformConfigs } from '../types/Platform';
import { Smartphone, Monitor, Apple, Globe } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
}

const platformIcons = {
  ios: Apple,
  android: Smartphone,
  macos: Monitor,
  web: Globe,
};

export function PlatformSelector({
  selectedPlatform,
  onPlatformSelect,
}: PlatformSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {(Object.keys(platformConfigs) as Platform[]).map((platform) => {
        const Icon = platformIcons[platform];
        return (
          <button
            key={platform}
            onClick={() => onPlatformSelect(platform)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedPlatform === platform
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">
                {platformConfigs[platform].name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}