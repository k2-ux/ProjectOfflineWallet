import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SyncState {
  isSyncing: boolean;
}

const initialState: SyncState = {
  isSyncing: false,
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setSyncing(state, action: PayloadAction<boolean>) {
      state.isSyncing = action.payload;
    },
  },
});

export const { setSyncing } = syncSlice.actions;
export default syncSlice.reducer;
