import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';

import { fDate, formatStr } from 'src/utils/format-time';

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from 'src/components/filters-result';

import {
  selectPromotion,
  resetTableFilters,
  setStatusObj,
  setVoucherTypeObj,
  setValueTypeObj,
  setTableFilters,
} from 'src/state/promotion/promotion.slice';

// ----------------------------------------------------------------------

export function PromotionTableFiltersResult({ totalResults, sx, ...other }) {
  const dispatch = useDispatch();

  const { statusObj, voucherTypeObj, valueTypeObj, tableFilters } =
    useSelector(selectPromotion);

  const handleRemoveStatus = useCallback(() => {
    dispatch(setStatusObj(null));
  }, [dispatch]);

  const handleRemoveVoucherType = useCallback(() => {
    dispatch(setVoucherTypeObj(null));
  }, [dispatch]);
  const handleRemoveValueType = useCallback(() => {
    dispatch(setValueTypeObj(null));
  }, [dispatch]);

  const handleRemoveStartDate = useCallback(() => {
    dispatch(
      setTableFilters({
        startDate: null,
        pageNumber: 1,
      }),
    );
  }, [dispatch]);

  const handleRemoveEndDate = useCallback(() => {
    dispatch(
      setTableFilters({
        endDate: null,
        pageNumber: 1,
      }),
    );
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
      <FiltersBlock label="Trạng thái:" isShow={!!statusObj}>
        <Chip
          {...chipProps}
          label={statusObj?.label || ''}
          onDelete={handleRemoveStatus}
        />
      </FiltersBlock>
      <FiltersBlock label="Loại voucher:" isShow={!!voucherTypeObj}>
        <Chip
          {...chipProps}
          label={voucherTypeObj?.label || ''}
          onDelete={handleRemoveVoucherType}
        />
      </FiltersBlock>{' '}
      <FiltersBlock label="Loại giá trị:" isShow={!!valueTypeObj}>
        <Chip
          {...chipProps}
          label={valueTypeObj?.label || ''}
          onDelete={handleRemoveValueType}
        />
      </FiltersBlock>
      <FiltersBlock label="Ngày bắt đầu:" isShow={!!tableFilters.startDate}>
        <Chip
          {...chipProps}
          label={
            tableFilters.startDate
              ? fDate(tableFilters.startDate, formatStr.myFormat.date)
              : ''
          }
          onDelete={handleRemoveStartDate}
        />
      </FiltersBlock>
      <FiltersBlock label="Ngày kết thúc:" isShow={!!tableFilters.endDate}>
        <Chip
          {...chipProps}
          label={
            tableFilters.endDate
              ? fDate(tableFilters.endDate, formatStr.myFormat.date)
              : ''
          }
          onDelete={handleRemoveEndDate}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
