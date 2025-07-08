import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET } from "../axios";

export const getDashboardSummary = createAsyncThunk(
  'dashboard/getDashboardSummary',
  async (params) => {
    const response = await GET(`/dashboard/summary`, { params });
    return response.data;
  }
);

export const getDashboardRevenue = createAsyncThunk(
  'dashboard/getDashboardRevenue',
  async (params) => {
    const response = await GET(`/dashboard/revenue`, { params });
    return response.data;
  }
);

export const getDashboardProfit = createAsyncThunk(
  'dashboard/getDashboardProfit',
  async (params) => {
    const response = await GET(`/dashboard/profit`, { params });
    return response.data;
  }
);

export const getDashboardCustomers = createAsyncThunk(
  'dashboard/getDashboardCustomers',
  async (params) => {
    const response = await GET(`/dashboard/customers`, { params });
    return response.data;
  }
);

export const getDashboardInventory = createAsyncThunk(
  'dashboard/getDashboardInventory',
  async (params) => {
    const response = await GET(`/dashboard/inventory`, { params });
    return response.data;
  }
);

export const getDashboardOrders = createAsyncThunk(
  'dashboard/getDashboardOrders',
  async (params) => {
    const response = await GET(`/dashboard/orders`, { params });
    return response.data;
  }
);

export const getDashboardTopProducts = createAsyncThunk(
  'dashboard/getDashboardTopProducts',
  async (params) => {
    const response = await GET(`/dashboard/top-products`, { params });
    return response.data;
  }
);

export const getDashboardSalesByProductTypes = createAsyncThunk(
  'dashboard/getDashboardSalesByProductTypes',
  async (params) => {
    const response = await GET(`/dashboard/sales-by-product-types`, { params });
    return response.data;
  }
);

export const getDashboardKpis = createAsyncThunk(
  'dashboard/getDashboardKpis',
  async (params) => {
    const response = await GET(`/dashboard/kpis`, { params });
    return response.data;
  }
);