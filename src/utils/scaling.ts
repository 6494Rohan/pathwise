import { Dimensions, PixelRatio } from 'react-native';

// Must match the Figma frame size, in points.
const GUIDELINE_BASE_WIDTH = 360;
const GUIDELINE_BASE_HEIGHT = 800;

// Screens outside this phone range (e.g. tablets) scale like the nearest phone.
const MIN_WIDTH = 320;
const MAX_WIDTH = 440;
const MIN_HEIGHT = 568;
const MAX_HEIGHT = 956;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const { width, height } = Dimensions.get('window');
const widthRatio = clamp(Math.min(width, height), MIN_WIDTH, MAX_WIDTH) / GUIDELINE_BASE_WIDTH;
const heightRatio = clamp(Math.max(width, height), MIN_HEIGHT, MAX_HEIGHT) / GUIDELINE_BASE_HEIGHT;

const toPixel = (size: number) => PixelRatio.roundToNearestPixel(size);

export const scale = (size: number) => toPixel(size * widthRatio);

export const verticalScale = (size: number) => toPixel(size * heightRatio);

export const moderateScale = (size: number, factor = 0.5) =>
  toPixel(size + (size * widthRatio - size) * factor);

export const moderateVerticalScale = (size: number, factor = 0.5) =>
  toPixel(size + (size * heightRatio - size) * factor);

export const fontScale = (size: number) => moderateScale(size);
