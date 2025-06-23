import { z as zod } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toastMessage } from 'src/utils/constant';

import { Form, Field } from 'src/components/hook-form';
import { selectCustomerType } from 'src/state/customer-type/customer-type.slice';
import { InputAdornment, TextField } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';
import { updateCustomerTypeAsync } from 'src/services/customer-type/customer-type.service';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export const CustomerTypeSchema = zod.object({
  name: zod.string().min(1, { message: toastMessage.error.empty }),
  minSpending: zod
    .number()
    .min(0, { message: 'Chi tiêu tối thiểu không được âm' }),
});

export function CustomerTypeForm({ open, onClose, onRefetch }) {
  const dispatch = useDispatch();

  const { customerType } = useSelector(selectCustomerType);

  const defaultValues = useMemo(
    () => ({
      name: customerType?.name || '',
      minSpending: customerType?.minSpending || 0,
    }),

    [customerType],
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(CustomerTypeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = {
        id: customerType?.id,
        tier: customerType?.tier,
        name: data.name,
        minSpending: data.minSpending,
      };

      if (customerType) {
        await dispatch(
          updateCustomerTypeAsync({ id: customerType.id, body }),
        ).unwrap();

        toast.success('Cập nhật phân loại khách hàng thành công');

        onRefetch();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật phân loại khách hàng thất bại.');
    }
  });

  useEffect(() => {
    if (customerType && open) {
      reset(defaultValues);
    }
  }, [customerType, defaultValues, reset, open]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      disableRestoreFocus
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Cập nhật phân loại khách hàng</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Field.Text name="name" label="Tên phân loại" />
            <Controller
              name="minSpending"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  type="text"
                  label="Chi tiêu tối thiểu"
                  InputLabelProps={{ shrink: true }}
                  value={fCurrency(value, { currencyDisplay: 'code' })}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    onChange(Number(rawValue));
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          ₫
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Hủy
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
