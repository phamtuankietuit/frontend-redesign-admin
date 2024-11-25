import { createSlice } from "@reduxjs/toolkit";

import {
  getAllUsers,
  sendMessageAsync,
  getConversationsAsync,
  createConversationAsync,
  getConversationByIdAsync
} from "src/services/chat/chat.service";

const initialState = {
  admin: {
    contacts: [],
    contact: null,
    conversation: {},
    messages: []
  }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setAdminContacts: (state, action) => {
      state.admin.contacts = action.payload;
    },
    setAdminContact: (state, action) => {
      state.admin.contact = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageAsync.fulfilled, (state, action) => {

      })
      .addCase(getConversationsAsync.fulfilled, (state, action) => {

      })
      .addCase(createConversationAsync.fulfilled, (state, action) => {

      })
      .addCase(getAllUsers.fulfilled, (state, action) => {

      })
      .addCase(getConversationByIdAsync.fulfilled, (state, action) => {
        state.admin.conversation = action.payload.conversation;
        state.admin.messages = action.payload.messages;
      });
  },
});

export const { setAdminContacts, setAdminContact } = chatSlice.actions;

export const selectChat = (state) => state.chat;

export default chatSlice.reducer;
