import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '@/context/app-context';
import { useAddressContext } from '@/context/address-context';
import { createStyles } from '@/styles';
import { locationService } from '@/services/locationService';

export default function AddUserScreen() {
  const navigation = useNavigation();
  const { addUser } = useAppContext();
  const { selectedAddress, clearSelectedAddress } = useAddressContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const address = selectedAddress ? locationService.formatAddress(selectedAddress) : '';

  const handleAddUser = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    addUser({ name, email, phone, address });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll}>
        <View style={styles.scrollContent}>
          <Text style={styles.subheader}>Add New User</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          ) : null}

          <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={isDark ? '#94a3b8' : '#9ca3af'}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={isDark ? '#94a3b8' : '#9ca3af'}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={isDark ? '#94a3b8' : '#9ca3af'}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Address</Text>
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
                {address || '📍 Select Address'}
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

          <View style={[styles.row, { marginTop: 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.secondaryButton, { flex: 1 }]}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAddUser} style={[styles.button, { flex: 1 }]}>
              <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
