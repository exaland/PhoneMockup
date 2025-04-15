export interface LocaleRange {
  min: string;
  current: string;
}

export interface TitleAreaControls {
  title: string;
  small: string;
  medium: string;
  large: string;
  range: LocaleRange;
}

export interface AppIconControls {
  upload: {
    title: string;
    noFile: string;
    dropzone: {
      default: string;
      dragging: string;
      supportText: string;
      button: string;
    };
  };
  controls: {
    platform: {
      label: string;
      ios: string;
      android: string;
      macos: string;
      web: string;
    };
    settings: {
      label: string;
      cornerRadius: string;
      backgroundColor: string;
      padding: string;
      preview: string;
    };
  };
  processing: {
    title: string;
    complete: string;
  };
  buttons: {
    generate: string;
    download: string;
  };
  export: {
    button: string;
    processing: string;
    success: string;
    download: string;
    downloadAll: string;
  };
  alerts: {
    imageOnly: string;
    processing: string;
    error: string;
    sizeWarning: string;
    sizeError: string;
    formatError: string;
  };
}

export interface ScreenshotControls {
  deviceType: {
    label: string;
    iphone: string;
    ipad: string;
  };
  titleArea: TitleAreaControls;
  frameWidth: {
    title: string;
    narrow: string;
    medium: string;
    wide: string;
    range: LocaleRange;
  };
  background: {
    title: string;
  };
  screenshot: {
    title: string;
    subtitle: string;
    alignBottom: string;
    cropOffset: string;
    px: string;
    upload: string;
    uploading: string;
    dimensions: {
      iphone69: string;
      iphone65: string;
      ipadPortrait: string;
      ipadLandscape: string;
    };
    noImages: string;
    uploadHint: string;
  };
  generate: string;
} 