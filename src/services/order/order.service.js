import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, PATCH } from "../axios";

export const getOrdersAsync = createAsyncThunk(
  'order/getOrdersAsync',
  async (params) => {
    const response = await GET(`/orders`, { params });
    return response.data;
  }
);

export const getOrderByIdAsync = createAsyncThunk(
  'order/getOrderByIdAsync',
  async (id) => {
    const response = await GET(`/orders/${id}`);
    return response.data;
  }
);

export const updateOrderStatusAsync = createAsyncThunk(
  'order/updateOrderStatusAsync',
  async ({ id, body }) => {
    const response = await PATCH(`/orders/${id}/update-status`, body);
    return response.data;
  }
);

export const confirmPackagingCompleteAsync = createAsyncThunk(
  'order/confirmPackagingCompleteAsync',
  async ({ id, body }) => {
    const response = await PATCH(`/orders/${id}/confirm-packaging-complete`, body);
    return response.data;
  }
);

export const selectBranchForPackagingAsync = createAsyncThunk(
  'order/selectBranchForPackagingAsync',
  async ({ id, body }) => {
    const response = await PATCH(`/orders/${id}/select-branch-for-packaging`, body);
    return response.data;
  }
);