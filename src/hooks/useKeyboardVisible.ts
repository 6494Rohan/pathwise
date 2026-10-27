import { useEffect, useState } from 'react';
import { DeviceEventEmitter, Keyboard, Platform } from 'react-native';

// Sent by plugins/withAndroidImeInsets as the keyboard starts to move; React Native's Android events fire only after.
export const IME_WILL_CHANGE_EVENT = 'imeWillChange';

const SHOW_EVENT = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const HIDE_EVENT = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export const useKeyboardVisible = () => {
  const [isVisible, setIsVisible] = useState(Keyboard.isVisible());

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener(SHOW_EVENT, () => setIsVisible(true)),
      Keyboard.addListener(HIDE_EVENT, () => setIsVisible(false)),
      DeviceEventEmitter.addListener(IME_WILL_CHANGE_EVENT, ({ visible }: { visible: boolean }) => setIsVisible(visible)),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

  return isVisible;
};
