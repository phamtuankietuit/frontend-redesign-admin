import { createSlice } from "@reduxjs/toolkit";

import { getFastMessagesAsync } from "src/services/fast-message/fast-message.service";

const initialState = {
  fastMessages: [],
  fastMessagesLoading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'shorthand',
    sortDirection: 'asc',
  },
  // 
  fastMessage: null,
  // 
  top3FastMessages: [],
};

const fastMessageSlice = createSlice({
  name: 'fastMessage',
  initialState,
  reducers: {
    setTop3FastMessages: (state, action) => {
      state.top3FastMessages = action.payload;
    },
    setFastMessage: (state, action) => {
      state.fastMessage = action.payload;
    },
    setTableFilters: (state, action) => {
      state.tableFilters = {
        ...state.tableFilters,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFastMessagesAsync.pending, (state) => {
        state.fastMessages = [];
        state.fastMessagesLoading = true;
      })
      .addCase(getFastMessagesAsync.fulfilled, (state, action) => {
        state.fastMessages = action.payload.fastMessages;
        state.totalCount = action.payload.count;
        state.fastMessagesLoading = false;
      })
      .addCase(getFastMessagesAsync.rejected, (state) => {
        state.fastMessages = [];
        state.totalCount = 0;
        state.fastMessagesLoading = false;
      });
  },
});

export const { setTableFilters, setFastMessage, setTop3FastMessages } = fastMessageSlice.actions;

export const selectFastMessage = (state) => state.fastMessage;

export default fastMessageSlice.reducer;
