import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionSlice';
import syncReducer from './syncSlice';
import authReducer from './authSlice'
export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    sync: syncReducer,
    auth: authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
