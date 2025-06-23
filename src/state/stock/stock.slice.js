import { createSlice } from "@reduxjs/toolkit";

import { getProductAsync, getProductOptionsAsync, getProductsAsync, } from "src/services/product/product.service";

const initialState = {
  products: [],
  loading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'CreationTime',
    sortDirection: 'desc',
    productTypeIds: undefined,
    warehouseId: undefined,
  },
  productType: null,
  warehouse: null,
  // 
  product: null,
  productLoading: false,
  variantsRender: [],
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    resetTableFilters: (state) => {
      state.tableFilters = initialState.tableFilters;
      state.productType = null;
      state.warehouse = null;
    },
    setTableFilters: (state, action) => {
      state.tableFilters = {
        ...state.tableFilters,
        ...action.payload,
      };
    },
    setProductType: (state, action) => {
      state.productType = action.payload;
      state.tableFilters.productTypeIds = [action.payload?.id];
      state.tableFilters.pageNumber = 1;
    },
    setWarehouse: (state, action) => {
      state.warehouse = action.payload;
      state.tableFilters.warehouseId = action.payload?.id;
      state.tableFilters.pageNumber = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(getProductsAsync.pending, (state) => {
        state.products = [];
        state.totalCount = 0;
        state.loading = true;
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(getProductsAsync.rejected, (state) => {
        state.products = [];
        state.totalCount = 0;
        state.loading = false;
      })

      // item 
      .addCase(getProductAsync.pending, (state) => {
        state.product = null;
        state.productLoading = true;
      })
      .addCase(getProductAsync.fulfilled, (state, action) => {
        state.product = action.payload;
        state.productLoading = false;
      })
      .addCase(getProductAsync.rejected, (state) => {
        state.product = null;
        state.productLoading = false;
      })
      .addCase(getProductOptionsAsync.fulfilled, (state, action) => {
        state.variantsRender = action.payload.items;
      })

      ;
  },
});

export const {
  resetTableFilters,
  setTableFilters,
  setProductType,
  setWarehouse,
} = stockSlice.actions;

export const selectStock = (state) => state.stock;

export default stockSlice.reducer;
