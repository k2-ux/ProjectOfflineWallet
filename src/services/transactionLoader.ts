import {
  getAllTransactions,
  getTransactionsPage,
} from '../storage/transactionDB';
import {
  setTransactions,
  setLoading,
  appendTransactions,
} from '../store/transactionSlice';
import { store } from '../store';
// transactionLoader.ts
const PAGE_SIZE = 50;

export const loadNextPage = async () => {
  const state = store.getState();
  const { loading, hasMore, list } = state.transactions;

  // 🔒 hard guards
  if (loading || !hasMore) return;

  store.dispatch(setLoading(true));

  const data = await getTransactionsPage(
    PAGE_SIZE,
    list.length, // offset
  );

  store.dispatch(appendTransactions(data));
  store.dispatch(setLoading(false));
};

export const loadInitialPage = async () => {
  store.dispatch(setLoading(true));
  const data = await getTransactionsPage(50, 0);
  store.dispatch(setTransactions(data));
  store.dispatch(setLoading(false));
};
