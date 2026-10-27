import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme';
import { useMapClusters } from '../hooks/useMapClusters';
import type { Coordinate, MapCompany } from '../types/jobs.types';
import ClusterPin from './ClusterPin';
import CompanyPin from './CompanyPin';
import PinMarker from './PinMarker';

const INITIAL_REGION: Region = { latitude: 13.34, longitude: 74.9, latitudeDelta: 2.2, longitudeDelta: 2.2 };
const ZOOM_ANIMATION_MS = 350;
const PLACE_DELTA = 0.3;

interface JobsMapProps {
  companies: MapCompany[];
  onCompanyPress: (company: MapCompany) => void;
  searchedPlace: { name: string; coordinate: Coordinate } | null;
}

export default function JobsMap({ companies, onCompanyPress, searchedPlace }: JobsMapProps) {
  const { t } = useTranslation('jobs');
  const mapRef = useRef<MapView>(null);
  const { colors, isDark } = useTheme();
  const colorScheme = isDark ? 'dark' : 'light';
  const [region, setRegion] = useState(INITIAL_REGION);
  const points = useMapClusters(companies, region);

  useEffect(() => {
    if (!searchedPlace) return;
    const placeRegion = { ...searchedPlace.coordinate, latitudeDelta: PLACE_DELTA, longitudeDelta: PLACE_DELTA };
    mapRef.current?.animateToRegion(placeRegion, ZOOM_ANIMATION_MS);
  }, [searchedPlace]);

  return (
    // Android reads userInterfaceStyle only when the map is created, so a theme change remounts it at the current region.
    <MapView
      key={colorScheme}
      ref={mapRef}
      testID="jobs-map"
      style={StyleSheet.absoluteFill}
      userInterfaceStyle={colorScheme}
      initialRegion={region}
      onRegionChangeComplete={setRegion}
      toolbarEnabled={false}
    >
      {points.map((point) =>
        point.kind === 'cluster' ? (
          <PinMarker
            key={point.key}
            coordinate={point.coordinate}
            accessibilityLabel={t('map.clusterPin', { count: point.companyCount })}
            onPress={() => mapRef.current?.animateToRegion(point.expansionRegion, ZOOM_ANIMATION_MS)}
          >
            <ClusterPin companyCount={point.companyCount} />
          </PinMarker>
        ) : (
          <PinMarker
            key={point.key}
            coordinate={point.coordinate}
            accessibilityLabel={t('map.companyPin', { name: point.company.name, count: point.company.openJobCount })}
            onPress={() => onCompanyPress(point.company)}
          >
            <CompanyPin openJobCount={point.company.openJobCount} />
          </PinMarker>
        )
      )}
      {searchedPlace ? (
        <Marker
          coordinate={searchedPlace.coordinate}
          title={searchedPlace.name}
          accessibilityLabel={searchedPlace.name}
          pinColor={colors.bgBrand}
        />
      ) : null}
    </MapView>
  );
}
