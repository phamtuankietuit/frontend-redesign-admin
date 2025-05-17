import { createAsyncThunk } from "@reduxjs/toolkit";

import { GET, PUT, POST, DELETE } from "../axios";

export const getBranchesAsync = createAsyncThunk(
  'branch/getBranchesAsync',
  async (params) => {
    const response = await GET(`/branches`, { params });
    return response.data;
  }
);

export const updateBranchAsync = createAsyncThunk(
  'branch/updateBranchAsync',
  async ({ id, body }) => {
    const response = await PUT(`/branches/${id}`, body);
    return response.data;
  }
);

export const createBranchAsync = createAsyncThunk(
  'branch/createBranchAsync',
  async (body) => {
    const response = await POST(`/branches`, body);
    return response.data;
  }
);

export const deleteBranchAsync = createAsyncThunk(
  'branch/deleteBranchAsync',
  async (id) => {
    const response = await DELETE(`/branches/${id}`);
    return response.data;
  }
);