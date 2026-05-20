import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
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

export default function UserDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { users, updateUser } = useAppContext();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const user = users.find((u) => u.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(user.address);
    }
  }, [user]);

  const handleSaveChanges = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (id && typeof id === 'string') {
      updateUser(id, { name, email, phone, address });
      setIsEditing(false);
      setError('');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
            {isEditing ? 'Edit User' : 'User Details'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                setName(user.name);
                setEmail(user.email);
                setPhone(user.phone);
                setAddress(user.address);
                setError('');
              }
              setIsEditing(!isEditing);
            }}>
            <Text style={{ color: colors.tint, fontSize: 14, fontWeight: '600' }}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

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
            editable={isEditing}
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
              opacity: isEditing ? 1 : 0.6,
            }}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Email</Text>
          <TextInput
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
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
              opacity: isEditing ? 1 : 0.6,
            }}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Phone</Text>
          <TextInput
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
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
              opacity: isEditing ? 1 : 0.6,
            }}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Address</Text>
          <TextInput
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            editable={isEditing}
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
              opacity: isEditing ? 1 : 0.6,
            }}
          />
        </View>

        {isEditing && (
          <TouchableOpacity
            onPress={handleSaveChanges}
            style={{
              backgroundColor: colors.tint,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 8,
            }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Save Changes
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: colors.tabIconDefault, fontSize: 12 }}>
            Created: {user.createdAt.toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
