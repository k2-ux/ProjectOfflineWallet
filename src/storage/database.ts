import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let dbInstance: SQLiteDatabase | null = null;

export const getDB = async (): Promise<SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabase({ name: 'wallet.db', location: 'default' });
  }
  return dbInstance;
};
