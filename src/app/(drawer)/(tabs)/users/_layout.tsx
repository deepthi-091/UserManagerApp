import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function UsersStackLayout() {
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
          title: 'Users',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: 'Add User',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'User Details',
        }}
      />
    </Stack>
  );
}
