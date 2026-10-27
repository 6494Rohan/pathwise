import { renderHook } from '@testing-library/react-native';
import { mapCompany } from '../../test-utils/jobsFixtures';
import type { MapCompany } from '../../types/jobs.types';
import { useMapClusters } from '../useMapClusters';

const company = (id: string, latitude: number, longitude: number): MapCompany =>
  mapCompany({ id, companyId: id, name: `Company ${id}`, coordinate: { latitude, longitude }, openJobCount: 2 });

const companies = [company('a', 13.34, 74.74), company('b', 13.341, 74.741), company('far', 12.87, 74.84)];

describe('useMapClusters', () => {
  it('groups companies that are close together when zoomed out', async () => {
    const region = { latitude: 13.1, longitude: 74.8, latitudeDelta: 2, longitudeDelta: 2 };

    const { result } = await renderHook(() => useMapClusters(companies, region));

    const cluster = result.current.find((point) => point.kind === 'cluster');
    expect(cluster).toEqual(expect.objectContaining({ companyCount: 2 }));
    expect(result.current.filter((point) => point.kind === 'company').map((point) => point.key)).toEqual([
      'company-far',
    ]);
  });

  it('gives a cluster a region that zooms in on it', async () => {
    const region = { latitude: 13.1, longitude: 74.8, latitudeDelta: 2, longitudeDelta: 2 };

    const { result } = await renderHook(() => useMapClusters(companies, region));

    const cluster = result.current.find((point) => point.kind === 'cluster');
    expect(cluster?.kind === 'cluster' && cluster.expansionRegion.longitudeDelta).toBeLessThan(region.longitudeDelta);
  });

  it('shows each company separately when zoomed in', async () => {
    const region = { latitude: 13.3405, longitude: 74.7405, latitudeDelta: 0.002, longitudeDelta: 0.002 };

    const { result } = await renderHook(() => useMapClusters(companies, region));

    expect(result.current.map((point) => point.key).sort()).toEqual(['company-a', 'company-b']);
  });
});
