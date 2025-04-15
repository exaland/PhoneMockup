import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { downloadZip } from '@/utils/downloadUtils';
import JSZip from 'jszip';

export function PngCropper() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<{ blob: Blob; name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number } | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const pngFiles = files.filter(file => file.type === 'image/png');
    if (pngFiles.length === 0) {
      alert('Please select PNG files only');
      return;
    }
    
    // Clean up old URLs
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    
    // Create new preview URL for single file
    const newPreviewUrl = pngFiles.length === 1 ? URL.createObjectURL(pngFiles[0]) : null;
    
    setSelectedFiles(pngFiles);
    setPreviewUrl(newPreviewUrl);
    setProcessedUrl(null);
    setProcessedBlob(null);
  }, [previewUrl, processedUrl]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  }, [handleFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleDownload = useCallback(() => {
    if (!processedBlob) return;

    if (selectedFiles.length === 1) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(processedBlob.blob);
      link.download = processedBlob.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (processedBlob.blob) {
      downloadZip(processedBlob.blob, 'cropped_images.zip');
    }
  }, [processedBlob, selectedFiles.length]);

  const cropTransparentPixels = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: selectedFiles.length });
    try {
      const processedImages: { blob: Blob; name: string }[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setProcessingProgress({ current: i + 1, total: selectedFiles.length });

        // Create a new Image object to load PNG
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Create canvas to process image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Find non-transparent pixel boundaries
        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4 + 3];
            if (alpha > 0) {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }

        // If non-transparent pixels found
        if (minX < maxX && minY < maxY) {
          // Create new canvas for cropped image
          const croppedCanvas = document.createElement('canvas');
          const width = maxX - minX + 1;
          const height = maxY - minY + 1;
          croppedCanvas.width = width;
          croppedCanvas.height = height;

          // Draw cropped image
          const croppedCtx = croppedCanvas.getContext('2d')!;
          croppedCtx.drawImage(
            canvas,
            minX, minY, width, height,
            0, 0, width, height
          );

          // Convert to Blob
          const blob = await new Promise<Blob>((resolve) => {
            croppedCanvas.toBlob((blob) => {
              resolve(blob!);
            }, 'image/png');
          });

          // Save processed image
          const processedImage = {
            blob,
            name: file.name.replace('.png', '_cropped.png')
          };
          processedImages.push(processedImage);

          // Update preview for single file
          if (selectedFiles.length === 1) {
            if (processedUrl) URL.revokeObjectURL(processedUrl);
            const url = URL.createObjectURL(blob);
            setProcessedUrl(url);
            setProcessedBlob(processedImage);
          }
        }
      }

      // For multiple files, prepare ZIP but don't download automatically
      if (processedImages.length > 1) {
        const zip = new JSZip();
        processedImages.forEach(({ blob, name }) => {
          zip.file(name, blob);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setProcessedBlob({ blob: zipBlob, name: 'cropped_images.zip' });
      }
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  }, [selectedFiles, processedUrl]);

  const isBatchMode = selectedFiles.length > 1;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        {/* Upload area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/png"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block"
          >
            <div className="space-y-4">
              <div className="text-gray-600">
                {isDragging ? "Release to Upload" : "Click or Drop PNG Files Here"}
              </div>
              <Button variant="outline" className="pointer-events-none">
                Choose Files
              </Button>
              <div className="text-sm text-gray-500">
                Supports single or multiple PNG files
              </div>
            </div>
          </label>
        </div>

        {/* Preview/Status area */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            {isBatchMode ? (
              <div className="text-center space-y-4">
                <div className="text-lg font-medium">
                  {isProcessing ? (
                    <div className="space-y-2">
                      <div>Processing Images...</div>
                      {processingProgress && (
                        <div className="text-sm text-gray-500">
                          Progress: {processingProgress.current}/{processingProgress.total}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>{selectedFiles.length} files selected</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {previewUrl && (
                  <div>
                    <div className="text-sm font-medium mb-2">Original</div>
                    <img
                      src={previewUrl}
                      alt="Original PNG"
                      className="max-w-full h-auto border rounded"
                    />
                  </div>
                )}
                {processedUrl && (
                  <div>
                    <div className="text-sm font-medium mb-2">Cropped</div>
                    <img
                      src={processedUrl}
                      alt="Cropped PNG"
                      className="max-w-full h-auto border rounded"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={cropTransparentPixels}
                disabled={isProcessing}
              >
                Crop Transparent Edges
              </Button>
              {processedBlob && (
                <Button
                  onClick={handleDownload}
                  disabled={isProcessing}
                >
                  Download
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}