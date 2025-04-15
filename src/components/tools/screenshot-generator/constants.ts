import type { ColorPreset, TitleAreaPreset, FrameWidthPreset } from './types';

export const colorPresets: ColorPreset[] = [
  {
    name: 'Earth',
    gradient: 'linear-gradient(135deg, #A1FF8B 0%, #3F93FF 96.83%)'
  },
  {
    name: 'Airplane',
    gradient: 'linear-gradient(224.86deg, #73CCD8 4.87%, #2B6B9F 96.04%)'
  },
  {
    name: 'Grasshoper',
    gradient: 'linear-gradient(135deg, #80F1A6 0%, #EFD000 100%)'
  },
  {
    name: 'Sugar Cream',
    gradient: 'linear-gradient(225.4deg, #FEDC2A 0%, #DD5789 48.12%, #7A2C9E 93.59%)'
  },
  {
    name: 'Purple Sky',
    gradient: 'linear-gradient(51.06deg, #9358F7 0.87%, #7B78F2 25.96%, #6197EE 49.23%, #45B5E9 74.93%, #10D7E2 97.48%)'
  },
  {
    name: 'Red Sun',
    gradient: 'linear-gradient(45.4deg, #F4426C 6.41%, #FBF2B1 98.99%)'
  },
  {
    name: 'Blackberry',
    gradient: 'linear-gradient(135deg, #7EAEFF 2.88%, #FCA6E9 100%)'
  },
  {
    name: 'Sun',
    gradient: 'linear-gradient(135deg, #FBDA61 2.88%, #F76B1C 98.13%)'
  }
];

export const titleAreaPresets: TitleAreaPreset[] = [
  { name: 'Small', value: 0.06 },
  { name: 'Medium', value: 0.18 },
  { name: 'Large', value: 0.25 },
];

export const frameWidthPresets: FrameWidthPreset[] = [
  { name: 'Narrow', value: 0.75 },
  { name: 'Medium', value: 0.85 },
  { name: 'Wide', value: 0.90 },
]; 