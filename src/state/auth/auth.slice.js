import { createSlice } from "@reduxjs/toolkit";

import { getMeAsync, signInAsync } from "src/services/auth/auth.service";

import { toast } from 'src/components/snackbar';

const initialState = {
  user: {},
  isSignedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(signInAsync.rejected, (state) => {
        state.isLoggedIn = false;
        toast.error('Vui lòng kiểm tra lại thông tin đăng nhập!');
      })
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;