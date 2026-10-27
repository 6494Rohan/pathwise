import { useRef } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Details, Region } from 'react-native-maps';

export const MIN_ZOOM = 4;
export const MAX_ZOOM = 18;
const LIMIT_TOLERANCE = 0.1;
const TILE_SIZE = 256;

export const zoomHaptics = {
  tap: () => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  tick: () =>
    void (Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick)
      : Haptics.selectionAsync()),
  bump: () => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

// Google's zoom level: how many times the 256-px world tile is doubled to fit the visible longitude span.
export const zoomOf = (region: Region, mapWidth: number) =>
  Math.log2((360 * mapWidth) / (TILE_SIZE * region.longitudeDelta));

export const isAtZoomLimit = (zoom: number, direction: 'in' | 'out') =>
  direction === 'in' ? zoom >= MAX_ZOOM - LIMIT_TOLERANCE : zoom <= MIN_ZOOM + LIMIT_TOLERANCE;

export const useZoomHaptics = (mapWidth: number) => {
  const lastZoom = useRef<number | null>(null);

  return (region: Region, details?: Details) => {
    const zoom = zoomOf(region, mapWidth);
    const previous = lastZoom.current;
    lastZoom.current = details?.isGesture ? zoom : null;
    if (!details?.isGesture || previous === null || !mapWidth) return;

    const direction = zoom > previous ? 'in' : 'out';
    if (isAtZoomLimit(zoom, direction) && !isAtZoomLimit(previous, direction)) zoomHaptics.bump();
    else if (Math.floor(zoom) !== Math.floor(previous)) zoomHaptics.tick();
  };
};
