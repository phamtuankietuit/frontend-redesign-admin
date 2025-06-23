import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from 'src/components/filters-result';
import {
  resetTableFilters,
  selectRating,
  setCommentStatusObj,
  setStarObj,
} from 'src/state/rating/rating.slice';

// ----------------------------------------------------------------------

export function RatingTableFiltersResult({ totalResults, sx }) {
  const dispatch = useDispatch();

  const { starObj, commentStatusObj } = useSelector(selectRating);

  const handleRemoveStatus = useCallback(() => {
    dispatch(setCommentStatusObj(null));
  }, [dispatch]);

  const handleRemoveStar = useCallback(() => {
    dispatch(setStarObj(null));
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
      <FiltersBlock label="Sao:" isShow={!!starObj}>
        <Chip
          {...chipProps}
          label={starObj?.name || ''}
          onDelete={handleRemoveStar}
        />
      </FiltersBlock>

      <FiltersBlock label="Trạng thái:" isShow={!!commentStatusObj}>
        <Chip
          {...chipProps}
          label={commentStatusObj?.name || ''}
          onDelete={handleRemoveStatus}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
