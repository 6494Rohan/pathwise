import React from 'react';
import { render, screen } from '@testing-library/react-native';
import SkillsScreen from '../SkillsScreen';

describe('SkillsScreen', () => {
  it('shows the placeholder', async () => {
    await render(<SkillsScreen />);

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
  });
});
