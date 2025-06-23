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
  selectStock,
  setProductType,
  setWarehouse,
} from 'src/state/stock/stock.slice';

// ----------------------------------------------------------------------

export function NewProductTableFiltersResult({ totalResults, sx }) {
  const dispatch = useDispatch();

  const { productType, warehouse } = useSelector(selectStock);

  const handleRemoveProductType = useCallback(() => {
    dispatch(setProductType(null));
  }, [dispatch]);

  const handleRemoveWarehouse = useCallback(() => {
    dispatch(setWarehouse(null));
  }, [dispatch]);

  const handleResetState = useCallback(() => {
    dispatch(resetTableFilters());
  }, [dispatch]);

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={handleResetState}
      sx={sx}
    >
      <FiltersBlock label="Chi nhánh:" isShow={!!warehouse}>
        <Chip
          {...chipProps}
          label={warehouse?.name}
          onDelete={handleRemoveWarehouse}
        />
      </FiltersBlock>

      <FiltersBlock label="Loại sản phẩm:" isShow={!!productType}>
        <Chip
          {...chipProps}
          label={productType?.displayName}
          onDelete={handleRemoveProductType}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
