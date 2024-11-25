import { createAsyncThunk } from "@reduxjs/toolkit";

import { schemeConfig } from "src/theme/scheme-config";

import { STORAGE_KEY } from "src/components/settings";

import { GET, POST } from "../axios";
import { deleteItem, sessionKey, setSession } from "../token.service";


export const getMeAsync = createAsyncThunk('auth/getMeAsync', async () => {
  const response = await GET(`/users/me`);
  return response.data;
});

export const signInAsync = createAsyncThunk(
  'auth/signInAsync',
  async (body) => {
    const response = await POST('/auth/sign-in', body);
    setSession(response.data);
    return response.data;
  }
);

export const signOut = () => {
  deleteItem(sessionKey);
  // RESET THEME
  deleteItem(STORAGE_KEY);
  deleteItem(schemeConfig.modeStorageKey);
};