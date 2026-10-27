import { useEffect, useRef } from 'react';
import {
  Keyboard,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
  ViewInstance,
} from 'react-native';
import { spacing } from '@/theme';

interface RevealInput {
  targetBottom: number;
  viewportHeight: number;
  scrollOffset: number;
  margin: number;
}

export const getRevealOffset = ({ targetBottom, viewportHeight, scrollOffset, margin }: RevealInput) => {
  const overflow = targetBottom + margin - (scrollOffset + viewportHeight);
  return overflow > 0 ? scrollOffset + overflow : null;
};

export const useKeyboardReveal = () => {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const targetRef = useRef<ViewInstance>(null);
  const viewportHeight = useRef(0);
  const scrollOffset = useRef(0);
  const isKeyboardVisible = useRef(false);

  const reveal = () => {
    const content = scrollRef.current?.getInnerViewRef();
    if (!isKeyboardVisible.current || !content || !targetRef.current) return;
    targetRef.current.measureLayout(content, (_x, y, _width, height) => {
      const offset = getRevealOffset({
        targetBottom: y + height,
        viewportHeight: viewportHeight.current,
        scrollOffset: scrollOffset.current,
        margin: spacing[16],
      });
      if (offset !== null) scrollRef.current?.scrollTo({ y: offset, animated: true });
    });
  };

  useEffect(() => {
    const shown = Keyboard.addListener('keyboardDidShow', () => {
      isKeyboardVisible.current = true;
      reveal();
    });
    const hidden = Keyboard.addListener('keyboardDidHide', () => {
      isKeyboardVisible.current = false;
    });
    return () => {
      shown.remove();
      hidden.remove();
    };
  });

  // The Android keyboard padding shrinks the scroll view after keyboardDidShow, so reveal again once it settles.
  const onLayout = (event: LayoutChangeEvent) => {
    viewportHeight.current = event.nativeEvent.layout.height;
    reveal();
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  return { scrollRef, targetRef, onLayout, onScroll };
};
