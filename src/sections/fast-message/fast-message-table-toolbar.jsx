import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';

import {
  setTableFilters,
  selectFastMessage,
} from 'src/state/fast-message/fast-message.slice';

import SearchBar from '../product/components/search-bar';

// ----------------------------------------------------------------------

export function FastMessageTableToolbar() {
  const dispatch = useDispatch();

  const { tableFilters } = useSelector(selectFastMessage);

  const handleSearchChange = useCallback(
    (searchValue) => {
      dispatch(
        setTableFilters({
          sortBy: 'shorthand',
          sortDirection: 'asc',
          searchQuery: searchValue,
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
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        flexGrow={1}
        sx={{ width: 1 }}
      >
        <SearchBar
          placeholder="Tìm kiếm tin nhắn nhanh..."
          value={tableFilters.searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Stack>
    </Stack>
  );
}
