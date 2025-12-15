import { getPendingTransactions } from '../storage/transactionDB';
import { processPayment } from './paymentService';
import NetInfo from '@react-native-community/netinfo';

let syncing = false;

export const syncPendingPayments = async () => {
  if (syncing) return;

  const net = await NetInfo.fetch();
  if (!net.isConnected) return;

  syncing = true;

  try {
    const pending = await getPendingTransactions();

    for (const tx of pending) {
      await processPayment(tx.id, tx.amount);
    }
  } finally {
    syncing = false;
  }
};
