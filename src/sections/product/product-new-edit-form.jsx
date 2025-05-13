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
import {
  Grid,
  Button,
  Skeleton,
  TextField,
  LinearProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { toastMessage } from 'src/utils/constant';
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
  getProductTypeByIdAsync,
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
  variantName: zod.string().min(1, { message: toastMessage.error.empty }),
  values: zod.array(
    zod.object({
      id: zod.number().optional(),
      value: zod.string().min(1, { message: toastMessage.error.empty }),
    }),
  ),
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
  productOptionId: zod.number().optional(),
  productOptionValueId: zod.number().optional(),
  value: zod.string(),
});

const itemSchema = zod.object({
  recommendedRetailPrice: zod.number().optional(),
  unitPrice: zod.number().min(0, {
    message: 'Giá bán không hợp lệ!',
  }),
  weight: zod.number().min(1, {
    message: 'Cân nặng không hợp lệ!',
  }),
  stockQuantity: zod.number().min(0, {
    message: 'Số lượng không hợp lệ!',
  }),
  dimension: dimensionSchema,
  taxRate: zod.number().optional(),
  comment: zod.string().optional(),
  variantOptions: zod.array(variantOptionSchema),
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
  productVariants: zod.array(itemSchema).optional(),
  price: zod.number().optional(),
  stockQuantity: zod.number().optional(),
  length: zod.number().optional(),
  width: zod.number().optional(),
  height: zod.number().optional(),
  weight: zod.number().optional(),
});

