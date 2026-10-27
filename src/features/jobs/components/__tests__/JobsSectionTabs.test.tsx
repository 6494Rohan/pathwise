import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import JobsSectionTabs from '../JobsSectionTabs';

describe('JobsSectionTabs', () => {
  it('shows every section and marks the selected one', async () => {
    await render(<JobsSectionTabs selected="allJobs" onSelect={jest.fn()} />);

    for (const name of ['Recommended', 'All Jobs', 'Saved', 'Applied']) {
      expect(screen.getByRole('tab', { name })).toBeOnTheScreen();
    }
    expect(screen.getByRole('tab', { name: 'All Jobs' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Saved' })).not.toBeSelected();
  });

  it('reports the pressed section', async () => {
    const onSelect = jest.fn();
    await render(<JobsSectionTabs selected="allJobs" onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole('tab', { name: 'Applied' }));

    expect(onSelect).toHaveBeenCalledWith('applied');
  });
});
