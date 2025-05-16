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
};

const fastMessageSlice = createSlice({
  name: 'fastMessage',
  initialState,
  reducers: {
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

export const { setTableFilters, setFastMessage } = fastMessageSlice.actions;

export const selectFastMessage = (state) => state.fastMessage;

export default fastMessageSlice.reducer;
