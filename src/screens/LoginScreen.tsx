import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { login } from '../services/authService';
import { commonStyles, buttonStyles } from '../styles/styles';

const LoginScreen = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            await login('demo', 'password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={commonStyles.centeredContainer}>
            <Text style={commonStyles.title}>Offline Wallet</Text>

            <TouchableOpacity
                style={buttonStyles.primary}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={buttonStyles.primaryText}>Login</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
