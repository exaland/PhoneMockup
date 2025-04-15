import React, { useCallback, useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { clsx } from 'clsx';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  error?: string;
  accept?: string;
  maxSize?: number;
  preview?: boolean;
}

export function ImageUploader({ 
  onImageSelect, 
  error,
  accept = "image/*",
  maxSize = 5242880, // 5MB
  preview = false
}: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      return false;
    }
    if (file.size > maxSize) {
      return false;
    }
    return true;
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        setIsLoading(true);
        try {
          if (preview) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
          }
          await onImageSelect(file);
        } catch (err) {
          console.error('Error processing image:', err);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onImageSelect, preview, maxSize]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        setIsLoading(true);
        try {
          if (preview) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
          }
          await onImageSelect(file);
        } catch (err) {
          console.error('Error processing image:', err);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onImageSelect, preview, maxSize]
  );

  return (
    <div
      className={clsx(
        'w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
        error
          ? 'border-red-400 bg-red-50'
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
      )}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        {isLoading ? (
          <Loader className="w-12 h-12 text-gray-400 animate-spin" />
        ) : (
          <>
            {preview && previewUrl ? (
              <div className="relative w-32 h-32">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                  sizes="128px"
                  priority
                />
              </div>
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
          </>
        )}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            拖放图片到这里，或者{' '}
            <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
              浏览
              <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileSelect}
                disabled={isLoading}
              />
            </label>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            支持 {accept.replace('image/', '')} 格式
            {maxSize && `，最大 ${Math.round(maxSize / 1024 / 1024)}MB`}
          </p>
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}