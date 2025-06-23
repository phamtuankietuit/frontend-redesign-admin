import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import {
  selectUser,
  setCustomerType,
  setTableFilters,
} from 'src/state/user/user.slice';
import { selectCustomerType } from 'src/state/customer-type/customer-type.slice';

import Stack from '@mui/material/Stack';
import SearchBar from '../product/components/search-bar';

// ----------------------------------------------------------------------

export function UserTableToolbar() {
  const dispatch = useDispatch();

  const { tableFilters, customerType } = useSelector(selectUser);
  const { customerTypes } = useSelector(selectCustomerType);

  const handleSearchChange = useCallback(
    (searchValue) => {
      dispatch(
        setTableFilters({
          sortBy: 'CreationTime',
          sortDirection: 'desc',
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
        value={customerType}
        options={customerTypes}
        onChange={(event, newValue) => {
          dispatch(setCustomerType(newValue));
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Loại khách hàng" />
        )}
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
          placeholder="Tìm kiếm khách hàng..."
          value={tableFilters.searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Stack>
    </Stack>
  );
}
