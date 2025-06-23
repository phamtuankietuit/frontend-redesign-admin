import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  rowInPage,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';

import {
  onSelectAllRows,
  onSelectRow,
  selectUser,
  setTableFilters,
} from 'src/state/user/user.slice';
import {
  getUsersAsync,
  getUserStatusSummaryAsync,
} from 'src/services/user/user.service';
import { getCustomerTypesAsync } from 'src/services/customer-type/customer-type.service';
import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'FullName', label: 'Khách hàng' },
  { id: 'phoneNumber', label: 'Số điện thoại', noSort: true },
  { id: 'status', label: 'Trạng thái', noSort: true },
  { id: 'level', label: 'Hạng', noSort: true },
  { id: 'CreationTime', label: 'Ngày tạo' },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const dispatch = useDispatch();

  const {
    users,
    totalCount,
    tableFilters,
    loading,
    selectedUsers,
    statusSummary,
  } = useSelector(selectUser);

  const TABS = [
    {
      value: 'all',
      label: 'Tất cả',
      color: 'default',
      count: statusSummary?.totalCount || 0,
    },
    {
      value: 1,
      label: 'Đang hoạt động',
      color: 'success',
      count: statusSummary?.activeCount || 0,
    },
    {
      value: 4,
      label: 'Không hoạt động',
      color: 'warning',
      count: statusSummary?.inactiveCount || 0,
    },
    {
      value: 6,
      label: 'Khóa tài khoản',
      color: 'error',
      count: statusSummary?.blockedCount || 0,
    },
  ];

  const router = useRouter();

  const canReset = tableFilters.status !== 'all' || tableFilters.customerTypeId;

  const notFound = !users.length && !loading;

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      dispatch(
        setTableFilters({
          status: newValue,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );

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

  const fetchData = useCallback(async () => {
    if (tableFilters.status === 'all') {
      const { status, ...rest } = tableFilters;
      dispatch(getUsersAsync(rest));
    } else {
      dispatch(getUsersAsync(tableFilters));
    }
    dispatch(getUserStatusSummaryAsync());
  }, [dispatch, tableFilters]);

  const fetchFiltersData = useCallback(async () => {
    dispatch(
      getCustomerTypesAsync({
        pageNumber: 1,
        pageSize: 999,
        searchQuery: '',
        sortBy: 'CreationTime',
        sortDirection: 'desc',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    fetchData();
    fetchFiltersData();
  }, [fetchData, fetchFiltersData]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách khách hàng"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách khách hàng' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />{' '}
      <Card>
        <Tabs
          value={tableFilters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
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
                    (tab.value === tableFilters.status && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <UserTableToolbar />

        {canReset && (
          <UserTableFiltersResult
            totalResults={totalCount}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={tableFilters.sortDirection}
                orderBy={tableFilters.sortBy}
                headLabel={TABLE_HEAD}
                onSort={handleSort}
              />

              <TableBody>
                {users.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={selectedUsers.includes(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
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
