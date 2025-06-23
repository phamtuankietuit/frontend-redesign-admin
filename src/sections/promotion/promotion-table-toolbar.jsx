import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  selectPromotion,
  setTableFilters,
  setStatusObj,
  setVoucherTypeObj,
  setValueTypeObj,
} from 'src/state/promotion/promotion.slice';
import SearchBar from '../product/components/search-bar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 1, label: 'Bản nháp' },
  { value: 2, label: 'Hoạt động' },
  { value: 3, label: 'Tạm dừng' },
  { value: 4, label: 'Hết hạn' },
  { value: 5, label: 'Đã hủy' },
];

const VOUCHER_TYPE_OPTIONS = [
  { value: 1, label: 'Đơn hàng' },
  { value: 2, label: 'Vận chuyển' },
];

const VALUE_TYPE_OPTIONS = [
  { value: 1, label: 'Giá trị cố định' },
  { value: 2, label: 'Phần trăm' },
];

export function PromotionTableToolbar({ dateError }) {
  const dispatch = useDispatch();

  const { tableFilters, statusObj, voucherTypeObj, valueTypeObj } =
    useSelector(selectPromotion);

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

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      dispatch(setStatusObj(newValue));
    },
    [dispatch],
  );

  const handleFilterVoucherType = useCallback(
    (event, newValue) => {
      dispatch(setVoucherTypeObj(newValue));
    },
    [dispatch],
  );

  const handleFilterValueType = useCallback(
    (event, newValue) => {
      dispatch(setValueTypeObj(newValue));
    },
    [dispatch],
  );

  const handleStartDate = useCallback(
    (newValue) => {
      dispatch(
        setTableFilters({
          startDate: newValue ? newValue.toISOString() : null,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );

  const handleEndDate = useCallback(
    (newValue) => {
      dispatch(
        setTableFilters({
          endDate: newValue ? newValue.toISOString() : null,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );
  return (
    <Stack spacing={3} sx={{ p: 2.5 }}>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
      >
        <DatePicker
          label="Ngày bắt đầu "
          value={tableFilters.startDate ? dayjs(tableFilters.startDate) : null}
          onChange={handleStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { xs: 1, md: 200 } }}
        />

        <DatePicker
          label="Ngày kết thúc"
          value={tableFilters.endDate ? dayjs(tableFilters.endDate) : null}
          onChange={handleEndDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { xs: 1, md: 200 } }}
        />

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <SearchBar
            placeholder="Tìm kiếm khuyến mãi..."
            value={tableFilters.searchQuery}
            onSearchChange={handleSearchChange}
          />
        </Stack>
      </Stack>

      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'flex-start', md: 'space-between' }}
      >
        <Autocomplete
          fullWidth
          value={statusObj}
          options={STATUS_OPTIONS}
          onChange={handleFilterStatus}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Trạng thái" />}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />

        <Autocomplete
          fullWidth
          value={voucherTypeObj}
          options={VOUCHER_TYPE_OPTIONS}
          onChange={handleFilterVoucherType}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Loại voucher" />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />

        <Autocomplete
          fullWidth
          value={valueTypeObj}
          options={VALUE_TYPE_OPTIONS}
          onChange={handleFilterValueType}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Loại giá trị" />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
      </Stack>
    </Stack>
  );
}
