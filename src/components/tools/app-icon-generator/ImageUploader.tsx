import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  error?: string;
}

export function ImageUploader({ onImageSelect, error }: ImageUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  return (
    <div
      className={clsx(
        'max-w-md mx-auto border-2 border-dashed rounded-lg transition-colors',
        error
          ? 'border-red-400 bg-red-50 hover:bg-red-100'
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
      )}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center justify-center gap-3 py-6">
        <Upload className={clsx(
          'w-8 h-8',
          error ? 'text-red-400' : 'text-gray-400'
        )} />
        <div className="text-center px-4">
          <p className={clsx(
            'text-sm',
            error ? 'text-red-600' : 'text-gray-600'
          )}>
            Drag and drop your image here, or click to select
          </p>
          <p className={clsx(
            'text-xs mt-1',
            error ? 'text-red-500' : 'text-gray-500'
          )}>
            PNG or JPG, minimum 1024x1024 pixels
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}