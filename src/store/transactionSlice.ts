import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../utils/types';

interface TransactionsState {
  list: Transaction[];
  loading: boolean;
  hasMore: boolean;
}

const initialState: TransactionsState = {
  list: [],
  loading: false,
  hasMore: true,
};

type UpdateTransactionPayload = {
  id: string;
  status?: Transaction['status'];
  updatedAt?: number;
};

type IncrementRetryPayload = {
  id: string;
  updatedAt: number;
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {

    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.list = action.payload;
      state.hasMore = action.payload.length > 0;
    },


    addTransaction(state, action: PayloadAction<Transaction>) {
      state.list.unshift(action.payload);
    },


    updateTransaction(state, action: PayloadAction<UpdateTransactionPayload>) {
      const tx = state.list.find(t => t.id === action.payload.id);
      if (!tx) return;

      if (action.payload.status !== undefined) {
        tx.status = action.payload.status;
      }
      if (action.payload.updatedAt !== undefined) {
        tx.updatedAt = action.payload.updatedAt;
      }
    },


    incrementRetry(state, action: PayloadAction<IncrementRetryPayload>) {
      const tx = state.list.find(t => t.id === action.payload.id);
      if (!tx) return;

      tx.retryCount += 1;
      tx.updatedAt = action.payload.updatedAt;
    },


    appendTransactions(state, action: PayloadAction<Transaction[]>) {
      const existingIds = new Set(state.list.map(t => t.id));

      const uniqueNew = action.payload.filter(tx => !existingIds.has(tx.id));

      state.list.push(...uniqueNew);

      if (action.payload.length === 0) {
        state.hasMore = false;
      }
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  incrementRetry,
  appendTransactions,
  setLoading,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
