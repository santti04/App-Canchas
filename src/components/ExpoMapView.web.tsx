import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

export const PROVIDER_DEFAULT = 'default';

export const Marker = ({ title, description }: any) => (
  <View style={styles.markerMock}>
    <Text style={styles.markerText}>📍 {title}</Text>
  </View>
);

const ExpoMapView = ({ children, style, initialRegion }: any) => {
  return (
    <View style={[styles.mapMock, style]}>
      <Text style={styles.mapText}>Google Maps no disponible en navegador web.</Text>
      <Text style={styles.mapTextSub}>Utilice la app de Expo Go para ver el mapa interactivo.</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  mapMock: {
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 200,
  },
  mapText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapTextSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  markerMock: {
    marginTop: 10,
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
  },
  markerText: {
    color: colors.primary,
    fontSize: 10,
  }
});

export default ExpoMapView;
