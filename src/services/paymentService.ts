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

  await insertTransaction(transaction);
  await loadTransactionsFromDB();

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
    await updateStatus(transactionId, 'PENDING');
  }
};
