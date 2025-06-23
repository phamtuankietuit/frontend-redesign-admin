import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

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
import { ConfirmDialog } from 'src/components/custom-dialog';

import {
  resetBanner,
  selectBanner,
  setTableFilters,
} from 'src/state/banner/banner.slice';
import {
  getBannersAsync,
  deleteBannerAsync,
  toggleBannerStatusAsync,
} from 'src/services/banner/banner.service';
import { getProductTypesFlattenAsync } from 'src/services/product-type/product-type.service';
import { useBoolean } from 'src/hooks/use-boolean';
import { BannerTableRow } from '../banner-table-row';
import { BannerTableToolbar } from '../banner-table-toolbar';
import { BannerTableFiltersResult } from '../banner-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Title', label: 'Tiêu đề & Hình ảnh' },
  { id: 'ProductType', label: 'Loại sản phẩm', noSort: true },
  { id: 'CreationTime', label: 'Ngày tạo', noSort: true },
  { id: 'IsActive', label: 'Trạng thái' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function BannerListView() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    banners,
    loading,
    tableFilters,
    totalCount,
    isActiveObj,
    productTypeObj,
  } = useSelector(selectBanner);

  const [selectedBannerId, setSelectedBannerId] = useState(null);

  const confirmDelete = useBoolean();

  const notFound = !banners.length && !loading;

  const canReset = !!isActiveObj || !!productTypeObj;

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
    router.push(paths.dashboard.banner.edit(id));
  };

  const handleDeleteRow = (id) => {
    setSelectedBannerId(id);
    confirmDelete.onTrue();
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteBannerAsync(selectedBannerId)).unwrap();

      toast.success('Xóa banner thành công!');

      fetchData();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa banner!');
      console.error(error);
    } finally {
      confirmDelete.onFalse();
      setSelectedBannerId(null);
    }
  };

  const fetchData = useCallback(() => {
    dispatch(getBannersAsync(tableFilters));
  }, [tableFilters, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    dispatch(getProductTypesFlattenAsync());
  }, [dispatch]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách banner"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách banner' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.banner.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              dispatch(resetBanner());
            }}
          >
            Thêm banner
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <BannerTableToolbar />

        {canReset && (
          <BannerTableFiltersResult
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
                {banners.map((row) => (
                  <BannerTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => handleEditRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
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

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Xóa banner"
        content="Bạn có chắc chắn muốn xóa banner này không?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Xóa
          </Button>
        }
      />
    </DashboardContent>
  );
}
