import { createSlice } from "@reduxjs/toolkit";
import {
  getPromotionsAsync,
  getPromotionByIdAsync,
  createPromotionAsync,
  updatePromotionAsync,
  deletePromotionAsync,
  updatePromotionActionAsync
} from "src/services/promotion/promotion.service";

export const initialState = {
  promotions: [],
  loading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'CreationTime',
    sortDirection: 'desc',
    status: undefined,
    voucherType: undefined,
    valueType: undefined,
    applyToProductTypeId: undefined,
    startTimeFrom: undefined,
    startTimeTo: undefined,
    endTimeFrom: undefined,
    endTimeTo: undefined,
    minValue: undefined,
    maxValue: undefined,
    startDate: undefined,
    endDate: undefined,
  },
  statusObj: null,
  voucherTypeObj: null,
  valueTypeObj: null,
  // 
  promotion: null,
  promotionLoading: false,
};

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    resetPromotion: (state) => {
      state.promotion = null;
      state.promotionLoading = false;
    },
    setStatusObj: (state, action) => {
      state.statusObj = action.payload;
      state.tableFilters.status = action.payload?.value;
      state.tableFilters.pageNumber = 1;
    },
    setVoucherTypeObj: (state, action) => {
      state.voucherTypeObj = action.payload;
      state.tableFilters.voucherType = action.payload?.value;
      state.tableFilters.pageNumber = 1;
    },
    setValueTypeObj: (state, action) => {
      state.valueTypeObj = action.payload;
      state.tableFilters.valueType = action.payload?.value;
      state.tableFilters.pageNumber = 1;
    },
    resetTableFilters: (state) => {
      state.tableFilters = initialState.tableFilters;
      state.statusObj = null;
      state.voucherTypeObj = null;
      state.valueTypeObj = null;
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
      .addCase(getPromotionsAsync.pending, (state) => {
        state.promotions = [];
        state.loading = true;
        state.totalCount = 0;
      })
      .addCase(getPromotionsAsync.fulfilled, (state, action) => {
        state.promotions = action.payload.items;
        state.loading = false;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getPromotionsAsync.rejected, (state) => {
        state.promotions = [];
        state.loading = false;
        state.totalCount = 0;
      })

      // promotion details
      .addCase(getPromotionByIdAsync.pending, (state) => {
        state.promotion = null;
        state.promotionLoading = true;
      })
      .addCase(getPromotionByIdAsync.fulfilled, (state, action) => {
        state.promotion = action.payload;
        state.promotionLoading = false;
      })
      .addCase(getPromotionByIdAsync.rejected, (state) => {
        state.promotion = null;
        state.promotionLoading = false;
      })

      // create promotion
      .addCase(createPromotionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPromotionAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPromotionAsync.rejected, (state) => {
        state.loading = false;
      })

      // update promotion
      .addCase(updatePromotionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePromotionAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePromotionAsync.rejected, (state) => {
        state.loading = false;
      })

      // delete promotion
      .addCase(deletePromotionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePromotionAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePromotionAsync.rejected, (state) => {
        state.loading = false;
      })

      // update promotion action
      .addCase(updatePromotionActionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePromotionActionAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePromotionActionAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  resetTableFilters,
  setTableFilters,
  setStatusObj,
  setVoucherTypeObj,
  setValueTypeObj,
  resetPromotion
} = promotionSlice.actions;

export const selectPromotion = (state) => state.promotion;

export default promotionSlice.reducer;
