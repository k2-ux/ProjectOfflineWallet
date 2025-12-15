import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { createPayment } from '../services/paymentService';
import { Transaction } from '../utils/types';
import DeviceInfoSection from '../components/DeviceInfoSection';

export const HomeScreen = () => {
  // ✅ Redux is the UI source (DB already mirrored into it)
  const transactions = useSelector(
    (state: RootState) => state.transactions.list,
  );

  // ✅ memoized for FlatList performance
  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <Text style={styles.row}>
        {item.id.slice(0, 6)} | ₹{item.amount} | {item.status}
      </Text>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <DeviceInfoSection />
      <Text style={styles.title}>Wallet Home</Text>

      {/* ✅ TouchableOpacity button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => createPayment(100)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Create Payment</Text>
      </TouchableOpacity>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    marginTop: 8,
  },
});
