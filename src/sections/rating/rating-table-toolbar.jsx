import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import { Autocomplete, TextField } from '@mui/material';

import {
  selectRating,
  setCommentStatusObj,
  setStarObj,
  setTableFilters,
} from 'src/state/rating/rating.slice';
import SearchBar from '../product/components/search-bar';

const STAR_OPTIONS = [
  { id: 1, name: '1 Sao' },
  { id: 2, name: '2 Sao' },
  { id: 3, name: '3 Sao' },
  { id: 4, name: '4 Sao' },
  { id: 5, name: '5 Sao' },
];

const STATUS_OPTIONS = [
  { id: 1, name: 'Đã đăng' },
  { id: 2, name: 'Đang xem xét' },
  { id: 3, name: 'Đã ẩn' },
];

// ----------------------------------------------------------------------

export function RatingTableToolbar() {
  const dispatch = useDispatch();

  const { tableFilters, starObj, commentStatusObj } = useSelector(selectRating);

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
      <Autocomplete
        sx={{ minWidth: { xs: 1, md: 180 } }}
        value={starObj}
        options={STAR_OPTIONS}
        onChange={(event, newValue) => {
          dispatch(setStarObj(newValue));
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Sao" />}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      <Autocomplete
        sx={{ minWidth: { xs: 1, md: 180 } }}
        value={commentStatusObj}
        options={STATUS_OPTIONS}
        onChange={(event, newValue) => {
          dispatch(setCommentStatusObj(newValue));
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Trạng thái" />}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        flexGrow={1}
        sx={{ width: 1 }}
      >
        <SearchBar
          placeholder="Tìm kiếm mã, tên sản phẩm..."
          value={tableFilters.searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Stack>
    </Stack>
  );
}
