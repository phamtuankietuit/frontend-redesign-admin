import { createSlice } from "@reduxjs/toolkit";

// import { socket } from "src/hooks/use-socket";

import { getMeAsync, signInAsync } from "src/services/auth/auth.service";

import { toast } from 'src/components/snackbar';

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  signUp: {}
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      Object.assign(state, initialState);
      // socket.disconnect();
    },
    setSignUp: (state, action) => {
      state.signUp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.rejected, () => {
        toast.error('Vui lòng kiểm tra lại thông tin đăng nhập!');
      })
      .addCase(getMeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        // socket.emit('add-user', action.payload.id);
      })
      .addCase(getMeAsync.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
    ;
  },
});

export const { signOut, setSignUp } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;