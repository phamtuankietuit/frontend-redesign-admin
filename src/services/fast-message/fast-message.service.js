import { createAsyncThunk } from "@reduxjs/toolkit";

import { CHAT_DELETE, CHAT_GET, CHAT_POST, CHAT_PUT } from "../chat-axios";

export const getFastMessagesAsync = createAsyncThunk(
  'fastMessage/getFastMessagesAsync',
  async (params) => {
    const response = await CHAT_GET(`/fast-messages`, { params });
    return response.data.data;
  }
);

export const updateFastMessageAsync = createAsyncThunk(
  'fastMessage/updateFastMessageAsync',
  async ({ id, body }) => {
    const response = await CHAT_PUT(`/fast-messages/${id}`, body);
    return response.data.data;
  }
);

export const createFastMessageAsync = createAsyncThunk(
  'fastMessage/createFastMessageAsync',
  async (body) => {
    const response = await CHAT_POST(`/fast-messages`, body);
    return response.data.data;
  }
);

export const deleteFastMessageAsync = createAsyncThunk(
  'fastMessage/deleteFastMessageAsync',
  async (id) => {
    const response = await CHAT_DELETE(`/fast-messages/${id}`);
    return response.data.data;
  }
);
