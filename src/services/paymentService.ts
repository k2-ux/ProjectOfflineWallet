import uuid from 'react-native-uuid';
import { insertTransaction } from '../storage/transactionDB';
import { Transaction } from '../utils/types';
import { updateStatus, incrementRetry } from './transactionState';
import { payApi } from '../api/paymentApi';
import { store } from '../store';
import { addTransaction } from '../store/transactionSlice';
import { DeviceInfoNative } from '../native/DeviceInfoNative';

/**
 * Create a new payment (offline-safe)
 */
export const createPayment = async (amount: number) => {
  const now = Date.now();

  const transaction: Transaction = {
    id: uuid.v4() as string,
    amount,
    status: 'INITIATED',
    retryCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // 1️⃣ Persist user intent
  await insertTransaction(transaction);

  // 2️⃣ Mirror to Redux
  store.dispatch(addTransaction(transaction));

  // 3️⃣ System responsibility begins
  await updateStatus(transaction.id, 'PENDING');

  // 4️⃣ Fire-and-forget
  processPayment(transaction.id, amount);

  return transaction.id;
};

/**
 * Process / retry payment
 */
export const processPayment = async (transactionId: string, amount: number) => {
  // 🔒 Explicit network gate (mock-safe)
  const networkType = await DeviceInfoNative.getNetworkType();

  if (networkType === 'NONE') {
    // Offline → do NOT call API
    await updateStatus(transactionId, 'PENDING');
    return;
  }

  try {
    const res = await payApi({ transactionId, amount });

    if (res.success) {
      await updateStatus(transactionId, 'SUCCESS');
    } else {
      await updateStatus(transactionId, 'FAILED');
      await incrementRetry(transactionId);
    }
  } catch (err) {
    // Network / unexpected failure
    await updateStatus(transactionId, 'PENDING');
    await incrementRetry(transactionId);
  }
};
