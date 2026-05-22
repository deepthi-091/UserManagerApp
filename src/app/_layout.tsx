import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppProvider } from '@/context/app-context';
import { AddressProvider } from '@/context/address-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AppProvider>
      <AddressProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <Slot />
        </ThemeProvider>
      </AddressProvider>
    </AppProvider>
  );
}
