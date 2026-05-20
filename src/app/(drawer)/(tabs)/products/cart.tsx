import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
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
import { Colors } from '@/constants/theme';

export default function CartScreen() {
  const navigation = useNavigation();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useAppContext();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'phonepay' | 'paytm' | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = getCartTotal();

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      alert('Please enter delivery address');
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
      setAddress('');
      setPaymentMethod(null);
      navigation.goBack();
    }, 2000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
            🛒 Cart Empty
          </Text>
          <Text style={{ color: colors.tabIconDefault, fontSize: 14, textAlign: 'center' }}>
            Add products to your cart to get started
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginTop: 20,
              backgroundColor: colors.tint,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 6,
            }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>
          Shopping Cart
        </Text>

        {cart.map((item) => (
          <View
            key={item.product.id}
            style={{
              backgroundColor: colors.backgroundElement,
              borderRadius: 8,
              padding: 12,
              gap: 8,
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{item.product.image}</Text>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                  {item.product.name}
                </Text>
                <Text style={{ color: colors.tint, fontSize: 14, fontWeight: '700', marginTop: 4 }}>
                  ₹{item.product.price}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.product.id)}
                  style={{
                    backgroundColor: '#fee2e2',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}>
                  <Text style={{ color: '#dc2626', fontWeight: '600' }}>✕</Text>
                </TouchableOpacity>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                  Qty: {item.quantity}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                onPress={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  backgroundColor: colors.tint,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>−</Text>
              </TouchableOpacity>

              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  fontWeight: '600',
                  minWidth: 30,
                  textAlign: 'center',
                }}>
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  updateCartQuantity(item.product.id, item.quantity + 1)
                }
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  backgroundColor: colors.tint,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>+</Text>
              </TouchableOpacity>

              <Text style={{ marginLeft: 'auto', color: colors.text, fontWeight: '600' }}>
                ₹{item.product.price * item.quantity}
              </Text>
            </View>
          </View>
        ))}

        <View
          style={{
            backgroundColor: colors.backgroundElement,
            borderRadius: 8,
            padding: 16,
            gap: 8,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.tabIconDefault, fontSize: 14 }}>Subtotal</Text>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
              ₹{total}
            </Text>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.tabIconDefault,
              paddingTop: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Total</Text>
            <Text style={{ color: colors.tint, fontSize: 18, fontWeight: '700' }}>
              ₹{total}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.background,
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: colors.backgroundElement,
          gap: 8,
        }}>
        <TouchableOpacity
          onPress={() => setShowOrderModal(true)}
          style={{
            backgroundColor: colors.tint,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Place Order
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
      </View>

      <Modal transparent visible={showOrderModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 16,
                gap: 12,
                maxHeight: '80%',
              }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
                Confirm Order
              </Text>

              {orderPlaced ? (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                  <Text style={{ fontSize: 60, marginBottom: 16 }}>✅</Text>
                  <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
                    Order Placed Successfully!
                  </Text>
                </View>
              ) : (
                <>
                  <View>
                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                      Delivery Address
                    </Text>
                    <TextInput
                      placeholder="Enter delivery address"
                      value={address}
                      onChangeText={setAddress}
                      multiline
                      numberOfLines={3}
                      placeholderTextColor={colors.tabIconDefault}
                      style={{
                        backgroundColor: colors.backgroundElement,
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        color: colors.text,
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: colors.tabIconDefault,
                        textAlignVertical: 'top',
                      }}
                    />
                  </View>

                  <View>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 14,
                        fontWeight: '600',
                        marginBottom: 8,
                      }}>
                      Payment Method
                    </Text>
                    <View style={{ gap: 8 }}>
                      {(['cash', 'phonepay', 'paytm'] as const).map((method) => (
                        <TouchableOpacity
                          key={method}
                          onPress={() => setPaymentMethod(method)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.backgroundElement,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderRadius: 6,
                            borderWidth: 2,
                            borderColor:
                              paymentMethod === method
                                ? colors.tint
                                : colors.tabIconDefault,
                          }}>
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor:
                                paymentMethod === method
                                  ? colors.tint
                                  : colors.tabIconDefault,
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
                                  backgroundColor: colors.tint,
                                }}
                              />
                            )}
                          </View>
                          <Text style={{ color: colors.text, fontWeight: '500' }}>
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

                  <View
                    style={{
                      backgroundColor: colors.backgroundElement,
                      borderRadius: 8,
                      padding: 12,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>
                        Order Total
                      </Text>
                      <Text style={{ color: colors.tint, fontSize: 18, fontWeight: '700' }}>
                        ₹{total}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => setShowOrderModal(false)}
                      style={{
                        flex: 1,
                        backgroundColor: colors.backgroundElement,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}>
                      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handlePlaceOrder}
                      style={{
                        flex: 1,
                        backgroundColor: colors.tint,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}>
                      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                        Confirm Order
                      </Text>
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
