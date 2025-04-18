import { createSlice } from "@reduxjs/toolkit";
import { set } from "nprogress";

import { getProductTypeAttributesAsync } from "src/services/product-type/product-type.service";
import { getProductAsync, getProductsAsync, createProductAsync, getProductRatingsAsync, getProductOptionsAsync } from "src/services/product/product.service";

const initialState = {
    product: null,
    ratings: null,
    productError: null,
    // 
    products: [],
    productsLoading: false,
    totalCount: 0,
    tableFilters: {
        pageNumber: 1,
        pageSize: 10,
        searchQuery: '',
        sortBy: undefined,
        sortDirection: undefined,
    },
    selectedRowIds: [],
    // 
    createProductPage: {
        attributes: [],
        variantsRender: [],
        variants: [],
    },
    updateProductPage: {
        product: null,
        variantsRender: []
    }
};

const productSlice = createSlice({
    name: 'product',
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
        resetSelectedRowIds: (state) => {
            state.selectedRowIds = initialState.selectedRowIds;
        },
        setSelectedRowIds: (state, action) => {
            state.selectedRowIds = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductAsync.fulfilled, (state, action) => {
                state.product = action.payload;
                state.updateProductPage.product = action.payload;
            })
            .addCase(getProductAsync.rejected, (state, action) => {
                state.productError = action.error;
            })
            .addCase(getProductRatingsAsync.fulfilled, (state, action) => {
                state.ratings = action.payload;
            })
            .addCase(getProductRatingsAsync.rejected, (state, action) => {
                state.productError = action.error;
            })
            .addCase(createProductAsync.fulfilled, (state, action) => {
                state.updateProductPage.product = action.payload;
            })
            .addCase(getProductTypeAttributesAsync.fulfilled, (state, action) => {
                state.createProductPage.attributes = action.payload;
            })
            .addCase(getProductOptionsAsync.fulfilled, (state, action) => {
                state.updateProductPage.variantsRender = action.payload.items;
            })
            .addCase(getProductsAsync.fulfilled, (state, action) => {
                state.products = action.payload.items;
                state.totalCount = action.payload.totalCount;
                state.selectedRowIds = initialState.selectedRowIds;
                state.productsLoading = false;
            })
            .addCase(getProductsAsync.pending, (state) => {
                state.productsLoading = true;
            });
    },
});

export const { resetTableFilters, setTableFilters, resetSelectedRowIds, setSelectedRowIds } = productSlice.actions;

export const selectProduct = (state) => state.product;

export default productSlice.reducer;
