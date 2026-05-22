import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  FlatList,
} from 'react-native';
import { locationService } from '@/services/locationService';
import { createStyles } from '@/styles';
import { Country } from '@/types';

interface LocationSelectorProps {
  step: 'country' | 'city';
  onCountrySelect: (countryCode: string, countryName: string) => void;
  onCitySelect?: (city: string) => void;
  onBack: () => void;
  selectedCountryCode?: string;
  selectedCity?: string;
}

export function LocationSelector({
  step,
  onCountrySelect,
  onCitySelect,
  onBack,
  selectedCountryCode,
  selectedCity,
}: LocationSelectorProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);
  const [searchQuery, setSearchQuery] = useState('');

  const countries = useMemo(() => locationService.getCountries(), []);
  const cities = useMemo(
    () => (selectedCountryCode ? locationService.getCitiesForCountry(selectedCountryCode) : []),
    [selectedCountryCode]
  );

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    return countries.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, countries]);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    return cities.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, cities]);

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      onPress={() => onCountrySelect(item.code, item.name)}
      style={[
        styles.card,
        selectedCountryCode === item.code && {
          borderLeftColor: isDark ? '#818cf8' : '#6366f1',
          borderLeftWidth: 6,
        },
      ]}>
      <Text style={[styles.mediumText, styles.boldText]}>🌍 {item.name}</Text>
      <Text style={[styles.smallText, styles.secondaryText]}>{item.cities.length} cities available</Text>
    </TouchableOpacity>
  );

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => onCitySelect?.(item)}
      style={[
        styles.card,
        selectedCity === item && {
          borderLeftColor: isDark ? '#818cf8' : '#6366f1',
          borderLeftWidth: 6,
        },
      ]}>
      <Text style={[styles.mediumText, styles.boldText]}>🏙️ {item}</Text>
    </TouchableOpacity>
  );

  const dataToRender = step === 'country' ? filteredCountries : filteredCities;

  return (
    <View style={[styles.container, { padding: 16, gap: 12 }]}>
      <View style={styles.rowBetween}>
        <Text style={styles.subheader}>{step === 'country' ? 'Select Country' : 'Select City'}</Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.mediumText, styles.accentText]}>✕</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, { marginVertical: 8 }]}
        placeholder={`Search ${step}...`}
        placeholderTextColor={isDark ? '#64748b' : '#cbd5e1'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {step === 'country' ? (
        <FlatList
          data={filteredCountries}
          renderItem={renderCountryItem}
          keyExtractor={(item) => item.code}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 8 }}
        />
      ) : (
        <FlatList
          data={filteredCities}
          renderItem={renderCityItem}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 8 }}
        />
      )}

      {dataToRender.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Text style={[styles.mediumText, styles.secondaryText]}>
            No {step} found matching "{searchQuery}"
          </Text>
        </View>
      )}
    </View>
  );
}
