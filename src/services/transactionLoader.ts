import { getAllTransactions } from '../storage/transactionDB';
import { setTransactions, setLoading } from '../store/transactionSlice';
import { store } from '../store';

export const loadTransactionsFromDB = async () => {
  store.dispatch(setLoading(true));
  const data = await getAllTransactions();
  store.dispatch(setTransactions(data));
  store.dispatch(setLoading(false));
};
