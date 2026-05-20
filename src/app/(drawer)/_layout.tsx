import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function DrawerLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        drawerContentStyle: {
          backgroundColor: colors.background,
        },
        drawerActiveTintColor: colors.tint,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          color: colors.text,
        },
      } as any}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'App',
          title: 'User Manager App',
        }}
      />
    </Drawer>
  );
}
