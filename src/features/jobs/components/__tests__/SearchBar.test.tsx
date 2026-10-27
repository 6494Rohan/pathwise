import React, { ComponentProps } from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import SearchBar from '../SearchBar';

const renderBar = (props: Partial<ComponentProps<typeof SearchBar>> = {}) => {
  const onChangeText = jest.fn();
  const result = render(
    <SearchBar
      icon="location-outline"
      placeholder="Search location"
      clearLabel="Clear search"
      value=""
      onChangeText={onChangeText}
      {...props}
    />
  );
  return { onChangeText, result };
};

describe('SearchBar', () => {
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

  it('shows an accessory beside the input', async () => {
    await renderBar({ accessory: <Text>toggle</Text> }).result;

    expect(screen.getByText('toggle')).toBeOnTheScreen();
  });
});
