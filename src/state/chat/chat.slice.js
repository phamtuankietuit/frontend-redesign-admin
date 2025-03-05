import { createSlice } from "@reduxjs/toolkit";

// import { socket } from "src/hooks/use-socket";

import {
  getAllUsers,
  sendAdminMessageAsync,
  getConversationsAsync,
  createConversationAsync,
  getConversationByIdAsync,
  sendCustomerMessageAsync
} from "src/services/chat/chat.service";

const initialState = {
  admin: {
    contacts: [],
    contact: {
      id: '',
    },
    conversation: {},
    messages: [],
    lastMessage: {},
    chatMessageList: {
      loading: true,
    }
  },
  customer: {
    messages: [],
    conversation: {},
    hasNewMessage: false,
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
      state.admin.lastMessage = action.payload.lastMessage;
    },
    addAdminMessage: (state, action) => {
      state.admin.messages.push(action.payload);
      state.admin.lastMessage = action.payload;
    },
    addCustomerMessage: (state, action) => {
      state.customer.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAdminMessageAsync.fulfilled, (state, action) => {
        state.admin.messages.push(action.payload);
        state.admin.lastMessage = action.payload;

        const contactIndex =
          state.admin.contacts.findIndex(contact =>
            contact.conversation._id === action.payload.conversationId);

        if (contactIndex !== -1) {
          const [contact] = state.admin.contacts.splice(contactIndex, 1);
          state.admin.contacts.unshift(contact);
        }

        const to = state.admin.conversation
          ?.participants
          ?.filter(
            participant => participant !== action.payload.senderId);

        // socket.emit('send-msg', { to, msg: action.payload });
      })
      .addCase(sendCustomerMessageAsync.fulfilled, (state, action) => {
        state.customer.messages.push(action.payload);

        const to = state.customer.conversation
          ?.participants
          ?.filter(
            participant => participant !== action.payload.senderId);

        // socket.emit('send-msg', { to, msg: action.payload });
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
        state.admin.lastMessage = action.payload.messages[action.payload.messages.length - 1];
        state.admin.chatMessageList.loading = false;

        state.customer.conversation = action.payload.conversation;
        state.customer.messages = action.payload.messages;
      });
  },
});

export const { setAdminContacts, setAdminContact, addCustomerMessage, addAdminMessage } = chatSlice.actions;

export const selectChat = (state) => state.chat;

export default chatSlice.reducer;
