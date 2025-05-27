import { toast } from 'sonner';
import { useCallback } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Avatar, MenuItem, TextField, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { ProductListDialog } from '../product/product-list-dialog';

// ----------------------------------------------------------------------

export const ACTION_OPTIONS = [
  {
    value: '1',
    label: 'Tăng',
  },
  {
    value: '2',
    label: 'Giảm',
  },
];

export function StockAdjustmentNewEditDetails() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const {
    fields: variants,
    remove: removeVariant,
    append,
  } = useFieldArray({
    control,
    name: 'products',
  });

  const values = watch();

  const handleRemoveVariant = (index) => {
    removeVariant(index);
  };

  const handleChangeQuantity = useCallback(
    (event, index) => {
      const variant = values.products[index];

      if (values.products[index].adjustmentType === '1') {
        setValue(`products[${index}].quantity`, Number(event.target.value));
        setValue(
          `products[${index}].afterQuantity`,
          variant.quantity + variant.totalQuantityBefore,
        );
      } else if (Number(event.target.value) <= variant.totalQuantityBefore) {
        setValue(`products[${index}].quantity`, Number(event.target.value));
        setValue(
          `products[${index}].afterQuantity`,
          variant.totalQuantityBefore - variant.quantity,
        );
      }
    },
    [setValue, values.products],
  );

  const handleChangeAction = useCallback(
    (event, index) => {
      const variant = values.products[index];

      setValue(`products[${index}].adjustmentType`, event.target.value);
      setValue(`products[${index}].quantity`, 0);
      setValue(`products[${index}].afterQuantity`, variant.stockQuantity);
    },
    [setValue, values.products],
  );

  const productDialog = useBoolean(false);

  const handleOpenProductDialog = () => {
    if (values.branch) {
      productDialog.onTrue();
    } else {
      toast.error('Vui lòng chọn chi nhánh trước khi thêm biến thể vào đơn.');
    }
  };

  const handleSelectProduct = (selectedProducts) => {
    const existingProductIds = values.products.map((item) => item.variantId);
    const filteredProducts = selectedProducts.filter(
      (item) => !existingProductIds.includes(item.variantId),
    );
    append(filteredProducts);
  };

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-start"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Field.Text name="reason" rows={3} fullWidth multiline label="Lý do" />

      <Field.Text name="remarks" rows={3} fullWidth multiline label="Ghi chú" />

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <div>Biến thể điều chỉnh:</div>
        <Box sx={{ ml: 1 }}>
          {fCurrency(values.products.length, { currencyDisplay: 'code' }) ||
            '-'}
        </Box>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Chi tiết:
      </Typography>

      {errors.products?.message && (
        <Typography typography="caption" sx={{ color: 'error.main' }}>
          {errors.products?.message}
        </Typography>
      )}

      <Stack
        divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={3}
      >
        {variants.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={3}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ width: 1 }}
              alignItems="center"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  alt={item.name}
                  src={item.thumbnailImageUrl}
                  variant="rounded"
                  sx={{ width: 64, height: 64 }}
                />

                <Stack spacing={0.5} sx={{ width: 1 }}>
                  <ListItemText
                    disableTypography
                    primary={
                      <Box component="div" sx={{ typography: 'body2' }}>
                        {item?.variantId}
                      </Box>
                    }
                    secondary={
                      <Typography
                        color="inherit"
                        variant="subtitle2"
                        sx={{
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 250,
                        }}
                      >
                        {item.productName}
                      </Typography>
                    }
                    sx={{ display: 'flex', flexDirection: 'column' }}
                  />
                  {!item.isSingle && (
                    <Stack direction="column" spacing={0.5}>
                      {item.optionValues.map((option) => (
                        <Typography key={option.name} variant="body2" noWrap>
                          {option.name}: {option.value}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Stack>
              <Field.Select
                name={`products[${index}].adjustmentType`}
                size="small"
                label="Thao tác"
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 160 } }}
                onChange={(event) => handleChangeAction(event, index)}
              >
                <Divider sx={{ borderStyle: 'dashed' }} />

                {ACTION_OPTIONS.map((action) => (
                  <MenuItem key={action.value} value={action.value}>
                    {action.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Controller
                name={`products[${index}].totalQuantityBefore`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="Tồn kho"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={fCurrency(field.value, { currencyDisplay: 'code' })}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ maxWidth: { md: 96 } }}
                  />
                )}
              />
              <Field.Text
                size="small"
                type="number"
                name={`products[${index}].quantity`}
                label="Số lượng"
                placeholder="0"
                onChange={(event) => handleChangeQuantity(event, index)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 96 } }}
              />
              <Controller
                name={`products[${index}].afterQuantity`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="Tồn"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={fCurrency(field.value, { currencyDisplay: 'code' })}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ maxWidth: { md: 96 } }}
                  />
                )}
              />

              <Controller
                name={`products[${index}].unitCost`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    type="text"
                    label="Giá nhập"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={fCurrency(value, { currencyDisplay: 'code' })}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      onChange(Number(rawValue));
                    }}
                    sx={{ maxWidth: { md: 120 } }}
                    error={!!errors.products?.[index]?.unitCost?.message}
                    helperText={errors.products?.[index]?.unitCost?.message}
                  />
                )}
              />
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ width: 1 }}>
              <Field.Text
                name={`products[${index}].reason`}
                rows={1}
                fullWidth
                multiline
                label="Lý do"
              />

              <Field.Text
                name={`products[${index}].remarks`}
                rows={1}
                fullWidth
                multiline
                label="Ghi chú"
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemoveVariant(index)}
            >
              Xóa
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenProductDialog}
          sx={{ flexShrink: 0 }}
        >
          Thêm biến thể
        </Button>
      </Stack>

      {renderTotal}

      <ProductListDialog
        title="Chọn biến thể sản phẩm"
        open={productDialog.value}
        onClose={productDialog.onFalse}
        onSelect={(selectedProducts) => handleSelectProduct(selectedProducts)}
      />
    </Box>
  );
}
