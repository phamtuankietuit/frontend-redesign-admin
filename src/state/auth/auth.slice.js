import { createSlice } from "@reduxjs/toolkit";

// import { socket } from "src/hooks/use-socket";

import { getMeAsync, signInAsync } from "src/services/auth/auth.service";

import { toast } from 'src/components/snackbar';

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      Object.assign(state, initialState);
      // socket.disconnect();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.rejected, () => {
        toast.error('Vui lòng kiểm tra lại thông tin đăng nhập!');
      })
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // socket.emit('add-user', action.payload.id);
      });
  },
});

export const { signOut } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;