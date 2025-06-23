import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { selectOrder, setTableFilters } from 'src/state/order/order.slice';
import SearchBar from '../product/components/search-bar';

// ----------------------------------------------------------------------

export function OrderTableToolbar({ dateError }) {
  const dispatch = useDispatch();

  const { tableFilters } = useSelector(selectOrder);

  const handleFilterStartDate = useCallback(
    (newValue) => {
      dispatch(
        setTableFilters({
          fromDate: newValue ? newValue.toISOString() : null,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      dispatch(
        setTableFilters({
          toDate: newValue ? newValue.toISOString() : null,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );

  const handleSearchChange = useCallback(
    (searchValue) => {
      dispatch(
        setTableFilters({
          searchQuery: searchValue,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <DatePicker
        label="Ngày bắt đầu"
        value={tableFilters.fromDate ? dayjs(tableFilters.fromDate) : null}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{ maxWidth: { md: 180 } }}
      />

      <DatePicker
        label="Ngày kết thúc"
        value={tableFilters.toDate ? dayjs(tableFilters.toDate) : null}
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: dateError,
            helperText: dateError
              ? 'Ngày kết thúc phải lớn hơn Ngày bắt đầu'
              : null,
          },
        }}
        sx={{
          maxWidth: { md: 180 },
          [`& .${formHelperTextClasses.root}`]: {
            bottom: { md: -40 },
            position: { md: 'absolute' },
          },
        }}
      />

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        flexGrow={1}
        sx={{ width: 1 }}
      >
        <SearchBar
          placeholder="Tìm kiếm đơn hàng..."
          value={tableFilters.searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Stack>
    </Stack>
  );
}
