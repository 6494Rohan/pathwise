import React, { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import QuickFilters from '../QuickFilters';

const dropdowns = [
  { section: 'location' as const, label: 'Location', selected: false },
  { section: 'country' as const, label: 'India', selected: true },
];

const renderFilters = (props: Partial<ComponentProps<typeof QuickFilters>> = {}) => {
  const callbacks = {
    onOpenFilters: jest.fn(),
    onToggleVerified: jest.fn(),
    onToggleLast24Hours: jest.fn(),
    onToggleLastWeek: jest.fn(),
  };
  const result = render(
    <QuickFilters
      activeCount={0}
      verifiedOnly={false}
      last24Hours={false}
      lastWeek={false}
      dropdowns={dropdowns}
      {...callbacks}
      {...props}
    />
  );
  return { ...callbacks, result };
};

describe('QuickFilters', () => {
  it('toggles each quick filter and opens the sheet at a section', async () => {
    const filters = renderFilters();
    await filters.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Verified' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Last 24 hours' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Last week' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Location' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Filters' }));

    expect(filters.onToggleVerified).toHaveBeenCalled();
    expect(filters.onToggleLast24Hours).toHaveBeenCalled();
    expect(filters.onToggleLastWeek).toHaveBeenCalled();
    expect(filters.onOpenFilters).toHaveBeenCalledWith('location');
    expect(filters.onOpenFilters).toHaveBeenLastCalledWith();
  });

  it('marks the selected chips and badges the number of active filters', async () => {
    await renderFilters({ activeCount: 2, verifiedOnly: true, lastWeek: true }).result;

    expect(screen.getByRole('button', { name: 'Verified' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Last week' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'India' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Last 24 hours' })).not.toBeSelected();
    expect(screen.getByRole('button', { name: 'Filters, 2 on' })).toBeOnTheScreen();
  });
});
