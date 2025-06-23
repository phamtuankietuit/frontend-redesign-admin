import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT, DELETE, PATCH } from "../axios";

export const getBannersAsync = createAsyncThunk(
  'banner/getBannersAsync',
  async (params) => {
    const response = await GET(`/banners`, { params });
    return response.data;
  }
);

export const getBannerByIdAsync = createAsyncThunk(
  'banner/getBannerByIdAsync',
  async (id) => {
    const response = await GET(`/banners/${id}`);
    return response.data;
  }
);

export const createBannerAsync = createAsyncThunk(
  'banner/createBannerAsync',
  async (body) => {
    const response = await POST(`/banners`, body);
    return response.data;
  }
);

export const updateBannerAsync = createAsyncThunk(
  'banner/updateBannerAsync',
  async ({ id, body }) => {
    const response = await PUT(`/banners/${id}`, body);
    return response.data;
  }
);

export const deleteBannerAsync = createAsyncThunk(
  'banner/deleteBannerAsync',
  async (id) => {
    const response = await DELETE(`/banners/${id}`);
    return response.data;
  }
);

export const toggleBannerStatusAsync = createAsyncThunk(
  'banner/toggleBannerStatusAsync',
  async (id) => {
    const response = await PATCH(`/banners/${id}/toggle-status`);
    return response.data;
  }
);
