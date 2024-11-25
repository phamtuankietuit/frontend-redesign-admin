import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function OrderTableFiltersResult({
  filters,
  totalResults,
  onResetPage,
  sx,
}) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    filters.setState({ startDate: null, endDate: null });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Trạng thái:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={
            (filters.state.status === 'pending' && 'Chờ xác nhận') ||
            (filters.state.status === 'processing' && 'Đang đóng hàng') ||
            (filters.state.status === 'shipping' && 'Đang giao hàng') ||
            (filters.state.status === 'completed' && 'Hoàn thành') ||
            (filters.state.status === 'cancelled' && 'Đã hủy') ||
            (filters.state.status === 'refunded' && 'Trả hàng')
          }
          onDelete={handleRemoveStatus}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Ngày:"
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(
            filters.state.startDate,
            filters.state.endDate,
          )}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Từ khóa:" isShow={!!filters.state.name}>
        <Chip
          {...chipProps}
          label={filters.state.name}
          onDelete={handleRemoveKeyword}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
