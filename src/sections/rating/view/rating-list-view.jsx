import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useRouter } from 'src/routes/hooks';
import { selectRating, setTableFilters } from 'src/state/rating/rating.slice';
import { getRatingsAsync } from 'src/services/rating/rating.service';
import { RatingTableRow } from '../rating-table-row';
import { RatingTableToolbar } from '../rating-table-toolbar';
import { RatingTableFiltersResult } from '../rating-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Customer', label: 'Khách hàng', noSort: true, width: 200 },
  { id: 'ProductId', label: 'Sản phẩm', width: 200 },
  { id: 'Content', label: 'Nội dung', noSort: true },
  { id: 'Rating', label: 'Đánh giá', noSort: true },
  { id: 'status', label: 'Trạng thái', noSort: true },
];

// ----------------------------------------------------------------------

export function RatingListView() {
  const router = useRouter();

  const dispatch = useDispatch();

  const {
    ratings,
    loading,
    tableFilters,
    totalCount,
    starObj,
    commentStatusObj,
  } = useSelector(selectRating);

  const notFound = !ratings.length && !loading;

  const canReset = !!starObj || !!commentStatusObj;

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
    router.push(paths.dashboard.rating.details(id));
  };

  const handleClickCustomer = (customerId) => {
    router.push(paths.dashboard.user.edit(customerId));
  };

  const fetchData = useCallback(() => {
    dispatch(getRatingsAsync(tableFilters));
  }, [tableFilters, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách đánh giá"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách đánh giá' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <RatingTableToolbar />

        {canReset && (
          <RatingTableFiltersResult
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
                {ratings.map((row) => (
                  <RatingTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => handleEditRow(row.id)}
                    onClickCustomer={() => handleClickCustomer(row.customerId)}
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
