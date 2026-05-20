import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '@/context/app-context';
import { Colors } from '@/constants/theme';

export default function ProductsListScreen() {
  const navigation = useNavigation();
  const { products, cart } = useAppContext();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Products',
      });
    }, [navigation])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16, gap: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
              Products
            </Text>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('cart')}
              style={{
                backgroundColor: colors.tint,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>🛒</Text>
              {cartCount > 0 && (
                <View
                  style={{
                    backgroundColor: '#dc2626',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                    {cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              onPress={() => (navigation as any).navigate('[id]', { id: product.id })}
              style={{
                backgroundColor: colors.backgroundElement,
                borderRadius: 8,
                padding: 12,
                borderLeftWidth: 4,
                borderLeftColor: colors.tint,
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{product.image}</Text>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                    {product.name}
                  </Text>
                  <Text style={{ color: colors.tabIconDefault, fontSize: 13, marginTop: 4 }}>
                    {product.description}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <Text style={{ color: colors.tint, fontSize: 18, fontWeight: '700' }}>
                  ₹{product.price}
                </Text>
                <Text style={{ color: colors.tabIconDefault, fontSize: 12 }}>
                  Stock: {product.stock}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
