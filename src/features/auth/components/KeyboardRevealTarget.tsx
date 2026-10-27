import React, { createContext, ReactNode, RefObject, useContext } from 'react';
import { View, ViewInstance } from 'react-native';

export const KeyboardRevealContext = createContext<RefObject<ViewInstance | null> | null>(null);

interface KeyboardRevealTargetProps {
  children: ReactNode;
}

export default function KeyboardRevealTarget({ children }: KeyboardRevealTargetProps) {
  const targetRef = useContext(KeyboardRevealContext);
  return <View ref={targetRef}>{children}</View>;
}
