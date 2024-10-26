import { createAsyncThunk } from "@reduxjs/toolkit";

import { GET, POST } from "../axios";
import { setSession } from "../token.service";


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