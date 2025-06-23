import { createSlice } from "@reduxjs/toolkit";
import {
  getBannersAsync,
  getBannerByIdAsync,
  createBannerAsync,
  updateBannerAsync,
  deleteBannerAsync,
  toggleBannerStatusAsync
} from "src/services/banner/banner.service";

export const initialState = {
  banners: [],
  loading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
    sortBy: 'CreationTime',
    sortDirection: 'desc',
    isActive: undefined,
    productTypeId: undefined,
  },
  isActiveObj: null,
  productTypeObj: null,
  // 
  banner: null,
  bannerLoading: false,
};

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    resetBanner: (state) => {
      state.banner = null;
      state.bannerLoading = false;
    },
    setIsActiveObj: (state, action) => {
      state.isActiveObj = action.payload;
      state.tableFilters.isActive = action.payload?.value;
      state.tableFilters.pageNumber = 1;
    }, setProductTypeObj: (state, action) => {
      state.productTypeObj = action.payload;
      state.tableFilters.productTypeId = action.payload?.id;
      state.tableFilters.pageNumber = 1;
    },
    resetTableFilters: (state) => {
      state.tableFilters = initialState.tableFilters;
      state.isActiveObj = null;
      state.productTypeObj = null;
    },
    setTableFilters: (state, action) => {
      state.tableFilters = {
        ...state.tableFilters,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(getBannersAsync.pending, (state) => {
        state.banners = [];
        state.loading = true;
        state.totalCount = 0;
      })
      .addCase(getBannersAsync.fulfilled, (state, action) => {
        state.banners = action.payload.items;
        state.loading = false;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getBannersAsync.rejected, (state) => {
        state.banners = [];
        state.loading = false;
        state.totalCount = 0;
      })

      // banner details
      .addCase(getBannerByIdAsync.pending, (state) => {
        state.banner = null;
        state.bannerLoading = true;
      })
      .addCase(getBannerByIdAsync.fulfilled, (state, action) => {
        state.banner = action.payload;
        state.bannerLoading = false;
      })
      .addCase(getBannerByIdAsync.rejected, (state) => {
        state.banner = null;
        state.bannerLoading = false;
      })

      // create banner
      .addCase(createBannerAsync.pending, (state) => {
        state.banner = null;
        state.bannerLoading = true;
      })
      .addCase(createBannerAsync.fulfilled, (state, action) => {
        state.banner = action.payload;
        state.bannerLoading = false;
      })
      .addCase(createBannerAsync.rejected, (state) => {
        state.banner = null;
        state.bannerLoading = false;
      })

      // update banner
      .addCase(updateBannerAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBannerAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBannerAsync.rejected, (state) => {
        state.loading = false;
      })

      // delete banner
      .addCase(deleteBannerAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBannerAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBannerAsync.rejected, (state) => {
        state.loading = false;
      });

  },
});

export const {
  resetTableFilters,
  setTableFilters,
  setIsActiveObj,
  setProductTypeObj,
  resetBanner,
} = bannerSlice.actions;

export const selectBanner = (state) => state.banner;

export default bannerSlice.reducer;
