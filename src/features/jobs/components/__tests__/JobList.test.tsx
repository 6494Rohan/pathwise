import React, { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { jobListing } from '../../test-utils/jobsFixtures';
import JobList from '../JobList';

const renderList = (props: Partial<ComponentProps<typeof JobList>> = {}) => {
  const callbacks = {
    onLoadMore: jest.fn(),
    onRefresh: jest.fn(),
    onRetry: jest.fn(),
    onShareJob: jest.fn(),
    onSaveJob: jest.fn(),
    onOpenSort: jest.fn(),
  };
  const result = render(
    <JobList
      jobs={[jobListing()]}
      total={41}
      isLoading={false}
      isError={false}
      isRefreshing={false}
      isLoadingMore={false}
      sort="newest"
      {...callbacks}
      {...props}
    />
  );
  return { ...callbacks, result };
};

describe('JobList', () => {
  it('shows the jobs, how many there are and the order', async () => {
    await renderList({ total: 340881 }).result;

    expect(screen.getByRole('header', { name: '340,881 Jobs' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Sort: Newest' })).toBeOnTheScreen();
    expect(screen.getByText('Frontend Developer')).toBeOnTheScreen();
  });

  it('passes share and save through to each job', async () => {
    const list = renderList();
    await list.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Share Frontend Developer' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Save Frontend Developer' }));

    expect(list.onShareJob).toHaveBeenCalled();
    expect(list.onSaveJob).toHaveBeenCalled();
  });

  it('asks for the next page at the end and refreshes on pull', async () => {
    const list = renderList();
    await list.result;

    await fireEvent(screen.getByTestId('job-list'), 'endReached');
    await fireEvent(screen.getByTestId('job-list'), 'refresh');

    expect(list.onLoadMore).toHaveBeenCalled();
    expect(list.onRefresh).toHaveBeenCalled();
  });

  it('says when nothing matches', async () => {
    await renderList({ jobs: [], total: 0 }).result;

    expect(screen.getByText('No jobs match right now.')).toBeOnTheScreen();
    expect(screen.queryByRole('header')).not.toBeOnTheScreen();
  });

  it('shows the error with retry when the first page fails', async () => {
    const list = renderList({ jobs: [], isError: true });
    await list.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(screen.getByText("Couldn't load jobs.")).toBeOnTheScreen();
    expect(list.onRetry).toHaveBeenCalled();
  });

  it('keeps showing loaded jobs if a later page fails', async () => {
    await renderList({ isError: true }).result;

    expect(screen.getByText('Frontend Developer')).toBeOnTheScreen();
  });

  it('opens the sort options from the header', async () => {
    const list = renderList({ sort: 'salary' });
    await list.result;

    await fireEvent.press(screen.getByRole('button', { name: 'Sort: Highest salary' }));

    expect(list.onOpenSort).toHaveBeenCalled();
  });

  it('shows placeholder cards while the first page loads', async () => {
    await renderList({ jobs: [], isLoading: true }).result;

    expect(screen.getByRole('progressbar', { name: 'Loading jobs' })).toBeOnTheScreen();
    expect(screen.queryByTestId('job-list')).not.toBeOnTheScreen();
  });

  it('shows a placeholder card at the end while the next page loads', async () => {
    await renderList({ isLoadingMore: true }).result;

    expect(screen.getByText('Frontend Developer')).toBeOnTheScreen();
    expect(screen.getByRole('progressbar', { name: 'Loading jobs' })).toBeOnTheScreen();
  });
});
