import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { locationService } from '@/services/locationService';
import { createStyles } from '@/styles';
import { LocationCoordinates, StructuredAddress } from '@/types';

interface MapSelectorProps {
  country: string;
  city: string;
  initialCoordinates?: LocationCoordinates;
  onLocationSelect: (address: StructuredAddress) => void;
  onBack: () => void;
}

export function MapSelector({ country, city, initialCoordinates, onLocationSelect, onBack }: MapSelectorProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

  const [pinCoordinates, setPinCoordinates] = useState<LocationCoordinates>(
    initialCoordinates || { latitude: 28.7041, longitude: 77.1025 } // Default: Delhi
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressLabel, setAddressLabel] = useState('Loading address...');
  const [mapRef, setMapRef] = useState<MapView | null>(null);

  useEffect(() => {
    reverseGeocodeLocation();
  }, [pinCoordinates]);

  const reverseGeocodeLocation = async () => {
    const address = await locationService.reverseGeocodeCoordinates(
      pinCoordinates.latitude,
      pinCoordinates.longitude
    );
    setAddressLabel(address || 'Selected Location');
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPinCoordinates({ latitude, longitude });
  };

  const handleSearchAddress = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Search', 'Please enter an address to search');
      return;
    }

    setIsLoading(true);
    const results = await locationService.searchAddress(searchQuery, country);
    setIsLoading(false);

    if (results.length === 0) {
      Alert.alert('Not Found', `No results found for "${searchQuery}"`);
      return;
    }

    const firstResult = results[0];
    setPinCoordinates(firstResult.coordinates);
    setSearchQuery('');

    if (mapRef) {
      mapRef.animateToRegion(
        {
          latitude: firstResult.coordinates.latitude,
          longitude: firstResult.coordinates.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const handleConfirmLocation = () => {
    const structuredAddress: StructuredAddress = {
      country,
      city,
      street: addressLabel,
      coordinates: pinCoordinates,
      label: `${city}, ${country}`,
    };
    onLocationSelect(structuredAddress);
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <MapView
        ref={setMapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: pinCoordinates.latitude,
          longitude: pinCoordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}>
        <Marker
          coordinate={pinCoordinates}
          draggable
          onDragEnd={(e) => setPinCoordinates(e.nativeEvent.coordinate)}
          title={city}
          description={addressLabel}
        />
      </MapView>

      <View
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 8,
          padding: 12,
          gap: 8,
        }}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Search Address</Text>
          <TouchableOpacity onPress={onBack}>
            <Text style={[styles.mediumText, styles.accentText]}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Search for a place..."
            placeholderTextColor={isDark ? '#64748b' : '#cbd5e1'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchAddress}
          />
          <TouchableOpacity
            onPress={handleSearchAddress}
            disabled={isLoading}
            style={[styles.button, { paddingHorizontal: 12, width: 'auto', marginLeft: 8 }]}>
            {isLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>🔍</Text>}
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 8,
          padding: 12,
          gap: 12,
        }}>
        <View style={[styles.card, { marginBottom: 0 }]}>
          <Text style={[styles.smallText, styles.secondaryText]}>Selected Location</Text>
          <Text style={[styles.mediumText, styles.boldText, { marginTop: 4 }]}>{addressLabel}</Text>
          <Text style={[styles.smallText, styles.secondaryText, { marginTop: 4 }]}>
            {pinCoordinates.latitude.toFixed(4)}, {pinCoordinates.longitude.toFixed(4)}
          </Text>
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={onBack} style={[styles.secondaryButton, { flex: 1 }]}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirmLocation} style={[styles.button, { flex: 1 }]}>
            <Text style={styles.buttonText}>✓ Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
