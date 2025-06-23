import { createAsyncThunk } from "@reduxjs/toolkit";

import { GET, PUT, POST, DELETE } from "../axios";

export const getProductAsync = createAsyncThunk(
    'product/getProductAsync',
    async (id) => {
        const response = await GET(`/products/${id}`);
        return response.data;
    }
);

export const getProductsAsync = createAsyncThunk(
    'product/getProductsAsync',
    async (body) => {
        const response = await POST(`/products/list`, body);
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

export const createProductAsync = createAsyncThunk(
    'product/createProductAsync',
    async (body) => {
        const response = await POST(`/products`, body);
        return response.data;
    }
);

export const getProductOptionsAsync = createAsyncThunk(
    'product/getProductOptionsAsync',
    async (id) => {
        const response = await GET(`/products/${id}/options`);
        return response.data;
    }
);

export const updateProductAsync = createAsyncThunk(
    'product/updateProductAsync',
    async ({ id, body }, { rejectWithValue }) => {
        try {
            const response = await PUT(`/products/${id}`, body);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteProductByIdAsync = createAsyncThunk(
    'product/deleteProductByIdAsync',
    async (id) => {
        const response = await DELETE(`/products/${id}`);
        return response.data;
    }
);
