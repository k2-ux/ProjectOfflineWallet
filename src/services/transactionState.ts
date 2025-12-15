import { getDB } from '../storage/database';
import { TransactionStatus } from '../utils/types';

export const updateStatus = async (id: string, status: TransactionStatus) => {
  const db = await getDB();
  await db.executeSql(
    `UPDATE transactions
     SET status = ?, updatedAt = ?
     WHERE id = ?`,
    [status, Date.now(), id],
  );
};

export const incrementRetry = async (id: string) => {
  const db = await getDB();
  await db.executeSql(
    `UPDATE transactions
     SET retryCount = retryCount + 1,
         updatedAt = ?
     WHERE id = ?`,
    [Date.now(), id],
  );
};
