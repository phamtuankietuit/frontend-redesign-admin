import { createSlice } from "@reduxjs/toolkit";

import { getProductAsync, getProductRatingsAsync } from "src/services/product/product.service";

const initialState = {
    product: null,
    ratings: null,
    productError: null,
    products: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getProductAsync.fulfilled, (state, action) => {
                state.product = action.payload;
            })
            .addCase(getProductAsync.rejected, (state, action) => {
                state.productError = action.error;
            })
            .addCase(getProductRatingsAsync.fulfilled, (state, action) => {
                state.ratings = action.payload;
            })
            .addCase(getProductRatingsAsync.rejected, (state, action) => {
                state.productError = action.error;
            });
    },
});

export const selectProduct = (state) => state.product;

export default productSlice.reducer;
