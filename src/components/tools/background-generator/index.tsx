"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shuffle, Download } from 'lucide-react';
import Trianglify from 'trianglify';

// Preset sizes
interface SizePreset {
  name: string;
  width: number;
  height: number;
  description: string;
}

const SIZE_PRESETS: SizePreset[] = [
  { name: 'custom', width: 800, height: 600, description: 'Custom Size' },
  { name: 'desktop', width: 1920, height: 1080, description: 'Desktop Wallpaper (1920×1080)' },
  { name: 'mobile', width: 1080, height: 1920, description: 'Mobile Wallpaper (1080×1920)' },
  { name: 'twitter', width: 1500, height: 500, description: 'Twitter/X Cover (1500×500)' },
  { name: 'instagram', width: 1080, height: 1080, description: 'Instagram Square (1080×1080)' },
  { name: 'facebook', width: 1200, height: 628, description: 'Facebook Cover (1200×628)' },
  { name: 'linkedin', width: 1584, height: 396, description: 'LinkedIn Cover (1584×396)' },
  { name: 'youtube', width: 1280, height: 720, description: 'YouTube Cover (1280×720)' },
  { name: 'rednote', width: 1080, height: 1440, description: 'Rednote Post (1080×1440)' },
];

// 颜色主题预设
const COLOR_THEMES = [
  { name: 'Ghibli Sky', colors: ['#86A7C5', '#BFC2DE', '#F6F3E9'] },
  { name: 'Forest Path', colors: ['#91AD70', '#D6A489', '#E4B4B4'] },
  { name: 'Modern Blue', colors: ['#2563eb', '#60a5fa', '#dbeafe'] },
  { name: 'Sunset', colors: ['#f97316', '#fdba74', '#fff7ed'] },
  { name: 'Purple Dream', colors: ['#7c3aed', '#a78bfa', '#ede9fe'] },
  { name: 'Jungle', colors: ['#059669', '#34d399', '#ecfdf5'] },
  { name: 'Coral Reef', colors: ['#db2777', '#f472b6', '#fce7f3'] },
  { name: 'Dark Mode', colors: ['#18181b', '#3f3f46', '#71717a'] },
];

