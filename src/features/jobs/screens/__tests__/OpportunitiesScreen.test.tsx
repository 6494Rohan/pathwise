import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Alert, Share } from 'react-native';
import { requestForegroundPermissionsAsync } from 'expo-location';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { jobsService } from '../../services/jobsService';
import { jobListing, mapCompany } from '../../test-utils/jobsFixtures';
import OpportunitiesScreen from '../OpportunitiesScreen';

const { mockAnimateToRegion } = jest.requireMock('react-native-maps');

jest.mock('../../services/jobsService', () => ({
  jobsService: { getMapCompanies: jest.fn(), listJobs: jest.fn(), getFilterOptions: jest.fn() },
}));

const company = mapCompany({ companyId: 'c1', name: 'Axis Bank', city: 'Hebri', openJobCount: 1 });
const listing = jobListing();
const pageOf = (jobs = [listing], total = jobs.length) => ({ jobs, page: 1, pageSize: 20, total });

const openListView = async () => {
  await fireEvent.press(screen.getByRole('button', { name: 'List view' }));
  await screen.findByText('Frontend Developer');
};

beforeEach(() => {
  jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);
  jest.mocked(jobsService.listJobs).mockResolvedValue(pageOf());
});
afterEach(() => jest.clearAllMocks());

describe('OpportunitiesScreen', () => {
  it('shows loading, then a pin per company', async () => {

    await renderWithProviders(<OpportunitiesScreen />);

    expect(screen.getByText('Loading jobs near you…')).toBeOnTheScreen();
    expect(await screen.findByRole('button', { name: 'Axis Bank, open jobs: 1' })).toBeOnTheScreen();
    expect(screen.queryByText('Loading jobs near you…')).not.toBeOnTheScreen();
  });

  it("opens that company's jobs in that city when its pin is pressed, and closes them", async () => {
    jest.mocked(jobsService.listJobs).mockResolvedValue(pageOf([jobListing({ title: 'Sales Executive' })]));
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.press(await screen.findByRole('button', { name: 'Axis Bank, open jobs: 1' }));

    expect(await screen.findByText('Sales Executive')).toBeOnTheScreen();
    expect(screen.getByText('Hebri · Open jobs: 1')).toBeOnTheScreen();
    expect(jobsService.listJobs).toHaveBeenCalledWith(expect.objectContaining({ companyIds: ['c1'], city: 'Hebri' }), 1);

    await fireEvent.press(screen.getAllByRole('button', { name: 'Close' })[0]);

    await waitFor(() => expect(screen.queryByText('Sales Executive')).not.toBeOnTheScreen());
  });

  it('shows an error with retry when the map data fails', async () => {
    jest.mocked(jobsService.getMapCompanies).mockReset().mockRejectedValueOnce(new Error('offline')).mockResolvedValue([company]);
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.press(await screen.findByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('button', { name: 'Axis Bank, open jobs: 1' })).toBeOnTheScreen();
  });

  it('opens on All Jobs in map view, with the other sections still to come', async () => {
    await renderWithProviders(<OpportunitiesScreen />);

    expect(screen.getByRole('tab', { name: 'All Jobs' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Map view' })).toBeSelected();

    await fireEvent.press(screen.getByRole('tab', { name: 'Saved' }));

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
    expect(screen.queryByTestId('jobs-map')).not.toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Map view' })).not.toBeOnTheScreen();
  });

  it('switches All Jobs between the map and the real job list', async () => {
    await renderWithProviders(<OpportunitiesScreen />);

    await openListView();

    expect(screen.getByRole('header', { name: '1 Jobs' })).toBeOnTheScreen();
    expect(jobsService.listJobs).toHaveBeenCalledWith(expect.any(Object), 1);
    expect(screen.queryByTestId('jobs-map')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Map view' }));

    expect(screen.getByTestId('jobs-map')).toBeOnTheScreen();
  });

  it('searches jobs once typing pauses', async () => {
    await renderWithProviders(<OpportunitiesScreen />);
    await openListView();

    await fireEvent.changeText(screen.getByPlaceholderText('Search jobs, skills, companies, places'), 'react');

    await waitFor(() => expect(jobsService.listJobs).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'react' }), 1), {
      timeout: 2000,
    });
  });

  it('applies quick filters to the list and the map', async () => {
    await renderWithProviders(<OpportunitiesScreen />);
    await openListView();

    await fireEvent.press(screen.getByRole('button', { name: 'Verified' }));

    await waitFor(() =>
      expect(jobsService.listJobs).toHaveBeenLastCalledWith(expect.objectContaining({ verifiedOnly: true }), 1)
    );
    expect(jobsService.getMapCompanies).toHaveBeenLastCalledWith(expect.objectContaining({ verifiedOnly: true }));
    expect(screen.getByRole('button', { name: 'Filters, 1 on' })).toBeOnTheScreen();
  });

  it('shares a job with its title, company and link', async () => {
    const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction, activityType: undefined });
    await renderWithProviders(<OpportunitiesScreen />);
    await openListView();

    await fireEvent.press(screen.getByRole('button', { name: 'Share Frontend Developer' }));

    expect(share).toHaveBeenCalledWith({
      message: 'Frontend Developer at Robosoft Technologies on pathwise: https://main.example.amplifyapp.com/jobs',
    });
  });

  it('says saving jobs is coming soon', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    await renderWithProviders(<OpportunitiesScreen />);
    await openListView();

    await fireEvent.press(screen.getByRole('button', { name: 'Save Frontend Developer' }));

    expect(alert).toHaveBeenCalledWith('Coming soon');
  });

  it('pins the place being typed on the map', async () => {
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Search location'), 'Bengaluru');

    expect(await screen.findByRole('button', { name: 'Bengaluru' }, { timeout: 2000 })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Bengaluru' })).not.toBeOnTheScreen());
  });

  it('explains when location permission blocks the search', async () => {
    jest.mocked(requestForegroundPermissionsAsync).mockResolvedValueOnce({ granted: false } as never);
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Search location'), 'Bengaluru');

    expect(await screen.findByText('Allow location access to search places.', {}, { timeout: 2000 })).toBeOnTheScreen();
  });

  it('swaps the place search for the job search in list view', async () => {
    await renderWithProviders(<OpportunitiesScreen />);

    await openListView();

    expect(screen.queryByPlaceholderText('Search location')).not.toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Search jobs, skills, companies, places')).toBeOnTheScreen();
  });

  it('zooms the map and shows where the user is', async () => {
    await renderWithProviders(<OpportunitiesScreen />);
    mockAnimateToRegion.mockClear();

    await fireEvent.press(screen.getByRole('button', { name: 'Zoom in' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Zoom out' }));
    expect(mockAnimateToRegion).toHaveBeenCalledTimes(2);

    await fireEvent.press(screen.getByRole('button', { name: 'Show my location' }));

    await waitFor(() => expect(screen.getByTestId('jobs-map')).toHaveProp('showsUserLocation', true));
    expect(mockAnimateToRegion).toHaveBeenLastCalledWith(
      expect.objectContaining({ latitude: 13.34, longitude: 74.74 }),
      expect.any(Number)
    );
  });

  it('explains when location permission blocks showing where the user is', async () => {
    jest.mocked(requestForegroundPermissionsAsync).mockResolvedValueOnce({ granted: false } as never);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Show my location' }));

    await waitFor(() => expect(alert).toHaveBeenCalledWith('Allow location access to see where you are.'));
  });

  it('does not load the job list until list view is opened', async () => {

    await renderWithProviders(<OpportunitiesScreen />);

    expect(jobsService.listJobs).not.toHaveBeenCalled();
  });
});
