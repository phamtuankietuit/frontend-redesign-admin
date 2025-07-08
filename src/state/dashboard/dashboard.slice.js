import { createSlice } from "@reduxjs/toolkit";

import {
  getDashboardSummary,
  getDashboardRevenue,
  getDashboardCustomers,
  getDashboardInventory,
  getDashboardOrders,
  getDashboardTopProducts,
  getDashboardSalesByProductTypes,
  getDashboardKpis,
  getDashboardProfit
} from "src/services/dashboard/dashboard.service";
import { getFirstDayOfMonth, getLastDayOfMonth } from "src/utils/format-time";

// Dashboard Filter Types Constants
export const DASHBOARD_FILTERS = {
  SUMMARY: 'summary',
  REVENUE: 'revenue',
  PROFIT: 'profit',
  CUSTOMER: 'customer',
  INVENTORY: 'inventory',
  ORDER: 'order',
  TOP_PRODUCTS: 'topProducts',
  SALES_BY_PRODUCT_TYPE: 'salesByProductType',
  KPIS: 'kpis',
};

export const PERIOD_OPTIONS = [
  { label: 'Hôm nay', value: 'day' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
];

export const GROUP_BY_OPTIONS = [
  { label: 'Ngày', value: 'day' },
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
];

const baseFilters = {
  fromDate: getFirstDayOfMonth(),
  toDate: getLastDayOfMonth(),
  period: 'month',
  branchId: undefined,
};

const initialState = {
  [DASHBOARD_FILTERS.SUMMARY]: null,
  [`${DASHBOARD_FILTERS.SUMMARY}Loading`]: false,
  [`${DASHBOARD_FILTERS.SUMMARY}Filters`]: {
    ...baseFilters,
    productTypeIds: [],
    topProductsLimit: 5,
  },
  // 
  [DASHBOARD_FILTERS.REVENUE]: null,
  [`${DASHBOARD_FILTERS.REVENUE}Loading`]: false,
  [`${DASHBOARD_FILTERS.REVENUE}Filters`]: {
    ...baseFilters,
    productTypeIds: [],
    groupBy: 'day', // 'day', 'week', 'month'
  },
  // 
  [DASHBOARD_FILTERS.PROFIT]: null,
  [`${DASHBOARD_FILTERS.PROFIT}Loading`]: false,
  [`${DASHBOARD_FILTERS.PROFIT}Filters`]: {
    ...baseFilters,
    productTypeIds: [],
    groupBy: 'day', // 'day', 'week', 'month'
  },
  // 
  [DASHBOARD_FILTERS.CUSTOMER]: null,
  [`${DASHBOARD_FILTERS.CUSTOMER}Loading`]: false,
  [`${DASHBOARD_FILTERS.CUSTOMER}Filters`]: {
    ...baseFilters,
    groupBy: 'day', // 'day', 'week', 'month'
  },
  // 
  [DASHBOARD_FILTERS.INVENTORY]: null,
  [`${DASHBOARD_FILTERS.INVENTORY}Loading`]: false,
  [`${DASHBOARD_FILTERS.INVENTORY}Filters`]: {
    ...baseFilters,
    productTypeIds: [],
    lowStockThreshold: 10, // Threshold for low stock
    lowStockProductsLimit: 5, // Limit for low stock products
  },
  //
  [DASHBOARD_FILTERS.ORDER]: null,
  [`${DASHBOARD_FILTERS.ORDER}Loading`]: false,
  [`${DASHBOARD_FILTERS.ORDER}Filters`]: {
    ...baseFilters,
    orderStatuses: 'all',
  },
  //
  [DASHBOARD_FILTERS.TOP_PRODUCTS]: null,
  [`${DASHBOARD_FILTERS.TOP_PRODUCTS}Loading`]: false,
  [`${DASHBOARD_FILTERS.TOP_PRODUCTS}Filters`]: {
    ...baseFilters,
    productTypeIds: [],
    limit: 5,
  },
  // 
  [DASHBOARD_FILTERS.SALES_BY_PRODUCT_TYPE]: null,
  [`${DASHBOARD_FILTERS.SALES_BY_PRODUCT_TYPE}Loading`]: false,
  [`${DASHBOARD_FILTERS.SALES_BY_PRODUCT_TYPE}Filters`]: {
    ...baseFilters,
    productTypeIds: [],
  },
  // 
  [DASHBOARD_FILTERS.KPIS]: null,
  [`${DASHBOARD_FILTERS.KPIS}Loading`]: false,
  [`${DASHBOARD_FILTERS.KPIS}Filters`]: {
    ...baseFilters,
  },
};

// Helper function to create async cases
const createAsyncCases = (builder, asyncThunk, stateKey) => {
  builder
    .addCase(asyncThunk.pending, (state) => {
      state[stateKey] = null;
      state[`${stateKey}Loading`] = true;
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state[stateKey] = action.payload;
      state[`${stateKey}Loading`] = false;
    })
    .addCase(asyncThunk.rejected, (state) => {
      state[stateKey] = null;
      state[`${stateKey}Loading`] = false;
    });
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const { filterType, filters } = action.payload;
      const filterKey = `${filterType}Filters`;

      if (state[filterKey]) {
        state[filterKey] = {
          ...state[filterKey],
          ...filters,
        };
      }
    },
    // Reset specific filter to initial state
    resetFilters: (state, action) => {
      const { filterType } = action.payload;
      const filterKey = `${filterType}Filters`;

      if (state[filterKey] && initialState[filterKey]) {
        state[filterKey] = { ...initialState[filterKey] };
      }
    },
    // Reset all filters
    resetAllFilters: (state) => {
      Object.keys(initialState).forEach(key => {
        if (key.endsWith('Filters')) {
          state[key] = { ...initialState[key] };
        }
      });
    },
  }, extraReducers: (builder) => {
    // Create async cases for all dashboard services
    createAsyncCases(builder, getDashboardSummary, DASHBOARD_FILTERS.SUMMARY);
    createAsyncCases(builder, getDashboardRevenue, DASHBOARD_FILTERS.REVENUE);
    createAsyncCases(builder, getDashboardProfit, DASHBOARD_FILTERS.PROFIT);
    createAsyncCases(builder, getDashboardCustomers, DASHBOARD_FILTERS.CUSTOMER);
    createAsyncCases(builder, getDashboardInventory, DASHBOARD_FILTERS.INVENTORY);
    createAsyncCases(builder, getDashboardOrders, DASHBOARD_FILTERS.ORDER);
    createAsyncCases(builder, getDashboardTopProducts, DASHBOARD_FILTERS.TOP_PRODUCTS);
    createAsyncCases(builder, getDashboardSalesByProductTypes, DASHBOARD_FILTERS.SALES_BY_PRODUCT_TYPE);
    createAsyncCases(builder, getDashboardKpis, DASHBOARD_FILTERS.KPIS);
  },
});

export const { setFilters, resetFilters, resetAllFilters } = dashboardSlice.actions;

export const selectDashboard = (state) => state.dashboard;

export default dashboardSlice.reducer;
