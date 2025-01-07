import { createAsyncThunk } from "@reduxjs/toolkit";

import { POST } from "../axios";


export const sendEmailAsync = createAsyncThunk(
  'product/sendEmailAsync',
  async (body) => {
    const response = await POST(`/orders/send-email`, body);
    return response.data;
  }
);