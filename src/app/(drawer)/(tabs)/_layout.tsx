import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarLabel: 'Users',
          tabBarIcon: ({ color }) => <TabBarIcon name="👥" color={color} />,
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => <TabBarIcon name="🛍️" color={color} />,
          headerShown: true,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: string;
  color: string;
}) {
  return <>{props.name}</>;
}