export function ProductNewEditForm({ product }) {
  const {
    createProductPage: { attributes },
    updateProductPage: { variantsRender },
  } = useSelector(selectProduct);

  const {
    treeView: { items },
  } = useSelector(selectProductType);

  const dispatch = useDispatch();

  const [expandedItems, setExpandedItems] = useState([]);

  const defaultValues = useMemo(() => {
    const images =
      product?.productImages?.map((item) => item.largeImageUrl) || [];

    const isOneVariant = product?.productVariants.length <= 1;

    const oneVariant = product?.productVariants[0] || {};

    return {
      name: product?.name || '',
      description: product?.description || '',
      images,
      productTypeId: String(product?.productTypeId || ''),
      formAttributes: [],
      variants: variantsRender || [],
      isActive: product?.isActive || true,
      productVariants: product?.productVariants || [],
      allStockQuantity: 0,
      allPrice: 0,
      allLength: 0,
      allHeight: 0,
      allWidth: 0,
      allWeight: 0,
      stockQuantity: isOneVariant ? oneVariant.stockQuantity : 0,
      price: isOneVariant ? oneVariant.unitPrice : 0,
      length: isOneVariant ? oneVariant.length : 0,
      height: isOneVariant ? oneVariant.height : 0,
      width: isOneVariant ? oneVariant.width : 0,
      weight: isOneVariant ? oneVariant.weight : 0,
      isViewProductVariants: !(product?.productVariants.length <= 1),
      isViewProductVariantsDetails: product?.productVariants.length > 1,
      isViewPricing: product?.productVariants.length <= 1,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, variantsRender]);

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

  const onItemExpansionToggle = useCallback((e, itemId, isExpanded) => {
    if (!isExpanded) {
      setExpandedItems((prev) => prev.filter((id) => id !== itemId));
    } else {
      setExpandedItems((prev) => [...prev, itemId]);
    }
  }, []);

  const handleExpandTreeView = useCallback(async () => {
    await dispatch(
      getProductTypeByIdAsync({
        id: product?.productTypeId,
        params: { withParent: true },
      }),
    )
      .unwrap()
      .then((res) => {
        const expandIds = res?.map((item) => item.id.toString()) || [];
        setExpandedItems(expandIds);
      });
  }, [dispatch, product]);

  useEffect(() => {
    if (product && Object.keys(defaultValues).length > 0) {
      reset(defaultValues);
      handleExpandTreeView();

      if (product.productVariants.length <= 1) {
        setValue('isViewProductVariants', false);
      }

      dispatch(getProductTypeAttributesAsync(product.productTypeId));

      if (variantsRender.length === 0 && product?.productVariants.length > 1) {
        dispatch(getProductOptionsAsync(product?.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, variantsRender]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const variants = useMemo(() => watch('variants'), [watch('variants')]);
  const productVariants = useMemo(
    () => watch('productVariants'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watch('productVariants')],
  );

  const handleApplyAll = () => {
    const {
      allStockQuantity,
      allPrice,
      allLength,
      allHeight,
      allWidth,
      allWeight,
    } = values;

    productVariants.forEach((_, index) => {
      setValue(`productVariants[${index}].stockQuantity`, allStockQuantity);
      setValue(`productVariants[${index}].unitPrice`, allPrice);
      setValue(`productVariants[${index}].weight`, allWeight);
      setValue(`productVariants[${index}].dimension.length`, allLength);
      setValue(`productVariants[${index}].dimension.width`, allWidth);
      setValue(`productVariants[${index}].dimension.height`, allHeight);
    });
  };

  // TRACK CHANGES
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'productTypeId') {
        dispatch(getProductTypeAttributesAsync(value.productTypeId));
      }

      if (name === 'variants') {
        setValue('productVariants', transformVariants(value.variants));
      }

      if (values?.variants?.length > 0) {
        values?.variants?.forEach((variant, variant_index) => {
          variant?.values?.forEach((_, value_index) => {
            if (
              name ===
                `variants[${variant_index}].values[${value_index}].value` &&
              value.variants[variant_index].values[value_index].value !== ''
            ) {
              setValue('productVariants', transformVariants(value.variants));
            }
          });
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, watch, setValue, values]);

  // ATTRIBUTE
  const formAttributes = watch('formAttributes');

  useEffect(() => {
    const newFormAttributes = attributes.map((item) => {
      let selectedValue = null;

      if (product) {
        const attributeMatching = product?.attributeProductValues?.find(
          (attribute) => attribute.attributeId === item.id,
        );

        selectedValue = item.values.find(
          (value) =>
            value.attributeValueId === attributeMatching?.attributeValueId,
        );
      }

      return {
        ...item,
        selectedValue: selectedValue || null,
        newValue: null,
      };
    });

    setValue('formAttributes', newFormAttributes);
  }, [attributes, product, setValue]);

  // PRODUCT TYPE
  useEffect(() => {
    if (items.length === 0) {
      dispatch(getProductTypesFlattenAsync());
    }
  }, [dispatch, items]);

  // IMAGES
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const images = useMemo(() => watch('images'), [watch('images')]);

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = images?.filter((file) => file !== inputFile);
      setValue('images', filtered, { shouldValidate: true });
    },
    [setValue, images],
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  // SUBMIT
  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name,
        productTypeId,
        description,
        images: imgs,
        isActive,
        formAttributes: dataAttributes,
        productVariants: dataProductVariants,
        stockQuantity,
        weight,
        length,
        width,
        height,
        price,
      } = data;

      const attributeProductValues = dataAttributes?.map((item) => ({
        value: item.newValue || item.selectedValue?.value,
        ...(item.selectedValue && {
          attributeId: item.selectedValue.attributeId,
          attributeValueId: item.selectedValue.attributeValueId,
        }),
        ...(item?.name && {
          name: item.name,
        }),
      }));

      const newImages = [];

      if (imgs.length > 0) {
        imgs.forEach(async (img) => {
          if (typeof img === 'string') {
            newImages.push({
              largeImageUrl: img,
              thumbnailImageUrl: img,
            });
          } else {
            const imgUrls = await dispatch(uploadImagesAsync([img])).unwrap();
            newImages.push({
              largeImageUrl: imgUrls[0],
              thumbnailImageUrl: imgUrls[0],
            });
          }
        });
      }

      const body = {
        ...(product && { id: product.id }),
        name,
        productTypeId: Number(productTypeId),
        productImages: newImages,
        description,
        isActive,
        attributeProductValues,
        productVariants:
          dataProductVariants?.length > 1
            ? dataProductVariants
            : [
                {
                  recommendedRetailPrice: 0,
                  unitPrice: price,
                  weight,
                  dimension: {
                    length,
                    width,
                    height,
                  },
                  taxRate: 0,
                  comment: '',
                  stockQuantity,
                  variantOptions: [],
                },
              ],
      };
      console.log('🚀 ~ onSubmit ~ body:', body);

      if (product) {
        await dispatch(updateProductAsync({ id: product.id, body })).unwrap();
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await dispatch(createProductAsync(body)).unwrap();
        toast.success('Tạo sản phẩm thành công!');
      }
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
          {formAttributes?.map((item, index) => (
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
        <ProductVariants control={control} getValues={getValues} />
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
            name="allStockQuantity"
            control={control}
            render={({ field: { onChange, value } }) => (
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
              />
            )}
          />
          <Controller
            name="allPrice"
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

        <DataGridProductVariants
          data={rowsWithId(variants)}
          control={control}
        />
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
            name="stockQuantity"
            control={control}
            render={({ field: { onChange, value } }) => (
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
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        ₫
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="length"
            control={control}
            render={({ field: { onChange, value } }) => (
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
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="width"
            control={control}
            render={({ field: { onChange, value } }) => (
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
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="height"
            control={control}
            render={({ field: { onChange, value } }) => (
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
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="weight"
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
                    <InputAdornment position="end">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        g
                      </Box>
                    </InputAdornment>
                  ),
                }}
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

  const pathName = usePathname();

  if (!product && pathName !== paths.dashboard.product.new) {
    return (
      <LinearProgress key="primary" color="primary" sx={{ mb: 2, width: 1 }} />
    );
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
        {renderDetails}

        {renderProperties}

        {values.isViewProductVariants && renderProductVariants}

        {productVariants?.length > 1 && renderProductVariantsDetails}

        {values.variants?.length === 0 && renderPricing}

        {renderActions}
      </Stack>
    </Form>
  );
}
