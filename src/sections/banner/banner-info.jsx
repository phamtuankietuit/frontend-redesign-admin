import { useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import { Field } from 'src/components/hook-form';

import { selectProductType } from 'src/state/product-type/product-type.slice';

// ----------------------------------------------------------------------

export function BannerInfo() {
  const { setValue } = useFormContext();

  const { productTypesFlatten } = useSelector(selectProductType);

  const handleRemoveFile = useCallback(() => {
    setValue('image', null);
  }, [setValue]);

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader
          title="Thông tin banner"
          subheader="Điền thông tin chi tiết banner"
          sx={{ mb: 3 }}
        />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text
            name="title"
            label="Tiêu đề banner *"
            placeholder="Nhập tiêu đề banner..."
          />

          <Field.Autocomplete
            name="productTypeId"
            label="Loại sản phẩm"
            placeholder="Chọn loại sản phẩm..."
            options={productTypesFlatten}
            getOptionLabel={(option) => option.displayName || ''}
            renderOption={(props, option) => (
              <li {...props} key={option.id || 'all'}>
                {option.displayName}
              </li>
            )}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />

          <Field.Switch name="isActive" label="Kích hoạt banner" />
        </Stack>
      </Card>

      <Card>
        <CardHeader
          title="Hình ảnh banner"
          subheader="Tải lên hình ảnh cho banner của bạn"
          sx={{ mb: 3 }}
        />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Upload
            name="image"
            maxSize={3145728}
            maxFiles={1}
            helperText="Kích thước hình lý tưởng là 1200x400px, dung lượng tối đa 3MB"
            onDelete={handleRemoveFile}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
