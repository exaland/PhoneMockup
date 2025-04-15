import React, { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { PlatformSelector } from './PlatformSelector';
import { Platform } from '../types/Platform';
import { validateImage, generateIcons } from '../utils/imageProcessor';
import { downloadZip } from '../utils/downloadUtils';

export function IconGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelect = useCallback(async (file: File) => {
    setError('');
    const isValid = await validateImage(file);
    
    if (!isValid) {
      setError('Please upload a 1024x1024 pixel image');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedFile || !selectedPlatform) return;

    try {
      setIsGenerating(true);
      const zipBlob = await generateIcons(selectedFile, selectedPlatform);
      await downloadZip(zipBlob, `${selectedPlatform}-icons.zip`);
    } catch (err) {
      setError('Failed to generate icons. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedFile, selectedPlatform]);

  return (
    <section id="generator" className="space-y-8">
      <ImageUploader onImageSelect={handleImageSelect} error={error} />

      {selectedFile && (
        <>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Select Platform
            </h2>
            <PlatformSelector
              selectedPlatform={selectedPlatform}
              onPlatformSelect={setSelectedPlatform}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={!selectedPlatform || isGenerating}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                !selectedPlatform || isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Generate Icons'}
            </button>
          </div>
        </>
      )}
    </section>
  );
}