import { createAsyncThunk } from "@reduxjs/toolkit";

import { POST } from "../axios";

export const uploadImagesAsync = createAsyncThunk(
  'file/uploadImagesAsync',
  async (images, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      const urls = [];

      images.forEach((image) => {
        if (typeof image === 'string') {
          urls.push(image);
        } else {
          formData.append(`images`, image);
        }
      });

      if (urls.length === images.length) {
        return urls.map((url) => ({
          thumbnailImageUrl: url,
          largeImageUrl: url,
        }));
      }

      const response = await POST(`/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = response.data.imageUrls.map((url) => ({
        thumbnailImageUrl: url,
        largeImageUrl: url,
      }));

      return [...responseData, ...urls];
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
