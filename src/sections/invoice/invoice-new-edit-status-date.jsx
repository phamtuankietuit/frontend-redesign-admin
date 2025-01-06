import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function InvoiceNewEditStatusDate() {
  const { watch } = useFormContext();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <Field.Text
        disabled
        name="invoiceNumber"
        label="Invoice number"
        value={values.invoiceNumber}
      />

      <Field.Select
        fullWidth
        name="status"
        label="Trạng thái"
        InputLabelProps={{ shrink: true }}
      >
        {['paid', 'pending', 'overdue', 'draft'].map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{ textTransform: 'capitalize' }}
          >
            {option === 'paid' && 'Đã trả'}
            {option === 'pending' && 'Đang đợi'}
            {option === 'overdue' && 'Quá hạn'}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.DatePicker name="createDate" label="Ngày tạo" />
      <Field.DatePicker name="dueDate" label="Ngày hết hạn" />
    </Stack>
  );
}
