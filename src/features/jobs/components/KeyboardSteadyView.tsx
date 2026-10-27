import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Keyboard, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';

const SETTLE_MS = 300;

interface KeyboardSteadyViewProps {
  children: ReactNode;
}

// A map re-centres whenever it is resized, so it keeps the height it had with the keyboard closed. Android reports
// the keyboard hidden as it starts to close, so a new height is taken only once the layout has stopped moving.
export default function KeyboardSteadyView({ children }: KeyboardSteadyViewProps) {
  const isKeyboardVisible = useKeyboardVisible();
  const [steadyHeight, setSteadyHeight] = useState<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyboardVisibleRef = useRef(isKeyboardVisible);

  useEffect(() => {
    keyboardVisibleRef.current = isKeyboardVisible;
    if (isKeyboardVisible && settleTimer.current) clearTimeout(settleTimer.current);
  }, [isKeyboardVisible]);

  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    },
    []
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      if (!keyboardVisibleRef.current && !Keyboard.isVisible()) setSteadyHeight(height);
    }, SETTLE_MS);
  };

  return (
    <View style={styles.area} onLayout={onLayout}>
      <View
        testID="keyboard-steady-content"
        style={[styles.content, steadyHeight === null ? styles.fill : { height: steadyHeight }]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  fill: {
    bottom: 0,
  },
});
