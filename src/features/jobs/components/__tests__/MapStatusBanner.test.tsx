import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import MapStatusBanner from '../MapStatusBanner';

describe('MapStatusBanner', () => {
  it('shows that jobs are loading', async () => {
    await render(<MapStatusBanner status="loading" />);

    expect(screen.getByText('Loading jobs near you…')).toBeOnTheScreen();
  });

  it('shows the error and retries', async () => {
    const onRetry = jest.fn();
    await render(<MapStatusBanner status="error" onRetry={onRetry} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(screen.getByText("Couldn't load jobs on the map.")).toBeOnTheScreen();
    expect(onRetry).toHaveBeenCalled();
  });
});
