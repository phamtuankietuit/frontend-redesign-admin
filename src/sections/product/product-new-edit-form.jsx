import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Skeleton,
  TextField,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';

import { rowsWithId } from 'src/utils/helper';
import { fCurrency } from 'src/utils/format-number';

import { selectProductType } from 'src/state/product-type/product-type.slice';
import {
  getProductTypesFlattenAsync,
  getProductTypeAttributesAsync,
} from 'src/services/product-type/product-type.service';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import ProductVariants from './product-variants';
import { ComponentBlock } from '../_examples/component-block';
import { CustomStyling } from '../_examples/mui/tree-view/custom-styling';
import { DataGridProductVariants } from '../_examples/mui/data-grid-view/data-grid-product-variants';

// ----------------------------------------------------------------------

const variantsSchema = zod.object({
  variantName: zod.string().min(1, { message: 'Không được bỏ trống!' }),
  values: zod
    .array(zod.string().min(1, { message: 'Không được bỏ trống!' }))
    .min(1, 'Ít nhất một giá trị!'),
});

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Không được bỏ trống!' }),
  description: schemaHelper.editor({
    message: { required_error: 'Không được bỏ trống!' },
  }),
  images: schemaHelper.files({
    message: { required_error: 'Chưa thêm hình ảnh!' },
    minFiles: 1,
  }),
  productTypeId: zod.string().min(1, { message: 'Chưa chọn loại sản phẩm!' }),
  variants: zod.array(variantsSchema),
});

export function ProductNewEditForm() {
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      images: [],
      productTypeId: '',
      attributes: [],
      price: 0,
      variants: [],
    }),
    [],
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info('DATA', data);
      reset();
      // toast.success(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images],
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const {
    treeView: { items },
  } = useSelector(selectProductType);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(getProductTypesFlattenAsync());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'productTypeId') {
        dispatch(getProductTypeAttributesAsync(value.productTypeId)).then(
          (action) => {
            if (getProductTypeAttributesAsync.fulfilled.match(action)) {
              setValue('attributes', action.payload);
            }
          },
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, watch, setValue]);

  const renderDetails = (
    <Card>
      <CardHeader
        title="Thông tin sản phẩm"
        subheader="Tên, mô tả và hình ảnh sản phẩm"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Tên sản phẩm" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Mô tả sản phẩm</Typography>
          <Field.Editor
            name="description"
            sx={{ maxHeight: 480 }}
            placeholder="Nhập mô tả sản phẩm"
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Hình ảnh</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const filter = createFilterOptions();

  const renderProperties = (
    <Card>
      <CardHeader
        title="Thuộc tính sản phẩm"
        // subheader="Thuộc tính..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <ComponentBlock title="Loại sản phẩm" sx={{ p: 2 }}>
          {items.length === 0 ? (
            <Skeleton animation="wave" height={30} width="100%" />
          ) : (
            <CustomStyling
              name="productTypeId"
              control={control}
              items={items}
            />
          )}
        </ComponentBlock>

        {values.attributes?.map((item) => (
          <Autocomplete
            key={item.id}
            name={item.name}
            fullWidth
            options={item.values}
            getOptionLabel={(option) => option.value}
            renderInput={(params) => (
              <TextField {...params} label={item.name} />
            )}
            renderOption={(props, option) => {
              if (option.inputValue) {
                return (
                  <li {...props} key="new">
                    {`Thêm "${option.inputValue}"`}
                  </li>
                );
              }

              return (
                <li {...props} key={option.id}>
                  {option.value}
                </li>
              );
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;

              const isExisting = options.some(
                (option) => inputValue === option.value,
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  value: `${inputValue}`,
                });
              }

              return filtered;
            }}
          />
        ))}

        {/* <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="code" label="Mã sản phẩm" />

          <Field.Text name="sku" label="SKU" />

          <Field.Text
            name="quantity"
            label="Số lượng"
            placeholder="0"
            type="number"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Select
            native
            name="category"
            label="Phân loại"
            InputLabelProps={{ shrink: true }}
          >
            {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
              <optgroup key={category.group} label={category.group}>
                {category.classify.map((classify) => (
                  <option key={classify} value={classify}>
                    {classify}
                  </option>
                ))}
              </optgroup>
            ))}
          </Field.Select>

          <Field.MultiSelect
            checkbox
            name="colors"
            label="Tác giả"
            options={PRODUCT_AUTHOR_NAME_OPTIONS}
          />

          <Field.MultiSelect
            checkbox
            name="sizes"
            label="Phân loại"
            options={PRODUCT_CATEGORY_NAME_OPTIONS}
          />
        </Box> */}

        {/* <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" spacing={3}>
          <Field.Switch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
          <Field.Text
            name="saleLabel.content"
            label="Tiêu đề Sale"
            fullWidth
            disabled={!values.saleLabel.enabled}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3}>
          <Field.Switch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
          <Field.Text
            name="newLabel.content"
            label="Tiêu đề mới"
            fullWidth
            disabled={!values.newLabel.enabled}
          />
        </Stack> */}
      </Stack>
    </Card>
  );

  const renderProductVariants = (
    <Card>
      <CardHeader
        title="Biến thể sản phẩm"
        subheader="Thêm các biến thể cho sản phẩm của bạn"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <ProductVariants control={control} getValues={getValues} />
      </Stack>
    </Card>
  );

  const renderProductVariantsDetails = (
    <Card>
      <CardHeader
        title="Giá bán"
        subheader="Thêm giá bán cho các biển thể"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <DataGridProductVariants
          data={rowsWithId(values.variants)}
          control={control}
        />
      </Stack>
    </Card>
  );

  const renderPricing = (
    <Card>
      <CardHeader
        title="Thông tin giá"
        subheader="Giá bán hiển thị với khách hàng"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Controller
          name="price"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              type="text"
              label="Giá bán"
              InputLabelProps={{ shrink: true }}
              value={fCurrency(value, { currencyDisplay: 'code' })}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                onChange(Number(rawValue));
              }}
              InputProps={{
                startAdornment: (
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
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={
          <Switch defaultChecked inputProps={{ id: 'publish-switch' }} />
        }
        label="Hiển thị"
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
      >
        Tạo sản phẩm
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}
      >
        {renderDetails}

        {renderProperties}

        {renderProductVariants}

        {values.variants.length > 0 && renderProductVariantsDetails}

        {values.variants.length === 0 && renderPricing}

        {renderActions}
      </Stack>
    </Form>
  );
}
