import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fIsAfter } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';

import {
  selectStockAdjustment,
  setTableFilters,
} from 'src/state/stock-adjustment/stock-adjustment.slice';
import {
  getStockAdjustmentsAsync,
  getStockAdjustmentSummaryAsync,
} from 'src/services/stock-adjustment/stock-adjustment.service';
import { getBranchesAsync } from 'src/services/branch/branch.service';
import { StockAdjustmentAnalytic } from '../stock-adjustment-analytic';
import { StockAdjustmentTableToolbar } from '../stock-adjustment-table-toolbar';
import { StockAdjustmentTableRow } from '../stock-adjustment-table-row';
import { StockAdjustmentTableFiltersResult } from '../stock-adjustment-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Code', label: 'Mã đơn cập nhật', width: 180 },
  { id: 'CreationTime', label: 'Ngày tạo' },
  { id: 'TransactionDate', label: 'Ngày hết hạn' },
  { id: 'totalCost', label: 'Tổng tiền hàng', noSort: true },
  { id: 'transactionStatus', label: 'Trạng thái', noSort: true },
];

// ----------------------------------------------------------------------

export function StockAdjustmentListView() {
  const dispatch = useDispatch();

  const {
    summary,
    tableFilters,
    stockAdjustments,
    totalCount,
    loading,
    createEditPage: { branchesTableFilters },
  } = useSelector(selectStockAdjustment);

  const theme = useTheme();

  const router = useRouter();

  const dateError = fIsAfter(
    tableFilters.transactionDateFrom,
    tableFilters.transactionDateTo,
  );

  const canReset =
    tableFilters.transactionStatus !== 'all' ||
    tableFilters.warehouseId ||
    tableFilters.transactionDateFrom;

  const notFound =
    (!stockAdjustments.length && canReset) || !stockAdjustments.length;

  const TABS = [
    {
      value: 'all',
      label: 'Tất cả',
      color: 'default',
      count: summary?.totalCount || 0,
    },
    {
      value: '2',
      label: 'Hoàn thành',
      color: 'success',
      count: summary?.completedCount || 0,
    },
    {
      value: '1',
      label: 'Đang đợi',
      color: 'warning',
      count: summary?.pendingCount || 0,
    },
    {
      value: '3',
      label: 'Đã hủy',
      color: 'error',
      count: summary?.cancelledCount || 0,
    },
  ];

  const handleChangePage = (event, newPage) => {
    dispatch(
      setTableFilters({
        pageNumber: newPage + 1,
      }),
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      setTableFilters({
        pageNumber: 1,
        pageSize: parseInt(event.target.value, 10),
      }),
    );
  };

  const handleSort = (id) => {
    const isAsc =
      tableFilters.sortBy === id && tableFilters.sortDirection === 'asc';

    if (id !== '') {
      dispatch(
        setTableFilters({
          sortDirection: isAsc ? 'desc' : 'asc',
          sortBy: id,
          pageNumber: 1,
        }),
      );
    }
  };

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.stockAdjustment.edit(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      dispatch(
        setTableFilters({
          transactionStatus: newValue,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );

  const getPercentByStatus = (status) => {
    const currentTotalCount = summary?.currentTotalCount || 0;
    const countByStatus = summary?.[`${status}Count`] || 0;

    return currentTotalCount > 0
      ? (countByStatus / currentTotalCount) * 100
      : 0;
  };

  const fetchData = useCallback(async () => {
    dispatch(getBranchesAsync(branchesTableFilters));
    dispatch(getStockAdjustmentSummaryAsync());
    if (tableFilters.transactionStatus === 'all') {
      const { transactionStatus, ...restFilters } = tableFilters;
      dispatch(getStockAdjustmentsAsync(restFilters));
    } else {
      dispatch(getStockAdjustmentsAsync(tableFilters));
    }
  }, [dispatch, tableFilters, branchesTableFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách đơn cập nhật tồn kho"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          {
            name: 'Danh sách đơn cập nhật tồn kho',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.stockAdjustment.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Tạo đơn mới
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        <Scrollbar sx={{ minHeight: 108 }}>
          <Stack
            direction="row"
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderStyle: 'dashed' }}
              />
            }
            sx={{ py: 2 }}
          >
            <StockAdjustmentAnalytic
              title="Tổng cộng"
              total={summary?.totalCount || 0}
              percent={100}
              increase={summary?.totalIncreasedAmount || 0}
              decrease={summary?.totalDecreasedAmount || 0}
              icon="solar:bill-list-bold-duotone"
              color={theme.vars.palette.info.main}
            />

            <StockAdjustmentAnalytic
              title="Hoàn thành"
              total={summary?.completedCount || 0}
              percent={getPercentByStatus('completed')}
              increase={summary?.completedIncreasedAmount || 0}
              decrease={summary?.completedDecreasedAmount || 0}
              icon="solar:file-check-bold-duotone"
              color={theme.vars.palette.success.main}
            />

            <StockAdjustmentAnalytic
              title="Đang đợi"
              total={summary?.pendingCount || 0}
              percent={getPercentByStatus('pending')}
              increase={summary?.pendingIncreasedAmount || 0}
              decrease={summary?.pendingDecreasedAmount || 0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.vars.palette.warning.main}
            />

            <StockAdjustmentAnalytic
              title="Đã hủy"
              total={summary?.cancelledCount || 0}
              percent={getPercentByStatus('cancelled')}
              increase={summary?.cancelledIncreasedAmount || 0}
              decrease={summary?.cancelledDecreasedAmount || 0}
              icon="solar:bell-bing-bold-duotone"
              color={theme.vars.palette.error.main}
            />
          </Stack>
        </Scrollbar>
      </Card>

      <Card>
        <Tabs
          value={tableFilters.transactionStatus}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    (tab.value === tableFilters.transactionStatus &&
                      'filled') ||
                    'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <StockAdjustmentTableToolbar dateError={dateError} />

        {canReset && (
          <StockAdjustmentTableFiltersResult
            totalResults={totalCount}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size="medium" sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={tableFilters.sortDirection}
                orderBy={tableFilters.sortBy}
                headLabel={TABLE_HEAD}
                onSort={handleSort}
              />

              <TableBody>
                {stockAdjustments.map((row) => (
                  <StockAdjustmentTableRow
                    key={row.id}
                    row={row}
                    onViewRow={() => handleViewRow(row.id)}
                  />
                ))}

                {loading &&
                  [...Array(5)].map((_, index) => (
                    <TableSkeleton key={index} />
                  ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={tableFilters.pageNumber - 1}
          count={totalCount}
          rowsPerPage={tableFilters.pageSize}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
