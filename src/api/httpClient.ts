import { API_BASE_URL } from '@env';
import { getTokens, saveTokens, clearTokens } from '../storage/secureAuth';
import { logout } from '../store/authSlice';
import { store } from '../store';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const tokens = await getTokens();
    if (!tokens?.refreshToken) return null;

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    await saveTokens(data.accessToken, data.refreshToken);

    return data.accessToken;
  } catch {
    return null;
  }
};

export const http = async (
  url: string,
  options: RequestInit = {},
  retry = true,
): Promise<any> => {
  const tokens = await getTokens();

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(tokens?.accessToken
        ? { Authorization: `Bearer ${tokens.accessToken}` }
        : {}),
      ...(options.headers || {}),
    },
  });

  // ✅ SUCCESS
  if (res.ok) {
    return res.json();
  }

  // 🔁 HANDLE 401 ONCE
  if (res.status === 401 && retry) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      return http(url, options, false); // retry once
    }

    // ❌ Refresh failed → real logout
    await clearTokens();
    store.dispatch(logout());
    throw new Error('Session expired');
  }

  // Other errors
  const err = await res.json().catch(() => ({}));
  throw new Error(err.message || 'Request failed');
};
