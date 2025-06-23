import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback, useMemo } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGrid,
  gridClasses,
  GridActionsCellItem,
  GridToolbarContainer,
} from '@mui/x-data-grid';

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
  setSelectedRowIds,
} from 'src/state/product/product.slice';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SearchBar from '../components/search-bar';
import { ProductTableToolbar } from '../product-table-toolbar';
import { ProductTableFiltersResult } from '../product-table-filters-result';
import {
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt,
} from '../product-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function ProductListView() {
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
  } = useSelector(selectProduct);

  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState(HIDE_COLUMNS);

  const canReset = !!isActiveObject;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await dispatch(deleteProductByIdAsync(id)).unwrap();
        toast.success('Xóa sản phẩm thành công');
        dispatch(getProductsAsync(tableFilters));
      } catch (error) {
        toast.error('Xóa sản phẩm thất bại');
      }
    },
    [dispatch, tableFilters],
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await Promise.all(
        selectedRowIds.map(async (id) => {
          await dispatch(deleteProductByIdAsync(id)).unwrap();
        }),
      );
      toast.success('Xóa sản phẩm thành công');
      dispatch(setSelectedRowIds([]));
      dispatch(getProductsAsync(tableFilters));
    } catch (error) {
      toast.error('Xóa sản phẩm thất bại');
    }
  }, [dispatch, selectedRowIds, tableFilters]);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router],
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        canReset={canReset}
        filteredResults={totalCount}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    [canReset, confirmRows, totalCount],
  );

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'Id',
      headerName: 'Sản phẩm',
      flex: 1,
      minWidth: 360,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellProduct
          params={params}
          onViewRow={() => handleViewRow(params.row.id)}
        />
      ),
    },
    {
      field: 'CreationTime',
      headerName: 'Ngày tạo',
      width: 200,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'minUnitPrice',
      headerName: 'Giá bán',
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'isActive',
      headerName: 'Hiển thị',
      width: 110,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Thao tác',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.row.id + 1}
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Cập nhật"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          key={params.row.id + 2}
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Xóa"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];
  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  console.log('🚀 ~ ProductListView ~ tableFilters:', tableFilters);
  useEffect(() => {
    // dispatch(getProductsAsync(tableFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tableFilters]);

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
            >
              Thêm sản phẩm
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
            minHeight: 700,
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={products}
            columns={columns}
            loading={productsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[10, 25, 50]}
            //
            pagination
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={{
              page: tableFilters.pageNumber - 1,
              pageSize: tableFilters.pageSize,
            }}
            onPaginationModelChange={(model) => {
              console.log('🚀 ~ ProductListView ~ model:', model);
              dispatch(
                setTableFilters({
                  pageNumber: model.page + 1,
                  pageSize: model.pageSize,
                }),
              );
            }}
            //
            sortingMode="server"
            onSortModelChange={(sortModel) => {
              console.log('🚀 ~ ProductListView ~ sortModel:', sortModel);
              dispatch(
                setTableFilters({
                  sortBy: sortModel[0]?.field ? sortModel[0].field : undefined,
                  sortDirection: sortModel[0]?.sort
                    ? sortModel[0].sort
                    : undefined,
                }),
              );
            }}
            rowSelectionModel={selectedRowIds}
            onRowSelectionModelChange={(newSelectionModel) => {
              console.log(
                '🚀 ~ ProductListView ~ newSelectionModel:',
                newSelectionModel,
              );
              dispatch(setSelectedRowIds(newSelectionModel));
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => {
              console.log('🚀 ~ ProductListView ~ newModel:', newModel);

              setColumnVisibilityModel(newModel);
            }}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent title="Không có dữ liệu" />,
              noResultsOverlay: () => <EmptyContent title="Không có dữ liệu" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{
              [`& .${gridClasses.cell}`]: {
                alignItems: 'center',
                display: 'inline-flex',
              },
            }}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Xóa"
        content={
          <>
            Bạn có chắc chắn muốn xóa
            <strong> {selectedRowIds.length} </strong> sản phẩm?
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

function CustomToolbar({ canReset, filteredResults, onOpenConfirmDeleteRows }) {
  const dispatch = useDispatch();

  const { tableFilters, selectedRowIds } = useSelector(selectProduct);

  const handleSearchChange = useCallback(
    (searchValue) => {
      dispatch(
        setTableFilters({
          sortBy: undefined,
          sortDirection: undefined,
          searchQuery: searchValue,
        }),
      );
    },
    [dispatch],
  );

  return (
    <>
      <GridToolbarContainer sx={{ pr: 0 }}>
        <ProductTableToolbar />

        <SearchBar
          placeholder="Tìm kiếm mã, tên sản phẩm..."
          value={tableFilters.searchQuery}
          onSearchChange={handleSearchChange}
          sx={{ flex: 1 }}
          autoFocus
        />

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ pr: 2 }}
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Xóa ({selectedRowIds.length})
            </Button>
          )}
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}
