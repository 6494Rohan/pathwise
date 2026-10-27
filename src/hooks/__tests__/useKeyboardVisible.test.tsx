import { DeviceEventEmitter, Keyboard } from 'react-native';
import { act, renderHook } from '@testing-library/react-native';
import { IME_WILL_CHANGE_EVENT, useKeyboardVisible } from '../useKeyboardVisible';

const listenToKeyboard = () => {
  const listeners: Record<string, () => void> = {};
  const remove = jest.fn();
  jest.spyOn(Keyboard, 'addListener').mockImplementation((event, listener) => {
    listeners[event] = listener as () => void;
    return { remove } as never;
  });
  return { listeners, remove };
};

describe('useKeyboardVisible', () => {
  afterEach(() => jest.restoreAllMocks());

  it('follows the keyboard showing and hiding, and stops listening on unmount', async () => {
    const { listeners, remove } = listenToKeyboard();
    const { result, unmount } = await renderHook(() => useKeyboardVisible());
    expect(result.current).toBe(false);

    await act(async () => (listeners.keyboardWillShow ?? listeners.keyboardDidShow)());
    expect(result.current).toBe(true);

    await act(async () => (listeners.keyboardWillHide ?? listeners.keyboardDidHide)());
    expect(result.current).toBe(false);

    await unmount();
    expect(remove).toHaveBeenCalledTimes(2);
  });

  it('reacts as soon as the Android keyboard starts to move', async () => {
    listenToKeyboard();
    const { result } = await renderHook(() => useKeyboardVisible());

    await act(async () => DeviceEventEmitter.emit(IME_WILL_CHANGE_EVENT, { visible: true }));
    expect(result.current).toBe(true);

    await act(async () => DeviceEventEmitter.emit(IME_WILL_CHANGE_EVENT, { visible: false }));
    expect(result.current).toBe(false);
  });
});
