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
import {
  setTableFilters,
  selectFastMessage,
} from 'src/state/fast-message/fast-message.slice';
import {
  getFastMessagesAsync,
  deleteFastMessageAsync,
} from 'src/services/fast-message/fast-message.service';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { FastMessageForm } from '../fast-message-form';
import { FastMessageTableRow } from '../fast-message-table-row';
import { FastMessageTableToolbar } from '../fast-message-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'shorthand', label: 'Cú pháp', width: 150 },
  { id: 'body', label: 'Nội dung', noSort: true },
  { id: '', width: 88, noSort: true },
];

// ----------------------------------------------------------------------

export function FastMessageListView() {
  const dispatch = useDispatch();

  const branchForm = useBoolean();

  const { fastMessages, fastMessagesLoading, tableFilters, totalCount } =
    useSelector(selectFastMessage);

  const fetchData = useCallback(() => {
    dispatch(getFastMessagesAsync(tableFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const notFound = !fastMessages.length;

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
          pageNumber: 1,
          sortDirection: isAsc ? 'desc' : 'asc',
          sortBy: id,
        }),
      );
    }
  };

  const handleEditRow = () => {
    branchForm.onTrue();
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteFastMessageAsync(id)).unwrap();

      toast.success('Xóa tin nhắn nhanh thành công!');

      dispatch(getFastMessagesAsync(tableFilters));
    } catch (error) {
      toast.error('Có lỗi xảy ra vui lòng thử lại sau!');
      console.error('Error deleting fast message:', error);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách tin nhắn nhanh"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách tin nhắn nhanh' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={branchForm.onTrue}
          >
            Thêm tin nhắn nhanh
          </Button>
        }
      />

      <Card>
        <FastMessageTableToolbar />

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
                {fastMessages.map((row) => (
                  <FastMessageTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => handleEditRow()}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                  />
                ))}

                {fastMessagesLoading &&
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

      <FastMessageForm open={branchForm.value} onClose={branchForm.onFalse} />
    </DashboardContent>
  );
}
