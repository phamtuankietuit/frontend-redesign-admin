import { createAsyncThunk } from "@reduxjs/toolkit";

import { GET, POST, PUT } from "../axios";

export const createStockAdjustmentAsync = createAsyncThunk(
  'stockAdjustment/createStockAdjustmentAsync',
  async (body) => {
    const response = await POST(`/stock-adjustments`, body);
    return response.data;
  }
);

export const getStockAdjustmentByIdAsync = createAsyncThunk(
  'stockAdjustment/getStockAdjustmentByIdAsync',
  async (id) => {
    const response = await GET(`/stock-adjustments/${id}`);
    return response.data;
  }
);

export const updateStockAdjustmentAsync = createAsyncThunk(
  'stockAdjustment/updateStockAdjustmentAsync',
  async ({ id, body }) => {
    const response = await PUT(`/stock-adjustments/${id}`, body);
    return response.data;
  }
);

export const getStockAdjustmentSummaryAsync = createAsyncThunk(
  'stockAdjustment/getStockAdjustmentSummaryAsync',
  async () => {
    const response = await GET(`/stock-adjustments/summary`);
    return response.data;
  }
);

export const getStockAdjustmentsAsync = createAsyncThunk(
  'branch/getStockAdjustmentsAsync',
  async (params) => {
    const response = await GET(`/stock-adjustments`, { params });
    return response.data;
  }
);
