import { getDB } from '../storage/database';
import { TransactionStatus } from '../utils/types';
import { store } from '../store';
import {
  updateTransaction,
  incrementRetry as incrementRetryRedux,
} from '../store/transactionSlice';


export const updateStatus = async (
  id: string,
  status: TransactionStatus,
) => {
  const updatedAt = Date.now();
  const db = await getDB();

  await db.executeSql(
    `UPDATE transactions
     SET status = ?, updatedAt = ?
     WHERE id = ?`,
    [status, updatedAt, id],
  );

  store.dispatch(
    updateTransaction({
      id,
      status,
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
