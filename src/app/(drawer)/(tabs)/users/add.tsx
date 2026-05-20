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
import { Colors } from '@/constants/theme';

export default function AddUserScreen() {
  const navigation = useNavigation();
  const { addUser } = useAppContext();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
          Add New User
        </Text>

        {error ? (
          <View style={{ backgroundColor: '#fee2e2', padding: 12, borderRadius: 6 }}>
            <Text style={{ color: '#dc2626', fontSize: 14 }}>❌ {error}</Text>
          </View>
        ) : null}

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Name</Text>
          <TextInput
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
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
            }}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Email</Text>
          <TextInput
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
            }}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Phone</Text>
          <TextInput
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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
            }}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Address</Text>
          <TextInput
            placeholder="Enter address"
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

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flex: 1,
              backgroundColor: colors.backgroundElement,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddUser}
            style={{
              flex: 1,
              backgroundColor: colors.tint,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Add User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
