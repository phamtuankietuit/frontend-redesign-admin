import {
  Box,
  capitalize,
  Card,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Chip,
  Autocomplete,
} from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Field } from 'src/components/hook-form';
import { selectCustomerType } from 'src/state/customer-type/customer-type.slice';
import { fCurrency } from 'src/utils/format-number';
import { DISCOUNT_VOUCHER_TYPE_OPTIONS, VALUE_TYPE_OPTIONS } from './constants';
import { TreeViewSelection } from './tree-view-selection';

const PromotionInfo = () => {
  const { control, watch, setValue, trigger } = useFormContext();
  const values = watch();

  const { customerTypes } = useSelector(selectCustomerType);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <Card>
            <CardHeader
              title="Thông tin cơ bản"
              subheader="Thông tin cơ bản về khuyến mãi"
              sx={{ mb: 3 }}
            />

            <Divider />

            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text name="code" label="Mã khuyến mãi" />

              <Field.Text name="description" label="Tên khuyến mãi" />

              <Field.Autocomplete
                name="discountVoucherTypeObject"
                label="Loại khuyến mãi"
                options={DISCOUNT_VOUCHER_TYPE_OPTIONS}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onChange={(event, option) => {
                  setValue('discountVoucherType', option?.value);
                  setValue('discountVoucherTypeObject', option);
                }}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Loại khuyến mãi"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
            </Stack>
          </Card>

          <Card>
            <CardHeader
              title="Thông tin chi tiết"
              subheader="Thông tin chi tiết về khuyến mãi"
              sx={{ mb: 3 }}
            />

            <Divider />

            <Stack spacing={3} sx={{ p: 3 }}>
              <Controller
                name="usageLimitOverall"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="text"
                    label="Số lượng"
                    InputLabelProps={{ shrink: true }}
                    value={fCurrency(value, { currencyDisplay: 'code' })}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      onChange(Number(rawValue));
                    }}
                    error={!!error}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              <Controller
                name="usageLimitPerUser"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="text"
                    label="Số lượng trên mỗi khách hàng"
                    InputLabelProps={{ shrink: true }}
                    value={fCurrency(value, { currencyDisplay: 'code' })}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      onChange(Number(rawValue));
                    }}
                    error={!!error}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              <Controller
                name="minimumSpend"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="text"
                    label="Đơn hàng tối thiểu"
                    InputLabelProps={{ shrink: true }}
                    value={fCurrency(value, { currencyDisplay: 'code' })}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      onChange(Number(rawValue));
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            ₫
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    error={!!error}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              {values.valueType === 2 && (
                <Controller
                  name="maximumDiscountValue"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      fullWidth
                      type="text"
                      label="Giảm giá tối đa"
                      InputLabelProps={{ shrink: true }}
                      value={fCurrency(value, { currencyDisplay: 'code' })}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        onChange(Number(rawValue));
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box
                              component="span"
                              sx={{ color: 'text.disabled' }}
                            >
                              ₫
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                      error={!!error}
                      helperText={error ? error.message : ''}
                    />
                  )}
                />
              )}

              <Field.Autocomplete
                name="valueTypeObject"
                label="Loại giá trị"
                options={VALUE_TYPE_OPTIONS}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onChange={(event, option) => {
                  setValue('valueType', option?.value);
                  setValue('valueTypeObject', option);
                }}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Loại giá trị"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
              <Controller
                name="value"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="text"
                    label="Giá trị"
                    InputLabelProps={{ shrink: true }}
                    value={fCurrency(value, { currencyDisplay: 'code' })}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      onChange(Number(rawValue));
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            {values.valueType === 1 ? `₫` : '%'}
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    error={!!error}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
            </Stack>
          </Card>

          <TreeViewSelection />
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <Card>
            <CardHeader
              title="Thời gian áp dụng"
              subheader="Thông tin thời gian áp dụng khuyến mãi"
              sx={{ mb: 3 }}
            />

            <Divider />

            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.MobileDateTimePicker
                name="startTime"
                label="Thời gian bắt đầu"
              />

              <Field.MobileDateTimePicker
                name="endTime"
                label="Thời gian kết thúc"
              />
            </Stack>
          </Card>

          <Card>
            <CardHeader
              title="Đối tượng áp dụng"
              subheader="Thông tin đối tượng áp dụng khuyến mãi"
              sx={{ mb: 3 }}
            />
            <Divider />{' '}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Controller
                name="customerTypeIds"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    label="Loại khách hàng"
                    multiple
                    options={customerTypes}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    sx={{ width: '100%' }}
                    onChange={(event, value) => {
                      field.onChange(value);
                      // Trigger validation for real-time error feedback
                      trigger('customerTypeIds');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Loại khách hàng"
                        InputLabelProps={{ shrink: true }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {capitalize(option.name)}
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          label={option.name}
                          size="small"
                          variant="soft"
                          color={
                            (option.name === 'Vàng' && 'warning') ||
                            (option.name === 'Kim cương' && 'info') ||
                            (option.name === 'Bạc' && 'default') ||
                            'primary'
                          }
                        />
                      ))
                    }
                  />
                )}
              />
            </Stack>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PromotionInfo;
