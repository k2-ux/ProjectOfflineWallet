import * as Keychain from 'react-native-keychain';
import { AuthToken } from '../utils/authTypes';

const AUTH_KEY = 'auth-token';

export const saveAuthToken = async (data: AuthToken) => {
    await Keychain.setGenericPassword(
        AUTH_KEY,
        JSON.stringify(data),
    );
};

export const getAuthToken = async (): Promise<AuthToken | null> => {
    const creds = await Keychain.getGenericPassword();
    if (!creds) return null;

    return JSON.parse(creds.password);
};

export const clearAuthToken = async () => {
    await Keychain.resetGenericPassword();
};
