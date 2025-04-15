'use client';

import React from 'react';
import type { ColorPreset, TitleAreaPreset, FrameWidthPreset } from './types';

interface SettingsPanelProps {
  selectedPreset: number;
  setSelectedPreset: (value: number) => void;
  titleAreaHeight: number;
  setTitleAreaHeight: (value: number) => void;
  frameWidth: number;
  setFrameWidth: (value: number) => void;
  colorPresets: ColorPreset[];
  titleAreaPresets: TitleAreaPreset[];
  frameWidthPresets: FrameWidthPreset[];
}

export function SettingsPanel({
  selectedPreset,
  setSelectedPreset,
  titleAreaHeight,
  setTitleAreaHeight,
  frameWidth,
  setFrameWidth,
  colorPresets,
  titleAreaPresets,
  frameWidthPresets
}: SettingsPanelProps) {
  const getFrameWidthLabel = (name: string): string => {
    switch (name.toLowerCase()) {
      case 'narrow':
        return 'Narrow';
      case 'medium':
        return 'Medium';
      case 'wide':
        return 'Wide';
      default:
        return 'Medium';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Title Area</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {titleAreaPresets.map((preset, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  Math.abs(titleAreaHeight - preset.value) < 0.01 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onClick={() => setTitleAreaHeight(preset.value)}
              >
                {preset.name === 'small' ? 'Small' :
                 preset.name === 'medium' ? 'Medium' :
                 'Large'}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Min</span>
              <span>
                {Math.round(titleAreaHeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.06"
              max="0.3"
              step="0.01"
              value={titleAreaHeight}
              onChange={(e) => setTitleAreaHeight(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Frame Width</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {frameWidthPresets.map((preset, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  Math.abs(frameWidth - preset.value) < 0.01 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onClick={() => setFrameWidth(preset.value)}
              >
                <span>{getFrameWidthLabel(preset.name)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Min</span>
              <span>{Math.round(frameWidth * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="0.90"
              step="0.01"
              value={frameWidth}
              onChange={(e) => setFrameWidth(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Background</h3>
        <div className="grid grid-cols-2 gap-4">
          {colorPresets.map((preset, index) => (
            <div
              key={index}
              className={`h-24 rounded-lg cursor-pointer transition-all ${
                selectedPreset === index ? 'ring-2 ring-blue-500 scale-95' : 'hover:scale-95'
              }`}
              style={{
                background: preset.gradient
              }}
              onClick={() => setSelectedPreset(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 