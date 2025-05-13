import { createAsyncThunk } from "@reduxjs/toolkit";

import { GET } from "../axios";
import { CHAT_GET, CHAT_PUT, CHAT_POST } from "../chat-axios";

export const sendAdminMessageAsync = createAsyncThunk(
  'chat/sendAdminMessageAsync',
  async (msg) => {
    const response = await CHAT_POST(`/messages/addmsg`, msg);

    return response.data;
  }
);

export const sendCustomerMessageAsync = createAsyncThunk(
  'chat/sendCustomerMessageAsync',
  async (msg) => {
    const response = await CHAT_POST(`/messages/addmsg`, msg);

    return response.data;
  }
);

export const createMessageAsync = createAsyncThunk(
  'chat/createMessageAsync',
  async (body) => {
    const response = await CHAT_POST(`/messages`, body);

    return response.data.data.message;
  }
);


export const getMessagesAsync = createAsyncThunk(
  'chat/getMessagesAsync',
  async (params) => {
    const response = await CHAT_GET(`/messages`, { params });

    return response.data.data;
  }
);

export const getConversationsAsync = createAsyncThunk(
  'chat/getConversationsAsync',
  async ({ params }) => {
    const response = await CHAT_GET(`/conversations`, {
      params
    });

    return response.data.data.conversations;
  }
);

export const getConversationByIdAsync = createAsyncThunk(
  'chat/getConversationByIdAsync',
  async (conversationId) => {
    const response = await CHAT_GET(`/conversations/${conversationId}`);

    return response.data.data;
  }
);

export const createConversationAsync = createAsyncThunk(
  'chat/createConversationAsync',
  async (body) => {
    const response = await CHAT_POST(`/conversations`, body);

    return response.data;
  }
);

export const updateConversationReadAsync = createAsyncThunk(
  'chat/updateConversationReadAsync',
  async (body) => {
    const response = await CHAT_PUT(`/conversation-reads`, body);

    return response.data.data;
  }
);

export const getAllUsers = createAsyncThunk(
  'chat/getAllUsers',
  async (customerIds) => {
    const response = await GET(`/users`,
      {
        params: {
          userIds: customerIds.join(','),
          pageNumber: 1,
          pageSize: 10000,
        }
      }
    );

    return response.data;
  }
);

export const getUserByIdAsync = createAsyncThunk(
  'chat/getUserById',
  async (id) => {
    const response = await GET(`/users/${id}`);

    return response.data;
  }
);

