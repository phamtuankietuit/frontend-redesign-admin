import { useCallback } from 'react';
import dayjs from 'dayjs';

import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import {
  selectStockAdjustment,
  setTableFilters,
  setWarehouse,
} from 'src/state/stock-adjustment/stock-adjustment.slice';
import { Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../product/components/search-bar';

// ----------------------------------------------------------------------

export function StockAdjustmentTableToolbar({ dateError }) {
  const dispatch = useDispatch();

  const {
    tableFilters,
    warehouse,
    createEditPage: { branches },
  } = useSelector(selectStockAdjustment);

  // const handleFilterService = useCallback(
  //   (event) => {
  //     const newValue =
  //       typeof event.target.value === 'string'
  //         ? event.target.value.split(',')
  //         : event.target.value;

  //     onResetPage();
  //     filters.setState({ service: newValue });
  //   },
  //   [filters, onResetPage],
  // );
  const handleFilterStartDate = useCallback(
    (newValue) => {
      dispatch(
        setTableFilters({
          transactionDateFrom: newValue ? newValue.toISOString() : null,
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
          transactionDateTo: newValue ? newValue.toISOString() : null,
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
          sortBy: 'Code',
          sortDirection: 'asc',
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
      <Autocomplete
        sx={{ minWidth: { md: 180 } }}
        value={warehouse}
        options={branches}
        onChange={(event, newValue) => {
          dispatch(setWarehouse(newValue));
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Chi nhánh" />}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      <DatePicker
        label="Ngày bắt đầu"
        value={
          tableFilters.transactionDateFrom
            ? dayjs(tableFilters.transactionDateFrom)
            : null
        }
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{ maxWidth: { md: 180 } }}
      />

      <DatePicker
        label="Ngày kết thúc"
        value={
          tableFilters.transactionDateTo
            ? dayjs(tableFilters.transactionDateTo)
            : null
        }
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
          placeholder="Tìm kiếm đơn cập nhật..."
          value={tableFilters.searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Stack>
    </Stack>
  );
}
