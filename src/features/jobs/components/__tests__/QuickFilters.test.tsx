import React, { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import QuickFilters from '../QuickFilters';

const renderFilters = (props: Partial<ComponentProps<typeof QuickFilters>> = {}) => {
  const callbacks = {
    onOpenFilters: jest.fn(),
    onToggleVerified: jest.fn(),
    onToggleLast24Hours: jest.fn(),
    onTogglePostedAge: jest.fn(),
  };
  const result = render(<QuickFilters activeCount={0} verifiedOnly={false} last24Hours={false} {...callbacks} {...props} />);
  return { ...callbacks, result };
};

describe('QuickFilters', () => {
  it('toggles each quick filter', async () => {
    const filters = renderFilters();
    await filters.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Verified' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Last 24 hours' }));
    await fireEvent.press(screen.getByRole('button', { name: '3–7 days' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Filters' }));

    expect(filters.onToggleVerified).toHaveBeenCalled();
    expect(filters.onToggleLast24Hours).toHaveBeenCalled();
    expect(filters.onTogglePostedAge).toHaveBeenCalledWith('3-7');
    expect(filters.onOpenFilters).toHaveBeenCalled();
  });

  it('marks the selected chips and badges the number of active filters', async () => {
    await renderFilters({ activeCount: 2, verifiedOnly: true, postedAge: '30+' }).result;

    expect(screen.getByRole('button', { name: 'Verified' })).toBeSelected();
    expect(screen.getByRole('button', { name: '30+ days' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Last 24 hours' })).not.toBeSelected();
    expect(screen.getByRole('button', { name: 'Filters, 2 on' })).toBeOnTheScreen();
  });
});
