import * as Keychain from 'react-native-keychain';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await Keychain.setGenericPassword(
    'auth',
    JSON.stringify({ accessToken, refreshToken }),
  );
};

export const getTokens = async () => {
  const creds = await Keychain.getGenericPassword();
  if (!creds) return null;
  return JSON.parse(creds.password);
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword();
};
