import React, { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { ImagePreview } from './ImagePreview';
import { PlatformSelector } from './PlatformSelector';
import { Platform } from '@/types/Platform';
import { validateImage, generateIcons } from '@/utils/imageProcessor';
import { downloadZip } from '@/utils/downloadUtils';

export function IconGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidSize, setIsValidSize] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelect = useCallback(async (file: File) => {
    setError('');
    try {
      const isValid = await validateImage(file);
      setIsValidSize(isValid);
      
      if (!isValid) {
        setError('Image must be at least 1024x1024 pixels');
      }

      setSelectedFile(file);
    } catch (err) {
      setError('Please upload a valid PNG or JPG image');
      setSelectedFile(null);
      setIsValidSize(false);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedFile(null);
    setIsValidSize(false);
    setError('');
    setSelectedPlatform(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedFile || !selectedPlatform || !isValidSize) return;

    try {
      setIsGenerating(true);
      setError('');
      const zipBlob = await generateIcons(selectedFile, selectedPlatform);
      await downloadZip(zipBlob, `${selectedPlatform}-icons.zip`);
    } catch (err) {
      setError('Error generating icons. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedFile, selectedPlatform, isValidSize]);

  return (
    <div className="space-y-8">
      {/* Image Upload/Preview Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Upload Your Image
        </h2>
        
        {selectedFile ? (
          <ImagePreview
            file={selectedFile}
            onRemove={handleRemoveImage}
            isValid={isValidSize}
          />
        ) : (
          <ImageUploader 
            onImageSelect={handleImageSelect} 
            error={error}
          />
        )}
      </div>

      {/* Platform Selection & Generation */}
      {selectedFile && isValidSize && (
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
              aria-label={isGenerating ? 'Generating Icons...' : 'Generate Icons'}
            >
              <Download className="w-5 h-5" />
              <span>
                {isGenerating ? 'Generating Icons...' : 'Generate Icons'}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}