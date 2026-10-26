import { AppState, AppStateStatus } from 'react-native';
import { renderHook } from '@testing-library/react-native';
import { focusManager } from '@tanstack/react-query';
import { useRefetchOnAppFocus } from '../useRefetchOnAppFocus';

describe('useRefetchOnAppFocus', () => {
  it('reports app foreground and background to React Query', async () => {
    let onChange: (status: AppStateStatus) => void = () => undefined;
    const remove = jest.fn();
    jest.spyOn(AppState, 'addEventListener').mockImplementation(((_: string, handler: typeof onChange) => {
      onChange = handler;
      return { remove };
    }) as never);

    const { unmount } = await renderHook(() => useRefetchOnAppFocus());

    onChange('background');
    expect(focusManager.isFocused()).toBe(false);
    onChange('active');
    expect(focusManager.isFocused()).toBe(true);

    await unmount();
    expect(remove).toHaveBeenCalled();
  });
});
