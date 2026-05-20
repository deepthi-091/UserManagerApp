import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '@/context/app-context';
import { Colors } from '@/constants/theme';

export default function UsersListScreen() {
  const navigation = useNavigation();
  const { users, deleteUser } = useAppContext();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Users',
      });
    }, [navigation])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16, gap: 12 }}>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('add')}
            style={{
              backgroundColor: colors.tint,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              ➕ Add User
            </Text>
          </TouchableOpacity>

          {users.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: colors.text, fontSize: 16 }}>
                No users found. Add a new user to get started!
              </Text>
            </View>
          ) : (
            users.map((user) => (
              <View
                key={user.id}
                style={{
                  backgroundColor: colors.backgroundElement,
                  borderRadius: 8,
                  padding: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.tint,
                }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                  {user.name}
                </Text>
                <Text style={{ color: colors.tabIconDefault, fontSize: 14, marginTop: 4 }}>
                  📧 {user.email}
                </Text>
                <Text style={{ color: colors.tabIconDefault, fontSize: 14, marginTop: 2 }}>
                  📱 {user.phone}
                </Text>
                <Text style={{ color: colors.tabIconDefault, fontSize: 14, marginTop: 2 }}>
                  📍 {user.address}
                </Text>

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  <TouchableOpacity
                    onPress={() => (navigation as any).navigate('[id]', { id: user.id })}
                    style={{
                      flex: 1,
                      backgroundColor: colors.tint,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>
                      View/Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => deleteUser(user.id)}
                    style={{
                      backgroundColor: '#dc2626',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
