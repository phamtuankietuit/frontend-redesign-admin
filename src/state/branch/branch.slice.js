import { createSlice } from "@reduxjs/toolkit";

import { getBranchesAsync } from "src/services/branch/branch.service";

const initialState = {
  branches: [],
  branchesLoading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'Name',
    sortDirection: 'asc',
    isDeleted: undefined,
    isDefault: undefined,
  },
  // 
  branch: null,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranch: (state, action) => {
      state.branch = action.payload;
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
      .addCase(getBranchesAsync.pending, (state) => {
        state.branchesLoading = true;
      })
      .addCase(getBranchesAsync.fulfilled, (state, action) => {
        state.branches = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.branchesLoading = false;
      })
      .addCase(getBranchesAsync.rejected, (state) => {
        state.branches = [];
        state.totalCount = 0;
        state.branchesLoading = false;
      });
  },
});

export const { setTableFilters, setBranch } = branchSlice.actions;

export const selectBranch = (state) => state.branch;

export default branchSlice.reducer;
