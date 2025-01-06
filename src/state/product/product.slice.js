import { createSlice } from "@reduxjs/toolkit";

import { getProductTypeAttributesAsync } from "src/services/product-type/product-type.service";
import { getProductAsync, createProductAsync, getProductRatingsAsync, getProductOptionsAsync } from "src/services/product/product.service";

const initialState = {
    product: null,
    ratings: null,
    productError: null,
    products: null,
    createUpdateProductPage: {
        attributes: [],
        variants: [],
        variantsRender: [],
    },
    updateProductPage: {
        product: null,
    }
};

const productSlice = createSlice({
    name: 'product',
    initialState,
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
                state.createUpdateProductPage.attributes = action.payload;
            })
            .addCase(getProductOptionsAsync.fulfilled, (state, action) => {
                state.createUpdateProductPage.variants = action.payload.items;
                state.createUpdateProductPage.variantsRender =
                    action.payload.items.map((item) => ({
                        ...item,
                        values: item.values.map((value) => value.value),
                    }));
            });
    },
});

export const selectProduct = (state) => state.product;

export default productSlice.reducer;
