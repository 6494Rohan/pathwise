import { renderHook } from '@testing-library/react-native';
import { getRevealOffset, useKeyboardReveal } from '../useKeyboardReveal';

describe('getRevealOffset', () => {
  it('scrolls just far enough to show the target above the keyboard', () => {
    expect(getRevealOffset({ targetBottom: 600, viewportHeight: 400, scrollOffset: 0, margin: 16 })).toBe(216);
    expect(getRevealOffset({ targetBottom: 600, viewportHeight: 400, scrollOffset: 100, margin: 16 })).toBe(216);
  });

  it('does not scroll when the target is already visible', () => {
    expect(getRevealOffset({ targetBottom: 300, viewportHeight: 400, scrollOffset: 0, margin: 16 })).toBeNull();
  });
});

describe('useKeyboardReveal', () => {
  it('gives the layout refs and handlers for the scroll view', async () => {
    const { result } = await renderHook(() => useKeyboardReveal());

    expect(result.current.scrollRef).toEqual({ current: null });
    expect(result.current.targetRef).toEqual({ current: null });
    expect(result.current.onLayout).toEqual(expect.any(Function));
    expect(result.current.onScroll).toEqual(expect.any(Function));
  });
});
