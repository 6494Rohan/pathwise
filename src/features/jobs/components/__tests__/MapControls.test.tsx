import React, { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import MapControls from '../MapControls';

const renderControls = (props: Partial<ComponentProps<typeof MapControls>> = {}) => {
  const callbacks = { onZoomIn: jest.fn(), onZoomOut: jest.fn(), onLocate: jest.fn() };
  const result = render(<MapControls isLocating={false} {...callbacks} {...props} />);
  return { ...callbacks, result };
};

describe('MapControls', () => {
  it('zooms in, zooms out and locates', async () => {
    const controls = renderControls();
    await controls.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Zoom in' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Zoom out' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Show my location' }));

    expect(controls.onZoomIn).toHaveBeenCalled();
    expect(controls.onZoomOut).toHaveBeenCalled();
    expect(controls.onLocate).toHaveBeenCalled();
  });

  it('shows locating as busy and ignores more presses meanwhile', async () => {
    const controls = renderControls({ isLocating: true });
    await controls.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Show my location' }));

    expect(screen.getByRole('button', { name: 'Show my location' })).toBeBusy();
    expect(controls.onLocate).not.toHaveBeenCalled();
  });
});
