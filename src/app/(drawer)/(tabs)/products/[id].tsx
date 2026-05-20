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
import { createStyles } from '@/styles';

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { products, addToCart } = useAppContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

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
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.mediumText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll}>
        <View style={[styles.scrollContent, { gap: 16 }]}>
          <View style={[styles.card, { padding: 30, alignItems: 'center' }]}>
            <Text style={{ fontSize: 80 }}>{product.image}</Text>
          </View>

          <View>
            <Text style={[styles.subheader]}>{product.name}</Text>
          </View>

          <View>
            <Text style={[styles.mediumText, styles.secondaryText]}>{product.description}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.mediumText}>Price</Text>
              <Text style={[styles.accentText, { fontSize: 20, fontWeight: '700' }]}>
                ₹{product.price}
              </Text>
            </View>

            <View style={[styles.rowBetween, { marginTop: 8 }]}>
              <Text style={styles.mediumText}>Available Stock</Text>
              <Text style={[styles.mediumText, styles.boldText]}>{product.stock} units</Text>
            </View>
          </View>

          {showSuccess && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✅ Added to cart successfully!</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={[styles.mediumText, styles.boldText]}>Quantity</Text>
            <View style={[styles.row, { justifyContent: 'center', marginTop: 12 }]}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  backgroundColor: isDark ? '#818cf8' : '#6366f1',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>−</Text>
              </TouchableOpacity>

              <Text style={[styles.mediumText, styles.boldText, { minWidth: 40, textAlign: 'center' }]}>
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  backgroundColor: isDark ? '#818cf8' : '#6366f1',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleAddToCart} style={styles.button}>
            <Text style={styles.buttonText}>🛒 Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
