import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, PUT } from "../axios";

export const getCustomerTypesAsync = createAsyncThunk(
  'customerType/getCustomerTypesAsync',
  async (params) => {
    const response = await GET(`/customer-types`, { params });
    return response.data;
  }
);

export const updateCustomerTypeAsync = createAsyncThunk(
  'customerType/updateCustomerTypeAsync',
  async ({ id, body }) => {
    const response = await PUT(`/customer-types/${id}`, body);
    return response.data;
  }
);