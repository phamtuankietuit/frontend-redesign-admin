import { createAsyncThunk } from "@reduxjs/toolkit";

import { ADDRESS_GET } from "../address-axios";
import { GET, PUT, POST, DELETE } from "../axios";

export const getProvincesAsync = createAsyncThunk('address/getProvincesAsync', async () => {
  const response = await ADDRESS_GET(`/province`);
  return response.data.data;
});

export const getDistrictsAsync = createAsyncThunk('address/getDistrictsAsync', async (provinceId) => {
  const response = await ADDRESS_GET(`/district`, {
    params: {
      province_id: provinceId,
    },
  });
  return response.data.data;
});

export const getWardsAsync = createAsyncThunk('address/getWardsAsync', async (districtId) => {
  const response = await ADDRESS_GET(`/ward`, {
    params: {
      district_id: districtId,
    },
  });
  return response.data.data;
});

export const getAddressesAsync = createAsyncThunk('address/getAddressesAsync', async (id) => {
  const { data } = await GET(`/users/${id}/addresses`);
  return data;
});

export const createAddressAsync = createAsyncThunk('address/createAddressAsync', async ({ id, body }) => {
  const { data } = await POST(`/users/${id}/addresses`, body);
  return data;
});

export const updateAddressAsync = createAsyncThunk('address/updateAddressAsync', async ({ userId, id, body }) => {
  const { data } = await PUT(`/users/${userId}/addresses/${id}`, body);
  return data;
});

export const deleteAddressAsync = createAsyncThunk('address/deleteAddressAsync', async ({ userId, id }) => {
  const { data } = await DELETE(`/users/${userId}/addresses/${id}`);
  return data;
});