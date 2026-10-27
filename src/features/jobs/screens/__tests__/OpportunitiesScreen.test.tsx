import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { requestForegroundPermissionsAsync } from 'expo-location';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { jobsService } from '../../services/jobsService';
import OpportunitiesScreen from '../OpportunitiesScreen';

jest.mock('../../services/jobsService', () => ({
  jobsService: { getMapCompanies: jest.fn(), getCompanyJobs: jest.fn() },
}));

const company = { id: 'c1', name: 'Axis Bank', coordinate: { latitude: 13.34, longitude: 74.9 }, openJobCount: 1 };
const job = { id: 'j1', title: 'Sales Executive', location: 'Hebri', employmentType: 'fullTime' as const, salaryLpa: null };

describe('OpportunitiesScreen', () => {
  it('shows loading, then a pin per company', async () => {
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);

    await renderWithProviders(<OpportunitiesScreen />);

    expect(screen.getByText('Loading jobs near you…')).toBeOnTheScreen();
    expect(await screen.findByRole('button', { name: 'Axis Bank, open jobs: 1' })).toBeOnTheScreen();
    expect(screen.queryByText('Loading jobs near you…')).not.toBeOnTheScreen();
  });

  it("opens the company's jobs when its pin is pressed, and closes them", async () => {
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);
    jest.mocked(jobsService.getCompanyJobs).mockResolvedValue([job]);
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.press(await screen.findByRole('button', { name: 'Axis Bank, open jobs: 1' }));

    expect(await screen.findByText('Sales Executive')).toBeOnTheScreen();
    expect(jobsService.getCompanyJobs).toHaveBeenCalledWith('c1');

    await fireEvent.press(screen.getAllByRole('button', { name: 'Close' })[0]);

    await waitFor(() => expect(screen.queryByText('Sales Executive')).not.toBeOnTheScreen());
  });

  it('shows an error with retry when the map data fails', async () => {
    jest.mocked(jobsService.getMapCompanies).mockRejectedValueOnce(new Error('offline')).mockResolvedValue([company]);
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.press(await screen.findByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('button', { name: 'Axis Bank, open jobs: 1' })).toBeOnTheScreen();
  });

  it('opens on All Jobs in map view, with the other sections still to come', async () => {
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);
    await renderWithProviders(<OpportunitiesScreen />);

    expect(screen.getByRole('tab', { name: 'All Jobs' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Map view' })).toBeSelected();

    await fireEvent.press(screen.getByRole('tab', { name: 'Saved' }));

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
    expect(screen.queryByTestId('jobs-map')).not.toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Map view' })).not.toBeOnTheScreen();
  });

  it('switches All Jobs between map and list view', async () => {
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'List view' }));

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
    expect(screen.queryByTestId('jobs-map')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Map view' }));

    expect(screen.getByTestId('jobs-map')).toBeOnTheScreen();
  });

  it('pins the place being typed on the map', async () => {
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Search location'), 'Bengaluru');

    expect(await screen.findByRole('button', { name: 'Bengaluru' }, { timeout: 2000 })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Bengaluru' })).not.toBeOnTheScreen());
  });

  it('explains when location permission blocks the search', async () => {
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);
    jest.mocked(requestForegroundPermissionsAsync).mockResolvedValueOnce({ granted: false } as never);
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Search location'), 'Bengaluru');

    expect(await screen.findByText('Allow location access to search places.', {}, { timeout: 2000 })).toBeOnTheScreen();
  });

  it('hides the search bar in list view', async () => {
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);
    await renderWithProviders(<OpportunitiesScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'List view' }));

    expect(screen.queryByPlaceholderText('Search location')).not.toBeOnTheScreen();
  });
});
