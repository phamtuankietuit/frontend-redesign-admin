import { createSlice } from "@reduxjs/toolkit";

import { getWardsAsync, getAddressesAsync, getDistrictsAsync, getProvincesAsync } from "src/services/address/address.service";

const initialState = {
  provinces: [],
  loadingProvinces: false,
  districts: [],
  loadingDistricts: false,
  wards: [],
  loadingWards: false,
  addresses: [],
  address: null,
};


const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setProvinces: (state, action) => {
      state.provinces = action.payload;
    },
    setDistricts: (state, action) => {
      state.districts = action.payload;
    },
    setWards: (state, action) => {
      state.wards = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProvincesAsync.pending, (state) => {
        state.loadingProvinces = true;
      })
      .addCase(getProvincesAsync.fulfilled, (state, action) => {
        action.payload.shift();
        state.provinces = action.payload;
        state.loadingProvinces = false;
      })
      .addCase(getProvincesAsync.rejected, (state) => {
        state.loadingProvinces = false;
      })
      .addCase(getDistrictsAsync.pending, (state) => {
        state.loadingDistricts = true;
      })
      .addCase(getDistrictsAsync.fulfilled, (state, action) => {
        state.districts = action.payload;
        state.loadingDistricts = false;
      })
      .addCase(getDistrictsAsync.rejected, (state) => {
        state.loadingDistricts = false;
      })
      .addCase(getWardsAsync.pending, (state) => {
        state.loadingWards = true;
      })
      .addCase(getWardsAsync.fulfilled, (state, action) => {
        state.wards = action.payload;
        state.loadingWards = false;
      })
      .addCase(getWardsAsync.rejected, (state) => {
        state.loadingWards = false;
      })
      .addCase(getAddressesAsync.fulfilled, (state, action) => {
        state.addresses = action.payload;
      });
  },
});

export const { setAddress, setProvinces, setDistricts, setWards } = addressSlice.actions;

export const selectAddress = (state) => state.address;

export default addressSlice.reducer;
