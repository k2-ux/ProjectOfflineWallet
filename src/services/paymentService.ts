import uuid from 'react-native-uuid';
import { insertTransaction } from '../storage/transactionDB';
import { Transaction } from '../utils/types';
import { updateStatus, incrementRetry } from './transactionState';
import { payApi } from '../api/paymentApi';
import { store } from '../store';
import { addTransaction } from '../store/transactionSlice';
import { DeviceInfoNative } from '../native/DeviceInfoNative';

export const createPayment = async (amount: number) => {
  const now = Date.now();

  const transaction: Transaction = {
    id: uuid.v4() as string,
    amount,
    status: 'PENDING',
    retryCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  await insertTransaction(transaction);
  store.dispatch(addTransaction(transaction));

  processPayment(transaction.id, amount);

  return transaction.id;
};

export const processPayment = async (transactionId: string, amount: number) => {
  const networkType = await DeviceInfoNative.getNetworkType();

  if (networkType === 'NONE') {
    await updateStatus(transactionId, 'PENDING');
    return;
  }

  try {
    const res = await payApi({ transactionId, amount });

    const status = String(res.status).trim().toUpperCase();

    console.log('Normalized Status:', status);

    if (status === 'SUCCESS') {
      await updateStatus(transactionId, 'SUCCESS');
    } else if (status === 'FAILED') {
      await updateStatus(transactionId, 'FAILED');
      await incrementRetry(transactionId);
    } else {
      await updateStatus(transactionId, 'PENDING');
      await incrementRetry(transactionId);
    }
  } catch (err) {
    await updateStatus(transactionId, 'PENDING');
    await incrementRetry(transactionId);
  }
};
