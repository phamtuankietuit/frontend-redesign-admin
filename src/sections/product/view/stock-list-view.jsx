import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { getProductsAsync } from 'src/services/product/product.service';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Box, Table, TableBody } from '@mui/material';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';
import { Scrollbar } from 'src/components/scrollbar';

import { getBranchesAsync } from 'src/services/branch/branch.service';
import { selectStock, setTableFilters } from 'src/state/stock/stock.slice';
import { initialState } from 'src/state/branch/branch.slice';
import { getProductTypesFlattenAsync } from 'src/services/product-type/product-type.service';
import { New2ProductTableRow } from '../new2-product-table-row';
import { NewProductTableToolbar } from '../new-product-table-toolbar';
import { NewProductTableFiltersResult } from '../new-product-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Id', label: 'Sản phẩm' },
  { id: 'CreationTime', label: 'Ngày tạo' },
  { id: 'totalStockQuantity', label: 'Tồn kho', noSort: true },
  { id: 'status', label: 'Trạng thái', noSort: true },
  { id: '', label: '', noSort: true },
];

// ----------------------------------------------------------------------

export function StockListView() {
  const dispatch = useDispatch();

  const router = useRouter();

  const {
    products,
    loading,
    totalCount,
    tableFilters,
    productType,
    warehouse,
  } = useSelector(selectStock);

  const canReset = !!productType || !!warehouse;

  const notFound = products.length === 0 && !loading;

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.stockDetails(id));
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

  const fetchData = useCallback(() => {
    dispatch(getProductsAsync(tableFilters));
  }, [dispatch, tableFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    dispatch(getProductTypesFlattenAsync());
    dispatch(getBranchesAsync(initialState.tableFilters));
  }, [dispatch]);

  return (
    <DashboardContent
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs
        heading="Tồn kho"
        links={[
          { name: 'Trang chủ', href: '/' },
          { name: 'Tồn kho', href: paths.dashboard.product.stock },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <NewProductTableToolbar />

        {canReset && (
          <NewProductTableFiltersResult
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
                {products.map((row) => (
                  <New2ProductTableRow
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
  );
}
