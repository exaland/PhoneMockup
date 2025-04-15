'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon } from 'lucide-react';
import type { ScreenshotGroup, DeviceType } from '@/types/ScreenshotGroup';
import type { PreviewImage } from './types';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';

interface PreviewPanelProps {
  deviceType: string;
  setDeviceType: (value: string) => void;
  screenshotGroups: ScreenshotGroup[];
  setScreenshotGroups: React.Dispatch<React.SetStateAction<ScreenshotGroup[]>>;
  previewImages: {[key: string]: PreviewImage};
  fileInputRefs: React.MutableRefObject<{[key: string]: HTMLInputElement | null}>;
  deviceTypes: DeviceType[];
  onGenerateScreenshots: () => void;
}

export function PreviewPanel({
  deviceType,
  setDeviceType,
  screenshotGroups,
  setScreenshotGroups,
  previewImages,
  fileInputRefs,
  deviceTypes,
  onGenerateScreenshots
}: PreviewPanelProps) {
  const handleTitleChange = (groupId: string, title: string) => {
    setScreenshotGroups(prev => prev.map(group => 
      group.id === groupId ? {
        ...group,
        [deviceType]: {
          ...group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>],
          title
        }
      } : group
    ));
  };

  const handleSubtitleChange = (groupId: string, subtitle: string) => {
    setScreenshotGroups(prev => prev.map(group => 
      group.id === groupId ? {
        ...group,
        [deviceType]: {
          ...group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>],
          subtitle
        }
      } : group
    ));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, groupId: string, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Preload image to ensure correct dimensions
          const img = new Image();
          img.onload = () => {
            setScreenshotGroups(prev => prev.map(group => 
              group.id === groupId ? {
                ...group,
                [type]: { file, preview: reader.result as string },
              } : group
            ));
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShowBottomPriorityChange = (groupId: string, showBottomPriority: boolean) => {
    setScreenshotGroups(prev => prev.map(group => 
      group.id === groupId ? {
        ...group,
        [deviceType]: {
          ...group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>],
          showBottomPriority
        }
      } : group
    ));
  };

  const handleOffsetChange = (groupId: string, value: string) => {
    const offset = parseInt(value) || 0;
    setScreenshotGroups(prev => prev.map(group => 
      group.id === groupId ? {
        ...group,
        [deviceType]: {
          ...group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>],
          offset
        }
      } : group
    ));
  };

  return (
    <div className="flex-1">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 mb-12 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <label className="text-base font-medium text-gray-600">Device Type:</label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="min-w-[120px] rounded-lg border-gray-200 bg-white py-2.5 px-4 text-base font-medium text-gray-900 shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="iphone">iPhone</option>
            <option value="ipad">iPad</option>
          </select>
        </div>

        <button
          onClick={onGenerateScreenshots}
          className="w-full sm:w-auto inline-flex items-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Download className="w-5 h-5 mr-2.5" />
          Generate Screenshots
        </button>
      </div>

      {deviceType === 'iphone' ? (
        <>
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {screenshotGroups.slice(0, 3).map((group, index) => (
                <div key={group.id} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="space-y-4">
                    <Input
                      placeholder="Screenshot Title"
                      value={group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>].title}
                      onChange={(e) => handleTitleChange(group.id, e.target.value)}
                      className="text-base font-normal tracking-tight placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Screenshot Subtitle"
                      value={group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>].subtitle}
                      onChange={(e) => handleSubtitleChange(group.id, e.target.value)}
                      className="text-sm font-normal text-gray-600 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-5 pt-2">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>].showBottomPriority}
                        onCheckedChange={(checked) => handleShowBottomPriorityChange(group.id, checked)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <Label className="text-sm font-medium text-gray-700">Align to Bottom</Label>
                    </div>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <Label className="text-sm font-medium text-gray-700 shrink-0">Crop Offset</Label>
                      <Input
                        type="number"
                        value={group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>].offset}
                        onChange={(e) => handleOffsetChange(group.id, e.target.value)}
                        className="w-16 text-right text-sm font-normal"
                        min={0}
                        max={200}
                      />
                      <span className="text-sm font-normal text-gray-500 shrink-0">px</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">iPhone 6.7" Screenshots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {screenshotGroups.slice(0, 3).map((group) => (
                  <div
                    key={`${group.id}-69`}
                    className="relative w-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                    style={{
                      aspectRatio: '9/19.5',
                      maxHeight: '800px'
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        fileInputRefs.current[`${group.id}-69`] = el;
                      }}
                      onChange={(e) => handleFileChange(e, group.id, 'iphone69')}
                      className="hidden"
                    />
                    {group.iphone69.preview ? (
                      <img
                        src={group.iphone69.preview}
                        alt="Screenshot preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        onClick={() => fileInputRefs.current[`${group.id}-69`]?.click()}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Click to Upload</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">iPhone 6.5" Screenshots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {screenshotGroups.slice(0, 3).map((group) => (
                  <div
                    key={`${group.id}-65`}
                    className="relative w-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                    style={{
                      aspectRatio: '9/19.5',
                      maxHeight: '800px'
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        fileInputRefs.current[`${group.id}-65`] = el;
                      }}
                      onChange={(e) => handleFileChange(e, group.id, 'iphone65')}
                      className="hidden"
                    />
                    {group.iphone65.preview ? (
                      <img
                        src={group.iphone65.preview}
                        alt="Screenshot preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        onClick={() => fileInputRefs.current[`${group.id}-65`]?.click()}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Click to Upload</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {screenshotGroups.slice(0, 3).map((group, index) => (
                <div key={group.id} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="space-y-4">
                    <Input
                      placeholder="Screenshot Title"
                      value={group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>].title}
                      onChange={(e) => handleTitleChange(group.id, e.target.value)}
                      className="text-base font-normal tracking-tight placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Screenshot Subtitle"
                      value={group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>].subtitle}
                      onChange={(e) => handleSubtitleChange(group.id, e.target.value)}
                      className="text-sm font-normal text-gray-600 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-5 pt-2">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>].showBottomPriority}
                        onCheckedChange={(checked) => handleShowBottomPriorityChange(group.id, checked)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <Label className="text-sm font-medium text-gray-700">Align to Bottom</Label>
                    </div>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <Label className="text-sm font-medium text-gray-700 shrink-0">Crop Offset</Label>
                      <Input
                        type="number"
                        value={group[deviceType as keyof Pick<ScreenshotGroup, 'iphone' | 'ipad'>].offset}
                        onChange={(e) => handleOffsetChange(group.id, e.target.value)}
                        className="w-16 text-right text-sm font-normal"
                        min={0}
                        max={200}
                      />
                      <span className="text-sm font-normal text-gray-500 shrink-0">px</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">iPad Portrait Screenshots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {screenshotGroups.slice(0, 3).map((group) => (
                  <div
                    key={`${group.id}-portrait`}
                    className="relative w-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                    style={{
                      aspectRatio: '3/4',
                      maxHeight: '800px'
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        fileInputRefs.current[`${group.id}-portrait`] = el;
                      }}
                      onChange={(e) => handleFileChange(e, group.id, 'ipad_portrait')}
                      className="hidden"
                    />
                    {group.ipad_portrait.preview ? (
                      <img
                        src={group.ipad_portrait.preview}
                        alt="Screenshot preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        onClick={() => fileInputRefs.current[`${group.id}-portrait`]?.click()}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Click to Upload</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">iPad Landscape Screenshots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {screenshotGroups.slice(0, 3).map((group) => (
                  <div
                    key={`${group.id}-landscape`}
                    className="relative w-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                    style={{
                      aspectRatio: '4/3',
                      maxHeight: '800px'
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        fileInputRefs.current[`${group.id}-landscape`] = el;
                      }}
                      onChange={(e) => handleFileChange(e, group.id, 'ipad_landscape')}
                      className="hidden"
                    />
                    {group.ipad_landscape.preview ? (
                      <img
                        src={group.ipad_landscape.preview}
                        alt="Screenshot preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        onClick={() => fileInputRefs.current[`${group.id}-landscape`]?.click()}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Click to Upload</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}