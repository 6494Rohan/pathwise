import React, { createRef } from 'react';
import { Text, ViewInstance } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import KeyboardRevealTarget, { KeyboardRevealContext } from '../KeyboardRevealTarget';

describe('KeyboardRevealTarget', () => {
  it('registers its view with the layout so the layout can scroll to it', async () => {
    const targetRef = createRef<ViewInstance>();
    await render(
      <KeyboardRevealContext.Provider value={targetRef}>
        <KeyboardRevealTarget>
          <Text>Sign up</Text>
        </KeyboardRevealTarget>
      </KeyboardRevealContext.Provider>
    );

    expect(screen.getByText('Sign up')).toBeOnTheScreen();
    expect(targetRef.current).not.toBeNull();
  });
});
