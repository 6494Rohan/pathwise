import React, { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { jobListing, mapCompany } from '../../test-utils/jobsFixtures';
import CompanyJobsSheet from '../CompanyJobsSheet';

const company = mapCompany({ name: 'Axis Bank', city: 'Hebri', openJobCount: 1 });
const job = jobListing({ title: 'Sales Executive', city: 'Hebri' });

const renderSheet = (props: Partial<ComponentProps<typeof CompanyJobsSheet>> = {}) => {
  const callbacks = { onRetry: jest.fn(), onClose: jest.fn(), onLoadMore: jest.fn(), onShareJob: jest.fn(), onSaveJob: jest.fn() };
  const result = render(
    <CompanyJobsSheet
      company={company}
      jobs={[job]}
      isLoading={false}
      isError={false}
      isLoadingMore={false}
      {...callbacks}
      {...props}
    />
  );
  return { ...callbacks, result };
};

describe('CompanyJobsSheet', () => {
  it('lists the jobs of the chosen company', async () => {
    await renderSheet().result;

    expect(screen.getByRole('header', { name: 'Axis Bank' })).toBeOnTheScreen();
    expect(screen.getByText('Hebri · Open jobs: 1')).toBeOnTheScreen();
    expect(screen.getByText('Sales Executive')).toBeOnTheScreen();
  });

  it('is hidden when no company is chosen', async () => {
    await renderSheet({ company: null }).result;

    expect(screen.queryByText('Sales Executive')).not.toBeOnTheScreen();
  });

  it('shows placeholder cards instead of jobs while loading', async () => {
    await renderSheet({ isLoading: true, jobs: undefined }).result;

    expect(screen.queryByText('Sales Executive')).not.toBeOnTheScreen();
    expect(screen.getByRole('progressbar', { name: 'Loading jobs' })).toBeOnTheScreen();
  });

  it('says when the company has no open jobs', async () => {
    await renderSheet({ jobs: [] }).result;

    expect(screen.getByText('No open jobs right now.')).toBeOnTheScreen();
  });

  it('shows the error and retries', async () => {
    const sheet = renderSheet({ isError: true, jobs: undefined });
    await sheet.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(screen.getByText("Couldn't load this company's jobs.")).toBeOnTheScreen();
    expect(sheet.onRetry).toHaveBeenCalled();
  });

  it('closes from the close button', async () => {
    const sheet = renderSheet();
    await sheet.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));

    expect(sheet.onClose).toHaveBeenCalled();
  });

  it('asks for more jobs when scrolled to the end', async () => {
    const sheet = renderSheet();
    await sheet.result;

    await fireEvent(screen.getByTestId('company-jobs-list'), 'endReached');

    expect(sheet.onLoadMore).toHaveBeenCalled();
  });
});
