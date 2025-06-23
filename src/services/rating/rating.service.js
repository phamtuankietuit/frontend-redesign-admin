import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "../axios";

export const getRatingsAsync = createAsyncThunk(
  'rating/getRatingsAsync',
  async (params) => {
    const response = await GET(`/ratings`, { params });
    return response.data;
  }
);

export const getRatingByIdAsync = createAsyncThunk(
  'rating/getRatingByIdAsync',
  async (id) => {
    const response = await GET(`/ratings/${id}`);
    return response.data;
  }
);

export const approveRatingAsync = createAsyncThunk(
  'rating/approveRatingAsync',
  async (id) => {
    const response = await POST(`Admin/ratings/${id}/approve`, {
      adminNote: 'Đã duyệt đánh giá',
    });
    return response.data;
  }
);

export const restoreRatingAsync = createAsyncThunk(
  'rating/restoreRatingAsync',
  async (id) => {
    const response = await POST(`Admin/ratings/${id}/restore`, {
      adminNote: 'Đã khôi phục đánh giá',
    });
    return response.data;
  }
);

