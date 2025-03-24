import { createAsyncThunk } from "@reduxjs/toolkit";

import { POST } from "../axios";

export const uploadImagesAsync = createAsyncThunk(
  'file/uploadImagesAsync',
  async (images, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      images.forEach(image => formData.append('images', image));

      const { data } = await POST('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data.imageUrls;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
