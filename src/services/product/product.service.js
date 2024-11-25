import { createAsyncThunk } from "@reduxjs/toolkit";

import { GET } from "../axios";

export const getProductAsync = createAsyncThunk(
    'product/getProductAsync',
    async (id) => {
        const response = await GET(`/products/${id}`);
        return response.data;
    }
);

export const getProductRatingsAsync = createAsyncThunk(
    'product/getProductRatingsAsync',
    async (params) => {
        const response = await GET(`/products/${params.productId}/ratings`, { params });
        return response.data;
    }
);
