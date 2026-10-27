import { Platform } from 'react-native';
import { renderHook } from '@testing-library/react-native';
import { impactAsync, ImpactFeedbackStyle, performAndroidHapticsAsync, selectionAsync } from 'expo-haptics';
import { isAtZoomLimit, MAX_ZOOM, MIN_ZOOM, useZoomHaptics, zoomOf } from '../useZoomHaptics';

const MAP_WIDTH = 400;
const atZoom = (zoom: number) => {
  const longitudeDelta = (360 * MAP_WIDTH) / (256 * 2 ** zoom);
  return { latitude: 13, longitude: 75, latitudeDelta: longitudeDelta, longitudeDelta };
};

const pinch = async (zooms: number[]) => {
  const { result } = await renderHook(() => useZoomHaptics(MAP_WIDTH));
  zooms.forEach((zoom) => result.current(atZoom(zoom), { isGesture: true }));
};

describe('useZoomHaptics', () => {
  beforeEach(() => jest.clearAllMocks());

  it("reads Google's zoom level from the visible span and map width", () => {
    expect(zoomOf(atZoom(11.5), MAP_WIDTH)).toBeCloseTo(11.5);
    expect(isAtZoomLimit(MAX_ZOOM, 'in')).toBe(true);
    expect(isAtZoomLimit(MIN_ZOOM, 'out')).toBe(true);
    expect(isAtZoomLimit(10, 'in')).toBe(false);
  });

  it('ticks once per whole zoom level while pinching', async () => {
    await pinch([8.2, 8.6, 9.1, 9.5, 10.3, 9.8]);

    expect(selectionAsync).toHaveBeenCalledTimes(3);
    expect(impactAsync).not.toHaveBeenCalled();
  });

  it('uses the system segment tick on Android', async () => {
    const os = Platform.OS;
    Platform.OS = 'android';
    try {
      await pinch([8.6, 9.1]);
    } finally {
      Platform.OS = os;
    }

    expect(performAndroidHapticsAsync).toHaveBeenCalledWith('segment-tick');
  });

  it('bumps once when a pinch reaches either zoom limit', async () => {
    await pinch([MAX_ZOOM - 0.5, MAX_ZOOM - 0.05, MAX_ZOOM]);
    await pinch([MIN_ZOOM + 0.5, MIN_ZOOM]);

    expect(impactAsync).toHaveBeenCalledTimes(2);
    expect(impactAsync).toHaveBeenCalledWith(ImpactFeedbackStyle.Heavy);
  });

  it('stays quiet when the map moves by itself or only pans', async () => {
    const { result } = await renderHook(() => useZoomHaptics(MAP_WIDTH));

    result.current(atZoom(8), { isGesture: false });
    result.current(atZoom(12), { isGesture: false });
    result.current(atZoom(12), { isGesture: true });
    result.current({ ...atZoom(12), latitude: 14 }, { isGesture: true });

    expect(selectionAsync).not.toHaveBeenCalled();
    expect(impactAsync).not.toHaveBeenCalled();
  });
});
