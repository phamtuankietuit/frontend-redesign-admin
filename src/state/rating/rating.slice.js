import { createSlice } from "@reduxjs/toolkit";
import { getRatingByIdAsync, getRatingsAsync } from "src/services/rating/rating.service";

export const initialState = {
  ratings: [],
  loading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'CreationTime',
    sortDirection: 'desc',
    productId: undefined,
    customerId: undefined,
    ratingValue: undefined,
    status: undefined,
  },
  starObj: null,
  commentStatusObj: null,
  // 
  rating: null,
  ratingLoading: false,
};

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    setStarObj: (state, action) => {
      state.starObj = action.payload;
      state.tableFilters.ratingValue = action.payload?.id;
      state.tableFilters.pageNumber = 1;
    },
    setCommentStatusObj: (state, action) => {
      state.commentStatusObj = action.payload;
      state.tableFilters.status = action.payload?.id;
      state.tableFilters.pageNumber = 1;
    },
    resetTableFilters: (state) => {
      state.tableFilters = initialState.tableFilters;
      state.starObj = null;
      state.commentStatusObj = null;
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
      // list
      .addCase(getRatingsAsync.pending, (state) => {
        state.ratings = [];
        state.loading = true;
        state.totalCount = 0;
      })
      .addCase(getRatingsAsync.fulfilled, (state, action) => {
        state.ratings = action.payload.items;
        state.loading = false;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getRatingsAsync.rejected, (state) => {
        state.ratings = [];
        state.loading = false;
        state.totalCount = 0;
      })

      // rating details
      .addCase(getRatingByIdAsync.pending, (state) => {
        state.rating = null;
        state.ratingLoading = true;
      })
      .addCase(getRatingByIdAsync.fulfilled, (state, action) => {
        state.rating = action.payload;
        state.ratingLoading = false;
      })
      .addCase(getRatingByIdAsync.rejected, (state) => {
        state.rating = null;
        state.ratingLoading = false;
      })
      ;
  },
});

export const { resetTableFilters, setTableFilters, setStarObj, setCommentStatusObj } = ratingSlice.actions;

export const selectRating = (state) => state.rating;

export default ratingSlice.reducer;
