import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { getBranchesAsync } from 'src/services/branch/branch.service';
import { selectStockAdjustment } from 'src/state/stock-adjustment/stock-adjustment.slice';

import { Iconify } from 'src/components/iconify';

import { BranchListDialog } from '../branch/branch-list-dialog';

// ----------------------------------------------------------------------

export function StockAdjustmentNewEditBranch({ isEdit }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const values = watch();

  const { branch } = values;

  const branchDialog = useBoolean();

  const dispatch = useDispatch();

  const {
    createEditPage: { branches, branchesTableFilters },
  } = useSelector(selectStockAdjustment);

  useEffect(() => {
    dispatch(getBranchesAsync(branchesTableFilters));
  }, [dispatch, branchesTableFilters]);

  return (
    <>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: 'column', md: 'row' }}
        divider={
          <Divider
            flexItem
            orientation={mdUp ? 'vertical' : 'horizontal'}
            sx={{ borderStyle: 'dashed' }}
          />
        }
        sx={{ p: 3 }}
      >
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: 'text.disabled', flexGrow: 1 }}
            >
              Chi nhánh nhập hàng
            </Typography>

            {!isEdit && (
              <IconButton onClick={branchDialog.onTrue}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            )}
          </Stack>

          {branch ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2">{branch?.name}</Typography>
              <Typography variant="body2">
                {branch?.address?.formattedAddress}
              </Typography>
              <Typography variant="body2">
                {branch?.address?.phoneNumber}
              </Typography>
            </Stack>
          ) : (
            <Typography typography="caption" sx={{ color: 'error.main' }}>
              {errors.branch?.message}
            </Typography>
          )}
        </Stack>
      </Stack>

      <BranchListDialog
        title="Chọn chi nhánh nhập hàng"
        open={branchDialog.value}
        onClose={branchDialog.onFalse}
        selected={(selectedId) => branch?.id === selectedId}
        onSelect={(newBranch) => setValue('branch', newBranch)}
        list={branches}
      />
    </>
  );
}
