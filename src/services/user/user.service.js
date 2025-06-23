import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "../axios";

export const getUsersAsync = createAsyncThunk(
  'user/getUsersAsync',
  async (params) => {
    const response = await GET(`/customers`, { params });
    return response.data;
  }
);

export const getUserByIdAsync = createAsyncThunk(
  'user/getUserByIdAsync',
  async (id) => {
    const response = await GET(`/customers/${id}`);
    return response.data;
  }
);

export const getUserStatusSummaryAsync = createAsyncThunk(
  'user/getUserStatusSummaryAsync',
  async () => {
    const response = await GET(`/customers/status-summary`);
    return response.data;
  }
);


export const blockCustomerAsync = createAsyncThunk(
  'user/blockCustomerAsync',
  async (id) => {
    const response = await POST(`/customers/${id}/block`);
    return response.data;
  }
);

export const unblockCustomerAsync = createAsyncThunk(
  'user/unblockCustomerAsync',
  async (id) => {
    const response = await POST(`/customers/${id}/unblock`);
    return response.data;
  }
);