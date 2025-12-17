import uuid from 'react-native-uuid';
import { insertTransaction } from '../storage/transactionDB';
import { Transaction } from '../utils/types';
import { updateStatus, incrementRetry } from './transactionState';
import { payApi } from '../api/paymentApi';
import { store } from '../store';
import { addTransaction } from '../store/transactionSlice';

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

  // 1️⃣ Persist user intent (SQLite)
  await insertTransaction(transaction);

  // 2️⃣ Mirror immediately to Redux (UI updates instantly)
  store.dispatch(addTransaction(transaction));

  // 3️⃣ System takes responsibility
  await updateStatus(transaction.id, 'PENDING');

  // 4️⃣ Fire-and-forget processing
  processPayment(transaction.id, amount);

  return transaction.id;
};

/**
 * Process / retry a payment (idempotent)
 */
export const processPayment = async (transactionId: string, amount: number) => {
  try {
    const res = await payApi({
      transactionId,
      amount,
    });

    if (res.success) {
      await updateStatus(transactionId, 'SUCCESS');
    } else {
      await updateStatus(transactionId, 'FAILED');
      await incrementRetry(transactionId);
    }
  } catch (err) {
    // Network error → stay pending, retry later
    await updateStatus(transactionId, 'PENDING');
    await incrementRetry(transactionId);
  }
};
