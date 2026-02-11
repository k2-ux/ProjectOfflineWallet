import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Role = 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'VIEWER';

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  initialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ role: Role }>) {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.initialized = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.role = null;
      state.initialized = true;
    },
    markInitialized(state) {
      state.initialized = true;
    },
  },
});

export const { loginSuccess, logout, markInitialized } = authSlice.actions;

export default authSlice.reducer;
