import { createAsyncThunk } from "@reduxjs/toolkit";

import { GET } from "../axios";

export const getProductTypesAsync = createAsyncThunk(
  'productType/getProductTypesAsync',
  async () => {
    const response = await GET(`/product-types`);
    return response.data.listItem;
  }
);

export const getProductTypesFlattenAsync = createAsyncThunk(
  'productType/getProductTypesFlattenAsync',
  async () => {
    const response = await GET(`/product-types`, { params: { Flatten: true } });
    return response.data.listItem;
  }
);

export const getProductTypeAttributesAsync = createAsyncThunk(
  'productType/getProductTypeAttributesAsync',
  async (id) => {
    const response = await GET(`/product-types/${id}/attributes`);
    return response.data.listAttributes;
  }
);

export const getProductTypeByIdAsync = createAsyncThunk(
  'productType/getProductTypeByIdAsync',
  async ({ id, params }) => {
    const response = await GET(`/product-types/${id}`, { params });
    return response.data.listItem;
  }
);