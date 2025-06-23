import { useDispatch, useSelector } from 'react-redux';
import {
  resetTableFilters,
  selectStockAdjustment,
  setTableFilters,
  setWarehouse,
} from 'src/state/stock-adjustment/stock-adjustment.slice';
import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDate, formatStr } from 'src/utils/format-time';

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function StockAdjustmentTableFiltersResult({ totalResults, sx }) {
  const dispatch = useDispatch();

  const {
    tableFilters: { transactionStatus, transactionDateFrom, transactionDateTo },
    warehouse,
  } = useSelector(selectStockAdjustment);

  const handleRemoveStatus = useCallback(() => {
    dispatch(
      setTableFilters({
        transactionStatus: 'all',
        pageNumber: 1,
      }),
    );
  }, [dispatch]);

  const handleRemoveWarehouse = useCallback(() => {
    dispatch(setWarehouse(null));
  }, [dispatch]);

  const handleRemoveStartDate = useCallback(() => {
    dispatch(
      setTableFilters({
        transactionDateFrom: undefined,
        pageNumber: 1,
      }),
    );
  }, [dispatch]);

  const handleRemoveEndDate = useCallback(() => {
    dispatch(
      setTableFilters({
        transactionDateTo: undefined,
        pageNumber: 1,
      }),
    );
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
          label={warehouse?.name || ''}
          onDelete={handleRemoveWarehouse}
        />
      </FiltersBlock>

      <FiltersBlock label="Trạng thái:" isShow={transactionStatus !== 'all'}>
        <Chip
          {...chipProps}
          label={
            (transactionStatus === '1' && 'Đang đợi') ||
            (transactionStatus === '2' && 'Hoàn thành') ||
            'Đã hủy'
          }
          onDelete={handleRemoveStatus}
        />
      </FiltersBlock>

      <FiltersBlock label="Ngày bắt đầu:" isShow={Boolean(transactionDateFrom)}>
        <Chip
          {...chipProps}
          label={fDate(transactionDateFrom, formatStr.myFormat.date)}
          onDelete={handleRemoveStartDate}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Ngày bắt kết thúc:"
        isShow={Boolean(transactionDateTo)}
      >
        <Chip
          {...chipProps}
          label={fDate(transactionDateTo, formatStr.myFormat.date)}
          onDelete={handleRemoveEndDate}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
