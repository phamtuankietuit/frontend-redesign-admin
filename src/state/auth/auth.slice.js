import { createSlice } from "@reduxjs/toolkit";

import { getMeAsync, signInAsync } from "src/services/auth/auth.service";

import { toast } from 'src/components/snackbar';

const initialState = {
  user: null,
  loading: true,
  signUp: {}
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      Object.assign(state, initialState);
    },
    setSignUp: (state, action) => {
      state.signUp = action.payload;
    }
  },
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

export const { signOut, setSignUp } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;