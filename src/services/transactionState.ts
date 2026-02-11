import { getDB } from '../storage/database';
import { TransactionStatus } from '../utils/types';
import { store } from '../store';
import {
  updateTransaction,
  incrementRetry as incrementRetryRedux,
} from '../store/transactionSlice';

export const updateStatus = async (
  id: string,
  newStatus: TransactionStatus,
) => {
  const db = await getDB();

  const [res] = await db.executeSql('SELECT * FROM transactions WHERE id = ?', [
    id,
  ]);

  if (res.rows.length === 0) return;

  const currentTx = res.rows.item(0);

  // ✅ SUCCESS is terminal (never overwrite it)
  if (currentTx.status === 'SUCCESS') {
    return;
  }

  const updatedAt = Date.now();

  await db.executeSql(
    `UPDATE transactions
     SET status = ?, updatedAt = ?
     WHERE id = ?`,
    [newStatus, updatedAt, id],
  );

  // ✅ Mirror to Redux immediately
  store.dispatch(
    updateTransaction({
      id,
      status: newStatus,
      updatedAt,
    }),
  );
};

export const incrementRetry = async (id: string) => {
  const updatedAt = Date.now();
  const db = await getDB();

  await db.executeSql(
    `UPDATE transactions
     SET retryCount = retryCount + 1,
         updatedAt = ?
     WHERE id = ?`,
    [updatedAt, id],
  );

  store.dispatch(
    incrementRetryRedux({
      id,
      updatedAt,
    }),
  );
};
