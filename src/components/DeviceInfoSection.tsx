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
      <View>
        <Text style={deviceInfoStyles.label}>Battery</Text>
        <Text style={deviceInfoStyles.value}>
          {battery !== null ? `${battery}%` : '--'}
        </Text>
      </View>
      <View>
        <Text style={deviceInfoStyles.label}>Network</Text>
        <Text style={deviceInfoStyles.value}>{network}</Text>
      </View>
    </View>
  );
};

export default DeviceInfoSection;
