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
  selectProduct,
  setIsActiveObject,
  setProductType,
} from 'src/state/product/product.slice';

// ----------------------------------------------------------------------

export function ProductTableFiltersResult({ totalResults, sx }) {
  const dispatch = useDispatch();

  const { isActiveObject, productType } = useSelector(selectProduct);

  const handleRemoveShow = useCallback(() => {
    dispatch(setIsActiveObject(null));
  }, [dispatch]);

  const handleRemoveProductType = useCallback(() => {
    dispatch(setProductType(null));
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
      <FiltersBlock label="Hiển thị:" isShow={!!isActiveObject}>
        <Chip
          {...chipProps}
          label={isActiveObject?.name}
          onDelete={handleRemoveShow}
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
