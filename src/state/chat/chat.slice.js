import { createSlice } from "@reduxjs/toolkit";

import {
  getAllUsers,
  getUserByIdAsync,
  getMessagesAsync,
  createMessageAsync,
  getConversationsAsync,
  getConversationByIdAsync,
  updateConversationReadAsync,
} from "src/services/chat/chat.service";

const initialState = {
  customerIds: [],
  conversations: [],
  conversationsCombined: [],
  loading: false,
  error: null,
  tableFiltersConversations: {
    pageNumber: 1,
    pageSize: 20,
  },
  //  
  customerId: '',
  conversation: {},
  cCombined: {},
  cLoading: false,
  cError: null,
  //
  messages: [],
  tableFiltersMessages: {
    pageSize: 20,
  },
  mTotalPages: 0,
  mLoading: false,
  mIsEnd: false,
  addTop: false,
  // Fast Message
  fastMessageSearchQuery: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setFastMessageSearchQuery: (state, action) => {
      state.fastMessageSearchQuery = action.payload;
    },
    setTableFiltersMessages: (state, action) => {
      state.tableFiltersMessages = {
        ...state.tableFiltersMessages,
        ...action.payload,
      };
    },
    resetChatSelected: (state) => {
      state.messages = [];
      state.tableFiltersMessages = initialState.tableFiltersMessages;
      state.mIsEnd = false;
    },
    addNewMessageSocket: (state, action) => {
      if (action.payload?.assignee?.id === 'admin') {
        // Only add the message if we're in the same conversation
        if (state.conversation?.id === action.payload.conversationId) {
          state.messages.push(action.payload);
        }

        // Update the conversation list to show the latest message
        const conversationIndex = state.conversationsCombined.findIndex(
          conversation => conversation.id === action.payload.conversationId
        );

        if (conversationIndex !== -1) {
          const conversation = state.conversationsCombined[conversationIndex];

          // Remove the conversation from its current position
          state.conversationsCombined.splice(conversationIndex, 1);

          // Add it back at the top of the list with updated latest message
          state.conversationsCombined.unshift({
            ...conversation,
            unreadCount:
              state.conversation?.id === action.payload.conversationId
                ? 0
                : conversation.unreadCount + 1,
            latestMessage: action.payload
          });
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // getConversationsAsync
      .addCase(getConversationsAsync.pending, (state) => {
        state.conversations = [];
        state.customerIds = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversationsAsync.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.customerIds = action.payload.map((conversation) => conversation.customerId);
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversationsAsync.rejected, (state, action) => {
        state.conversations = [];
        state.customerIds = [];
        state.loading = false;
        state.error = action.error;
      })

      // getAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.conversationsCombined = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.conversationsCombined = state.conversations.map((conversation) => {
          const customer = action.payload.items.find((user) => user.id === conversation.customerId);
          return {
            ...conversation,
            customer,
          };
        });
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.conversationsCombined = [];
        state.loading = false;
        state.error = action.error;
      })

      // getConversationByIdAsync
      .addCase(getConversationByIdAsync.pending, (state) => {
        state.customerId = '';
        state.conversation = {};
        state.cLoading = true;
        state.cError = null;
      })
      .addCase(getConversationByIdAsync.fulfilled, (state, action) => {
        state.customerId = action.payload.customerId;
        state.conversation = action.payload;
        state.cLoading = false;
        state.cError = null;
      })
      .addCase(getConversationByIdAsync.rejected, (state, action) => {
        state.customerId = '';
        state.conversation = {};
        state.cLoading = false;
        state.cError = action.error;
      })

      // getUserByIdAsync
      .addCase(getUserByIdAsync.pending, (state) => {
        state.cCombined = {};
        state.cLoading = true;
        state.cError = null;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action) => {
        state.cCombined = {
          ...state.conversation,
          customer: action.payload,
        };
        state.cLoading = false;
        state.cError = null;
      })
      .addCase(getUserByIdAsync.rejected, (state, action) => {
        state.cCombined = {};
        state.cLoading = false;
        state.cError = action.error;
      })

      // getMessagesAsync
      .addCase(getMessagesAsync.pending, (state) => {
        state.mLoading = true;
      }).addCase(getMessagesAsync.fulfilled, (state, action) => {
        state.messages.unshift(...action.payload.messages);
        state.mLoading = false;

        state.addTop = !state.addTop;

        if (action.payload.count <= state.tableFiltersMessages.pageSize) {
          state.mIsEnd = true;
        }

        if (action.payload.messages.length === 0) {
          state.mIsEnd = true;
        }
      })

      // updateConversationReadAsync
      .addCase(updateConversationReadAsync.fulfilled, (state, action) => {
        const conversationId = action.payload.conversationRead.conversation.id;
        const conversation = state.conversationsCombined.find(
          conv => conv.id === conversationId
        );

        if (conversation) {
          conversation.unreadCount = 0;
        }
      })

      // createMessageAsync
      .addCase(createMessageAsync.fulfilled, (state, action) => {
        state.messages.push(action.payload);

        const conversationIndex = state.conversationsCombined.findIndex(
          conversation => conversation.id === action.payload.conversationId
        );

        if (conversationIndex !== -1) {
          const conversation = state.conversationsCombined[conversationIndex];

          state.conversationsCombined.splice(conversationIndex, 1);

          state.conversationsCombined.unshift({
            ...conversation,
            latestMessage: action.payload
          });
        }
      })
      ;
  },
});

export const
  {
    setTableFiltersMessages,
    resetChatSelected,
    addNewMessageSocket,
    setFastMessageSearchQuery,
  }
    = chatSlice.actions;

export const selectChat = (state) => state.chat;

export default chatSlice.reducer;
