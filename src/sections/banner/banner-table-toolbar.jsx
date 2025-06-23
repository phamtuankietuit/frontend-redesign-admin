import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import {
  selectBanner,
  setTableFilters,
  setIsActiveObj,
  setProductTypeObj,
} from 'src/state/banner/banner.slice';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import SearchBar from '../product/components/search-bar';

// ----------------------------------------------------------------------

const IS_ACTIVE_OPTIONS = [
  { value: true, label: 'Hoạt động' },
  { value: false, label: 'Không hoạt động' },
];

export function BannerTableToolbar() {
  const dispatch = useDispatch();

  const { tableFilters, isActiveObj, productTypeObj } =
    useSelector(selectBanner);
  const { productTypesFlatten } = useSelector(selectProductType);

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

  const handleFilterIsActive = useCallback(
    (event, newValue) => {
      dispatch(setIsActiveObj(newValue));
    },
    [dispatch],
  );

  const handleFilterProductType = useCallback(
    (event, newValue) => {
      dispatch(setProductTypeObj(newValue));
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
        <Autocomplete
          sx={{ minWidth: { xs: 1, md: 200 } }}
          value={isActiveObj}
          options={IS_ACTIVE_OPTIONS}
          onChange={handleFilterIsActive}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Trạng thái" />}
          renderOption={(props, option) => (
            <li {...props} key={option.value?.toString()}>
              {option.label}
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />

        <Autocomplete
          sx={{ minWidth: { md: 200 } }}
          value={productTypeObj}
          options={productTypesFlatten}
          onChange={handleFilterProductType}
          getOptionLabel={(option) => option?.displayName}
          renderInput={(params) => (
            <TextField {...params} label="Loại sản phẩm" />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option?.displayName}
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
            placeholder="Tìm kiếm banner..."
            value={tableFilters.searchQuery}
            onSearchChange={handleSearchChange}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
