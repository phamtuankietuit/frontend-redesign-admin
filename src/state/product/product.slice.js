import { createSlice } from "@reduxjs/toolkit";

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
        sortBy: 'CreationTime',
        sortDirection: 'desc',
        isActive: undefined,
        productTypeIds: undefined,
    },
    selectedRowIds: [],
    isActiveObject: null,
    productType: null,
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
        resetProduct: (state) => {
            state.updateProductPage = initialState.updateProductPage;
        },
        resetTableFilters: (state) => {
            state.tableFilters = initialState.tableFilters;
            state.isActiveObject = null;
            state.productType = null;
        },
        setTableFilters: (state, action) => {
            state.tableFilters = {
                ...state.tableFilters,
                ...action.payload,
            };
        },
        setIsActiveObject: (state, action) => {
            state.isActiveObject = action.payload;
            const payloadId = action.payload?.id;
            let isActiveValue;
            if (payloadId === 'true') {
                isActiveValue = true;
            } else if (payloadId === 'false') {
                isActiveValue = false;
            } else {
                isActiveValue = undefined;
            }
            state.tableFilters.isActive = isActiveValue;
            state.tableFilters.pageNumber = 1;
        },
        setProductType: (state, action) => {
            state.productType = action.payload;
            state.tableFilters.productTypeIds = action.payload?.id;
            state.tableFilters.pageNumber = 1;
        },
        onSelectAllRows: (state, action) => {
            if (action.payload.checked) {
                state.selectedRowIds = action.payload.inputValue;
            } else {
                state.selectedRowIds = [];
            }
        },
        onSelectRow: (state, action) => {
            const inputValue = action.payload;
            const newSelected = state.selectedRowIds.includes(inputValue)
                ? state.selectedRowIds.filter((value) => value !== inputValue)
                : [...state.selectedRowIds, inputValue];
            state.selectedRowIds = newSelected;
        }
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

            // 
            .addCase(getProductsAsync.pending, (state) => {
                state.products = [];
                state.totalCount = 0;
                state.selectedRowIds = [];
                state.productsLoading = true;
            })
            .addCase(getProductsAsync.fulfilled, (state, action) => {
                state.products = action.payload.items;
                state.totalCount = action.payload.totalCount;
                state.selectedRowIds = [];
                state.productsLoading = false;
            })
            .addCase(getProductsAsync.rejected, (state) => {
                state.products = [];
                state.totalCount = 0;
                state.selectedRowIds = [];
                state.productsLoading = false;
            })
            ;
    },
});

export const {
    resetTableFilters,
    setTableFilters,
    resetSelectedRowIds,
    setSelectedRowIds,
    setIsActiveObject,
    setProductType,
    onSelectAllRows,
    onSelectRow,
    resetProduct,
} = productSlice.actions;

export const selectProduct = (state) => state.product;

export default productSlice.reducer;
