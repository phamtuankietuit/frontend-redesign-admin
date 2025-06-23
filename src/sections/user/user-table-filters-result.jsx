import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from 'src/components/filters-result';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetTableFilters,
  selectUser,
  setCustomerType,
  setTableFilters,
} from 'src/state/user/user.slice';

// ----------------------------------------------------------------------

export function UserTableFiltersResult({ totalResults, sx }) {
  const dispatch = useDispatch();

  const {
    tableFilters: { status },
    customerType,
  } = useSelector(selectUser);

  const handleRemoveStatus = useCallback(() => {
    dispatch(setTableFilters({ status: 'all', pageNumber: 1 }));
  }, [dispatch]);

  const handleRemoveCustomerType = useCallback(() => {
    dispatch(setCustomerType(null));
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetTableFilters());
  }, [dispatch]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Trạng thái:" isShow={status !== 'all'}>
        <Chip
          {...chipProps}
          label={
            (status === 1 && 'Đang hoạt động') ||
            (status === 4 && 'Không hoạt động') ||
            (status === 6 && 'Khóa tài khoản')
          }
          onDelete={handleRemoveStatus}
        />
      </FiltersBlock>

      <FiltersBlock label="Loại khách hàng:" isShow={!!customerType}>
        <Chip
          {...chipProps}
          label={customerType?.name || ''}
          onDelete={handleRemoveCustomerType}
        />
      </FiltersBlock>

      {/* <FiltersBlock label="Role:" isShow={!!filters.state.role.length}>
        {filters.state.role.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveRole(item)}
          />
        ))}
      </FiltersBlock> */}
    </FiltersResult>
  );
}
