import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useColorScheme, SafeAreaView } from 'react-native';
import { useNavigation } from 'expo-router';
import { createStyles } from '@/styles';
import { LocationSelector } from '@/components/LocationSelector';
import { MapSelector } from '@/components/MapSelector';
import { StructuredAddress } from '@/types';
import { useAddressContext } from '@/context/address-context';

type Step = 'country' | 'city' | 'map' | 'manual';

export default function AddressSelectScreen() {
  const navigation = useNavigation();
  const { setSelectedAddress: setContextAddress } = useAddressContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

  const [step, setStep] = useState<Step>('country');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [selectedCountryName, setSelectedCountryName] = useState<string>('India');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<StructuredAddress | null>(null);
  const [manualAddress, setManualAddress] = useState('');

  const handleCountrySelect = (code: string, name: string) => {
    setSelectedCountryCode(code);
    setSelectedCountryName(name);
    setStep('city');
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setStep('map');
  };

  const handleLocationSelect = (address: StructuredAddress) => {
    setSelectedAddress(address);
    setStep('manual');
  };

  const handleBack = () => {
    if (step === 'city') {
      setStep('country');
    } else if (step === 'map') {
      setStep('city');
    } else if (step === 'manual') {
      setStep('map');
    } else {
      navigation.goBack();
    }
  };

  const handleConfirmAddress = () => {
    if (!selectedAddress) return;

    const addressWithStreet: StructuredAddress = {
      ...selectedAddress,
      street: manualAddress || selectedAddress.street,
    };

    setContextAddress(addressWithStreet);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {step === 'country' && (
        <LocationSelector
          step="country"
          onCountrySelect={handleCountrySelect}
          onBack={() => navigation.goBack()}
          selectedCountryCode={selectedCountryCode}
        />
      )}

      {step === 'city' && (
        <LocationSelector
          step="city"
          selectedCountryCode={selectedCountryCode}
          onCountrySelect={handleCountrySelect}
          onCitySelect={handleCitySelect}
          onBack={handleBack}
          selectedCity={selectedCity}
        />
      )}

      {step === 'map' && (
        <MapSelector
          country={selectedCountryName}
          city={selectedCity}
          onLocationSelect={handleLocationSelect}
          onBack={handleBack}
        />
      )}

      {step === 'manual' && selectedAddress && (
        <ScrollView style={styles.scroll}>
          <View style={[styles.scrollContent, { gap: 16 }]}>
            <Text style={styles.subheader}>Confirm Your Address</Text>

            <View style={styles.card}>
              <Text style={[styles.label, styles.boldText]}>Address Details</Text>
              <View style={{ marginTop: 12, gap: 8 }}>
                <View>
                  <Text style={styles.smallText}>Country</Text>
                  <Text style={[styles.mediumText, styles.boldText]}>{selectedAddress.country}</Text>
                </View>
                <View>
                  <Text style={styles.smallText}>City</Text>
                  <Text style={[styles.mediumText, styles.boldText]}>{selectedAddress.city}</Text>
                </View>
                <View>
                  <Text style={styles.smallText}>Coordinates</Text>
                  <Text style={[styles.smallText, styles.secondaryText]}>
                    {selectedAddress.coordinates.latitude.toFixed(4)}, {selectedAddress.coordinates.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={[styles.label, styles.boldText]}>Street Address (Optional)</Text>
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.smallText, styles.secondaryText, { marginBottom: 4 }]}>
                  Auto-detected: {selectedAddress.street}
                </Text>
                <TouchableOpacity
                  onPress={() => setManualAddress(selectedAddress.street)}
                  style={[
                    styles.input,
                    {
                      minHeight: 60,
                      justifyContent: 'flex-start',
                      paddingVertical: 12,
                    },
                  ]}>
                  <Text style={[styles.mediumText, { flex: 1 }]}>
                    {manualAddress || 'Tap to edit street address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity onPress={handleBack} style={[styles.secondaryButton, { flex: 1 }]}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmAddress} style={[styles.button, { flex: 1 }]}>
                <Text style={styles.buttonText}>✓ Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
