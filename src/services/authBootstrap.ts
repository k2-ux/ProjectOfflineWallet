
import { getAuthToken, clearAuthToken } from '../storage/authStorage';
import { store } from '../store';
import { loginSuccess, logout, markInitialized } from '../store/authSlice';

export const bootstrapAuth = async () => {
    const auth = await getAuthToken();

    if (!auth || auth.expiresAt < Date.now()) {
        await clearAuthToken();
        store.dispatch(logout());
        return;
    }

    store.dispatch(loginSuccess());
};
