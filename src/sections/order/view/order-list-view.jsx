import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'src/routes/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';

import { paths } from 'src/routes/paths';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';

import { selectOrder, setTableFilters } from 'src/state/order/order.slice';
import { getOrdersAsync } from 'src/services/order/order.service';
import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';
import { OrderTableFiltersResult } from '../order-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  ...ORDER_STATUS_OPTIONS,
];

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Mã đơn hàng', width: 150, noSort: true },
  { id: 'name', label: 'Khách hàng', noSort: true },
  { id: 'CreationTime', label: 'Ngày đặt hàng', width: 140 },
  {
    id: 'totalQuantity',
    label: 'Sản phẩm',
    width: 120,
    align: 'center',
    noSort: true,
  },
  { id: 'totalAmount', label: 'Tổng thanh toán', width: 140, noSort: true },
  { id: 'status', label: 'Trạng thái', width: 110, noSort: true },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function OrderListView() {
  const dispatch = useDispatch();

  const router = useRouter();

  const { orders, tableFilters, loading, totalCount } =
    useSelector(selectOrder);

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const dateError = fIsAfter(tableFilters.fromDate, tableFilters.toDate);

  const canReset =
    tableFilters.orderStatuses !== 'all' ||
    tableFilters.fromDate ||
    tableFilters.toDate;

  const notFound = orders.length === 0 && !loading;

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      dispatch(
        setTableFilters({
          orderStatuses: newValue,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );

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

  useEffect(() => {
    if (tableFilters.orderStatuses === 'all') {
      const { orderStatuses, ...restFilters } = tableFilters;
      dispatch(getOrdersAsync(restFilters));
    } else {
      dispatch(getOrdersAsync(tableFilters));
    }
  }, [dispatch, tableFilters]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách đơn hàng"
        links={[
          { name: 'Trang chủ', href: '#' },
          { name: 'Danh sách đơn hàng' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={tableFilters.orderStatuses}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              // icon={
              //   <Label
              //     variant={
              //       ((tab.value === 'all' ||
              //         tab.value === filters.state.status) &&
              //         'filled') ||
              //       'soft'
              //     }
              //     color={
              //       (tab.value === 'Delivered' && 'success') ||
              //       (tab.value === 'WaitForConfirmPackageBranch' &&
              //         'secondary') ||
              //       (tab.value === 'Pending' && 'warning') ||
              //       (tab.value === 'Cancelled' && 'error') ||
              //       (tab.value === 'Processing' && 'warning') ||
              //       (tab.value === 'Shipped' && 'primary') ||
              //       (tab.value === 'Packaging' && 'info') ||
              //       'default'
              //     }
              //   >
              //     {[
              //       'Pending',
              //       'WaitForConfirmPackageBranch',
              //       'Packaging',
              //       'Processing',
              //       'Shipped',
              //       'Delivered',
              //       'Received',
              //       'Cancelled',
              //       'Refunded',
              //     ].includes(tab.value)
              //       ? tableData.filter((user) => user.status === tab.value)
              //           .length
              //       : tableData.length}
              //   </Label>
              // }
            />
          ))}
        </Tabs>
        <OrderTableToolbar dateError={dateError} />
        {canReset && (
          <OrderTableFiltersResult
            totalResults={totalCount}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
        <Box sx={{ position: 'relative' }}>
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table
              size={table.dense ? 'small' : 'medium'}
              sx={{ minWidth: 960 }}
            >
              <TableHeadCustom
                order={tableFilters.sortDirection}
                orderBy={tableFilters.sortBy}
                headLabel={TABLE_HEAD}
                onSort={handleSort}
              />

              <TableBody>
                {orders.map((row) => (
                  <OrderTableRow
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
          page={Math.min(
            tableFilters.pageNumber - 1,
            Math.max(0, Math.ceil(totalCount / tableFilters.pageSize) - 1),
          )}
          count={totalCount}
          rowsPerPage={tableFilters.pageSize}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
