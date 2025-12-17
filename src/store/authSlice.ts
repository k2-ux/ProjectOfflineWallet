import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;
      state.initialized = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.initialized = true;
    },
    markInitialized(state) {
      state.initialized = true;
    },
  },
});

export const { loginSuccess, logout, markInitialized } = authSlice.actions;

export default authSlice.reducer;
