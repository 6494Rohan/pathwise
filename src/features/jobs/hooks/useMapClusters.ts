import { useMemo } from 'react';
import type { Region } from 'react-native-maps';
import Supercluster from 'supercluster';
import type { Coordinate, MapCompany } from '../types/jobs.types';

export type MapPoint =
  | { kind: 'company'; key: string; coordinate: Coordinate; company: MapCompany }
  | { kind: 'cluster'; key: string; coordinate: Coordinate; companyCount: number; expansionRegion: Region };

type CompanyIndex = Supercluster<{ company: MapCompany }>;

const CLUSTER_RADIUS = 60;
const MAX_CLUSTER_ZOOM = 16;

const toZoom = (region: Region) => Math.max(0, Math.min(MAX_CLUSTER_ZOOM + 1, Math.round(Math.log2(360 / region.longitudeDelta))));

const toBoundingBox = ({ latitude, longitude, latitudeDelta, longitudeDelta }: Region): GeoJSON.BBox => [
  longitude - longitudeDelta / 2,
  latitude - latitudeDelta / 2,
  longitude + longitudeDelta / 2,
  latitude + latitudeDelta / 2,
];

const toMapPoint = (index: CompanyIndex, feature: ReturnType<CompanyIndex['getClusters']>[number]): MapPoint => {
  const [longitude, latitude] = feature.geometry.coordinates;
  const coordinate = { latitude, longitude };
  if ('cluster' in feature.properties && feature.properties.cluster) {
    const { cluster_id: clusterId, point_count: companyCount } = feature.properties;
    const delta = 360 / 2 ** index.getClusterExpansionZoom(clusterId);
    return {
      kind: 'cluster',
      key: `cluster-${clusterId}-${companyCount}`,
      coordinate,
      companyCount,
      expansionRegion: { ...coordinate, latitudeDelta: delta, longitudeDelta: delta },
    };
  }
  const { company } = feature.properties as { company: MapCompany };
  return { kind: 'company', key: `company-${company.id}`, coordinate, company };
};

export const useMapClusters = (companies: MapCompany[], region: Region): MapPoint[] => {
  const index = useMemo(() => {
    const companyIndex: CompanyIndex = new Supercluster({ radius: CLUSTER_RADIUS, maxZoom: MAX_CLUSTER_ZOOM });
    companyIndex.load(
      companies.map((company) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [company.coordinate.longitude, company.coordinate.latitude] },
        properties: { company },
      }))
    );
    return companyIndex;
  }, [companies]);

  return useMemo(
    () => index.getClusters(toBoundingBox(region), toZoom(region)).map((feature) => toMapPoint(index, feature)),
    [index, region]
  );
};
