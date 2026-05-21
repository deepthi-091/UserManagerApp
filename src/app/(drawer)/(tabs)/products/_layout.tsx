import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function ProductsStackLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Products',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Product Details',
        }}
      />
      <Stack.Screen
        name="cart"
        options={{
          title: 'Shopping Cart',
        }}
      />
      <Stack.Screen
        name="rating"
        options={{
          title: 'Rate Product',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
