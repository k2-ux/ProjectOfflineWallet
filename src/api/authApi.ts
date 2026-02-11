import { http } from './httpClient';

export const loginApi = async (email: string, password: string) => {
  return http('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerApi = async (email: string, password: string) => {
  return http('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const refreshTokenApi = async (refreshToken: string) => {
  return http('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
};
