import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from 'src/components/filters-result';

import {
  selectBanner,
  resetTableFilters,
  setIsActiveObj,
  setProductTypeObj,
} from 'src/state/banner/banner.slice';

// ----------------------------------------------------------------------

export function BannerTableFiltersResult({ totalResults, sx, ...other }) {
  const dispatch = useDispatch();

  const { isActiveObj, productTypeObj } = useSelector(selectBanner);

  const handleRemoveIsActive = useCallback(() => {
    dispatch(setIsActiveObj(null));
  }, [dispatch]);

  const handleRemoveProductType = useCallback(() => {
    dispatch(setProductTypeObj(null));
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetTableFilters());
  }, [dispatch]);

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={handleReset}
      sx={sx}
      {...other}
    >
      <FiltersBlock label="Trạng thái:" isShow={!!isActiveObj}>
        <Chip
          {...chipProps}
          label={isActiveObj?.label}
          onDelete={handleRemoveIsActive}
        />
      </FiltersBlock>

      <FiltersBlock label="Loại sản phẩm:" isShow={!!productTypeObj}>
        <Chip
          {...chipProps}
          label={productTypeObj?.displayName}
          onDelete={handleRemoveProductType}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