export function BackgroundGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  
  // Polygon background parameters
  const [cellSize, setCellSize] = useState(60);
  const [variance, setVariance] = useState(0.75);
  const [colors, setColors] = useState<string[]>(['#86A7C5', '#BFC2DE', '#F6F3E9']);
  const [seed] = useState(() => Date.now().toString());
  
  // Client-side rendering state
  const [mounted, setMounted] = useState(false);

  // Effect that runs only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // HSL to RGB conversion helper function
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4))
    ];
  };

  // Generate random colors
  const generateRandomColors = () => {
    const newColors = Array(3).fill(0).map(() => {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 65 + Math.random() * 30; // 65-95%
      const lightness = 40 + Math.random() * 40;  // 40-80%
      
      const rgb = hslToRgb(hue, saturation, lightness);
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      return `#${rgb.map(toHex).join('')}`;
    });
    setColors(newColors);
  };

  // Handle preset size selection
  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const selected = SIZE_PRESETS.find(p => p.name === preset);
    if (selected) {
      setWidth(selected.width);
      setHeight(selected.height);
    }
  };

  // Apply a color theme
  const applyColorTheme = (themeIndex: number) => {
    setColors([...COLOR_THEMES[themeIndex].colors]);
  };

  // Generate polygon background
  const generatePolygon = () => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const pattern = Trianglify({
      width,
      height,
      cellSize,
      variance,
      xColors: colors,
      yColors: 'match',
      fill: true,
      strokeWidth: 0.5,
      colorSpace: 'lab',
      colorFunction: Trianglify.colorFunctions.interpolateLinear(0.5),
      seed: seed
    });

    pattern.toCanvas(canvas);
    setCurrentImage(canvas.toDataURL('image/png', 1.0));
  };

  // Regenerate background when parameters change
  useEffect(() => {
    if (mounted) {
      generatePolygon();
    }
  }, [width, height, cellSize, variance, colors, mounted]);

  // If not mounted, return a placeholder
  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[600px] flex items-center justify-center bg-white/50 rounded-2xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-5">
            {/* 尺寸预设选择器 */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-800 font-medium">
                <span className="inline-block w-6 h-6 mr-2 text-[#86A7C5]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="15" y1="3" x2="15" y2="21"></line>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="3" y1="15" x2="21" y2="15"></line>
                  </svg>
                </span>
                Preset Size
              </label>
              <div className="relative">
                <select 
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full bg-white/80 border-2 border-[#86A7C5]/20 rounded-xl py-2 px-3 pr-8 text-gray-700 focus:border-[#86A7C5]/40 focus:outline-none appearance-none transition-colors"
                >
                  {SIZE_PRESETS.map((preset) => (
                    <option key={preset.name} value={preset.name}>
                      {preset.description}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* 自定义尺寸控制 */}
            {selectedPreset === 'custom' && (
              <>
                <div className="space-y-3">
                  <label className="flex items-center text-gray-800 font-medium">
                    <span className="inline-block w-6 h-6 mr-2 text-[#D6A489]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <polyline points="8 8 12 4 16 8"></polyline>
                        <polyline points="16 16 12 20 8 16"></polyline>
                      </svg>
                    </span>
                    Width
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow h-2 bg-[#D6A489]/20 rounded-full relative">
                      <input 
                        type="range"
                        min="200"
                        max="2000"
                        step="100"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D6A489] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                      />
                    </div>
                    <div className="text-sm text-gray-600 w-16 text-right">{width}px</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center text-gray-800 font-medium">
                    <span className="inline-block w-6 h-6 mr-2 text-[#D6A489]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="3" x2="12" y2="21"></line>
                        <polyline points="8 8 4 12 8 16"></polyline>
                        <polyline points="16 8 20 12 16 16"></polyline>
                      </svg>
                    </span>
                    Height
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow h-2 bg-[#D6A489]/20 rounded-full relative">
                      <input 
                        type="range"
                        min="200"
                        max="2000"
                        step="100"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D6A489] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                      />
                    </div>
                    <div className="text-sm text-gray-600 w-16 text-right">{height}px</div>
                  </div>
                </div>
              </>
            )}

            {/* 图案参数控制 */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-800 font-medium">
                <span className="inline-block w-6 h-6 mr-2 text-[#91AD70]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
                  </svg>
                </span>
                Cell Size
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-grow h-2 bg-[#91AD70]/20 rounded-full relative">
                  <input 
                    type="range"
                    min="20"
                    max="200"
                    step="10"
                    value={cellSize}
                    onChange={(e) => setCellSize(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#91AD70] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
                <div className="text-sm text-gray-600 w-16 text-right">{cellSize}px</div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-gray-800 font-medium">
                <span className="inline-block w-6 h-6 mr-2 text-[#91AD70]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m8 17 4 4 4-4"></path>
                  </svg>
                </span>
                Variance
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-grow h-2 bg-[#91AD70]/20 rounded-full relative">
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={variance}
                    onChange={(e) => setVariance(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#91AD70] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
                <div className="text-sm text-gray-600 w-16 text-right">{variance}</div>
              </div>
            </div>

            {/* 颜色选择器 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-gray-800 font-medium">
                  <span className="inline-block w-6 h-6 mr-2 text-[#E4B4B4]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="13.5" cy="6.5" r="2.5"></circle>
                      <circle cx="17.5" cy="10.5" r="2.5"></circle>
                      <circle cx="8.5" cy="7.5" r="2.5"></circle>
                      <circle cx="6.5" cy="12.5" r="2.5"></circle>
                      <path d="M12 22v-6"></path>
                      <path d="m9 14 3 3 3-3"></path>
                    </svg>
                  </span>
                  Colors
                </label>
                <button 
                  onClick={generateRandomColors}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E4B4B4]/10 hover:bg-[#E4B4B4]/20 text-[#E4B4B4] transition-colors"
                  title="Random Colors"
                >
                  <Shuffle className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {colors.map((color, index) => (
                    <div 
                      key={index}
                      className="relative flex-1 aspect-square bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[index] = e.target.value;
                          setColors(newColors);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div 
                        className="w-full h-full rounded-lg border-2 border-white"
                        style={{ backgroundColor: color }}
                      ></div>
                    </div>
                  ))}
                </div>
                
                {/* 颜色主题选择器 */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {COLOR_THEMES.map((theme, index) => (
                    <button
                      key={index}
                      onClick={() => applyColorTheme(index)}
                      className="flex h-8 items-center gap-1 px-2 rounded-full bg-white/50 hover:bg-white/80 border border-gray-200 text-sm transition-colors"
                      title={theme.name}
                    >
                      {theme.colors.map((color, colorIndex) => (
                        <span 
                          key={colorIndex} 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        ></span>
                      ))}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 预览和下载区域 */}
          <div className="space-y-5">
            <div className="text-center text-sm text-gray-500 mb-2">
              {width} × {height} pixels
            </div>
            <div 
              className="border-2 border-[#86A7C5]/20 rounded-xl overflow-hidden flex items-center justify-center bg-white/50 relative group p-2"
              style={{
                maxHeight: '500px',
              }}
            >
              <div className="absolute inset-0 bg-[#86A7C5]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: '100%',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '0.5rem',
                }}
              />
            </div>
            
            {currentImage && (
              <button 
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-[#86A7C5] hover:bg-[#86A7C5]/90 text-white font-medium transition-colors relative overflow-hidden"
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `background-${width}x${height}-${Date.now()}.png`;
                  link.href = currentImage;
                  link.click();
                }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Image
                <div className="absolute -inset-px border-2 border-white/10 rounded-xl pointer-events-none"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 