import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import JobFiltersSheet from '../JobFiltersSheet';

const options = {
  skills: [
    { slug: 'react', name: 'React', jobCount: 9 },
    { slug: 'sql', name: 'SQL', jobCount: 4 },
  ],
  companies: [{ id: 'c1', name: 'Freshworks', isVerified: true, jobCount: 8 }],
};

const renderSheet = (initial = { skillSlugs: [] as string[], companyIds: [] as string[] }) => {
  const callbacks = { onApply: jest.fn(), onClose: jest.fn() };
  const result = render(<JobFiltersSheet visible initial={initial} options={options} {...callbacks} />);
  return { ...callbacks, result };
};

describe('JobFiltersSheet', () => {
  it('applies the chosen experience, skills and companies', async () => {
    const sheet = renderSheet();
    await sheet.result;

    await fireEvent.press(screen.getByRole('button', { name: '3 yrs' }));
    await fireEvent.press(screen.getByRole('button', { name: 'React' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Freshworks' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Show jobs' }));

    expect(sheet.onApply).toHaveBeenCalledWith({ experienceYears: 3, skillSlugs: ['react'], companyIds: ['c1'] });
  });

  it('starts from the current filters, and pressing a chosen one again removes it', async () => {
    const sheet = renderSheet({ skillSlugs: ['react', 'sql'], companyIds: [] });
    await sheet.result;

    expect(screen.getByRole('button', { name: 'React' })).toBeSelected();
    await fireEvent.press(screen.getByRole('button', { name: 'React' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Fresher' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Fresher' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Show jobs' }));

    expect(sheet.onApply).toHaveBeenCalledWith({ skillSlugs: ['sql'], companyIds: [], experienceYears: undefined });
  });

  it('clears everything and closes', async () => {
    const sheet = renderSheet({ skillSlugs: ['react'], companyIds: ['c1'] });
    await sheet.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Clear all' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Show jobs' }));
    await fireEvent.press(screen.getAllByRole('button', { name: 'Close filters' })[0]);

    expect(sheet.onApply).toHaveBeenCalledWith({ experienceYears: undefined, skillSlugs: [], companyIds: [] });
    expect(sheet.onClose).toHaveBeenCalled();
  });
});
