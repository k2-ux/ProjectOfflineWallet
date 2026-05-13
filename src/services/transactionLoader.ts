import { getTransactionsPage } from '../storage/transactionDB';
import {
  setTransactions,
  setLoading,
  setHasMore,
  appendTransactions,
} from '../store/transactionSlice';
import { store } from '../store';

const PAGE_SIZE = 50;

export const loadNextPage = async () => {
  const state = store.getState();
  const { loading, hasMore, list } = state.transactions;

  if (loading || !hasMore) return;

  store.dispatch(setLoading(true));

  const data = await getTransactionsPage(PAGE_SIZE, list.length);

  store.dispatch(appendTransactions(data));

  if (data.length < PAGE_SIZE) {
    store.dispatch(setHasMore(false));
  }

  store.dispatch(setLoading(false));
};

export const loadInitialPage = async () => {
  store.dispatch(setLoading(true));
  const data = await getTransactionsPage(PAGE_SIZE, 0);
  store.dispatch(setTransactions(data));
  if (data.length < PAGE_SIZE) {
    store.dispatch(setHasMore(false));
  }
  store.dispatch(setLoading(false));
};
