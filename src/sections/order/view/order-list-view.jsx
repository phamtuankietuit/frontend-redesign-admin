import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';
import { OrderTableFiltersResult } from '../order-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  ...ORDER_STATUS_OPTIONS,
];

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Mã đơn hàng', width: 150 },
  { id: 'name', label: 'Khách hàng' },
  { id: 'createdAt', label: 'Ngày đặt hàng', width: 140 },
  {
    id: 'totalQuantity',
    label: 'Sản phẩm',
    width: 120,
    align: 'center',
  },
  { id: 'totalAmount', label: 'Tổng thanh toán', width: 140 },
  { id: 'status', label: 'Trạng thái', width: 110 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function OrderListView({ isCustomer = false }) {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      orderNumber: 'DH6010',
      createdAt: '2025-01-07T11:15:19+07:00',
      taxes: 0,
      items: [
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
          sku: '16H9UR0',
          quantity: 1,
          name: 'Bố già',
          coverUrl:
            'https://uitbookstorestorage.blob.core.windows.net/images/book-6.webp',
          price: 60000,
        },
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
          sku: '16H9UR1',
          quantity: 2,
          name: 'Cô Gái Đến Từ Hôm Qua',
          coverUrl:
            'https://uitbookstorestorage.blob.core.windows.net/images/book-17.webp',
          price: 115000,
        },
      ],
      history: {
        orderTime: '2025-01-06T10:15:19+07:00',
        paymentTime: '2025-01-05T09:15:19+07:00',
        deliveryTime: '2025-01-04T08:15:19+07:00',
        completionTime: '2025-01-03T07:15:19+07:00',
        timeline: [
          {
            title: 'Đã đến kho Quận Đống Đa',
            time: '2025-01-05T09:15:19+07:00',
          },
          {
            title: 'Đã tới kho HN',
            time: '2025-01-04T08:15:19+07:00',
          },
          {
            title: 'Shipper lấy hàng',
            time: '2025-01-03T07:15:19+07:00',
          },
          {
            title: 'Đã đặt hàng',
            time: '2025-01-02T06:15:19+07:00',
          },
        ],
      },
      subtotal: 230000,
      shipping: 0,
      discount: 0,
      customer: {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'Nguyễn Văn An',
        email: 'nguyenvana@gmail.com',
        avatarUrl: '/assets/images/mock/avatar/avatar-1.webp',
        ipAddress: '192.158.1.38',
      },
      delivery: {
        shipBy: 'DHL',
        speedy: 'Standard',
        trackingNumber: 'SPX037739199373',
      },
      totalAmount: 229980,
      totalQuantity: 6,
      shippingAddress: {
        fullAddress:
          'Nguyễn Văn An (Nhà ở) 19034 Đường Lê Lợi Căn hộ 164 - Hà Nội, VN',
        phoneNumber: '033500125',
      },
      payment: {
        cardType: 'mastercard',
        cardNumber: '**** **** **** 5678',
      },
      status: 'pending',
    },
    ..._orders,
  ]);
  console.log('🚀 ~ OrderListView ~ _orders:', _orders);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData],
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id),
    );

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table],
  );

  return (
    <>
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
            value={filters.state.status}
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
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' ||
                        tab.value === filters.state.status) &&
                        'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      (tab.value === 'processing' && 'warning') ||
                      (tab.value === 'shipping' && 'info') ||
                      'default'
                    }
                  >
                    {[
                      'pending',
                      'processing',
                      'shipping',
                      'completed',
                      'cancelled',
                      'refunded',
                    ].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value)
                          .length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id),
                )
              }
              action={
                <Tooltip title="Xóa">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={
                    isCustomer
                      ? TABLE_HEAD.filter((item) => item.id !== 'name')
                      : TABLE_HEAD
                  }
                  rowCount={dataFiltered.length}
                  // numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     dataFiltered.map((row) => row.id),
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        // selected={table.selected.includes(row.id)}
                        // onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        isCustomer={isCustomer}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length,
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Bạn có chắc chắn xóa <strong> {table.selected.length} </strong> dòng
            đã chọn?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.orderNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) =>
        fIsBetween(order.createdAt, startDate, endDate),
      );
    }
  }

  return inputData;
}
