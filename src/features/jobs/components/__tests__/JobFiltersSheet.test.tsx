import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { AdvancedJobFilters, NO_ADVANCED_FILTERS } from '../../hooks/useJobListFilters';
import JobFiltersSheet from '../JobFiltersSheet';

const options = {
  cities: [
    { name: 'Bengaluru', jobCount: 62126 },
    { name: 'Pune', jobCount: 21390 },
  ],
  titles: [{ name: 'QA Engineer', jobCount: 5 }],
  skills: [{ slug: 'react', name: 'React', jobCount: 9 }],
  companies: [{ id: 'c1', name: 'Freshworks', isVerified: true, jobCount: 8 }],
};

const renderSheet = (
  value: AdvancedJobFilters = NO_ADVANCED_FILTERS,
  matchCount: number | undefined = 1234,
  focusSection?: 'location'
) => {
  const callbacks = { onChange: jest.fn(), onReset: jest.fn(), onApply: jest.fn(), onClose: jest.fn() };
  const result = render(
    <JobFiltersSheet
      visible
      focusSection={focusSection}
      value={value}
      options={options}
      isOptionsError={false}
      onRetryOptions={jest.fn()}
      matchCount={matchCount}
      {...callbacks}
    />
  );
  return { ...callbacks, result };
};

describe('JobFiltersSheet', () => {
  it('shows every section collapsed with its summary', async () => {
    await renderSheet().result;

    expect(screen.getByRole('button', { name: 'Location, Any' })).toBeOnTheScreen();
    expect(screen.getByText('India')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Skills, Any' })).toBeOnTheScreen();
    expect(screen.queryByRole('checkbox', { name: 'Bengaluru' })).toBeNull();
  });

  it('expands a section and toggles an option', async () => {
    const sheet = renderSheet();
    await sheet.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Location, Any' }));
    expect(screen.getByText('62,126')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Pune' }));

    expect(sheet.onChange).toHaveBeenCalledWith({ ...NO_ADVANCED_FILTERS, cities: ['Pune'] });
  });

  it('searches within a section', async () => {
    await renderSheet().result;

    await fireEvent.press(screen.getByRole('button', { name: 'Location, Any' }));
    await fireEvent.changeText(screen.getByLabelText('Search location'), 'pun');

    expect(screen.getByRole('checkbox', { name: 'Pune' })).toBeOnTheScreen();
    expect(screen.queryByRole('checkbox', { name: 'Bengaluru' })).toBeNull();
  });

  it('summarises chosen values and picks one experience at a time', async () => {
    const sheet = renderSheet({ ...NO_ADVANCED_FILTERS, cities: ['Pune', 'Bengaluru'], experienceYears: 3 });
    await sheet.result;

    expect(screen.getByRole('button', { name: 'Location, 2 selected' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Experience, 3 yrs' }));
    await fireEvent.press(screen.getByRole('checkbox', { name: '3 yrs' }));

    expect(sheet.onChange).toHaveBeenCalledWith(expect.objectContaining({ experienceYears: undefined }));
  });

  it('shows the match count, resets, applies and closes', async () => {
    const sheet = renderSheet();
    await sheet.result;

    await fireEvent.press(screen.getByText('Reset'));
    await fireEvent.press(screen.getByRole('button', { name: 'Show 1,234 jobs' }));
    await fireEvent.press(screen.getByLabelText('Close filters'));

    expect(sheet.onReset).toHaveBeenCalled();
    expect(sheet.onApply).toHaveBeenCalled();
    expect(sheet.onClose).toHaveBeenCalled();
  });

  it('shows only one filter when opened from its quick filter, and resets just that one', async () => {
    const sheet = renderSheet({ ...NO_ADVANCED_FILTERS, cities: ['Pune'], skillSlugs: ['react'] }, 10, 'location');
    await sheet.result;

    expect(screen.getByRole('header', { name: 'Location' })).toBeOnTheScreen();
    expect(screen.getByRole('checkbox', { name: 'Pune' })).toBeChecked();
    expect(screen.queryByRole('button', { name: 'Skills, React' })).toBeNull();
    await fireEvent.press(screen.getByText('Reset'));

    expect(sheet.onChange).toHaveBeenCalledWith({ ...NO_ADVANCED_FILTERS, skillSlugs: ['react'] });
    expect(sheet.onReset).not.toHaveBeenCalled();
  });
});
