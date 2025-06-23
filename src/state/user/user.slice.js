import { createSlice } from "@reduxjs/toolkit";
import { getUserByIdAsync, getUsersAsync, getUserStatusSummaryAsync } from "src/services/user/user.service";

const initialState = {
  users: [],
  loading: false,
  totalCount: 0,
  selectedUsers: [],
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'CreationTime',
    sortDirection: 'desc',
    status: 'all',
    customerTypeId: undefined,
  },
  statusSummary: {
    totalCount: 0,
    activeCount: 0,
    verifiedCount: 0,
    unverifiedCount: 0,
    inactiveCount: 0,
    suspendedCount: 0,
    blockedCount: 0
  },
  customerType: null,
  // 
  user: null,
  userLoading: false,
  userError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetTableFilters: (state) => {
      state.tableFilters = initialState.tableFilters;
      state.customerType = null;
    },
    setTableFilters: (state, action) => {
      state.tableFilters = {
        ...state.tableFilters,
        ...action.payload,
      };
    },
    setCustomerType: (state, action) => {
      state.customerType = action.payload;
      state.tableFilters.customerTypeId = action.payload?.id;
      state.tableFilters.pageNumber = 1;
    },
    onSelectAllRows: (state, action) => {
      if (action.payload.checked) {
        state.selectedUsers = action.payload.inputValue;
      } else {
        state.selectedUsers = [];
      }
    },
    onSelectRow: (state, action) => {
      const inputValue = action.payload;
      const newSelected = state.selectedUsers.includes(inputValue)
        ? state.selectedUsers.filter((value) => value !== inputValue)
        : [...state.selectedUsers, inputValue];
      state.selectedUsers = newSelected;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAsync.pending, (state) => {
        state.users = [];
        state.loading = true;
        state.totalCount = 0;
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.users = action.payload.items;
        state.loading = false;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getUsersAsync.rejected, (state) => {
        state.users = [];
        state.loading = false;
        state.totalCount = 0;
      })

      //
      .addCase(getUserByIdAsync.pending, (state) => {
        state.user = null;
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userLoading = false;
        state.userError = null;
      })
      .addCase(getUserByIdAsync.rejected, (state, action) => {
        state.user = null;
        state.userLoading = false;
        state.userError = action.error.message || 'Failed to fetch user data';
      })

      // 
      .addCase(getUserStatusSummaryAsync.fulfilled, (state, action) => {
        state.statusSummary = action.payload;
      })
      ;
  },
});

export const
  {
    setTableFilters,
    resetTableFilters,
    onSelectAllRows,
    onSelectRow,
    setCustomerType
  } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
