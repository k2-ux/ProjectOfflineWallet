import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { syncStyles } from '../styles/styles';

const SyncStatusBanner = () => {
  const isSyncing = useSelector(
    (state: RootState) => state.sync.isSyncing,
  );

  if (!isSyncing) return null;

  return (
    <View style={syncStyles.container}>
      <ActivityIndicator size="small" color="#2563EB" />
      <Text style={syncStyles.text}>Syncing payments…</Text>
    </View>
  );
};

export default SyncStatusBanner;
