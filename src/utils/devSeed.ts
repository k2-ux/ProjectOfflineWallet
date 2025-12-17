import uuid from 'react-native-uuid';
import { insertTransaction } from '../storage/transactionDB';
import { Transaction } from './types';

let seeded = false;

/**
 * DEV ONLY: Seed large transaction dataset
 */
export const seedTransactionsIfNeeded = async () => {
  if (!__DEV__ || seeded) return;

  seeded = true;

  const now = Date.now();

  for (let i = 0; i < 5000; i++) {
    const tx: Transaction = {
      id: uuid.v4() as string,
      amount: Math.round(Math.random() * 1000),
      status: 'SUCCESS',
      retryCount: 0,
      createdAt: now - i * 1000,
      updatedAt: now - i * 1000,
    };

    await insertTransaction(tx);
  }

  console.log('✅ Seeded 5000 transactions');
};
