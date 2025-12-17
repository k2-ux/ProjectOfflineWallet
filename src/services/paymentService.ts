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
    status: 'INITIATED',
    retryCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  await insertTransaction(transaction);

  store.dispatch(addTransaction(transaction));

  await updateStatus(transaction.id, 'PENDING');

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

    if (res.success) {
      await updateStatus(transactionId, 'SUCCESS');
    } else {
      await updateStatus(transactionId, 'FAILED');
      await incrementRetry(transactionId);
    }
  } catch (err) {
    await updateStatus(transactionId, 'PENDING');
    await incrementRetry(transactionId);
  }
};
