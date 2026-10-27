import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { MapCompany } from '../../types/jobs.types';
import JobsMap from '../JobsMap';

const { mockAnimateToRegion } = jest.requireMock('react-native-maps');

const mockColorScheme = jest.fn(() => 'light');
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => mockColorScheme(),
}));

const company = (id: string, name: string, latitude: number, longitude: number, openJobCount: number): MapCompany => ({
  id,
  name,
  coordinate: { latitude, longitude },
  openJobCount,
});

const companies = [
  company('c1', 'Axis Bank', 13.9299, 75.5681, 3),
  company('c2', 'Infosys', 13.34, 74.74, 5),
  company('c3', 'Robosoft', 13.341, 74.741, 2),
];

describe('JobsMap', () => {
  it('shows a pin per company and groups nearby companies', async () => {
    await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} />);

    expect(screen.getByRole('button', { name: 'Axis Bank, open jobs: 3' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: '2 companies here. Tap to zoom in.' })).toBeOnTheScreen();
  });

  it('reports the company when its pin is pressed', async () => {
    const onCompanyPress = jest.fn();
    await render(<JobsMap companies={companies} onCompanyPress={onCompanyPress} searchedPlace={null} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Axis Bank, open jobs: 3' }));

    expect(onCompanyPress).toHaveBeenCalledWith(companies[0]);
  });

  it('zooms in when a group is pressed', async () => {
    await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} />);

    await fireEvent.press(screen.getByRole('button', { name: '2 companies here. Tap to zoom in.' }));

    expect(mockAnimateToRegion).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: expect.any(Number), longitudeDelta: expect.any(Number) }),
      expect.any(Number)
    );
  });

  it('splits a group once the map is zoomed in', async () => {
    await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} />);

    await fireEvent(screen.getByTestId('jobs-map'), 'regionChangeComplete', {
      latitude: 13.3405,
      longitude: 74.7405,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    });

    expect(screen.getByRole('button', { name: 'Infosys, open jobs: 5' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Robosoft, open jobs: 2' })).toBeOnTheScreen();
  });

  it('recreates the map in the new colour scheme, where the user left it', async () => {
    const zoomedIn = { latitude: 13.3405, longitude: 74.7405, latitudeDelta: 0.002, longitudeDelta: 0.002 };
    const view = await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} />);
    expect(screen.getByTestId('jobs-map')).toHaveProp('userInterfaceStyle', 'light');
    await fireEvent(screen.getByTestId('jobs-map'), 'regionChangeComplete', zoomedIn);

    mockColorScheme.mockReturnValue('dark');
    await view.rerender(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} />);

    expect(screen.getByTestId('jobs-map')).toHaveProp('userInterfaceStyle', 'dark');
    expect(screen.getByTestId('jobs-map')).toHaveProp('initialRegion', zoomedIn);
    mockColorScheme.mockReturnValue('light');
  });

  it('flies to a searched place and pins it', async () => {
    mockAnimateToRegion.mockClear();
    const bengaluru = { name: 'Bengaluru', coordinate: { latitude: 12.97, longitude: 77.59 } };

    await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={bengaluru} />);

    expect(screen.getByRole('button', { name: 'Bengaluru' })).toBeOnTheScreen();
    expect(mockAnimateToRegion).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: 12.97, longitude: 77.59 }),
      expect.any(Number)
    );
  });
});
