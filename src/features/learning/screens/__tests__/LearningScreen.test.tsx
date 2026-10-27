import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LearningScreen from '../LearningScreen';

describe('LearningScreen', () => {
  it('shows the placeholder', async () => {
    await render(<LearningScreen />);

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
  });
});
