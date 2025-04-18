import { createSlice } from "@reduxjs/toolkit";

import { transformProductTypes } from "src/utils/helper";

import { getProductTypesAsync, getProductTypesFlattenAsync } from "src/services/product-type/product-type.service";

const initialState = {
  productTypes: [],
  productTypesFlatten: [],
  treeView: {
    items: []
  },
  formMode: 'new'
};

const productTypeSlice = createSlice({
  name: 'productType',
  initialState,
  reducers: {
    setFormMode: (state, action) => {
      state.formMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductTypesAsync.fulfilled, (state, action) => {
        state.productTypes = action.payload;
      })
      .addCase(getProductTypesFlattenAsync.fulfilled, (state, action) => {
        state.productTypesFlatten = action.payload;
        state.treeView.items = transformProductTypes(action.payload);
      });
  },
});

export const { setFormMode } = productTypeSlice.actions;

export const selectProductType = (state) => state.productType;

export default productTypeSlice.reducer;
