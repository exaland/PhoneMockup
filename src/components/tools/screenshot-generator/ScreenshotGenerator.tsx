'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SettingsPanel } from './SettingsPanel';
import { PreviewPanel } from './PreviewPanel';
import { deviceTypes } from '@/constants/deviceTypes';
import { colorPresets, titleAreaPresets, frameWidthPresets } from './constants';
import type { ScreenshotGroup, ScreenshotFile, DeviceConfig } from '@/types/ScreenshotGroup';
import type { PreviewImage } from './types';

export function ScreenshotGenerator() {
  const [screenshotGroups, setScreenshotGroups] = useState<ScreenshotGroup[]>([]);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [deviceType, setDeviceType] = useState('iphone');
  const [titleAreaHeight, setTitleAreaHeight] = useState(0.18);
  const [frameWidth, setFrameWidth] = useState(0.85);
  const [previewImages, setPreviewImages] = useState<{[key: string]: PreviewImage}>({});
  
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize screenshots
  useEffect(() => {
    const initialGroups: ScreenshotGroup[] = Array(6).fill(null).map((_, index) => ({
      id: `group-${index}`,
      iphone: {
        title: '',
        subtitle: '',
        showBottomPriority: false,
        offset: 88
      } as DeviceConfig,
      ipad: {
        title: '',
        subtitle: '',
        showBottomPriority: false,
        offset: 88
      } as DeviceConfig,
      iphone69: { file: null, preview: '' } as ScreenshotFile,
      iphone65: { file: null, preview: '' } as ScreenshotFile,
      ipad_portrait: { file: null, preview: '' } as ScreenshotFile,
      ipad_landscape: { file: null, preview: '' } as ScreenshotFile
    }));
    setScreenshotGroups(initialGroups);
  }, []);

  // Debounce function
  const debounceUpdate = (callback: () => void) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(callback, 300);
  };

  // Cache device dimensions calculation with useMemo
  const getDimensions = useCallback((deviceType: string) => {
    const device = deviceTypes.find(d => {
      if (deviceType.includes('ipad')) return d.id === 'ipad';
      if (deviceType.includes('iphone')) return d.id === 'iphone';
      return false;
    });

    if (!device) {
      return deviceTypes[0].screens![0].dimensions;
    }

    // Return dimensions based on device type
    let dimensions;
    if (deviceType === 'iphone69') dimensions = device.screens![0].dimensions;
    else if (deviceType === 'iphone65') dimensions = device.screens![1].dimensions;
    else if (deviceType === 'ipad_portrait') dimensions = device.screens![0].dimensions;
    else if (deviceType === 'ipad_landscape') dimensions = device.screens![1].dimensions;
    else dimensions = device.screens![0].dimensions;

    return dimensions;
  }, []);

  // Cache current device dimensions with useMemo
  const currentDimensions = useMemo(() => {
    return getDimensions(deviceType);
  }, [deviceType, getDimensions]);

  // Setup canvas
  const setupCanvas = useCallback((canvas: HTMLCanvasElement, deviceType: string) => {
    const dimensions = getDimensions(deviceType);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height); // Clear canvas
    }
    return ctx;
  }, [getDimensions]);

  // Render base layer
  const renderBaseLayer = useCallback(async (groupId: string, deviceType: string) => {
    const canvas = baseCanvasRef.current;
    if (!canvas) return;
    
    const ctx = setupCanvas(canvas, deviceType);
    if (!ctx) return;

    const dimensions = getDimensions(deviceType);
    const group = screenshotGroups.find(g => g.id === groupId);
    if (!group) return;

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
    const gradientStr = colorPresets[selectedPreset].gradient;
    const colors = gradientStr.match(/(?:rgb|rgba)\([^)]+\)|#[A-Fa-f0-9]{6}/g) || [];
    gradient.addColorStop(0, colors[0] || '#000000');
    gradient.addColorStop(1, colors[1] || '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Get screenshot based on device type
    let screenshot;
    if (deviceType === 'iphone69') screenshot = group.iphone69;
    else if (deviceType === 'iphone65') screenshot = group.iphone65;
    else if (deviceType === 'ipad_portrait') screenshot = group.ipad_portrait;
    else if (deviceType === 'ipad_landscape') screenshot = group.ipad_landscape;
    else screenshot = group.iphone69;
    
    // Calculate title area height
    const titleAreaPixels = dimensions.height * titleAreaHeight;
    const remainingHeight = dimensions.height - titleAreaPixels;
    
    // Calculate device frame dimensions and position
    const actualFrameWidth = dimensions.width * frameWidth;
    let frameHeight;

    if (deviceType.includes('ipad')) {
      if (deviceType.includes('portrait')) {
        frameHeight = Math.min(
          actualFrameWidth * 1.33,
          remainingHeight * 0.95
        );
      } else {
        frameHeight = Math.min(
          actualFrameWidth * 0.75,
          remainingHeight * 0.95
        );
      }
    } else {
      frameHeight = Math.min(actualFrameWidth * 2.16, remainingHeight * 0.95);
    }
    
    // Calculate frame position
    const x = dimensions.width * 0.5 - actualFrameWidth * 0.5;
    const y = titleAreaPixels + (remainingHeight - frameHeight) * 0.5;

    // Draw frame background
    const padding = 30;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.roundRect(x - padding, y - padding, actualFrameWidth + padding * 2, frameHeight + padding * 2, 44);
    ctx.fill();

    if (screenshot?.preview) {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = screenshot.preview;
      });

      // Create rounded clip area
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, actualFrameWidth, frameHeight, 24);
      ctx.clip();

      // Get device config
      const config = deviceType.includes('ipad') ? group.ipad : group.iphone;
      
      // Calculate image dimensions to fill frame while maintaining aspect ratio
      const imgRatio = img.width / img.height;
      let drawWidth = actualFrameWidth;
      let drawHeight = drawWidth / imgRatio;
      
      if (drawHeight < frameHeight) {
        drawHeight = frameHeight;
        drawWidth = drawHeight * imgRatio;
      }
      
      // Calculate draw position
      const drawX = x + (actualFrameWidth - drawWidth) * 0.5;
      let drawY = y;
      if (drawHeight > frameHeight) {
        if (config.showBottomPriority) {
          drawY = y + frameHeight - drawHeight + config.offset;
        } else {
          drawY = y - config.offset;
        }
      }

      // Draw screenshot
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      // Draw frame border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(x - padding, y - padding, actualFrameWidth + padding * 2, frameHeight + padding * 2, 44);
      ctx.stroke();
    } else {
      // Draw empty state
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.roundRect(x, y, actualFrameWidth, frameHeight, 24);
      ctx.fill();
    }
  }, [getDimensions, screenshotGroups, selectedPreset, titleAreaHeight, frameWidth]);

  // Optimize text layer rendering
  const renderTextLayer = useCallback(async (groupId: string, deviceType: string) => {
    const canvas = textCanvasRef.current;
    if (!canvas) return;
    
    const ctx = setupCanvas(canvas, deviceType);
    if (!ctx) return;

    const dimensions = getDimensions(deviceType);
    const group = screenshotGroups.find(g => g.id === groupId);
    if (!group) return;

    // Clear previous text
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Get device config
    const config = deviceType.includes('ipad') ? group.ipad : group.iphone;
    const { title, subtitle } = config;
    
    if (!title && !subtitle) return; // Return if no text content

    // Use set title area height
    const actualTitleAreaHeight = dimensions.height * titleAreaHeight;
    
    // Adjust main title position based on subtitle presence
    const titleY = subtitle 
      ? actualTitleAreaHeight * 0.4
      : actualTitleAreaHeight * 0.5;
    
    // Draw title
    if (title) {
      ctx.font = `bold ${Math.round(dimensions.width * 0.07)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText(title, dimensions.width * 0.5, titleY);
    }

    // Draw subtitle
    if (subtitle) {
      ctx.font = `${Math.round(dimensions.width * 0.04)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(subtitle, dimensions.width * 0.5, titleY + dimensions.width * 0.06);
    }
  }, [getDimensions, setupCanvas, titleAreaHeight]);

  // Generate screenshots
  const generateScreenshots = useCallback(async () => {
    const zip = new JSZip();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Process each screenshot group
    for (const group of screenshotGroups) {
      // Skip empty groups
      if (!group.iphone69.file && !group.iphone65.file && !group.ipad_portrait.file && !group.ipad_landscape.file) {
        continue;
      }

      // Process iPhone screenshots
      if (group.iphone69.file || group.iphone65.file) {
        // Setup iPhone folder
        const iphoneFolder = zip.folder('iPhone');
        if (!iphoneFolder) continue;

        // Generate iPhone 6.7" screenshots
        if (group.iphone69.file) {
          await renderBaseLayer(group.id, 'iphone69');
          await renderTextLayer(group.id, 'iphone69');
          const dimensions = getDimensions('iphone69');
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
          ctx.clearRect(0, 0, dimensions.width, dimensions.height);
          ctx.drawImage(baseCanvasRef.current!, 0, 0);
          ctx.drawImage(textCanvasRef.current!, 0, 0);
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)));
          iphoneFolder.file('6.7-inch.png', blob);
        }

        // Generate iPhone 6.5" screenshots
        if (group.iphone65.file) {
          await renderBaseLayer(group.id, 'iphone65');
          await renderTextLayer(group.id, 'iphone65');
          const dimensions = getDimensions('iphone65');
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
          ctx.clearRect(0, 0, dimensions.width, dimensions.height);
          ctx.drawImage(baseCanvasRef.current!, 0, 0);
          ctx.drawImage(textCanvasRef.current!, 0, 0);
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)));
          iphoneFolder.file('6.5-inch.png', blob);
        }
      }

      // Process iPad screenshots
      if (group.ipad_portrait.file || group.ipad_landscape.file) {
        // Setup iPad folder
        const ipadFolder = zip.folder('iPad');
        if (!ipadFolder) continue;

        // Generate iPad portrait screenshots
        if (group.ipad_portrait.file) {
          await renderBaseLayer(group.id, 'ipad_portrait');
          await renderTextLayer(group.id, 'ipad_portrait');
          const dimensions = getDimensions('ipad_portrait');
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
          ctx.clearRect(0, 0, dimensions.width, dimensions.height);
          ctx.drawImage(baseCanvasRef.current!, 0, 0);
          ctx.drawImage(textCanvasRef.current!, 0, 0);
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)));
          ipadFolder.file('portrait.png', blob);
        }

        // Generate iPad landscape screenshots
        if (group.ipad_landscape.file) {
          await renderBaseLayer(group.id, 'ipad_landscape');
          await renderTextLayer(group.id, 'ipad_landscape');
          const dimensions = getDimensions('ipad_landscape');
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
          ctx.clearRect(0, 0, dimensions.width, dimensions.height);
          ctx.drawImage(baseCanvasRef.current!, 0, 0);
          ctx.drawImage(textCanvasRef.current!, 0, 0);
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)));
          ipadFolder.file('landscape.png', blob);
        }
      }
    }

    // Generate and download ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'screenshots.zip');
  }, [getDimensions, renderBaseLayer, renderTextLayer, screenshotGroups]);

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <SettingsPanel
        selectedPreset={selectedPreset}
        setSelectedPreset={setSelectedPreset}
        titleAreaHeight={titleAreaHeight}
        setTitleAreaHeight={setTitleAreaHeight}
        frameWidth={frameWidth}
        setFrameWidth={setFrameWidth}
        colorPresets={colorPresets}
        titleAreaPresets={titleAreaPresets}
        frameWidthPresets={frameWidthPresets}
      />
      <PreviewPanel
        deviceType={deviceType}
        setDeviceType={setDeviceType}
        screenshotGroups={screenshotGroups}
        setScreenshotGroups={setScreenshotGroups}
        previewImages={previewImages}
        fileInputRefs={fileInputRefs}
        deviceTypes={deviceTypes}
        onGenerateScreenshots={generateScreenshots}
      />
      <canvas ref={baseCanvasRef} className="hidden" />
      <canvas ref={textCanvasRef} className="hidden" />
    </div>
  );
} 