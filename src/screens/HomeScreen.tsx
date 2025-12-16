import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
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

  const renderItem = useCallback(({ item }: { item: Transaction }) => {
    const isSuccess = item.status === 'SUCCESS';
    const isPending = item.status === 'PENDING' || item.status === 'INITIATED';

    return (
      <View style={tableStyles.row}>
        <View style={tableStyles.cell}>
          <Text style={typography.amount}>₹{item.amount.toFixed(2)}</Text>
          <Text style={typography.meta}>ID: {item.id.slice(0, 8)}</Text>
        </View>

        {/* Status */}
        <View style={tableStyles.cell}>
          <View
            style={[
              badgeStyles.base,
              isSuccess
                ? badgeStyles.success
                : isPending
                ? badgeStyles.pending
                : badgeStyles.failed,
            ]}
          >
            <Text
              style={
                isSuccess
                  ? badgeStyles.textSuccess
                  : isPending
                  ? badgeStyles.textPending
                  : badgeStyles.textFailed
              }
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Time */}
        <View style={tableStyles.cell}>
          <Text style={typography.meta}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    );
  }, []);

  return (
    <View style={commonStyles.container}>
      {/* Modal */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* Device Info */}
      <View style={commonStyles.card}>
        <DeviceInfoSection refreshKey={refreshKey} />
      </View>

      <Text style={commonStyles.title}>Wallet Home</Text>

      <TouchableOpacity
        style={buttonStyles.primary}
        onPress={() => setModalVisible(true)}
      >
        <Text style={buttonStyles.primaryText}>Add Transaction</Text>
      </TouchableOpacity>

      {/* ⭐ Table Headers */}
      <View style={tableStyles.headerRow}>
        <Text style={tableStyles.headerText}>AMOUNT / ID</Text>
        <Text style={tableStyles.headerText}>STATUS</Text>
        <Text style={tableStyles.headerText}>TIME</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
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
      />
    </View>
  );
};
