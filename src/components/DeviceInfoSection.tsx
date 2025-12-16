import React, { useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { DeviceInfoNative } from '../native/DeviceInfoNative';
import { deviceInfoStyles, typography } from '../styles/styles';

type Props = {
  refreshKey: number;
};

const DeviceInfoSection = ({ refreshKey }: Props) => {
  const [battery, setBattery] = React.useState<number | null>(null);
  const [network, setNetwork] = React.useState<string>('...');

  const fetchInfo = useCallback(() => {
    DeviceInfoNative.getBatteryLevel().then(setBattery);
    DeviceInfoNative.getNetworkType().then(setNetwork);
  }, []);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo, refreshKey]);

  return (
    <View style={deviceInfoStyles.container}>
      <Text style={typography.label}>Battery</Text>
      <Text style={typography.body}>
        {battery !== null ? `${battery}%` : '--'}
      </Text>

      <Text style={typography.label}>Network</Text>
      <Text style={typography.body}>{network}</Text>
    </View>
  );
};

export default DeviceInfoSection;
