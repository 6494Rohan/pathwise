import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import SortSheet from '../SortSheet';

describe('SortSheet', () => {
  it('ticks the current order and reports a new choice', async () => {
    const onChange = jest.fn();
    await render(<SortSheet visible value="newest" onChange={onChange} onClose={jest.fn()} />);

    expect(screen.getByRole('radio', { name: 'Newest' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Highest salary' })).not.toBeChecked();

    await fireEvent.press(screen.getByRole('radio', { name: 'Highest salary' }));

    expect(onChange).toHaveBeenCalledWith('salary');
  });

  it('closes when the backdrop is tapped', async () => {
    const onClose = jest.fn();
    await render(<SortSheet visible value="oldest" onChange={jest.fn()} onClose={onClose} />);

    await fireEvent.press(screen.getByLabelText('Close sort'));

    expect(onClose).toHaveBeenCalled();
  });
});
