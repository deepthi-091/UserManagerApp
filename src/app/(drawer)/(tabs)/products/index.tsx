import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '@/context/app-context';
import { createStyles } from '@/styles';

export default function ProductsListScreen() {
  const navigation = useNavigation();
  const { products, cart } = useAppContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Products',
      });
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll}>
        <View style={styles.scrollContent}>
          <View style={styles.rowBetween}>
            <Text style={styles.header}>Products</Text>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('cart')}
              style={{
                backgroundColor: isDark ? '#818cf8' : '#6366f1',
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
              style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{product.image}</Text>
                  <Text style={[styles.mediumText, styles.boldText]}>{product.name}</Text>
                  <Text style={[styles.mediumText, styles.secondaryText, { marginTop: 4 }]}>
                    {product.description}
                  </Text>
                </View>
              </View>

              <View style={[styles.rowBetween, { marginTop: 8 }]}>
                <Text style={[styles.boldText, styles.accentText, { fontSize: 18 }]}>
                  ₹{product.price}
                </Text>
                <Text style={styles.smallText}>Stock: {product.stock}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
