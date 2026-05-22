import { useNavigation } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '@/context/app-context';
import { useAddressContext } from '@/context/address-context';
import { createStyles } from '@/styles';
import { locationService } from '@/services/locationService';

export default function CartScreen() {
  const navigation = useNavigation();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useAppContext();
  const { selectedAddress, clearSelectedAddress } = useAddressContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'phonepay' | 'paytm' | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const address = selectedAddress ? locationService.formatAddress(selectedAddress) : '';

  const total = getCartTotal();

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      alert('Please select a delivery address');
      return;
    }

    if (!paymentMethod) {
      alert('Please select payment method');
      return;
    }

    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setShowOrderModal(false);
      setOrderPlaced(false);
      clearSelectedAddress();
      setPaymentMethod(null);
      navigation.goBack();
    }, 2000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={[styles.subheader, { marginBottom: 8 }]}>🛒 Cart Empty</Text>
          <Text style={styles.mediumText}>Add products to your cart to get started</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, { marginTop: 20 }]}>
            <Text style={styles.buttonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <Text style={styles.header}>Shopping Cart</Text>

        {cart.map((item) => (
          <View key={item.product.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{item.product.image}</Text>
                <Text style={[styles.mediumText, styles.boldText]}>{item.product.name}</Text>
                <Text style={[styles.accentText, { fontSize: 14, fontWeight: '700', marginTop: 4 }]}>
                  ₹{item.product.price}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.product.id)}
                  style={{ backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                  <Text style={{ color: '#dc2626', fontWeight: '600' }}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.mediumText, styles.boldText]}>Qty: {item.quantity}</Text>
              </View>
            </View>

            <View style={[styles.row, { alignItems: 'center', marginTop: 8 }]}>
              <TouchableOpacity
                onPress={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  backgroundColor: isDark ? '#818cf8' : '#6366f1',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>−</Text>
              </TouchableOpacity>

              <Text style={[styles.mediumText, styles.boldText, { minWidth: 30, textAlign: 'center' }]}>
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  backgroundColor: isDark ? '#818cf8' : '#6366f1',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>+</Text>
              </TouchableOpacity>

              <Text style={[styles.mediumText, styles.boldText, { marginLeft: 'auto' }]}>
                ₹{item.product.price * item.quantity}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => (navigation as any).navigate('rating', { productId: item.product.id })}
              style={[styles.row, { alignItems: 'center', marginTop: 8 }]}>
              <Text style={[styles.smallText, styles.accentText]}>⭐ Rate this product</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.mediumText}>Subtotal</Text>
            <Text style={[styles.mediumText, styles.boldText]}>₹{total}</Text>
          </View>
          <View
            style={[
              styles.rowBetween,
              {
                borderTopWidth: 1,
                borderTopColor: isDark ? '#334155' : '#d4dce6',
                paddingTop: 8,
                marginTop: 8,
              },
            ]}>
            <Text style={[styles.mediumText, styles.boldText, { fontSize: 16 }]}>Total</Text>
            <Text style={[styles.accentText, { fontSize: 18, fontWeight: '700' }]}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDark ? '#0f172a' : '#f5f7fa',
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1e293b' : '#e8ecf1',
          gap: 8,
        }}>
        <TouchableOpacity onPress={() => setShowOrderModal(true)} style={styles.button}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={showOrderModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View
              style={{
                backgroundColor: isDark ? '#0f172a' : '#f5f7fa',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 16,
                gap: 12,
                maxHeight: '80%',
              }}>
              <Text style={styles.subheader}>Confirm Order</Text>

              {orderPlaced ? (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                  <Text style={{ fontSize: 60, marginBottom: 16 }}>✅</Text>
                  <Text style={[styles.subheader, { marginBottom: 0 }]}>Order Placed Successfully!</Text>
                </View>
              ) : (
                <>
                  <View>
                    <Text style={styles.label}>Delivery Address</Text>
                    <TouchableOpacity
                      onPress={() => (navigation as any).navigate('address-select')}
                      style={[
                        styles.input,
                        {
                          minHeight: 80,
                          justifyContent: 'center',
                          paddingVertical: 12,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.mediumText,
                          address ? styles.text : styles.secondaryText,
                        ]}>
                        {address || '📍 Select Delivery Address'}
                      </Text>
                    </TouchableOpacity>
                    {address && (
                      <TouchableOpacity
                        onPress={() => {
                          clearSelectedAddress();
                        }}
                        style={{
                          marginTop: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                        }}>
                        <Text style={[styles.smallText, styles.accentText]}>✕ Clear Address</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View>
                    <Text style={styles.label}>Payment Method</Text>
                    <View style={{ gap: 8 }}>
                      {(['cash', 'phonepay', 'paytm'] as const).map((method) => (
                        <TouchableOpacity
                          key={method}
                          onPress={() => setPaymentMethod(method)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: isDark ? '#1e293b' : '#e8ecf1',
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderRadius: 6,
                            borderWidth: 2,
                            borderColor: paymentMethod === method ? (isDark ? '#818cf8' : '#6366f1') : (isDark ? '#1e293b' : '#e8ecf1'),
                          }}>
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor: paymentMethod === method ? (isDark ? '#818cf8' : '#6366f1') : (isDark ? '#94a3b8' : '#9ca3af'),
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginRight: 8,
                            }}>
                            {paymentMethod === method && (
                              <View
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: isDark ? '#818cf8' : '#6366f1',
                                }}
                              />
                            )}
                          </View>
                          <Text style={[styles.mediumText, styles.boldText]}>
                            {method === 'cash'
                              ? '💵 Cash on Delivery'
                              : method === 'phonepay'
                                ? '📱 PhonePay'
                                : '📲 Paytm'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.card}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.mediumText, styles.boldText]}>Order Total</Text>
                      <Text style={[styles.accentText, { fontSize: 18, fontWeight: '700' }]}>₹{total}</Text>
                    </View>
                  </View>

                  <View style={[styles.row, { gap: 8 }]}>
                    <TouchableOpacity
                      onPress={() => setShowOrderModal(false)}
                      style={[styles.secondaryButton, { flex: 1 }]}>
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePlaceOrder} style={[styles.button, { flex: 1 }]}>
                      <Text style={styles.buttonText}>Confirm Order</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
