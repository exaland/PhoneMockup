export interface ScreenshotFile {
  file: File | null;
  preview: string;
}

export interface DeviceConfig {
  title: string;
  subtitle: string;
  showBottomPriority: boolean;
  offset: number;
}

export interface ScreenshotGroup {
  id: string;
  iphone: DeviceConfig;
  ipad: DeviceConfig;
  iphone69: ScreenshotFile;
  iphone65: ScreenshotFile;
  ipad_portrait: ScreenshotFile;
  ipad_landscape: ScreenshotFile;
}

export interface DeviceType {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
  screens: {
    id: string;
    name: string;
    dimensions: {
      width: number;
      height: number;
    };
  }[];
} 