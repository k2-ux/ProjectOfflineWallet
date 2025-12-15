import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { DeviceInfoNative } from '../native/DeviceInfoNative';

const DeviceInfoSection = () => {
  const [battery, setBattery] = useState<number | null>(null);
  const [network, setNetwork] = useState<string>('...');

  useEffect(() => {
    DeviceInfoNative.getBatteryLevel().then(setBattery);
    DeviceInfoNative.getNetworkType().then(setNetwork);
  }, []);

  return (
    <>
      <Text>Battery: {battery ?? '--'}%</Text>
      <Text>Network: {network}</Text>
    </>
  );
};
export default DeviceInfoSection;
