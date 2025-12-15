import { insertTransaction } from '../storage/transactionDB';
import { Transaction } from '../utils/types';
import uuid from 'react-native-uuid';
import { updateStatus } from './transactionState';
import { payApi } from '../api/paymentApi';
import { loadTransactionsFromDB } from './transactionLoader';

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

  // 1️⃣ Persist immediately (offline-safe)
  await insertTransaction(transaction);
  await loadTransactionsFromDB();

  // 2️⃣ Move to PENDING
  await updateStatus(transaction.id, 'PENDING');
  processPayment(transaction.id, amount);
  await loadTransactionsFromDB();

  return transaction.id;
};

export const processPayment = async (transactionId: string, amount: number) => {
  try {
    const res = await payApi({ transactionId, amount });
    await loadTransactionsFromDB();

    if (res.success) {
      await updateStatus(transactionId, 'SUCCESS');
    } else {
      await updateStatus(transactionId, 'FAILED');
    }
  } catch (err) {
    // Network error → keep PENDING
    await updateStatus(transactionId, 'PENDING');
  }
};
