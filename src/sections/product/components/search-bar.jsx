import { useState, useEffect, useCallback } from 'react';

import { TextField, InputAdornment } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

import { Iconify } from 'src/components/iconify';

const SearchBar = ({
  placeholder = 'Tìm kiếm...',
  value = '',
  onSearchChange,
  ...other
}) => {
  const [searchValue, setSearchValue] = useState(value);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleChangeValue = useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearchValue);
    }
  }, [debouncedSearchValue, onSearchChange]);

  return (
    <TextField
      {...other}
      fullWidth
      placeholder={placeholder}
      value={searchValue}
      onChange={handleChangeValue}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ ml: 1, color: 'text.disabled' }}
            />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
