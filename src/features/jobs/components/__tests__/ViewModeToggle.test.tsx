import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ViewModeToggle from '../ViewModeToggle';

describe('ViewModeToggle', () => {
  it('marks the current view', async () => {
    await render(<ViewModeToggle value="map" onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Map view' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'List view' })).not.toBeSelected();
  });

  it('reports the chosen view', async () => {
    const onChange = jest.fn();
    await render(<ViewModeToggle value="map" onChange={onChange} />);

    await fireEvent.press(screen.getByRole('button', { name: 'List view' }));

    expect(onChange).toHaveBeenCalledWith('list');
  });
});
