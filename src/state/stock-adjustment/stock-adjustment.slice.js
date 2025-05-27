import { createSlice } from "@reduxjs/toolkit";
import { set } from "nprogress";

import { getBranchesAsync } from "src/services/branch/branch.service";
import { getProductsAsync } from "src/services/product/product.service";
import {
  getStockAdjustmentByIdAsync,
  getStockAdjustmentsAsync,
  getStockAdjustmentSummaryAsync,
  updateStockAdjustmentAsync
} from "src/services/stock-adjustment/stock-adjustment.service";

const initialState = {
  summary: {},
  stockAdjustments: [],
  loading: false,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    warehouseId: undefined,
    sortBy: 'Code',
    sortDirection: 'asc',
    isDeleted: undefined,
    transactionStatus: 'all',
    transactionDateFrom: undefined,
    transactionDateTo: undefined,
  },
  totalCount: 0,
  warehouse: null,
  // 
  createEditPage: {
    branches: [],
    branchesTableFilters: {
      pageNumber: 1,
      pageSize: 999,
      searchQuery: '',
      sortBy: 'Name',
      sortDirection: 'asc',
      isDeleted: undefined,
      isDefault: undefined,
    },
    products: [],
    productsLoading: false,
    productsTableFilters: {
      pageNumber: 1,
      pageSize: 10,
      searchQuery: '',
    },
    productsTotalCount: 0,
    isProductsEnd: false,
    // 
    currentStockAdjustment: null,
  }
};

const stockAdjustmentSlice = createSlice({
  name: 'stockAdjustment',
  initialState,
  reducers: {
    setWarehouse: (state, action) => {
      state.warehouse = action.payload;
      state.tableFilters.warehouseId = action.payload?.id;
      state.tableFilters.pageNumber = 1;
    },
    resetTableFilters: (state) => {
      state.tableFilters = initialState.tableFilters;
      state.warehouse = null;
    },
    setTableFilters: (state, action) => {
      state.tableFilters = {
        ...state.tableFilters,
        ...action.payload,
      };
    },
    setProductsTableFilters: (state, action) => {
      state.createEditPage.productsTableFilters = {
        ...state.createEditPage.productsTableFilters,
        ...action.payload,
      };
    },
    appendProducts: (state, action) => {
      state.createEditPage.products = [
        ...state.createEditPage.products,
        ...action.payload,
      ];
    },
    setProducts: (state, action) => {
      state.createEditPage.products = action.payload;
    },
    setCurrentStockAdjustment: (state, action) => {
      state.createEditPage.currentStockAdjustment = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBranchesAsync.fulfilled, (state, action) => {
        state.createEditPage.branches = action.payload.items;
      })

      .addCase(getProductsAsync.pending, (state) => {
        state.createEditPage.productsLoading = true;
        state.createEditPage.products = [];
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.createEditPage.productsTotalCount = action.payload.totalCount;
        state.createEditPage.productsLoading = false;

        if (action.payload.items.length === 0) {
          state.createEditPage.isProductsEnd = true;
        }
      })
      // 
      .addCase(getStockAdjustmentByIdAsync.fulfilled, (state, action) => {
        state.createEditPage.currentStockAdjustment = action.payload;
      })

      //
      .addCase(updateStockAdjustmentAsync.fulfilled, (state, action) => {
        state.createEditPage.currentStockAdjustment = action.payload;
      })

      // 
      .addCase(getStockAdjustmentSummaryAsync.fulfilled, (state, action) => {
        state.summary = action.payload;
      })

      // list
      .addCase(getStockAdjustmentsAsync.pending, (state) => {
        state.loading = true;
        state.stockAdjustments = [];
      })
      .addCase(getStockAdjustmentsAsync.fulfilled, (state, action) => {
        state.stockAdjustments = action.payload.items;
        state.loading = false;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getStockAdjustmentsAsync.rejected, (state) => {
        state.loading = false;
        state.stockAdjustments = [];
      })
      ;
  },
});

export const {
  setProductsTableFilters,
  appendProducts,
  setProducts,
  setCurrentStockAdjustment,
  setTableFilters,
  resetTableFilters,
  setWarehouse,
} = stockAdjustmentSlice.actions;

export const selectStockAdjustment = (state) => state.stockAdjustment;

export default stockAdjustmentSlice.reducer;
