import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT, DELETE, PATCH } from "../axios";

export const getPromotionsAsync = createAsyncThunk(
  'promotion/getPromotionsAsync',
  async (body) => {
    const response = await POST(`/discount-vouchers/list`, body);
    return response.data;
  }
);

export const getPromotionByIdAsync = createAsyncThunk(
  'promotion/getPromotionByIdAsync',
  async (id) => {
    const response = await GET(`/discount-vouchers/${id}`);
    return response.data;
  }
);

export const createPromotionAsync = createAsyncThunk(
  'promotion/createPromotionAsync',
  async (body) => {
    const response = await POST(`/discount-vouchers`, body);
    return response.data;
  }
);

export const updatePromotionAsync = createAsyncThunk(
  'promotion/updatePromotionAsync',
  async ({ id, body }) => {
    const response = await PUT(`/discount-vouchers/${id}`, body);
    return response.data;
  }
);

export const deletePromotionAsync = createAsyncThunk(
  'promotion/deletePromotionAsync',
  async (id) => {
    const response = await DELETE(`/discount-vouchers/${id}`);
    return response.data;
  }
);

export const updatePromotionActionAsync = createAsyncThunk(
  'promotion/updatePromotionActionAsync',
  async ({ id, body }) => {
    const response = await PATCH(`/discount-vouchers/${id}/action`, body);
    return response.data;
  }
);