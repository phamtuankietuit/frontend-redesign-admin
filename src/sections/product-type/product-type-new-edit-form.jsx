import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { toastMessage } from 'src/utils/constant';

import { selectProductType } from 'src/state/product-type/product-type.slice';

import { Form, Field } from 'src/components/hook-form';

export const ProductTypeSchema = zod.object({
  name: zod.string().min(1, { message: toastMessage.error.empty }),
});

export const ProductTypeNewEditForm = ({
  open,
  onClose,
  selectedProductType,
}) => {
  const { formMode } = useSelector(selectProductType);

  const defaultValues = useMemo(
    () => ({
      parentName: selectedProductType?.displayName || '',
      name: '',
    }),
    [selectedProductType],
  );

  const defaultValuesEdit = useMemo(
    () => ({
      name: selectedProductType?.displayName || '',
    }),
    [selectedProductType],
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ProductTypeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, [500]));
      console.log('DATA', data);
      handleClearForm();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClearForm = () => {
    if (formMode === 'new') {
      reset(defaultValues);
    } else {
      reset(defaultValuesEdit);
    }
    onClose();
  };

  useEffect(() => {
    if (selectedProductType) {
      if (formMode === 'new') {
        reset(defaultValues);
      } else {
        reset(defaultValuesEdit);
      }
    }
  }, [defaultValues, selectedProductType, reset, defaultValuesEdit, formMode]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {formMode === 'new' ? 'Thêm loại sản phẩm' : 'Cập nhật loại sản phẩm'}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1 }}>
          <Stack spacing={3}>
            {formMode === 'new' && (
              <Field.Text
                name="parentName"
                label="Loại sản phẩm cha đã chọn"
                inputProps={{ readOnly: true }}
              />
            )}
            <Field.Text
              name="name"
              label={
                formMode === 'new'
                  ? 'Tên loại sản phẩm mới'
                  : 'Tên loại sản phẩm'
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={handleClearForm}>
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
};
