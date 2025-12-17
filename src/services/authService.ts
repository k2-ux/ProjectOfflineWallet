import { loginApi } from '../api/authApi';
import { saveAuthToken, clearAuthToken } from '../storage/authStorage';
import { store } from '../store';
import { loginSuccess, logout } from '../store/authSlice';
import NetInfo from '@react-native-community/netinfo';

export const login = async (
    username: string,
    password: string,
) => {
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
        throw new Error('No internet connection');
    }

    const auth = await loginApi(username, password);
    await saveAuthToken(auth);
    store.dispatch(loginSuccess());
};

export const logoutUser = async () => {
    await clearAuthToken();
    store.dispatch(logout());
};
