import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function StockAdjustmentNewEditStatusDate({ currentStockAdjustment }) {
  const { watch } = useFormContext();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <Field.Text
        name="code"
        rows={1}
        fullWidth
        multiline
        label="Mã đơn"
        InputProps={{
          readOnly: !!currentStockAdjustment,
        }}
      />

      {!!currentStockAdjustment && (
        <Field.Select
          fullWidth
          name="transactionStatus"
          label="Trạng thái"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly: currentStockAdjustment?.transactionStatus !== 1,
          }}
        >
          {[1, 2, 3].map((option) => (
            <MenuItem key={option} value={option}>
              {option === 2 && 'Hoàn thành'}
              {option === 3 && 'Hủy'}
              {option === 1 && 'Đang đợi'}
            </MenuItem>
          ))}
        </Field.Select>
      )}

      <Field.DatePicker
        name="transactionDate"
        label="Ngày hết hạn"
        disabled={values.transactionStatus !== 1}
      />
    </Stack>
  );
}
