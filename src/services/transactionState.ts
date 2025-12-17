import { getDB } from '../storage/database';
import { TransactionStatus } from '../utils/types';
import { store } from '../store';
import {
  updateTransaction,
  incrementRetry as incrementRetryRedux,
} from '../store/transactionSlice';

/**
 * Update transaction status in BOTH:
 * 1. SQLite (source of truth)
 * 2. Redux (UI cache)
 */
export const updateStatus = async (
  id: string,
  status: TransactionStatus,
) => {
  const updatedAt = Date.now();
  const db = await getDB();

  // 1️⃣ Update SQLite
  await db.executeSql(
    `UPDATE transactions
     SET status = ?, updatedAt = ?
     WHERE id = ?`,
    [status, updatedAt, id],
  );

  // 2️⃣ Update Redux immediately
  store.dispatch(
    updateTransaction({
      id,
      status,
      updatedAt,
    }),
  );
};

/**
 * Increment retry count in BOTH SQLite & Redux
 */
export const incrementRetry = async (id: string) => {
  const updatedAt = Date.now();
  const db = await getDB();

  // 1️⃣ Update SQLite
  await db.executeSql(
    `UPDATE transactions
     SET retryCount = retryCount + 1,
         updatedAt = ?
     WHERE id = ?`,
    [updatedAt, id],
  );

  // 2️⃣ Update Redux
  store.dispatch(
    incrementRetryRedux({
      id,
      updatedAt,
    }),
  );
};
