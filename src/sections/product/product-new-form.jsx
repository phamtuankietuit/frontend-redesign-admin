import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Grid, Button, Skeleton, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toastMessage } from 'src/utils/constant';
import { fCurrency } from 'src/utils/format-number';
import { rowsWithId, transformVariants } from 'src/utils/helper';

import { selectProduct } from 'src/state/product/product.slice';
import { uploadImagesAsync } from 'src/services/file/file.service';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import { createProductAsync } from 'src/services/product/product.service';
import {
  getProductTypesFlattenAsync,
  getProductTypeAttributesAsync,
} from 'src/services/product-type/product-type.service';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { ComponentBlock } from '../_examples/component-block';
import { CustomStyling } from '../_examples/mui/tree-view/custom-styling';
import { DataGridProductVariants } from '../_examples/mui/data-grid-view/data-grid-product-variants';
import ProductVariants from './product-variants';

// ----------------------------------------------------------------------

const variantsSchema = zod.object({
  variantName: zod.string().min(1, { message: toastMessage.error.empty }),
  values: zod.array(
    zod.object({
      id: zod.number().optional(),
      value: zod.string().min(1, { message: toastMessage.error.empty }),
    }),
  ),
  id: zod.number().optional(),
});

const dimensionSchema = zod.object({
  length: zod.number().min(1, {
    message: 'Chiều dài không hợp lệ!',
  }),
  width: zod.number().min(1, {
    message: 'Chiều rộng không hợp lệ!',
  }),
  height: zod.number().min(1, {
    message: 'Chiều cao không hợp lệ!',
  }),
});

const variantOptionSchema = zod.object({
  name: zod.string(),
  productOptionId: zod.any().optional(),
  productOptionValueId: zod.any().optional(),
  value: zod.string(),
});

const itemSchema = zod.object({
  id: zod.number().optional(),
  sku: zod.string().optional(),
  recommendedRetailPrice: zod.number().min(1, {
    message: 'Giá bán đề xuất không hợp lệ!',
  }),
  unitPrice: zod.number().min(1, {
    message: 'Giá bán không hợp lệ!',
  }),
  weight: zod.number().min(1, {
    message: 'Cân nặng không hợp lệ!',
  }),
  dimension: dimensionSchema,
  variantOptions: zod.array(variantOptionSchema).optional(),
});

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: toastMessage.error.empty }),
  description: schemaHelper.editor({
    message: { required_error: toastMessage.error.empty },
  }),
  images: schemaHelper.files({
    message: { required_error: 'Chưa thêm hình ảnh!' },
    minFiles: 1,
  }),
  productTypeId: zod.string().min(1, { message: 'Chưa chọn loại sản phẩm!' }),
  formAttributes: schemaHelper.objectOrNull(),
  isActive: zod.boolean(),
  variants: zod.array(variantsSchema),
  productVariants: zod.array(itemSchema),
});

