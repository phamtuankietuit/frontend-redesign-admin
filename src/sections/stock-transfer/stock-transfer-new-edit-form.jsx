import dayjs from 'dayjs';
import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { today } from 'src/utils/format-time';

import {
  createStockAdjustmentAsync,
  updateStockAdjustmentAsync,
} from 'src/services/stock-adjustment/stock-adjustment.service';

import { Form, schemaHelper } from 'src/components/hook-form';

import { selectStockTransfer } from 'src/state/stock-transfer/stock-transfer.slice';
import { StockTransferNewEditBranch } from './stock-transfer-new-edit-branch';
import { StockAdjustmentNewEditDetails } from './stock-adjustment-new-edit-details';
import { StockAdjustmentNewEditStatusDate } from './stock-adjustment-new-edit-status-date';

// ----------------------------------------------------------------------

export const NewStockTransferSchema = zod
  .object({
    warehouseFrom: schemaHelper.objectOrNull({
      message: { required_error: 'Chưa chọn chi nhánh chuyển hàng!' },
    }),
    sourceWarehouseId: zod.number(),
    warehouseTo: schemaHelper.objectOrNull({
      message: { required_error: 'Chưa chọn chi nhánh nhận hàng!' },
    }),
    destinationWarehouseId: zod.number(),
    transactionDate: schemaHelper.date({
      message: { required_error: 'Không được bỏ trống!' },
    }),
    code: zod.string().min(1, {
      message: 'Không được bỏ trống!',
    }),
    remarks: zod.string().optional(),
    reason: zod.string().optional(),
    transactionStatus: zod.number(),
    products: zod
      .array(
        zod.object({
          variantId: zod.number(),
          adjustmentType: zod.string(),
          quantity: zod.number().min(1, {
            message: 'Số lượng phải lớn hơn 0',
          }),
          afterQuantity: zod.number().min(0, {
            message: 'Số lượng sau điều chỉnh không được âm',
          }),
          unitCost: zod.number().min(1, {
            message: 'Giá nhập phải lớn hơn 0',
          }),
          remarks: zod.string().optional(),
          reason: zod.string().min(1, {
            message: 'Không được bỏ trống!',
          }),
        }),
      )
      .min(1, {
        message: 'Chưa có biến thể nào trong đơn!',
      }),
  })
  .refine(
    (data) => {
      if (data.warehouseFrom && data.warehouseTo) {
        return data.warehouseFrom.id !== data.warehouseTo.id;
      }
      return true;
    },
    {
      message:
        'Chi nhánh chuyển hàng và chi nhánh nhận hàng không được giống nhau!',
      path: ['warehouseTo'],
    },
  );

// ----------------------------------------------------------------------

export function StockTransferNewEditForm() {
  const {
    createEditPage: { currentStockTransfer },
  } = useSelector(selectStockTransfer);

  const dispatch = useDispatch();

  const router = useRouter();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const isHideUpdateButton = useBoolean(false);

  const defaultValues = useMemo(
    () => ({
      code: currentStockTransfer?.code || '',
      warehouseFrom: null,
      sourceWarehouseId: null,
      warehouseTo: null,
      destinationWarehouseId: null,
      transactionDate: dayjs(currentStockTransfer?.transactionDate) || today(),
      remarks: '',
      reason: '',
      transactionStatus: currentStockTransfer?.transactionStatus || 1,
      products:
        currentStockTransfer?.items.map((item) => ({
          ...item,
          afterQuantity:
            item.adjustmentType === 1
              ? item.totalQuantityBefore + item.quantity
              : item.totalQuantityBefore - item.quantity,
          adjustmentType: item.adjustmentType.toString(),
        })) || [],
    }),

    [currentStockTransfer],
  );

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(NewStockTransferSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleCreate = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      const items = data.products.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        reason: item.reason,
        remarks: item.remarks,
        adjustmentType: Number(item.adjustmentType),
      }));

      const body = {
        code: data.code,
        transactionDate: data.transactionDate,
        remarks: data.remarks,
        reason: data.reason,
        transactionStatus: 1,
        warehouseId: data.branch.id,
        items,
      };

      await dispatch(createStockAdjustmentAsync(body))
        .unwrap()
        .then((response) => {
          reset();
          loadingSave.onFalse();
          toast.success('Tạo đơn thành công!');
          router.push(paths.dashboard.stockAdjustment.edit(response.id));
        });
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
      if (
        error?.message === 'A stock adjustment with this code already exists'
      ) {
        toast.error('Mã đơn đã tồn tại, vui lòng sử dụng mã khác!');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
      }
    }
  });

  const handleCreateAndApply = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      const items = data.products.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        reason: item.reason,
        remarks: item.remarks,
        adjustmentType: Number(item.adjustmentType),
        id: item.id || undefined,
      }));

      const body = {
        code: data.code,
        transactionDate: data.transactionDate,
        remarks: data.remarks,
        reason: data.reason,
        transactionStatus: 2,
        warehouseId: data.branch.id,
        items,
      };

      if (!currentStockTransfer) {
        await dispatch(createStockAdjustmentAsync(body))
          .unwrap()
          .then((response) => {
            reset();
            loadingSend.onFalse();
            toast.success('Tạo đơn thành công!');
            router.push(paths.dashboard.stockAdjustment.edit(response.id));
          });
      } else {
        const newBody = {
          ...body,
          id: currentStockTransfer.id,
          transactionStatus: data.transactionStatus,
        };

        await dispatch(
          updateStockAdjustmentAsync({
            id: currentStockTransfer.id,
            body: newBody,
          }),
        ).unwrap();

        toast.success('Cập nhật đơn thành công!');
        loadingSend.onFalse();
      }
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
      if (
        error?.message === 'A stock adjustment with this code already exists'
      ) {
        toast.error('Mã đơn đã tồn tại, vui lòng sử dụng mã khác!');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
      }
    }
  });

  useEffect(() => {
    reset(defaultValues);
    if (
      currentStockTransfer &&
      (currentStockTransfer.transactionStatus === 2 ||
        currentStockTransfer.transactionStatus === 3)
    ) {
      isHideUpdateButton.onTrue();
    } else {
      isHideUpdateButton.onFalse();
    }
  }, [currentStockTransfer, defaultValues, reset, isHideUpdateButton]);

  return (
    <Form methods={methods}>
      <Card>
        <StockTransferNewEditBranch isEdit={!!currentStockTransfer} />

        <StockAdjustmentNewEditStatusDate
          currentStockAdjustment={currentStockTransfer}
        />

        <Box position="relative">
          {values.transactionStatus !== 1 && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              zIndex={10}
            />
          )}

          <StockAdjustmentNewEditDetails />
        </Box>
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        {!currentStockTransfer && (
          <LoadingButton
            color="inherit"
            size="large"
            variant="outlined"
            loading={loadingSave.value && isSubmitting}
            onClick={handleCreate}
          >
            Tạo
          </LoadingButton>
        )}

        {!isHideUpdateButton.value && (
          <LoadingButton
            size="large"
            variant="contained"
            loading={loadingSend.value && isSubmitting}
            onClick={handleCreateAndApply}
          >
            {currentStockTransfer ? 'Cập nhật' : 'Tạo và áp dụng'}
          </LoadingButton>
        )}
      </Stack>
    </Form>
  );
}
