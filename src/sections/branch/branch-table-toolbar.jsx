import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';

import { selectBranch, setTableFilters } from 'src/state/branch/branch.slice';

import SearchBar from '../product/components/search-bar';

// ----------------------------------------------------------------------

export function BranchTableToolbar() {
  const dispatch = useDispatch();

  const { tableFilters } = useSelector(selectBranch);

  const handleSearchChange = useCallback(
    (searchValue) => {
      dispatch(
        setTableFilters({
          sortBy: 'Name',
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
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        flexGrow={1}
        sx={{ width: 1 }}
      >
        <SearchBar
          placeholder="Tìm kiếm chi nhánh..."
          value={tableFilters.searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Stack>
    </Stack>
  );
}
