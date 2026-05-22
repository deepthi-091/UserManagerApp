import * as Location from 'expo-location';
import { LocationCoordinates, StructuredAddress, Country } from '@/types';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

const COUNTRIES_DATA: Country[] = [
  {
    code: 'IN',
    name: 'India',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
  },
  {
    code: 'US',
    name: 'United States',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    cities: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 'Sheffield', 'Bristol', 'Edinburgh', 'Liverpool', 'Newcastle'],
  },
  {
    code: 'AU',
    name: 'Australia',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Hobart', 'Canberra', 'Gold Coast', 'Newcastle', 'Wollongong'],
  },
  {
    code: 'CA',
    name: 'Canada',
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  },
];

export const locationService = {
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  },

  async getDeviceLocation(): Promise<LocationCoordinates | null> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const granted = await this.requestLocationPermission();
        if (!granted) return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Device location error:', error);
      return null;
    }
  },

  async geocodeAddress(address: string, country: string): Promise<LocationCoordinates | null> {
    try {
      const searchQuery = `${address}, ${country}`;
      const response = await fetch(
        `${NOMINATIM_API}/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'UserManagerApp/1.0',
          },
        }
      );

      if (!response.ok) {
        console.error('Geocoding API error:', response.status);
        return null;
      }

      const data = await response.json();
      if (data.length === 0) {
        console.warn('No results found for:', searchQuery);
        return null;
      }

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  },

  async reverseGeocodeCoordinates(lat: number, lon: number): Promise<string | null> {
    try {
      const response = await fetch(
        `${NOMINATIM_API}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'UserManagerApp/1.0',
          },
        }
      );

      if (!response.ok) {
        console.error('Reverse geocoding API error:', response.status);
        return null;
      }

      const data = await response.json();
      return data.address?.road || data.address?.village || data.address?.city || data.display_name || null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  },

  async searchAddress(query: string, country: string): Promise<Array<{ name: string; coordinates: LocationCoordinates }>> {
    try {
      const searchQuery = `${query}, ${country}`;
      const response = await fetch(
        `${NOMINATIM_API}/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`,
        {
          headers: {
            'User-Agent': 'UserManagerApp/1.0',
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.map((item: any) => ({
        name: item.display_name || item.name,
        coordinates: {
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        },
      }));
    } catch (error) {
      console.error('Address search error:', error);
      return [];
    }
  },

  getCountries(): Country[] {
    return COUNTRIES_DATA;
  },

  getCitiesForCountry(countryCode: string): string[] {
    const country = COUNTRIES_DATA.find((c) => c.code === countryCode);
    return country?.cities || [];
  },

  getCountryByCode(code: string): Country | undefined {
    return COUNTRIES_DATA.find((c) => c.code === code);
  },

  formatAddress(structuredAddress: StructuredAddress): string {
    const { street, city, country } = structuredAddress;
    return [street, city, country].filter(Boolean).join(', ');
  },

  formatAddressShort(structuredAddress: StructuredAddress): string {
    const { city, country } = structuredAddress;
    return `${city}, ${country}`;
  },
};
