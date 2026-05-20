import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '@/context/app-context';
import { Colors } from '@/constants/theme';

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { products, addToCart } = useAppContext();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View
          style={{
            backgroundColor: colors.backgroundElement,
            padding: 30,
            borderRadius: 12,
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 80 }}>{product.image}</Text>
        </View>

        <View>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>
            {product.name}
          </Text>
        </View>

        <View>
          <Text style={{ color: colors.tabIconDefault, fontSize: 14, lineHeight: 20 }}>
            {product.description}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.backgroundElement,
            padding: 12,
            borderRadius: 8,
            gap: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ color: colors.tabIconDefault, fontSize: 14 }}>Price</Text>
            <Text style={{ color: colors.tint, fontSize: 20, fontWeight: '700' }}>
              ₹{product.price}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ color: colors.tabIconDefault, fontSize: 14 }}>Available Stock</Text>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
              {product.stock} units
            </Text>
          </View>
        </View>

        {showSuccess && (
          <View style={{ backgroundColor: '#dcfce7', padding: 12, borderRadius: 6 }}>
            <Text style={{ color: '#166534', fontSize: 14, fontWeight: '600' }}>
              ✅ Added to cart successfully!
            </Text>
          </View>
        )}

        <View
          style={{
            backgroundColor: colors.backgroundElement,
            padding: 12,
            borderRadius: 8,
            gap: 12,
          }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
            Quantity
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                backgroundColor: colors.tint,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>−</Text>
            </TouchableOpacity>

            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '600',
                minWidth: 40,
                textAlign: 'center',
              }}>
              {quantity}
            </Text>

            <TouchableOpacity
              onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                backgroundColor: colors.tint,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          style={{
            backgroundColor: colors.tint,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            🛒 Add to Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: colors.backgroundElement,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
          }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
