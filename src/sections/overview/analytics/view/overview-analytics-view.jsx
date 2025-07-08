import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';

import {
  selectDashboard,
  setFilters,
  DASHBOARD_FILTERS,
  PERIOD_OPTIONS,
} from 'src/state/dashboard/dashboard.slice';
import { selectBranch } from 'src/state/branch/branch.slice';
import {
  getDashboardProfit,
  getDashboardSummary,
  getDashboardTopProducts,
} from 'src/services/dashboard/dashboard.service';
import { getBranchesAsync } from 'src/services/branch/branch.service';

import { Autocomplete, Stack, TextField } from '@mui/material';
import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

// Function to transform salesByProductTypes into chart series format
const getSalesByProductTypeSeries = (salesByProductTypes) => {
  if (!salesByProductTypes || !Array.isArray(salesByProductTypes)) {
    return [];
  }

  return salesByProductTypes.map((item) => ({
    label: item.productTypeName,
    value: item.totalQuantitySold,
  }));
};

// Function to get categories (product names) from top products
const getTopProductsCategories = (topProducts) => {
  if (!topProducts || !Array.isArray(topProducts)) {
    return [];
  }

  return topProducts.map((product) => product.productName);
};

// Function to get series data (quantities sold) from top products
const getTopProductsSeries = (topProducts) => {
  if (!topProducts || !Array.isArray(topProducts)) {
    return [{ name: '2024', data: [] }];
  }

  return [
    {
      name: '2024',
      data: topProducts.map((product) => product.totalQuantitySold),
    },
  ];
};

export function OverviewAnalyticsView() {
  const dispatch = useDispatch();

  const {
    summary,
    revenue,
    profit,
    customer,
    inventory,
    order,
    topProducts,
    salesByProductType,
    kpis,
    summaryFilters,
    revenueFilters,
    profitFilters,
    customerFilters,
    inventoryFilters,
    orderFilters,
    topProductsFilters,
    salesByProductTypeFilters,
    kpisFilters,
    summaryLoading,
    revenueLoading,
    profitLoading,
    customerLoading,
    inventoryLoading,
    orderLoading,
    topProductsLoading,
    salesByProductTypeLoading,
    kpisLoading,
  } = useSelector(selectDashboard);

  const { branches, branchesLoading } = useSelector(selectBranch);

  useEffect(() => {
    dispatch(
      getBranchesAsync({
        pageNumber: 1,
        pageSize: 100,
        sortBy: 'Name',
        sortDirection: 'asc',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDashboardSummary(summaryFilters));
  }, [dispatch, summaryFilters]);

  useEffect(() => {
    dispatch(getDashboardProfit(profitFilters));
  }, [dispatch, profitFilters]);

  useEffect(() => {
    dispatch(getDashboardTopProducts(topProductsFilters));
  }, [dispatch, topProductsFilters]);

  const handlePeriodChange = (event, newValue) => {
    if (newValue) {
      dispatch(
        setFilters({
          filterType: DASHBOARD_FILTERS.SUMMARY,
          filters: { period: newValue.value },
        }),
      );
      dispatch(
        setFilters({
          filterType: DASHBOARD_FILTERS.PROFIT,
          filters: { period: newValue.value },
        }),
      );
    }
  };

  const handleBranchChange = (event, newValue) => {
    const branchId = newValue?.id || undefined;

    // Apply branch filter to all dashboard filter types
    Object.values(DASHBOARD_FILTERS).forEach((filterType) => {
      dispatch(
        setFilters({
          filterType,
          filters: { branchId },
        }),
      );
    });
  };

  const getCurrentPeriodOption = () =>
    PERIOD_OPTIONS.find((option) => option.value === summaryFilters?.period) ||
    PERIOD_OPTIONS.find((option) => option.value === 'month');

  const getCurrentBranchOption = () => {
    if (!summaryFilters?.branchId) {
      return { id: undefined, name: 'Tất cả chi nhánh' };
    }
    return (
      branches?.find((branch) => branch.id === summaryFilters.branchId) || {
        id: undefined,
        name: 'Tất cả chi nhánh',
      }
    );
  };

  const branchOptions = [
    { id: undefined, name: 'Tất cả chi nhánh' },
    ...(branches || []),
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Stack
        direction="row"
        alignItems="center"
        sx={{ mb: { xs: 3, md: 5 } }}
        spacing={2}
      >
        <Typography variant="h4">Chào mừng trở lại 👋</Typography>

        <Autocomplete
          sx={{ width: 220 }}
          options={branchOptions}
          value={getCurrentBranchOption()}
          onChange={handleBranchChange}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={branchesLoading}
          renderInput={(params) => <TextField {...params} label="Chi nhánh" />}
        />
      </Stack>

      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={2}>
        <Autocomplete
          sx={{ width: 200 }}
          options={PERIOD_OPTIONS}
          value={getCurrentPeriodOption()}
          onChange={handlePeriodChange}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => <TextField {...params} label="Thời gian" />}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Đơn hàng"
            percent={summary?.totalOrdersChangePercent || 0}
            total={summary?.totalOrders || 0}
            icon={
              <img
                alt="icon"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-bag.svg`}
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Người dùng mới"
            percent={summary?.totalNewUsersChangePercent || 0}
            total={summary?.totalNewUsers || 0}
            color="secondary"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-users.svg`}
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            money
            title="Doanh thu"
            percent={summary?.totalRevenueChangePercent || 0}
            total={summary?.totalRevenue || 0}
            color="warning"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-buy.svg`}
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            money
            title="Lợi nhuận"
            percent={profit?.profitMarginPercentage || 0}
            total={profit?.totalProfit || 0}
            color="error"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-message.svg`}
              />
            }
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Phân loại hàng bán chạy"
            chart={{
              series: getSalesByProductTypeSeries(summary?.salesByProductTypes),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            sx={{ height: 1 }}
            title="Doanh thu và Lợi nhuận"
            chart={{
              categories: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
              ],
              series: [
                {
                  name: 'Doanh thu',
                  data: [
                    43000000, 33000000, 22000000, 37000000, 67000000, 68000000,
                    37000000, 24000000, 55000000, 32000000, 87000000, 65000000,
                  ],
                },
                {
                  name: 'Lợi nhuận',
                  data: [
                    51000000, 70000000, 47000000, 67000000, 40000000, 37000000,
                    24000000, 70000000, 24000000, 64000000, 72000000, 70000000,
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AnalyticsConversionRates
            title="Top 5 sản phẩm bán chạy tháng này"
            chart={{
              categories: getTopProductsCategories(topProducts),
              series: getTopProductsSeries(topProducts),
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
