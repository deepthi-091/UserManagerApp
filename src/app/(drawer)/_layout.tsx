import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { useColorScheme, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerItemList } from '@react-navigation/drawer';

import { Colors } from '@/constants/theme';
import { createStyles } from '@/styles';

function CustomDrawerContent(props: any) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

  const handleNavigateUsers = () => {
    props.navigation.navigate('(tabs)', { screen: 'users' });
  };

  const handleNavigateProducts = () => {
    props.navigation.navigate('(tabs)', { screen: 'products' });
  };

  return (
    <View style={[styles.container, { paddingTop: 20 }]}>
      <Text style={[styles.header, { paddingHorizontal: 16, marginBottom: 20 }]}>
        📱 Manager App
      </Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={handleNavigateUsers}
          style={[
            styles.card,
            {
              marginHorizontal: 12,
              marginVertical: 8,
              padding: 16,
              borderLeftWidth: 0,
            },
          ]}>
          <Text style={[styles.mediumText, styles.boldText]}>👥 Users</Text>
          <Text style={[styles.smallText, { marginTop: 4 }]}>Manage users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNavigateProducts}
          style={[
            styles.card,
            {
              marginHorizontal: 12,
              marginVertical: 8,
              padding: 16,
              borderLeftWidth: 0,
            },
          ]}>
          <Text style={[styles.mediumText, styles.boldText]}>🛍️ Products</Text>
          <Text style={[styles.smallText, { marginTop: 4 }]}>Browse & shop</Text>
        </TouchableOpacity>

        <View
          style={{
            height: 1,
            backgroundColor: isDark ? '#1e293b' : '#e8ecf1',
            marginVertical: 16,
            marginHorizontal: 12,
          }}
        />

        <DrawerItemList {...props} />
      </ScrollView>
    </View>
  );
}

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
      } as any}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Dashboard',
          title: 'User Manager',
        }}
      />
    </Drawer>
  );
}
