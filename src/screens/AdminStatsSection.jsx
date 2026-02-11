import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAdminStats } from '../services/adminService';

const AdminStatsSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await getAdminStats();
      if (res) {
        setStats(res);
      }
    } catch (e) {
      console.log('Admin stats error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        margin: 8,
      }}
    >
      <TouchableOpacity
        onPress={loadStats}
        style={{
          backgroundColor: '#007bff',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 6,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: stats ? 12 : 0,
        }}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ marginRight: 8 }}
          />
        ) : (
          <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>
            🔐
          </Text>
        )}
        <Text
          style={{
            fontSize: 14,
            color: '#fff',
            fontWeight: '600',
            marginLeft: 6,
          }}
        >
          Check Admin Access
        </Text>
      </TouchableOpacity>

      {stats && !loading && (
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 6,
            padding: 10,
            borderWidth: 1,
            borderColor: '#dee2e6',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#6c757d',
              marginBottom: 2,
              fontWeight: '500',
            }}
          >
            Status:{' '}
            <Text style={{ color: '#28a745', fontWeight: '600' }}>
              {stats.message}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#6c757d',
              marginBottom: 2,
              fontWeight: '500',
            }}
          >
            Role:{' '}
            <Text style={{ color: '#495057', fontWeight: '600' }}>
              {stats.role}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#6c757d',
              fontWeight: '500',
            }}
          >
            Time:{' '}
            <Text style={{ color: '#495057', fontWeight: '600' }}>
              {stats.time}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

export default AdminStatsSection;
