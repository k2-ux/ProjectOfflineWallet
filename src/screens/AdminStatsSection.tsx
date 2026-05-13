import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { getAdminStats, AdminStats } from '../services/adminService';

const AdminStatsSection = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await getAdminStats();
      if (res) setStats(res);
    } catch (e) {
      console.log('Admin stats error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={loadStats}
        style={[styles.button, stats ? styles.buttonWithStats : null]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
        ) : (
          <Text style={styles.buttonIcon}>🔐</Text>
        )}
        <Text style={styles.buttonText}>Check Admin Access</Text>
      </TouchableOpacity>

      {stats && !loading && (
        <View style={styles.statsCard}>
          <Text style={styles.label}>
            Status: <Text style={styles.valueGreen}>{stats.message}</Text>
          </Text>
          <Text style={styles.label}>
            Role: <Text style={styles.valueDark}>{stats.role}</Text>
          </Text>
          <Text style={styles.label}>
            Time: <Text style={styles.valueDark}>{stats.time}</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    margin: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonWithStats: {
    marginBottom: 12,
  },
  spinner: {
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  label: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 2,
  },
  valueGreen: {
    color: '#28a745',
    fontWeight: '600',
  },
  valueDark: {
    color: '#495057',
    fontWeight: '600',
  },
});

export default AdminStatsSection;
