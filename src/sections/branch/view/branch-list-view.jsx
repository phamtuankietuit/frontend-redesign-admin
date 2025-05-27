import { toast } from 'sonner';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { selectBranch, setTableFilters } from 'src/state/branch/branch.slice';
import {
  getBranchesAsync,
  deleteBranchAsync,
} from 'src/services/branch/branch.service';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { BranchForm } from '../branch-form';
import { BranchTableRow } from '../branch-table-row';
import { BranchTableToolbar } from '../branch-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Name', label: 'Tên' },
  { id: 'address', label: 'Địa chỉ', noSort: true },
  { id: 'phoneNumber', label: 'Số điện thoại', noSort: true },
  { id: 'status', label: 'Trạng thái', noSort: true },
  { id: '', width: 88, noSort: true },
];

// ----------------------------------------------------------------------

export function BranchListView() {
  const dispatch = useDispatch();

  const branchForm = useBoolean();

  const { branches, branchesLoading, tableFilters, totalCount } =
    useSelector(selectBranch);

  const fetchData = useCallback(() => {
    dispatch(getBranchesAsync(tableFilters));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const notFound = !branches.length;

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

  const handleEditRow = () => {
    branchForm.onTrue();
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteBranchAsync(id)).unwrap();

      toast.success('Xóa chi nhánh thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra vui lòng thử lại sau!');
      console.error('Error deleting branch:', error);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách chi nhánh"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách chi nhánh' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={branchForm.onTrue}
          >
            Thêm chi nhánh
          </Button>
        }
      />

      <Card>
        <BranchTableToolbar />

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
                {branches.map((row) => (
                  <BranchTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => handleEditRow()}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                  />
                ))}

                {branchesLoading &&
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

      <BranchForm open={branchForm.value} onClose={branchForm.onFalse} />
    </DashboardContent>
  );
}
