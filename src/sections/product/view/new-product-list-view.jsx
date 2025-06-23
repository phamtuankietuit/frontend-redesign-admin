import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  deleteProductByIdAsync,
  getProductsAsync,
} from 'src/services/product/product.service';
import {
  selectProduct,
  setTableFilters,
  onSelectAllRows,
  onSelectRow,
  resetProduct,
} from 'src/state/product/product.slice';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Box, Table, TableBody, Tooltip, IconButton } from '@mui/material';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
} from 'src/components/table';
import { Scrollbar } from 'src/components/scrollbar';

import { getProductTypesFlattenAsync } from 'src/services/product-type/product-type.service';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import { ProductTableToolbar } from '../product-table-toolbar';
import { ProductTableFiltersResult } from '../product-table-filters-result';
import { New1ProductTableRow } from '../new1-product-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Id', label: 'Sản phẩm' },
  { id: 'CreationTime', label: 'Ngày tạo' },
  { id: 'UnitPrice', label: 'Giá bán', noSort: true },
  { id: 'isActive', label: 'Hiển thị', noSort: true },
];

// ----------------------------------------------------------------------

export function NewProductListView() {
  const dispatch = useDispatch();

  const confirmRows = useBoolean();

  const router = useRouter();

  const {
    products,
    productsLoading,
    totalCount,
    tableFilters,
    selectedRowIds,
    isActiveObject,
    productType,
  } = useSelector(selectProduct);

  const { productTypesFlatten } = useSelector(selectProductType);

  const canReset = !!isActiveObject || !!productType;

  const notFound = products.length === 0 && !productsLoading;

  const handleDeleteRows = useCallback(async () => {
    try {
      await Promise.all(
        selectedRowIds.map(async (id) => {
          await dispatch(deleteProductByIdAsync(id)).unwrap();
        }),
      );
      toast.success('Xóa sản phẩm thành công');
      dispatch(getProductsAsync(tableFilters));
    } catch (error) {
      console.log('🚀 ~ handleDeleteRows ~ error:', error);
      toast.error('Xóa sản phẩm thất bại');
    }
  }, [dispatch, selectedRowIds, tableFilters]);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router],
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

  const handleSelectAllRows = useCallback(
    (checked, inputValue) => {
      dispatch(onSelectAllRows({ checked, inputValue }));
    },
    [dispatch],
  );

  const handleSelectRow = useCallback(
    (inputValue) => {
      dispatch(onSelectRow(inputValue));
    },
    [dispatch],
  );
  useEffect(() => {
    dispatch(getProductsAsync(tableFilters));
  }, [dispatch, tableFilters]);

  useEffect(() => {
    if (productTypesFlatten.length === 0) {
      dispatch(getProductTypesFlattenAsync());
    }
  }, [dispatch, productTypesFlatten.length]);

  return (
    <>
      <DashboardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Danh sách sản phẩm' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                dispatch(resetProduct());
              }}
            >
              Thêm sản phẩm
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ProductTableToolbar />

          {canReset && (
            <ProductTableFiltersResult
              totalResults={totalCount}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              rowCount={products.length}
              numSelected={selectedRowIds.length}
              onSelectAllRows={(checked) => {
                handleSelectAllRows(
                  checked,
                  products.map((row) => row.id),
                );
              }}
              action={
                <Stack direction="row">
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirmRows.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar sx={{ minHeight: 444, maxHeight: 444 }}>
              <Table size="medium" sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={tableFilters.sortDirection}
                  orderBy={tableFilters.sortBy}
                  headLabel={TABLE_HEAD}
                  onSort={handleSort}
                  rowCount={totalCount}
                  numSelected={selectedRowIds.length}
                  onSelectAllRows={(checked) =>
                    handleSelectAllRows(
                      checked,
                      products.map((row) => row.id),
                    )
                  }
                />

                <TableBody>
                  {products.map((row) => (
                    <New1ProductTableRow
                      key={row.id}
                      row={row}
                      selected={selectedRowIds.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ))}

                  {productsLoading &&
                    [...Array(5)].map((_, index) => (
                      <TableSkeleton key={`skeleton-${index}`} />
                    ))}
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
          <TablePaginationCustom
            count={totalCount}
            page={
              totalCount === 0
                ? 0
                : Math.min(
                    tableFilters.pageNumber - 1,
                    Math.ceil(totalCount / tableFilters.pageSize) - 1,
                  )
            }
            rowsPerPage={tableFilters.pageSize}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Xóa"
        content={
          <>
            Bạn có chắc chắn muốn xóa <strong>{selectedRowIds.length}</strong>{' '}
            sản phẩm?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Xóa
          </Button>
        }
      />
    </>
  );
}
