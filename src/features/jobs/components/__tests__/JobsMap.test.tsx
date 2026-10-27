import React, { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { mapCompany } from '../../test-utils/jobsFixtures';
import type { MapCompany } from '../../types/jobs.types';
import { MAX_ZOOM } from '../../hooks/useZoomHaptics';
import JobsMap, { JobsMapHandle } from '../JobsMap';

const { mockAnimateToRegion } = jest.requireMock('react-native-maps');

const mockColorScheme = jest.fn(() => 'light');
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => mockColorScheme(),
}));

const company = (id: string, name: string, latitude: number, longitude: number, openJobCount: number): MapCompany =>
  mapCompany({ id, companyId: id, name, coordinate: { latitude, longitude }, openJobCount });

const companies = [
  company('c1', 'Axis Bank', 13.9299, 75.5681, 3),
  company('c2', 'Infosys', 13.34, 74.74, 5),
  company('c3', 'Robosoft', 13.341, 74.741, 2),
];

describe('JobsMap', () => {
  it('shows a pin per company and groups nearby companies', async () => {
    await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} showsUserLocation={false} />);

    expect(screen.getByRole('button', { name: 'Axis Bank, open jobs: 3' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: '2 companies here. Tap to zoom in.' })).toBeOnTheScreen();
  });

  it('reports the company when its pin is pressed', async () => {
    const onCompanyPress = jest.fn();
    await render(<JobsMap companies={companies} onCompanyPress={onCompanyPress} searchedPlace={null} showsUserLocation={false} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Axis Bank, open jobs: 3' }));

    expect(onCompanyPress).toHaveBeenCalledWith(companies[0]);
  });

  it('zooms in when a group is pressed', async () => {
    await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} showsUserLocation={false} />);

    await fireEvent.press(screen.getByRole('button', { name: '2 companies here. Tap to zoom in.' }));

    expect(mockAnimateToRegion).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: expect.any(Number), longitudeDelta: expect.any(Number) }),
      expect.any(Number)
    );
  });

  it('splits a group once the map is zoomed in', async () => {
    await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} showsUserLocation={false} />);

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
    const view = await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} showsUserLocation={false} />);
    expect(screen.getByTestId('jobs-map')).toHaveProp('userInterfaceStyle', 'light');
    await fireEvent(screen.getByTestId('jobs-map'), 'regionChangeComplete', zoomedIn);

    mockColorScheme.mockReturnValue('dark');
    await view.rerender(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} showsUserLocation={false} />);

    expect(screen.getByTestId('jobs-map')).toHaveProp('userInterfaceStyle', 'dark');
    expect(screen.getByTestId('jobs-map')).toHaveProp('initialRegion', zoomedIn);
    mockColorScheme.mockReturnValue('light');
  });

  it('flies to a searched place and pins it', async () => {
    mockAnimateToRegion.mockClear();
    const bengaluru = { name: 'Bengaluru', coordinate: { latitude: 12.97, longitude: 77.59 } };

    await render(<JobsMap companies={companies} onCompanyPress={jest.fn()} searchedPlace={bengaluru} showsUserLocation={false} />);

    expect(screen.getByRole('button', { name: 'Bengaluru' })).toBeOnTheScreen();
    expect(mockAnimateToRegion).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: 12.97, longitude: 77.59 }),
      expect.any(Number)
    );
  });

  it('zooms around the current centre and flies to a coordinate when asked', async () => {
    mockAnimateToRegion.mockClear();
    const ref = createRef<JobsMapHandle>();
    await render(<JobsMap ref={ref} companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} showsUserLocation />);

    await act(async () => ref.current?.zoomBy(0.5));
    expect(mockAnimateToRegion).toHaveBeenLastCalledWith(
      expect.objectContaining({ latitude: 13.34, longitude: 74.9, latitudeDelta: 1.1, longitudeDelta: 1.1 }),
      expect.any(Number)
    );

    await act(async () => ref.current?.flyTo({ latitude: 12.97, longitude: 77.59 }));
    expect(mockAnimateToRegion).toHaveBeenLastCalledWith(
      expect.objectContaining({ latitude: 12.97, longitude: 77.59 }),
      expect.any(Number)
    );
    expect(screen.getByTestId('jobs-map')).toHaveProp('showsUserLocation', true);
  });

  it('confirms a button zoom with a tap, and bumps instead of zooming at the limit', async () => {
    const ref = createRef<JobsMapHandle>();
    await render(<JobsMap ref={ref} companies={companies} onCompanyPress={jest.fn()} searchedPlace={null} showsUserLocation={false} />);
    await fireEvent(screen.getByTestId('jobs-map'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } } });
    jest.mocked(impactAsync).mockClear();
    mockAnimateToRegion.mockClear();

    await act(async () => ref.current?.zoomBy(0.5));
    expect(impactAsync).toHaveBeenLastCalledWith(ImpactFeedbackStyle.Medium);
    expect(mockAnimateToRegion).toHaveBeenCalledTimes(1);

    const longitudeDelta = (360 * 400) / (256 * 2 ** MAX_ZOOM);
    await fireEvent(screen.getByTestId('jobs-map'), 'regionChangeComplete', {
      latitude: 13,
      longitude: 75,
      latitudeDelta: longitudeDelta,
      longitudeDelta,
    });
    await act(async () => ref.current?.zoomBy(0.5));

    expect(impactAsync).toHaveBeenLastCalledWith(ImpactFeedbackStyle.Heavy);
    expect(mockAnimateToRegion).toHaveBeenCalledTimes(1);
  });
});
