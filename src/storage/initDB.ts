import { getDB } from './database';

export const initDb = async () => {
  const db = await getDB();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      retryCount INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `);
};
