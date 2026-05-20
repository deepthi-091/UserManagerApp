import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '@/context/app-context';
import { createStyles } from '@/styles';

export default function UsersListScreen() {
  const navigation = useNavigation();
  const { users, deleteUser } = useAppContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Users',
      });
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll}>
        <View style={styles.scrollContent}>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('add')}
            style={styles.button}>
            <Text style={styles.buttonText}>➕ Add User</Text>
          </TouchableOpacity>

          {users.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={styles.mediumText}>No users found. Add a new user to get started!</Text>
            </View>
          ) : (
            users.map((user) => (
              <View key={user.id} style={styles.card}>
                <Text style={[styles.mediumText, styles.boldText]}>{user.name}</Text>
                <Text style={[styles.smallText, { marginTop: 4 }]}>📧 {user.email}</Text>
                <Text style={[styles.smallText, { marginTop: 2 }]}>📱 {user.phone}</Text>
                <Text style={[styles.smallText, { marginTop: 2 }]}>📍 {user.address}</Text>

                <View style={[styles.row, { marginTop: 12 }]}>
                  <TouchableOpacity
                    onPress={() => (navigation as any).navigate('[id]', { id: user.id })}
                    style={[styles.button, { flex: 1 }]}>
                    <Text style={styles.buttonText}>View/Edit</Text>
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
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Delete</Text>
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
