import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDate, fDateRangeShortLabel, formatStr } from 'src/utils/format-time';

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from 'src/components/filters-result';
import {
  resetTableFilters,
  selectOrder,
  setTableFilters,
} from 'src/state/order/order.slice';

// ----------------------------------------------------------------------

export function OrderTableFiltersResult({ totalResults, sx }) {
  const dispatch = useDispatch();

  const { tableFilters } = useSelector(selectOrder);

  const handleResetState = useCallback(() => {
    dispatch(resetTableFilters());
  }, [dispatch]);

  const handleRemoveStatus = useCallback(() => {
    dispatch(
      setTableFilters({
        orderStatuses: 'all',
        pageNumber: 1,
      }),
    );
  }, [dispatch]);

  const handleRemoveStartDate = useCallback(() => {
    dispatch(
      setTableFilters({
        fromDate: undefined,
        pageNumber: 1,
      }),
    );
  }, [dispatch]);

  const handleRemoveEndDate = useCallback(() => {
    dispatch(
      setTableFilters({
        toDate: undefined,
        pageNumber: 1,
      }),
    );
  }, [dispatch]);

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={handleResetState}
      sx={sx}
    >
      <FiltersBlock
        label="Trạng thái:"
        isShow={tableFilters.orderStatuses !== 'all'}
      >
        <Chip
          {...chipProps}
          label={
            (tableFilters.orderStatuses === 'Pending' && 'Chờ xác nhận') ||
            (tableFilters.orderStatuses === 'WaitForConfirmPackageBranch' &&
              'Chờ chọn kho') ||
            (tableFilters.orderStatuses === 'Packaging' && 'Đang đóng hàng') ||
            (tableFilters.orderStatuses === 'Processing' && 'Chờ lấy hàng') ||
            (tableFilters.orderStatuses === 'Shipped' && 'Đang giao hàng') ||
            (tableFilters.orderStatuses === 'Delivered' && 'Đã giao') ||
            (tableFilters.orderStatuses === 'Received' && 'Đã nhận') ||
            (tableFilters.orderStatuses === 'Cancelled' && 'Đã hủy') ||
            (tableFilters.orderStatuses === 'Refunded' && 'Trả hàng')
          }
          onDelete={handleRemoveStatus}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Ngày bắt đầu:"
        isShow={Boolean(tableFilters.fromDate)}
      >
        <Chip
          {...chipProps}
          label={fDate(tableFilters.fromDate, formatStr.myFormat.date)}
          onDelete={handleRemoveStartDate}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Ngày bắt kết thúc:"
        isShow={Boolean(tableFilters.toDate)}
      >
        <Chip
          {...chipProps}
          label={fDate(tableFilters.toDate, formatStr.myFormat.date)}
          onDelete={handleRemoveEndDate}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
