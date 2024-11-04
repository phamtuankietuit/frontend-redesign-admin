import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import { Link, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useSetState } from 'src/hooks/use-set-state';

import { fCurrency, fMyShortenNumber } from 'src/utils/format-number';

import { selectProduct } from 'src/state/product/product.slice';

import { Label } from 'src/components/label';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import MyOption from 'src/components/my-option/my-option';

import { IncrementerButton } from './components/incrementer-button';

// ----------------------------------------------------------------------

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  ...other
}) {
  const { ratings } = useSelector(selectProduct);

  const { id, name, minRecommendedRetailPrice, productVariants } = product;

  const { state, setState, setField, onResetState, canReset } = useSetState({
    available: productVariants.length === 1 ? productVariants[0].quantity : 0,
  });

  const defaultValues = {
    id,
    skuValue: '',
    name,
    quantity: state.available < 1 ? 0 : 1,
    selectedOptions: {},
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleChangeOption = () => {
    if (
      Object.keys(values.selectedOptions).length ===
      product.productVariantOptions.length
    ) {
      const productVariant = productVariants.find((variant) =>
        variant.optionValues.every(
          (optionValue) =>
            values.selectedOptions[optionValue.name] === optionValue.value,
        ),
      );

      if (productVariant) {
        setState({ available: productVariant.quantity });
      }
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    // try {
    //  if (!existProduct) {
    //     onAddCart?.({
    //       ...data,
    //       colors: [values.colors],
    //       subtotal: data.price * data.quantity,
    //     });
    //   }
    //   onGotoStep?.(0);
    //   router.push(paths.product.checkout);

    // } catch (error) {
    // console.error(error);
    // }
  });

  const handleAddCart = useCallback(() => {
    try {
      onAddCart?.({
        ...values,
        colors: [values.colors],
        subtotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>{fCurrency(minRecommendedRetailPrice)}</Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
          ':hover': {
            cursor: 'pointer',
          },
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Yêu Thích
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
          ':hover': {
            cursor: 'pointer',
          },
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Chia sẻ
      </Link>
    </Stack>
  );

  const renderOptions = product?.productVariantOptions?.map((option, index) => (
    <Stack key={option.name} direction="column" gap={2.5}>
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {option.name}
      </Typography>

      <MyOption
        name={`selectedOptions.${option.name}`}
        control={control}
        values={option.values}
        thumbnailImageUrls={option.thumbnailImageUrls}
        largeImageUrls={option.largeImageUrls}
        onChangeOption={handleChangeOption}
      />
    </Stack>
  ));

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Số lượng
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= state.available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography
          variant="caption"
          component="div"
          sx={{ textAlign: 'right' }}
        >
          Kho: {state.available}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={!state.available}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Thêm vào giỏ hàng
      </Button>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={!state.available}
      >
        Mua ngay
      </Button>
    </Stack>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ color: 'text.disabled', typography: 'body2' }}
    >
      <Rating
        size="small"
        value={ratings.averageRating}
        precision={0.1}
        readOnly
        sx={{ mr: 1 }}
      />
      {`(${fMyShortenNumber(ratings.totalRating)} đánh giá)`}
    </Stack>
  );

  const renderLabels = (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Label color="info">MỚI</Label>
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color: (state.available < 1 && 'error.main') || 'success.main',
      }}
    >
      {state.available < 1 && 'Hết hàng'}
      {state.available > 0 && 'Còn hàng'}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}

          {renderInventoryType}

          <Typography variant="h5">{name}</Typography>

          {renderRating}

          {renderPrice}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderOptions}

        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {renderShare}
      </Stack>
    </Form>
  );
}
