import JSZip from 'jszip';
import { Platform, platformConfigs } from '../types/Platform';

export async function validateImage(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve(img.width === 1024 && img.height === 1024);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src); // Clean up
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export async function resizeImage(
  imgData: ArrayBuffer,
  width: number,
  height: number
): Promise<Blob> {
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              URL.revokeObjectURL(img.src); // Clean up
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/png',
          1.0
        );
      } catch (err) {
        URL.revokeObjectURL(img.src); // Clean up
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src); // Clean up
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = URL.createObjectURL(new Blob([imgData]));
  });
}

export async function generateIcons(
  file: File,
  platform: Platform
): Promise<Blob> {
  const zip = new JSZip();
  const imgData = await file.arrayBuffer();
  const config = platformConfigs[platform];

  try {
    for (const size of config.sizes) {
      const resizedBlob = await resizeImage(imgData, size.size, size.size);
      zip.file(size.path, resizedBlob);
    }

    return await zip.generateAsync({ type: 'blob' });
  } catch (err) {
    throw new Error('Failed to generate icons');
  }
}