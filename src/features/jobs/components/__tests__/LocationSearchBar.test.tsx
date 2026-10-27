import React, { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import LocationSearchBar from '../LocationSearchBar';

const renderBar = (props: Partial<ComponentProps<typeof LocationSearchBar>> = {}) => {
  const onChangeText = jest.fn();
  const result = render(<LocationSearchBar value="" onChangeText={onChangeText} isSearching={false} error={null} {...props} />);
  return { onChangeText, result };
};

describe('LocationSearchBar', () => {
  it('reports typed text', async () => {
    const bar = renderBar();
    await bar.result;

    await fireEvent.changeText(screen.getByPlaceholderText('Search location'), 'Beng');

    expect(bar.onChangeText).toHaveBeenCalledWith('Beng');
  });

  it('clears the text', async () => {
    const bar = renderBar({ value: 'Bengaluru' });
    await bar.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));

    expect(bar.onChangeText).toHaveBeenCalledWith('');
  });

  it('shows a spinner instead of the clear button while searching', async () => {
    await renderBar({ value: 'Bengaluru', isSearching: true }).result;

    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeOnTheScreen();
  });

  it('shows the search error', async () => {
    await renderBar({ error: 'Allow location access to search places.' }).result;

    expect(screen.getByText('Allow location access to search places.')).toBeOnTheScreen();
  });
});
