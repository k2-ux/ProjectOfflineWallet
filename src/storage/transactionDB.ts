import { getDB } from './database';
import { Transaction } from '../utils/types';

export const insertTransaction = async (tx: Transaction) => {
  const db = await getDB();
  await db.executeSql(
    `INSERT OR REPLACE INTO transactions
     (id, amount, status, retryCount, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      tx.id,
      tx.amount,
      tx.status,
      tx.retryCount,
      tx.createdAt,
      tx.updatedAt,
    ],
  );
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();
  const [result] = await db.executeSql(
    `SELECT * FROM transactions ORDER BY createdAt DESC`,
  );

  const rows = result.rows;
  const transactions: Transaction[] = [];

  for (let i = 0; i < rows.length; i++) {
    transactions.push(rows.item(i));
  }

  return transactions;
};
export const getPendingTransactions = async () => {
  const db = await getDB();
  const [result] = await db.executeSql(
    `SELECT * FROM transactions
     WHERE status IN ('PENDING', 'FAILED')
     AND retryCount < 3
     ORDER BY createdAt ASC
     LIMIT 10`
  );

  const rows = result.rows;
  const list = [];

  for (let i = 0; i < rows.length; i++) {
    list.push(rows.item(i));
  }

  return list;
};

// transactionDB.ts
export const getTransactionsPage = async (
  limit: number,
  offset: number,
) => {
  const db = await getDB();

  const [result] = await db.executeSql(
    `SELECT * FROM transactions
     ORDER BY createdAt DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
  );

  const rows = result.rows;
  const data = [];

  for (let i = 0; i < rows.length; i++) {
    data.push(rows.item(i));
  }

  return data;
};
