import React, { Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme';
import { useMapClusters } from '../hooks/useMapClusters';
import { isAtZoomLimit, MAX_ZOOM, MIN_ZOOM, useZoomHaptics, zoomHaptics, zoomOf } from '../hooks/useZoomHaptics';
import type { Coordinate, MapCompany } from '../types/jobs.types';
import ClusterPin from './ClusterPin';
import CompanyPin from './CompanyPin';
import PinMarker from './PinMarker';

const INITIAL_REGION: Region = { latitude: 13.34, longitude: 74.9, latitudeDelta: 2.2, longitudeDelta: 2.2 };
const ZOOM_ANIMATION_MS = 350;
const PLACE_DELTA = 0.3;

const regionAround = (coordinate: Coordinate): Region => ({
  ...coordinate,
  latitudeDelta: PLACE_DELTA,
  longitudeDelta: PLACE_DELTA,
});

export interface JobsMapHandle {
  zoomBy: (factor: number) => void;
  flyTo: (coordinate: Coordinate) => void;
}

interface JobsMapProps {
  companies: MapCompany[];
  onCompanyPress: (company: MapCompany) => void;
  searchedPlace: { name: string; coordinate: Coordinate } | null;
  showsUserLocation: boolean;
  ref?: Ref<JobsMapHandle>;
}

export default function JobsMap({ companies, onCompanyPress, searchedPlace, showsUserLocation, ref }: JobsMapProps) {
  const { t } = useTranslation('jobs');
  const mapRef = useRef<MapView>(null);
  const { colors, isDark } = useTheme();
  const colorScheme = isDark ? 'dark' : 'light';
  const [region, setRegion] = useState(INITIAL_REGION);
  const points = useMapClusters(companies, region);
  const [mapWidth, setMapWidth] = useState(0);
  const onRegionChange = useZoomHaptics(mapWidth);

  const animateTo = (target: Region) => mapRef.current?.animateToRegion(target, ZOOM_ANIMATION_MS);

  useImperativeHandle(ref, () => ({
    zoomBy: (factor) => {
      if (mapWidth && isAtZoomLimit(zoomOf(region, mapWidth), factor < 1 ? 'in' : 'out')) {
        zoomHaptics.bump();
        return;
      }
      zoomHaptics.tap();
      animateTo({ ...region, latitudeDelta: region.latitudeDelta * factor, longitudeDelta: region.longitudeDelta * factor });
    },
    flyTo: (coordinate) => animateTo(regionAround(coordinate)),
  }));

  useEffect(() => {
    if (searchedPlace) mapRef.current?.animateToRegion(regionAround(searchedPlace.coordinate), ZOOM_ANIMATION_MS);
  }, [searchedPlace]);

  return (
    // Android reads userInterfaceStyle only when the map is created, so a theme change remounts it at the current region.
    <MapView
      key={colorScheme}
      ref={mapRef}
      testID="jobs-map"
      style={StyleSheet.absoluteFill}
      onLayout={(event) => setMapWidth(event.nativeEvent.layout.width)}
      minZoomLevel={MIN_ZOOM}
      maxZoomLevel={MAX_ZOOM}
      userInterfaceStyle={colorScheme}
      initialRegion={region}
      onRegionChange={onRegionChange}
      onRegionChangeComplete={setRegion}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
      toolbarEnabled={false}
    >
      {points.map((point) =>
        point.kind === 'cluster' ? (
          <PinMarker
            key={point.key}
            coordinate={point.coordinate}
            accessibilityLabel={t('map.clusterPin', { count: point.companyCount })}
            onPress={() => animateTo(point.expansionRegion)}
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
