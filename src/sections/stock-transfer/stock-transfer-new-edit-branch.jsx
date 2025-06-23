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

export function StockTransferNewEditBranch({ isEdit }) {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const values = watch();

  const { warehouseFrom, warehouseTo } = values;

  const warehouseDialog = useBoolean();

  const isFromWarehouse = useBoolean(true);

  const dispatch = useDispatch();

  const {
    createEditPage: { branches, branchesTableFilters },
  } = useSelector(selectStockAdjustment);

  useEffect(() => {
    dispatch(getBranchesAsync(branchesTableFilters));
  }, [dispatch, branchesTableFilters]);

  const handleOpenWarehouseDialog = (code) => {
    if (code === 'from') {
      isFromWarehouse.onTrue();
    } else {
      isFromWarehouse.onFalse();
    }
    warehouseDialog.onTrue();
  };
  const handleSelectWarehouse = (warehouse) => {
    if (isFromWarehouse.value) {
      setValue('warehouseFrom', warehouse);
      setValue('sourceWarehouseId', warehouse.id);
      trigger(['warehouseFrom', 'warehouseTo']);
    } else {
      setValue('warehouseTo', warehouse);
      setValue('destinationWarehouseId', warehouse.id);
      trigger(['warehouseFrom', 'warehouseTo']);
    }
  };

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
        <Stack sx={{ width: 1 }} spacing={1}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: 'text.disabled', flexGrow: 1 }}
            >
              Chi nhánh chuyển hàng
            </Typography>

            {!isEdit && (
              <IconButton onClick={() => handleOpenWarehouseDialog('from')}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            )}
          </Stack>

          {warehouseFrom ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2">{warehouseFrom?.name}</Typography>
              <Typography variant="body2">
                {warehouseFrom?.address?.formattedAddress}
              </Typography>
              <Typography variant="body2">
                {warehouseFrom?.address?.phoneNumber}
              </Typography>
            </Stack>
          ) : (
            <Typography typography="caption" sx={{ color: 'error.main' }}>
              {errors.warehouseFrom?.message}
            </Typography>
          )}
        </Stack>

        <Stack sx={{ width: 1 }} spacing={1}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: 'text.disabled', flexGrow: 1 }}
            >
              Chi nhánh nhận hàng
            </Typography>

            {!isEdit && (
              <IconButton onClick={() => handleOpenWarehouseDialog('to')}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            )}
          </Stack>

          {warehouseTo && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">{warehouseTo?.name}</Typography>
              <Typography variant="body2">
                {warehouseTo?.address?.formattedAddress}
              </Typography>
              <Typography variant="body2">
                {warehouseTo?.address?.phoneNumber}
              </Typography>
            </Stack>
          )}

          {errors.warehouseTo?.message && (
            <Typography typography="caption" sx={{ color: 'error.main' }}>
              {errors.warehouseTo?.message}
            </Typography>
          )}
        </Stack>
      </Stack>

      <BranchListDialog
        title={
          isFromWarehouse.value
            ? `Chọn chi nhánh chuyển hàng`
            : `Chọn chi nhánh nhận hàng`
        }
        open={warehouseDialog.value}
        onClose={warehouseDialog.onFalse}
        onSelect={handleSelectWarehouse}
        list={branches}
      />
    </>
  );
}
