'use client';

import { Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { Scene3D } from './components/Scene3D';
import { FileUpload } from './components/FileUpload';
import { v4 as uuidv4 } from 'uuid';

interface Screenshot {
  id: string;
  url: string;
}

export function IphoneMockup() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      const imageUrl = URL.createObjectURL(file);
      const newScreenshot = {
        id: uuidv4(),
        url: imageUrl
      };
      
      setScreenshots(prev => [...prev, newScreenshot]);
      // If this is the first image, automatically select it
      if (screenshots.length === 0) {
        setSelectedScreenshot(imageUrl);
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const handleScreenshotSelect = (url: string) => {
    setSelectedScreenshot(url);
  };

  const handleScreenshotDelete = (id: string) => {
    setScreenshots(prev => {
      const newScreenshots = prev.filter(screenshot => screenshot.id !== id);
      // If the deleted image is the currently selected image, automatically select the first image
      if (newScreenshots.length > 0 && selectedScreenshot === prev.find(s => s.id === id)?.url) {
        setSelectedScreenshot(newScreenshots[0].url);
      } else if (newScreenshots.length === 0) {
        setSelectedScreenshot(null);
      }
      return newScreenshots;
    });
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#1c1f23] mb-6 flex items-center">
              <Smartphone className="w-5 h-5 text-[#6ee7b7] mr-2" />
              <span>Upload Screenshots</span>
            </h2>
            <FileUpload 
              onFileSelect={handleFileSelect}
              uploadedFiles={screenshots}
              onFileDelete={handleScreenshotDelete}
              onPreviewSelect={handleScreenshotSelect}
              selectedUrl={selectedScreenshot}
            />
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#1c1f23] mb-6 flex items-center">
              <span className="w-6 h-6 bg-[#6ee7b7]/20 flex items-center justify-center rounded-md mr-2">
                <span className="text-[#10b981] text-sm">3D</span>
              </span>
              <span>3D Preview</span>
            </h2>
            <Scene3D screenshotUrl={selectedScreenshot} background={null} />
          </div>
        </div>
      </div>
    </div>
  );
} 