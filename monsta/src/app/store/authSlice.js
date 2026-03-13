import { createSlice } from '@reduxjs/toolkit';

const initialToken = null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload || null;
    },
    clearToken(state) {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;