export function ProductNewForm() {
  const dispatch = useDispatch();

  const {
    createProductPage: { attributes },
  } = useSelector(selectProduct);

  const {
    treeView: { items },
  } = useSelector(selectProductType);

  const [expandedItems, setExpandedItems] = useState([]);

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      images: [],
      productTypeId: '',
      formAttributes: [],
      variants: [],
      isActive: true,
      productVariants: [],
      allRecommendedRetailPrice: 0,
      allUnitPrice: 0,
      allLength: 0,
      allHeight: 0,
      allWidth: 0,
      allWeight: 0,
    }),
    [],
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });
  const {
    watch,
    setValue,
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;
  // console.log('🚀 ~ ProductNewEditForm ~ errors:', errors);
  const values = watch();

  const onItemExpansionToggle = useCallback((e, itemId, isExpanded) => {
    if (!isExpanded) {
      setExpandedItems((prev) => prev.filter((id) => id !== itemId));
    } else {
      setExpandedItems((prev) => [...prev, itemId]);
    }
  }, []);

  const handleApplyAll = () => {
    const {
      allRecommendedRetailPrice,
      allUnitPrice,
      allLength,
      allHeight,
      allWidth,
      allWeight,
    } = values;

    values.productVariants.forEach((_, index) => {
      setValue(
        `productVariants[${index}].recommendedRetailPrice`,
        allRecommendedRetailPrice,
      );
      setValue(`productVariants[${index}].unitPrice`, allUnitPrice);
      setValue(`productVariants[${index}].weight`, allWeight);
      setValue(`productVariants[${index}].dimension.length`, allLength);
      setValue(`productVariants[${index}].dimension.width`, allWidth);
      setValue(`productVariants[${index}].dimension.height`, allHeight);
    });
  }; // TRACK CHANGES
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'productTypeId') {
        dispatch(getProductTypeAttributesAsync(value.productTypeId));
      }

      if (name?.startsWith('variants')) {
        const transformedVariants = transformVariants(value.variants);
        setValue('productVariants', transformedVariants);
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, watch, setValue]);

  useEffect(() => {
    const newFormAttributes = attributes.map((item) => ({
      ...item,
      selectedValue: null,
      newValue: null,
    }));

    setValue('formAttributes', newFormAttributes);
  }, [attributes, setValue]);

  // PRODUCT TYPE
  useEffect(() => {
    dispatch(getProductTypesFlattenAsync());
  }, [dispatch]);

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const currentImages = getValues('images');
      const filtered = currentImages?.filter((file) => file !== inputFile);
      setValue('images', filtered, { shouldValidate: true });
    },
    [setValue, getValues],
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const router = useRouter();

  // SUBMIT
  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name,
        productTypeId,
        description,
        images,
        isActive,
        formAttributes: dataAttributes,
        productVariants: dataProductVariants,
      } = data;

      const attributeProductValues = dataAttributes
        ?.map((item) => ({
          value: item.newValue || item.selectedValue?.value,
          attributeId: item.id,
          ...(item.selectedValue && {
            attributeValueId: item.selectedValue.attributeValueId,
          }),
          ...(item?.name && {
            name: item.name,
          }),
        }))
        .filter((item) => item.value);
      const newImages = [];

      if (images.length > 0) {
        const imgUrls = await dispatch(uploadImagesAsync(images)).unwrap();

        if (imgUrls.length > 0) {
          imgUrls.forEach((url) => {
            newImages.push({
              largeImageUrl: url,
              thumbnailImageUrl: url,
            });
          });
        }
      }

      const body = {
        name,
        productTypeId: Number(productTypeId),
        productImages: newImages,
        description,
        isActive,
        attributeProductValues,
        productVariants: dataProductVariants,
      };

      body.productVariants.forEach((variant) => {
        if (!variant.sku) {
          variant.sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        }
      });

      // console.log('🚀 ~ body.productVariants.forEach ~ body:', body);

      await dispatch(createProductAsync(body))
        .unwrap()
        .then((res) => {
          toast.success('Tạo sản phẩm thành công!');
          router.push(paths.dashboard.product.details(res.id));
        });
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  });

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

  const renderProperties = (
    <Card>
      <CardHeader title="Thuộc tính sản phẩm" sx={{ mb: 3 }} />

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
              expandedItems={expandedItems}
              onItemExpansionToggle={onItemExpansionToggle}
            />
          )}
        </ComponentBlock>

        <Grid container spacing={3}>
          {values.formAttributes?.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Field.Autocomplete
                name={`formAttributes.${index}.selectedValue`}
                label={item.name}
                options={item.values || []}
                getOptionLabel={(option) => option?.value || ''}
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                onChange={(_, newValue) => {
                  setValue(`formAttributes.${index}.newValue`, null);
                  setValue(`formAttributes.${index}.selectedValue`, newValue);
                }}
                renderInput={(params) => (
                  <Field.Text
                    {...params}
                    name={`formAttributes.${index}.newValue`}
                    label={item.name}
                    onChange={(e) => {
                      const isExist = item.values?.find(
                        (value) => value.value === e.target.value,
                      );

                      if (isExist) {
                        setValue(
                          `formAttributes.${index}.selectedValue`,
                          isExist,
                        );
                        setValue(`formAttributes.${index}.newValue`, null);
                      } else {
                        setValue(`formAttributes.${index}.selectedValue`, null);
                        setValue(
                          `formAttributes.${index}.newValue`,
                          e.target.value,
                        );
                      }
                    }}
                  />
                )}
                freeSolo
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Card>
  );

  const renderProductVariants = (
    <Card>
      <CardHeader
        title="Biến thể sản phẩm"
        subheader="Thêm biến thể cho sản phẩm"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <ProductVariants />
      </Stack>
    </Card>
  );

  const renderProductVariantsDetails = (
    <Card>
      <CardHeader
        title="Thông tin biến thể"
        subheader="Thêm thông tin cho các biển thể"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Controller
            name="allRecommendedRetailPrice"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                type="text"
                label="Giá bán đề xuất"
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
          <Controller
            name="allUnitPrice"
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
          <Controller
            name="allLength"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                type="text"
                label="Chiè̀u dài"
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
                        cm
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="allHeight"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                type="text"
                label="Chiè̀u cao"
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
                        cm
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="allWidth"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                type="text"
                label="Chiè̀u rộng"
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
                        cm
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="allWeight"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                type="text"
                label="Cân nặng"
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
                        g
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Stack>

        <Button variant="contained" size="large" onClick={handleApplyAll}>
          Áp dụng tất cả
        </Button>

        <DataGridProductVariants data={rowsWithId(values.variants)} />
      </Stack>
    </Card>
  );

  const renderPricing = (
    <Card>
      <CardHeader
        title="Thông tin sản phẩm"
        subheader="Thông tin phục vụ quản lý và giao hàng"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="productVariants[0].sku"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="text"
                label="SKU"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="productVariants[0].recommendedRetailPrice"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="text"
                label="Giá bán đề xuất"
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
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="productVariants[0].unitPrice"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="productVariants[0].dimension.length"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="text"
                label="Chiều dài"
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
                        cm
                      </Box>
                    </InputAdornment>
                  ),
                }}
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="productVariants[0].dimension.width"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="text"
                label="Chiều rộng"
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
                        cm
                      </Box>
                    </InputAdornment>
                  ),
                }}
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="productVariants[0].dimension.height"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="text"
                label="Chiều cao"
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
                        cm
                      </Box>
                    </InputAdornment>
                  ),
                }}
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="productVariants[0].weight"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="text"
                label="Cân nặng"
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
                        g
                      </Box>
                    </InputAdornment>
                  ),
                }}
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Grid>
      </Grid>
    </Card>
  );

  const renderActions = (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
    >
      <Field.Switch name="isActive" label="Hiển thị" />

      <Stack direction="row" spacing={2}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          Tạo sản phẩm
        </LoadingButton>
      </Stack>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
        {renderDetails}

        {renderProperties}

        {renderProductVariants}

        {values.variants?.length > 0 && renderProductVariantsDetails}

        {values.variants?.length === 0 && renderPricing}

        {renderActions}
      </Stack>
    </Form>
  );
}
