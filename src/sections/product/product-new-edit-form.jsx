import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState, useEffect, useCallback } from 'react';

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
  Grid,
  Skeleton,
  TextField,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';
import { rowsWithId, transformVariants } from 'src/utils/helper';

import { selectProduct } from 'src/state/product/product.slice';
import { uploadImagesAsync } from 'src/services/file/file.service';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import {
  createProductAsync,
  getProductOptionsAsync,
  updateProductAsync,
} from 'src/services/product/product.service';
import {
  getProductTypesFlattenAsync,
  getProductTypeAttributesAsync,
} from 'src/services/product-type/product-type.service';

import { toast } from 'src/components/snackbar';
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

export function ProductNewEditForm({ product }) {
  console.log('🚀 ~ ProductNewEditForm ~ product:', product);
  const { createUpdateProductPage } = useSelector(selectProduct);
  // console.log(
  //   '🚀 ~ ProductNewEditForm ~ createUpdateProductPage:',
  //   createUpdateProductPage,
  // );

  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const dispatch = useDispatch();

  const router = useRouter();

  const defaultValues = useMemo(() => {
    const images =
      product?.productImages?.map((item) => item.largeImageUrl) || [];

    return {
      name: product?.name || '',
      description: product?.description || '',
      images,
      productTypeId: product?.productTypeId || '',
      price: 0,
      variants: createUpdateProductPage?.variantsRender || [],
      productVariants: product?.productVariants || [],
      isActive: true,
      selectedAttributes: product?.attributeProductValues || [],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

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
  // console.log('🚀 ~ ProductNewEditForm ~ values:', values);

  useEffect(() => {
    reset(defaultValues);
    if (product) {
      dispatch(getProductTypeAttributesAsync(product?.productTypeId));
      dispatch(getProductOptionsAsync(product?.id));
    }
  }, [product, reset, defaultValues, dispatch]);

  useEffect(() => {
    if (createUpdateProductPage?.variantsRender && product) {
      setValue('variants', createUpdateProductPage?.variantsRender);
      setValue('productVariants', product?.productVariants);
    }
  }, [createUpdateProductPage?.variantsRender, setValue, product]);

  const onSubmit = handleSubmit(async () => {
    try {
      const {
        name,
        description,
        selectedAttributes,
        isActive,
        productTypeId,
        productVariants,
        images,
      } = values;

      const newImages = [];

      await dispatch(uploadImagesAsync(images)).then((action) => {
        if (uploadImagesAsync.fulfilled.match(action)) {
          newImages.push(...action.payload);
        } else {
          toast.error('Có lỗi xảy khi tải ảnh lên, vui lòng thử lại!');
        }
      });

      if (!product) {
        await dispatch(
          createProductAsync({
            name,
            description,
            isActive,
            productTypeId,
            productImages: newImages,
            productVariants,
            attributeProductValues: selectedAttributes,
          }),
        ).then((action) => {
          if (createProductAsync.fulfilled.match(action)) {
            toast.success('Tạo sản phẩm thành công!');
            reset();
            router.push(paths.dashboard.product.edit(action.payload.id));
          } else {
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
          }
        });
      } else {
        const newProductVariants = productVariants.map((item) => {
          const variantOptions = item.variantOptions?.map((vO) => {
            const productOptionId = createUpdateProductPage?.variants.find(
              (v) => v.variantName === vO.name,
            )?.id;

            const productOptionValueId =
              createUpdateProductPage?.variants?.reduce(
                (acc, variant) =>
                  acc || variant?.values?.find((v) => v.value === vO.value),
                null,
              )?.id;

            return { ...vO, productOptionId, productOptionValueId };
          });

          return {
            ...item,
            variantOptions,
          };
        });

        const { productType, unitMeasure, ...restProduct } = product;

        const updateImages = newImages.map((item) => {
          const id = product.productImages.find(
            (img) => img.largeImageUrl === item.largeImageUrl,
          )?.id;

          return {
            id,
            largeImageUrl: item.largeImageUrl,
            thumbnailImageUrl: item.thumbnailImageUrl,
          };
        });

        const body = {
          ...restProduct,
          name,
          description,
          isActive,
          productTypeId: Number(productTypeId),
          productImages: updateImages,
          productVariants: newProductVariants,
          attributeProductValues: selectedAttributes,
        };

        console.log('🚀 ~ onSubmit ~ body:', body);

        dispatch(updateProductAsync({ id: product.id, body })).then(
          (action) => {
            if (updateProductAsync.fulfilled.match(action)) {
              console.log(action.payload);
              toast.success('Cập nhật sản phẩm thành công!');
            } else {
              toast.error('Có lỗi xảy ra, vui lòng thử lại!');
            }
          },
        );
      }
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
        dispatch(getProductTypeAttributesAsync(value.productTypeId));
      }

      if (name === 'variants') {
        setValue('productVariants', transformVariants(value.variants));
      }

      if (values.variants.length > 0) {
        values.variants.forEach((variant, index) => {
          if (name?.includes(`variants[${index}]`)) {
            setValue('productVariants', transformVariants(values.variants));
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, watch, setValue, values.variants, product, isFirstLoading]);

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
            control={control}
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

        <Grid container spacing={3}>
          {createUpdateProductPage?.attributes?.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Controller
                key={item.id}
                name={`selectedAttributes.${index}`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={field.value || null}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    fullWidth
                    options={item.values || []}
                    getOptionLabel={(option) => option.value || ''}
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
                        <li {...props} key={option.attributeValueId}>
                          {option.value || ''}
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
                          attributeId: item.id,
                          name: item.name,
                        });
                      }

                      return filtered;
                    }}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || null);
                    }}
                  />
                )}
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
          setValue={setValue}
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
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                defaultChecked
                inputProps={{ id: 'publish-switch' }}
              />
            )}
          />
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
        {product ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
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
