export interface ScreenshotGroup {
  id: string;
  title: string;
  subtitle: string;
  showBottomPriority: boolean;
  offset: number;
  iphone69: {
    file: File | null;
    preview: string;
  };
  iphone65: {
    file: File | null;
    preview: string;
  };
}

export interface PreviewImage {
  url: string;
  loading: boolean;
}

export interface DeviceType {
  name: string;
  value: string;
  enabled: boolean;
  screens?: {
    name: string;
    dimensions: {
      width: number;
      height: number;
    };
    label: string;
  }[];
}

export interface ColorPreset {
  name: string;
  gradient: string;
}

export interface TitleAreaPreset {
  name: string;
  value: number;
}

export interface FrameWidthPreset {
  name: string;
  value: number;
} 