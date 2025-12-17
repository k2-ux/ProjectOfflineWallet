import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Transaction } from '../utils/types';
import DeviceInfoSection from '../components/DeviceInfoSection';
import AddTransactionModal from '../components/AddTransactionModal';
import {
  commonStyles,
  buttonStyles,
  tableStyles,
  badgeStyles,
  typography,
} from '../styles/styles';
import { formatTime } from '../utils/funtions';
import TransactionRow from '../components/TransactionRow';
import { loadNextPage } from '../services/transactionLoader';
import NetworkStatusBanner from '../components/NetworkStatusBanner';
import SyncStatusBanner from '../components/SyncStatusBanner';
import { logoutUser } from '../services/authService';

export const HomeScreen = () => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.list,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey(prev => prev + 1);

    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  return (
    <View style={commonStyles.container}>
      <StatusBar hidden />
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <View style={commonStyles.card}>
        <DeviceInfoSection refreshKey={refreshKey} />
      </View>
      <NetworkStatusBanner />
      <SyncStatusBanner />

      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Wallet Home</Text>

        <TouchableOpacity
          onPress={logoutUser}
          style={buttonStyles.secondary}
          activeOpacity={0.8}
        >
          <Text style={buttonStyles.secondaryText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={buttonStyles.primary}
        onPress={() => setModalVisible(true)}
      >
        <Text style={buttonStyles.primaryText}>Add Transaction</Text>
      </TouchableOpacity>

      <View style={tableStyles.headerRow}>
        <Text style={tableStyles.headerText}>AMOUNT / ID</Text>
        <Text style={tableStyles.headerText}>STATUS</Text>
        <Text style={tableStyles.headerText}>TIME</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TransactionRow item={item} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
          />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.7}
      />
    </View>
  );
};
