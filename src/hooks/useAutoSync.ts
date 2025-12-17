import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import { syncPendingPayments } from '../services/syncService';
import { store } from '../store';
import { setSyncing } from '../store/syncSlice';

export const useAutoSync = () => {
  const syncingRef = useRef(false);

  const runSync = async () => {
    if (syncingRef.current) return; // 🔒 prevent overlap

    syncingRef.current = true;
    store.dispatch(setSyncing(true));

    try {
      await syncPendingPayments();
    } finally {
      syncingRef.current = false;
      store.dispatch(setSyncing(false));
    }
  };

  useEffect(() => {
    // Initial attempt
    runSync();

    // Network-based trigger
    const unsubscribeNet = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        runSync();
      }
    });

    // App foreground trigger
    const subApp = AppState.addEventListener('change', state => {
      if (state === 'active') {
        runSync();
      }
    });

    return () => {
      unsubscribeNet();
      subApp.remove();
    };
  }, []);
};
