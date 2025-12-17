

import React from 'react';
import { View, Text } from 'react-native';
import { Transaction } from '../utils/types';
import { tableStyles, badgeStyles, typography } from '../styles/styles';
import { formatTime } from '../utils/funtions';

type Props = {
  item: Transaction;
};

const TransactionRow = React.memo(({ item }: Props) => {
  const isSuccess = item.status === 'SUCCESS';
  const isPending =
    item.status === 'PENDING' || item.status === 'INITIATED';

  return (
    <View style={tableStyles.row}>
      <View style={tableStyles.cell}>
        <Text style={typography.amount}>
          ₹{item.amount.toFixed(2)}
        </Text>
        <Text style={typography.meta}>
          ID: {item.id.slice(0, 8)}
        </Text>
      </View>

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

      <View style={tableStyles.cell}>
        <Text style={typography.meta}>
          {formatTime(item.createdAt)}
        </Text>
      </View>
    </View>
  );
});

export default TransactionRow;
