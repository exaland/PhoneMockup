import React from 'react';
import { UploadCloud, Eye, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploadedFiles: Array<{ id: string; url: string }>;
  onFileDelete?: (id: string) => void;
  onPreviewSelect?: (url: string) => void;
  selectedUrl?: string | null;
}

// Create rounded image function
const createRoundedImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        // Create rounded path
        ctx.beginPath();
        // Set corner radius to 18% of the smaller dimension
        const radius = Math.min(canvas.width, canvas.height) * 0.18;
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        ctx.lineTo(radius, canvas.height);
        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        
        // Clip and draw
        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      
      // Convert to blob and create new File
      canvas.toBlob((blob) => {
        if (blob) {
          const roundedFile = new File([blob], file.name, { type: 'image/png' });
          resolve(roundedFile);
        }
      }, 'image/png');
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export function FileUpload({
  onFileSelect,
  uploadedFiles,
  onFileDelete,
  onPreviewSelect,
  selectedUrl 
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    onDrop: async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        const roundedFile = await createRoundedImage(file);
        onFileSelect(roundedFile);
      }
    }
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragActive ? 'border-[#6ee7b7] bg-[#6ee7b7]/5' : 'border-gray-200 hover:border-[#6ee7b7]/40 hover:bg-gray-50'
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-[#6ee7b7]/10 flex items-center justify-center rounded-full">
              <UploadCloud className="w-8 h-8 text-[#10b981]" />
            </div>
            <p className="text-[#1c1f23] font-medium">
              {isDragActive
                ? "Release to Upload"
                : "Click or Drop Screenshots Here"}
            </p>
            <p className="text-sm text-gray-500">
              Supports PNG, JPG, JPEG, WebP (max 5MB)
            </p>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-[#1c1f23]">Uploaded Screenshots</h3>
            <div className="flex flex-wrap gap-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onPreviewSelect?.(file.url)}
                  className={`relative group cursor-pointer overflow-hidden rounded-lg transition-all ${
                    selectedUrl === file.url 
                      ? 'ring-2 ring-[#6ee7b7] shadow-md' 
                      : 'hover:shadow-md hover:ring-1 hover:ring-[#6ee7b7]/30'
                  }`}
                >
                  <img
                    src={file.url}
                    alt="Screenshot preview"
                    className="w-[100px] h-auto object-contain"
                  />
                  {onFileDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileDelete(file.id);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-[#1c1f23] text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
