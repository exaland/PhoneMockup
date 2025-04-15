import React from 'react';
import { X, Check } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  isValid: boolean;
}

export function ImagePreview({ file, onRemove, isValid }: ImagePreviewProps) {
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden max-w-[200px] mx-auto">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={onRemove}
          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Remove image"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <div className="w-[200px] h-[200px] relative">
        <img
          src={URL.createObjectURL(file)}
          alt="Icon preview"
          className="w-full h-full object-contain p-4"
          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
        />
        
        {/* Validation Status */}
        <div className={`absolute bottom-0 left-0 right-0 p-2 ${
          isValid ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center gap-2 justify-center">
            {isValid ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-700">1024x1024px</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-700">Need 1024x1024px</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}