import { createSlice } from "@reduxjs/toolkit";

import { getMeAsync, signInAsync } from "src/services/auth/auth.service";

import { toast } from 'src/components/snackbar';

const initialState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.rejected, () => {
        toast.error('Vui lòng kiểm tra lại thông tin đăng nhập!');
      })
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      });
  },
});

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;