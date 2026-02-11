import { loginApi, registerApi } from '../api/authApi';
import { saveAuthToken, clearAuthToken } from '../storage/authStorage';
import { saveTokens } from '../storage/secureAuth';
import { store } from '../store';
import { loginSuccess, logout } from '../store/authSlice';
import NetInfo from '@react-native-community/netinfo';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  role: 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'VIEWER';
};

export const login = async (email: string, password: string) => {
  const res = await loginApi(email, password);

  const { accessToken, refreshToken } = res;

  await saveTokens(accessToken, refreshToken);

  const decoded = jwtDecode<JwtPayload>(accessToken);

  store.dispatch(loginSuccess({ role: decoded.role }));
};
export const logoutUser = async () => {
  await clearAuthToken();
  store.dispatch(logout());
};
