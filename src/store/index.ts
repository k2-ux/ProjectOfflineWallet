import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionSlice';
import syncReducer from './syncSlice'; // ✅ add this

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    sync: syncReducer, // ✅ register here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
