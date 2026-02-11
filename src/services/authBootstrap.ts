import { jwtDecode } from 'jwt-decode';
import { getTokens } from '../storage/secureAuth';
import { store } from '../store';
import { loginSuccess, logout, markInitialized } from '../store/authSlice';

type JwtPayload = {
  role: 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'VIEWER';
  exp: number;
};

export const bootstrapAuth = async () => {
  try {
    const tokens = await getTokens();

    if (!tokens?.accessToken) {
      store.dispatch(logout());
      return;
    }

    const decoded = jwtDecode<JwtPayload>(tokens.accessToken);

    if (!decoded?.role || decoded.exp * 1000 < Date.now()) {
      store.dispatch(logout());
      return;
    }

    store.dispatch(loginSuccess({ role: decoded.role }));
  } catch (e) {
    store.dispatch(logout());
  } finally {
    // 🔒 GUARANTEE INITIALIZATION
    store.dispatch(markInitialized());
  }
};
