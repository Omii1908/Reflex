import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'expo-maps';
import { Location } from '../types';

interface MapViewProps {
  location: Location | null | undefined;
  error: string | null;
}

const MapViewComponent: React.FC<MapViewProps> = ({ location, error }) => {
  const initialRegion = {
    latitude: location?.latitude ?? 28.6139,
    longitude: location?.longitude ?? 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS Location</Text>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          region={location ? { ...initialRegion, latitude: location.latitude, longitude: location.longitude } : initialRegion}
          provider="google"
          mapType='hybrid'
        >
          {location && <Marker coordinate={location} />}
        </MapView>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Lat: {initialRegion.latitude.toFixed(4)}</Text>
          <Text style={styles.infoText}>Lon: {initialRegion.longitude.toFixed(4)}</Text>
        </View>
        {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 16,
    height: 300,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoBox: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 4,
  },
  infoText: {
    color: '#FFF',
    fontSize: 12,
  },
  errorBox: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(250, 204, 21, 0.8)',
    padding: 8,
    borderRadius: 4,
  },
  errorText: {
    color: '#111827',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter-Medium'
  }
});

export default MapViewComponent;
