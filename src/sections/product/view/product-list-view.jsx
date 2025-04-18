import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

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
import { useSetState } from 'src/hooks/use-set-state';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { getProductsAsync } from 'src/services/product/product.service';
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
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt,
} from '../product-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'publish', label: 'Hiển thị' },
  { value: 'hide', label: 'Ẩn' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function ProductListView({ isInventoryListPage = false }) {
  const dispatch = useDispatch();

  const confirmRows = useBoolean();

  const router = useRouter();

  const {
    products,
    productsLoading,
    totalCount,
    tableFilters,
    selectedRowIds,
  } = useSelector(selectProduct);
  console.log('🚀 ~ ProductListView ~ products:', products);
  // const [tableData, setTableData] = useState([]);

  const filters = useSetState({ publish: [], stock: [] });

  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState(HIDE_COLUMNS);

  const fetchProducts = useCallback(() => {
    dispatch(getProductsAsync(tableFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableFilters.pageSize,
    tableFilters.pageNumber,
    tableFilters.searchQuery,
    tableFilters.sortBy,
    tableFilters.sortDirection,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const canReset =
    filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const handleDeleteRow = useCallback((id) => {}, []);

  const handleDeleteRows = useCallback(() => {}, []);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router],
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router],
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={products.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state],
  );

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'Name',
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
          key={params.row.id}
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Xem"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          key={params.row.id + 1}
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Cập nhật"
          onClick={() => handleEditRow(params.row.id)}
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
            !isInventoryListPage && (
              <Button
                component={RouterLink}
                href={paths.dashboard.product.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Thêm sản phẩm
              </Button>
            )
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
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            //
            pagination
            paginationMode="server"
            rowCount={totalCount}
            onPaginationModelChange={(paginationModel) => {
              dispatch(
                setTableFilters({
                  pageNumber: paginationModel.page + 1,
                  pageSize: paginationModel.pageSize,
                }),
              );
            }}
            //
            sortingMode="server"
            onSortModelChange={(sortModel) => {
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
            onRowSelectionModelChange={(newSelectionModel) =>
              dispatch(setSelectedRowIds(newSelectionModel))
            }
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
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
        title="Delete"
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

function CustomToolbar({
  filters,
  canReset,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}) {
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
      <GridToolbarContainer>
        <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        />

        <SearchBar
          placeholder="Tìm kiếm mã, tên sản phẩm..."
          value={tableFilters.searchQuery}
          onSearchChange={handleSearchChange}
          sx={{ flex: 1 }}
        />

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
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
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
          publishs={PUBLISH_OPTIONS}
        />
      )}
    </>
  );
}

function applyFilter({ inputData, filters }) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) =>
      stock.includes(product.inventoryType),
    );
  }

  if (publish.length) {
    inputData = inputData.filter((product) =>
      publish.includes(product.publish),
    );
  }

  return inputData;
}
