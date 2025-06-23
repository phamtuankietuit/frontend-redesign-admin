import { createSlice } from "@reduxjs/toolkit";
import { getCustomerTypesAsync } from "src/services/customer-type/customer-type.service";

const initialState = {
  customerTypes: [],
  loading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'CreationTime',
    sortDirection: 'desc',
  },
  //
  customerType: null,
};

const customerTypeSlice = createSlice({
  name: 'customerType',
  initialState,
  reducers: {
    resetTableFilters: (state) => {
      state.tableFilters = initialState.tableFilters;
    },
    setTableFilters: (state, action) => {
      state.tableFilters = {
        ...state.tableFilters,
        ...action.payload,
      };
    },
    setCustomerType: (state, action) => {
      state.customerType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerTypesAsync.pending, (state) => {
        state.customerTypes = [];
        state.loading = true;
        state.totalCount = 0;
      })
      .addCase(getCustomerTypesAsync.fulfilled, (state, action) => {
        state.customerTypes = action.payload.items;
        state.loading = false;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getCustomerTypesAsync.rejected, (state) => {
        state.customerTypes = [];
        state.loading = false;
        state.totalCount = 0;
      })
      ;
  },
});

export const { setTableFilters, resetTableFilters, setCustomerType } = customerTypeSlice.actions;

export const selectCustomerType = (state) => state.customerType;

export default customerTypeSlice.reducer;
