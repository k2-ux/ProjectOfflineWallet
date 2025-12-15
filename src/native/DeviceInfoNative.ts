import { NativeModules } from 'react-native';

type DeviceInfoNativeType = {
  getBatteryLevel(): Promise<number>;
  getNetworkType(): Promise<string>;
};

export const DeviceInfoNative =
  NativeModules.DeviceInfoNative as DeviceInfoNativeType;
