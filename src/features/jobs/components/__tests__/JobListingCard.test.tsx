import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { jobListing } from '../../test-utils/jobsFixtures';
import JobListingCard from '../JobListingCard';

const HOUR = 60 * 60 * 1000;

const renderCard = (overrides: Parameters<typeof jobListing>[0] = {}) => {
  const callbacks = { onShare: jest.fn(), onSave: jest.fn() };
  const job = jobListing(overrides);
  const result = render(<JobListingCard job={job} {...callbacks} />);
  return { ...callbacks, job, result };
};

describe('JobListingCard', () => {
  beforeEach(() => jest.useFakeTimers({ now: new Date('2026-10-27T12:00:00Z') }));
  afterEach(() => jest.useRealTimers());

  it('shows the title, verified badge, company, city and how long ago it was posted', async () => {
    await renderCard({ postedAt: new Date(Date.now() - 3 * HOUR) }).result;

    expect(screen.getByText('Frontend Developer')).toBeOnTheScreen();
    expect(screen.getByLabelText('Verified company')).toBeOnTheScreen();
    expect(screen.getByText('Robosoft Technologies')).toBeOnTheScreen();
    expect(screen.getByText('Udupi')).toBeOnTheScreen();
    expect(screen.getByLabelText('Posted 3h ago')).toBeOnTheScreen();
  });

  it('shares and saves the job', async () => {
    const card = renderCard();
    await card.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Share Frontend Developer' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Save Frontend Developer' }));

    expect(card.onShare).toHaveBeenCalledWith(card.job);
    expect(card.onSave).toHaveBeenCalledWith(card.job);
  });

  it('shows distance instead of the city when known, and no badge for unverified companies', async () => {
    await renderCard({
      company: { id: 'c2', name: 'Coastal Logistics', logoUrl: null, isVerified: false },
      distanceKm: 4.5,
      postedAt: new Date(Date.now() - 2 * 24 * HOUR),
    }).result;

    expect(screen.getByText('4.5 km away')).toBeOnTheScreen();
    expect(screen.getByText('2d ago')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Verified company')).not.toBeOnTheScreen();
  });

  it('says just now for brand-new jobs', async () => {
    await renderCard({ postedAt: new Date() }).result;

    expect(screen.getByText('Just now')).toBeOnTheScreen();
  });
});
