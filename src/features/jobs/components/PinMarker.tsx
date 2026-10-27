import React, { ReactNode, useState } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import type { Coordinate } from '../types/jobs.types';

interface PinMarkerProps {
  coordinate: Coordinate;
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
}

export default function PinMarker({ coordinate, accessibilityLabel, onPress, children }: PinMarkerProps) {
  // Android redraws a custom marker's bitmap every frame while tracking; stop once the pin has laid out.
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  return (
    <Marker
      coordinate={coordinate}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      tracksViewChanges={tracksViewChanges}
    >
      <View onLayout={() => setTracksViewChanges(false)}>{children}</View>
    </Marker>
  );
}
