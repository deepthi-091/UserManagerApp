import { useLocalSearchParams } from 'expo-router';
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
import { createStyles } from '@/styles';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const { users, updateUser } = useAppContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

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
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.mediumText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll}>
        <View style={styles.scrollContent}>
          <View style={styles.rowBetween}>
            <Text style={styles.subheader}>{isEditing ? 'Edit User' : 'User Details'}</Text>
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
              <Text style={[styles.accentText, { fontSize: 14, fontWeight: '600' }]}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

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
              editable={isEditing}
              placeholderTextColor={isDark ? '#94a3b8' : '#9ca3af'}
              style={isEditing ? styles.input : styles.inputDisabled}
            />
          </View>

          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              keyboardType="email-address"
              placeholderTextColor={isDark ? '#94a3b8' : '#9ca3af'}
              style={isEditing ? styles.input : styles.inputDisabled}
            />
          </View>

          <View>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
              keyboardType="phone-pad"
              placeholderTextColor={isDark ? '#94a3b8' : '#9ca3af'}
              style={isEditing ? styles.input : styles.inputDisabled}
            />
          </View>

          <View>
            <Text style={styles.label}>Address</Text>
            <TextInput
              placeholder="Enter address"
              value={address}
              onChangeText={setAddress}
              editable={isEditing}
              multiline
              numberOfLines={3}
              placeholderTextColor={isDark ? '#94a3b8' : '#9ca3af'}
              style={[
                isEditing ? styles.input : styles.inputDisabled,
                { textAlignVertical: 'top' },
              ]}
            />
          </View>

          {isEditing && (
            <TouchableOpacity onPress={handleSaveChanges} style={[styles.button, { marginTop: 8 }]}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          )}

          <View style={{ marginTop: 16 }}>
            <Text style={styles.smallText}>Created: {user.createdAt.toLocaleDateString()}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
