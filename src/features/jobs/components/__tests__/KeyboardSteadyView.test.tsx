import React from 'react';
import { Keyboard, StyleSheet, Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import KeyboardSteadyView from '../KeyboardSteadyView';

jest.mock('@/hooks/useKeyboardVisible', () => ({ useKeyboardVisible: jest.fn(() => false) }));

const layout = (height: number) => ({ nativeEvent: { layout: { x: 0, y: 0, width: 400, height } } });
const contentHeight = () => StyleSheet.flatten(screen.getByTestId('keyboard-steady-content').props.style).height;
const area = () => screen.getByTestId('keyboard-steady-content').parent!;
const settle = () => act(async () => jest.advanceTimersByTime(300));

const renderSteadyView = () =>
  render(
    <KeyboardSteadyView>
      <Text>map</Text>
    </KeyboardSteadyView>
  );

describe('KeyboardSteadyView', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.mocked(useKeyboardVisible).mockReturnValue(false);
  });

  it('fills its area until the layout settles, then keeps that height', async () => {
    await renderSteadyView();
    expect(contentHeight()).toBeUndefined();

    await fireEvent(area(), 'layout', layout(600));
    await settle();

    expect(contentHeight()).toBe(600);
    expect(screen.getByText('map')).toBeOnTheScreen();
  });

  it('ignores the heights it passes through while the layout is still moving', async () => {
    await renderSteadyView();
    await fireEvent(area(), 'layout', layout(600));
    await settle();

    await fireEvent(area(), 'layout', layout(300));
    await act(async () => jest.advanceTimersByTime(100));
    await fireEvent(area(), 'layout', layout(450));
    await act(async () => jest.advanceTimersByTime(100));
    expect(contentHeight()).toBe(600);

    await fireEvent(area(), 'layout', layout(600));
    await settle();
    expect(contentHeight()).toBe(600);
  });

  it('keeps its height while the keyboard stays open', async () => {
    await renderSteadyView();
    await fireEvent(area(), 'layout', layout(600));
    await settle();
    jest.spyOn(Keyboard, 'isVisible').mockReturnValue(true);

    await fireEvent(area(), 'layout', layout(300));
    await settle();

    expect(contentHeight()).toBe(600);
  });

  it('follows a real size change once things settle with the keyboard closed', async () => {
    await renderSteadyView();
    await fireEvent(area(), 'layout', layout(600));
    await settle();

    await fireEvent(area(), 'layout', layout(640));
    await settle();

    expect(contentHeight()).toBe(640);
  });

  it('drops a pending height when the keyboard starts opening, even if React Native still says it is hidden', async () => {
    const view = await renderSteadyView();
    await fireEvent(area(), 'layout', layout(600));
    await settle();

    await fireEvent(area(), 'layout', layout(300));
    jest.mocked(useKeyboardVisible).mockReturnValue(true);
    await view.rerender(
      <KeyboardSteadyView>
        <Text>map</Text>
      </KeyboardSteadyView>
    );
    await settle();

    expect(contentHeight()).toBe(600);
  });
});
