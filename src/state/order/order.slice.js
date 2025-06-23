import { createSlice } from "@reduxjs/toolkit";

import { getOrderByIdAsync, getOrdersAsync } from "src/services/order/order.service";

const initialState = {
  orders: [],
  loading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'CreationTime',
    sortDirection: 'desc',
    fromDate: null,
    toDate: null,
    orderStatuses: 'all',
  },
  // 
  statusObj: null,
  // 
  order: null,
  orderLoading: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setTableFilters: (state, action) => {
      state.tableFilters = {
        ...state.tableFilters,
        ...action.payload,
      };
    },
    resetTableFilters: (state) => {
      state.tableFilters = initialState.tableFilters;
      state.statusObj = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(getOrdersAsync.pending, (state) => {
        state.orders = [];
        state.totalCount = 0;
        state.loading = true;
      })
      .addCase(getOrdersAsync.fulfilled, (state, action) => {
        state.orders = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(getOrdersAsync.rejected, (state) => {
        state.orders = [];
        state.totalCount = 0;
        state.loading = false;
      })

      // order
      .addCase(getOrderByIdAsync.pending, (state) => {
        state.order = null;
        state.orderLoading = true;
      })
      .addCase(getOrderByIdAsync.fulfilled, (state, action) => {
        state.order = action.payload;
        state.orderLoading = false;
      })
      .addCase(getOrderByIdAsync.rejected, (state) => {
        state.order = null;
        state.orderLoading = false;
      });
    ;
  },
});

export const { setTableFilters, setOrder, resetTableFilters } = orderSlice.actions;

export const selectOrder = (state) => state.order;

export default orderSlice.reducer;
