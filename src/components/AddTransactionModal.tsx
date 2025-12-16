import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { createPayment } from '../services/paymentService';
import {
  commonStyles,
  buttonStyles,
  typography,
  colors,
} from '../styles/styles';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AddTransactionModal = ({ visible, onClose }: Props) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Enter a valid amount');
      return;
    }

    createPayment(numericAmount);
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View style={commonStyles.card}>
          <Text style={typography.h1}>New Transaction</Text>

          <Text style={typography.label}>Amount (₹)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 6,
              padding: 10,
              marginTop: 6,
              marginBottom: 8,
            }}
          />

          {error ? (
            <Text style={{ color: colors.error }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={onSubmit}
          >
            <Text style={buttonStyles.primaryText}>
              Create Transaction
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 8,
                color: colors.textMuted,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddTransactionModal;
