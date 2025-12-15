import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../utils/types';

interface TransactionsState {
  list: Transaction[];
  loading: boolean;
}

const initialState: TransactionsState = {
  list: [],
  loading: false,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.list = action.payload;
    },
    updateTransaction(state, action: PayloadAction<Transaction>) {
      const index = state.list.findIndex(
        tx => tx.id === action.payload.id,
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setTransactions,
  updateTransaction,
  setLoading,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
