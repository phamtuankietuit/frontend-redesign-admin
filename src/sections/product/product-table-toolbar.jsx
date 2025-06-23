import { useCallback } from 'react';
import { Autocomplete, Stack, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProduct,
  setIsActiveObject,
  setProductType,
  setTableFilters,
} from 'src/state/product/product.slice';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import SearchBar from './components/search-bar';

// ----------------------------------------------------------------------

const options = [
  { id: 'true', name: 'Hiển thị' },
  { id: 'false', name: 'Ẩn' },
];

export function ProductTableToolbar() {
  const dispatch = useDispatch();

  const { tableFilters, isActiveObject, productType } =
    useSelector(selectProduct);
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

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <Autocomplete
        sx={{ width: { xs: 1, md: 180 } }}
        value={isActiveObject}
        options={options}
        onChange={(event, newValue) => {
          dispatch(setIsActiveObject(newValue));
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            sx={{ width: { xs: 1, md: 180 } }}
            {...params}
            label="Hiển thị"
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      <Autocomplete
        sx={{ width: { xs: 1, md: 180 } }}
        value={productType}
        options={productTypesFlatten}
        onChange={(event, newValue) => {
          dispatch(setProductType(newValue));
        }}
        getOptionLabel={(option) => option.displayName}
        renderInput={(params) => (
          <TextField
            sx={{ width: { xs: 1, md: 180 } }}
            {...params}
            label="Loại sản phẩm"
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.displayName}
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
