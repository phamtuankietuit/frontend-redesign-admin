import { createAsyncThunk } from "@reduxjs/toolkit";

import { schemeConfig } from "src/theme/scheme-config";

import { STORAGE_KEY } from "src/components/settings";

import { GET, POST, PUT } from "../axios";
import { deleteItem, sessionKey, setSession } from "../token.service";


export const getMeAsync = createAsyncThunk('auth/getMeAsync', async () => {
  const response = await GET(`/users/me`);
  return response.data;
});

export const updateMeAsync = createAsyncThunk(
  'auth/updateMeAsync',
  async ({ id, body }) => {
    const { data } = await PUT(`/users/${id}`, body);
    return data;
  }
);

export const signInAsync = createAsyncThunk(
  'auth/signInAsync',
  async (body) => {
    const response = await POST('/auth/sign-in', body);
    setSession(response.data);
    return response.data;
  }
);

export const sendEmailForgotPasswordAsync = createAsyncThunk(
  'auth/sendEmailForgotPasswordAsync',
  async (body) => {
    const { data } = await POST('/auth/request-password-reset', body);
    return data;
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPasswordAsync',
  async ({ id, body }) => {
    const { data } = await POST(`/auth/${id}/reset-password`, body);
    return data;
  }
);

export const updatePasswordAsync = createAsyncThunk(
  'auth/updatePasswordAsync',
  async ({ id, body }) => {
    const { data } = await POST(`/auth/${id}/change-password`, body);
    return data;
  }
);

export const signOut = () => {
  deleteItem(sessionKey);
  // RESET THEME
  deleteItem(STORAGE_KEY);
  deleteItem(schemeConfig.modeStorageKey);
};