import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import {
  selectCustomerType,
  setCustomerType,
  setTableFilters,
} from 'src/state/customer-type/customer-type.slice';
import { getCustomerTypesAsync } from 'src/services/customer-type/customer-type.service';
import { CustomerTypeForm } from '../customer-type-form';
import { CustomerTypeTableToolbar } from '../customer-type-table-toolbar';
import { CustomerTypeTableRow } from '../customer-type-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Phân loại', noSort: true },
  { id: 'minSpending', label: 'Chi tiêu tối thiểu', noSort: true },
  { id: 'Tier', label: 'Cấp độ' },
];

// ----------------------------------------------------------------------

export function CustomerTypeListView() {
  const dispatch = useDispatch();

  const customerTypeForm = useBoolean();

  const { customerTypes, loading, tableFilters, totalCount } =
    useSelector(selectCustomerType);

  const fetchData = useCallback(() => {
    dispatch(getCustomerTypesAsync(tableFilters));
  }, [tableFilters, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const notFound = !customerTypes.length && !loading;

  const handleChangePage = useCallback(
    (event, newPage) => {
      dispatch(
        setTableFilters({
          pageNumber: newPage + 1,
        }),
      );
    },
    [dispatch],
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      dispatch(
        setTableFilters({
          pageNumber: 1,
          pageSize: parseInt(event.target.value, 10),
        }),
      );
    },
    [dispatch],
  );

  const handleEditRow = useCallback(
    (row) => {
      dispatch(setCustomerType(row));
      customerTypeForm.onTrue();
    },
    [dispatch, customerTypeForm],
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Loại khách hàng"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Loại khách hàng' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CustomerTypeTableToolbar />

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 960 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {customerTypes.map((row) => (
                  <CustomerTypeTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => handleEditRow(row)}
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

      <CustomerTypeForm
        open={customerTypeForm.value}
        onClose={customerTypeForm.onFalse}
        onRefetch={fetchData}
      />
    </DashboardContent>
  );
}
