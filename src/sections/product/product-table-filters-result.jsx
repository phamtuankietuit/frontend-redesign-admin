import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { sentenceCase } from 'src/utils/change-case';

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function ProductTableFiltersResult({
  filters,
  totalResults,
  sx,
  publishs,
}) {
  const handleRemoveStock = useCallback(
    (inputValue) => {
      const newValue = filters.state.stock.filter(
        (item) => item !== inputValue,
      );

      filters.setState({ stock: newValue });
    },
    [filters],
  );

  const handleRemovePublish = useCallback(
    (inputValue) => {
      const newValue = filters.state.publish.filter(
        (item) => item !== inputValue,
      );

      filters.setState({ publish: newValue });
    },
    [filters],
  );

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={filters.onResetState}
      sx={sx}
    >
      <FiltersBlock label="Stock:" isShow={!!filters.state.stock.length}>
        {filters.state.stock.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={sentenceCase(item)}
            onDelete={() => handleRemoveStock(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Hiển thị:" isShow={!!filters.state.publish.length}>
        {filters.state.publish.map((item) => {
          const publishOption = publishs.find(
            (option) => option.value === item,
          );
          const publishLabel = publishOption ? publishOption.label : item;
          return (
            <Chip
              {...chipProps}
              key={item}
              label={sentenceCase(publishLabel)}
              onDelete={() => handleRemovePublish(item)}
            />
          );
        })}
      </FiltersBlock>
    </FiltersResult>
  );
}
