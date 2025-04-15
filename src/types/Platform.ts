export type Platform = 'ios' | 'android' | 'macos' | 'web';

export interface PlatformConfig {
  name: string;
  sizes: Array<{
    name: string;
    size: number;
    scale?: number;
    path: string;
  }>;
}

export const platformConfigs: Record<Platform, PlatformConfig> = {
  ios: {
    name: 'iOS',
    sizes: [
      { name: 'iPhone 20pt @2x', size: 40, path: 'iOS/Icon-App-20x20@2x.png' },
      { name: 'iPhone 20pt @3x', size: 60, path: 'iOS/Icon-App-20x20@3x.png' },
      { name: 'iPhone 29pt @1x', size: 29, path: 'iOS/Icon-App-29x29@1x.png' },
      { name: 'iPhone 29pt @2x', size: 58, path: 'iOS/Icon-App-29x29@2x.png' },
      { name: 'iPhone 29pt @3x', size: 87, path: 'iOS/Icon-App-29x29@3x.png' },
      { name: 'iPhone 40pt @2x', size: 80, path: 'iOS/Icon-App-40x40@2x.png' },
      { name: 'iPhone 40pt @3x', size: 120, path: 'iOS/Icon-App-40x40@3x.png' },
      { name: 'iPhone 60pt @2x', size: 120, path: 'iOS/Icon-App-60x60@2x.png' },
      { name: 'iPhone 60pt @3x', size: 180, path: 'iOS/Icon-App-60x60@3x.png' },
      { name: 'iPad 76pt @1x', size: 76, path: 'iOS/Icon-App-76x76@1x.png' },
      { name: 'iPad 76pt @2x', size: 152, path: 'iOS/Icon-App-76x76@2x.png' },
      { name: 'iPad Pro 83.5pt @2x', size: 167, path: 'iOS/Icon-App-83.5x83.5@2x.png' },
      { name: 'App Store', size: 1024, path: 'iOS/Icon-App-1024x1024@1x.png' }
    ]
  },
  android: {
    name: 'Android',
    sizes: [
      { name: 'mdpi', size: 48, path: 'mipmap-mdpi/ic_launcher.png' },
      { name: 'hdpi', size: 72, path: 'mipmap-hdpi/ic_launcher.png' },
      { name: 'xhdpi', size: 96, path: 'mipmap-xhdpi/ic_launcher.png' },
      { name: 'xxhdpi', size: 144, path: 'mipmap-xxhdpi/ic_launcher.png' },
      { name: 'xxxhdpi', size: 192, path: 'mipmap-xxxhdpi/ic_launcher.png' }
    ]
  },
  macos: {
    name: 'macOS',
    sizes: [
      { name: '16x16', size: 16, path: 'macOS/app_icon_16.png' },
      { name: '32x32', size: 32, path: 'macOS/app_icon_32.png' },
      { name: '64x64', size: 64, path: 'macOS/app_icon_64.png' },
      { name: '128x128', size: 128, path: 'macOS/app_icon_128.png' },
      { name: '256x256', size: 256, path: 'macOS/app_icon_256.png' },
      { name: '512x512', size: 512, path: 'macOS/app_icon_512.png' },
      { name: '1024x1024', size: 1024, path: 'macOS/app_icon_1024.png' }
    ]
  },
  web: {
    name: 'Web',
    sizes: [
      { name: 'Favicon', size: 16, path: 'web/favicon.png' },
      { name: 'Maskable Icon', size: 192, path: 'web/Icon-maskable-192.png' },
      { name: 'Large Maskable Icon', size: 512, path: 'web/Icon-maskable-512.png' },
      { name: 'Icon', size: 192, path: 'web/Icon-192.png' },
      { name: 'Large Icon', size: 512, path: 'web/Icon-512.png' }
    ]
  }
};