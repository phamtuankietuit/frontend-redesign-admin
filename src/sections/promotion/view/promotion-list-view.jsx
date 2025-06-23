import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fIsAfter } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import {
  resetPromotion,
  selectPromotion,
  setTableFilters,
} from 'src/state/promotion/promotion.slice';
import { getPromotionsAsync } from 'src/services/promotion/promotion.service';
import { PromotionTableRow } from '../promotion-table-row';
import { PromotionTableToolbar } from '../promotion-table-toolbar';
import { PromotionTableFiltersResult } from '../promotion-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Name', label: 'Tên khuyến mãi', width: 200 },
  { id: 'VoucherType', label: 'Loại voucher', width: 150, noSort: true },
  { id: 'ValueType', label: 'Loại giá trị', width: 150, noSort: true },
  { id: 'Value', label: 'Giá trị', width: 120 },
  { id: 'Status', label: 'Trạng thái', width: 120 },
  { id: 'StartTime', label: 'Ngày bắt đầu', width: 150 },
  { id: 'EndTime', label: 'Ngày kết thúc', width: 150 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function PromotionListView() {
  const router = useRouter();

  const dispatch = useDispatch();

  const {
    promotions,
    loading,
    tableFilters,
    totalCount,
    statusObj,
    voucherTypeObj,
    valueTypeObj,
  } = useSelector(selectPromotion);

  const notFound = !promotions.length && !loading;
  const canReset =
    !!statusObj ||
    !!voucherTypeObj ||
    !!valueTypeObj ||
    !!tableFilters.startDate ||
    !!tableFilters.endDate;

  const dateError = fIsAfter(tableFilters.startDate, tableFilters.endDate);

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

  const handleEditRow = (id) => {
    router.push(paths.dashboard.promotion.edit(id));
  };

  const handleViewRow = (id) => {
    router.push(paths.dashboard.promotion.edit(id));
  };

  const fetchData = useCallback(() => {
    dispatch(getPromotionsAsync(tableFilters));
  }, [tableFilters, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách khuyến mãi"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách khuyến mãi' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.promotion.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              dispatch(resetPromotion());
            }}
          >
            Thêm khuyến mãi
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <PromotionTableToolbar dateError={dateError} />

        {canReset && (
          <PromotionTableFiltersResult
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
                numSelected={0}
                rowCount={0}
              />
              <TableBody>
                {promotions.map((row) => (
                  <PromotionTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => handleEditRow(row.id)}
                    onViewRow={() => handleViewRow(row.id)}
                  />
                ))}
                {loading && (
                  <>
                    <TableSkeleton />
                    <TableSkeleton />
                    <TableSkeleton />
                    <TableSkeleton />
                    <TableSkeleton />
                  </>
                )}
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
