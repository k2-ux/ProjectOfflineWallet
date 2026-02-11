import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { login } from '../services/authService';
import { isValidEmail } from '../utils/validators';
import { styles } from '../styles/AuthStyles';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (loading) return;

    if (!email || !password) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      Alert.alert('No Internet', 'Internet connection is required to login.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      // ✅ No navigation here
      // AppContent will switch screen based on auth state
    } catch (err: any) {
      Alert.alert('Login failed', err?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Secure Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && { opacity: 0.6 }]}
          onPress={onLogin}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
