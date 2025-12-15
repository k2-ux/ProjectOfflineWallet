import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import { syncPendingPayments } from '../services/syncService';

export const useAutoSync = () => {
  useEffect(() => {
    syncPendingPayments();

    const unsubscribeNet = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncPendingPayments();
      }
    });

    const subApp = AppState.addEventListener('change', state => {
      if (state === 'active') {
        syncPendingPayments();
      }
    });

    return () => {
      unsubscribeNet();
      subApp.remove();
    };
  }, []);
};
