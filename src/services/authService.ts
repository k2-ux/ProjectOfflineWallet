import { loginApi, registerApi } from '../api/authApi';
import { saveTokens, clearTokens } from '../storage/secureAuth';
import { store } from '../store';
import { loginSuccess, logout } from '../store/authSlice';
import type { Role } from '../store/authSlice';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  role: Role;
};

export const login = async (email: string, password: string) => {
  const res = await loginApi(email, password);
  const { accessToken, refreshToken } = res;
  await saveTokens(accessToken, refreshToken);
  const decoded = jwtDecode<JwtPayload>(accessToken);
  store.dispatch(loginSuccess({ role: decoded.role }));
};

export const register = async (email: string, password: string) => {
  await registerApi(email, password);
};

export const logoutUser = async () => {
  await clearTokens();
  store.dispatch(logout());
};
