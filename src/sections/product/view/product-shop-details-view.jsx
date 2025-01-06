import { useSelector } from 'react-redux';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { _coursesFeatured } from 'src/_mock';
import { selectProduct } from 'src/state/product/product.slice';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CatalogItemCard } from 'src/components/catalog-item';
import { MyCarousel } from 'src/components/my-carousel/my-carousel';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CartIcon } from '../components/cart-icon';
import { ChatIcon } from '../components/chat-icon';
import { useCheckoutContext } from '../../checkout/context';
import { ProductDetailsSkeleton } from '../product-skeleton';
import { ProductDetailsReview } from '../product-details-review';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';
import { ProductDetailsInformation } from '../product-details-information';

export function ProductShopDetailsView({ product, error, loading }) {
  const { ratings } = useSelector(selectProduct);

  const checkout = useCheckoutContext();

  const tabs = useTabs('information');

  if (loading) {
    return (
      <Container sx={{ mt: 5, mb: 10 }}>
        <ProductDetailsSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5, mb: 10 }}>
        <EmptyContent
          filled
          title="Không tìm thấy sản phẩm!"
          action={
            <Button
              component={RouterLink}
              href="/"
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Trở về danh sách
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <CartIcon totalItems={checkout.totalItems} />

      <CustomBreadcrumbs
        links={[
          { name: 'Trang chủ', href: '/' },
          { name: product?.productType?.displayName, href: '/' },
          { name: product?.name || 'Sản phẩm' },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel
            images={product?.productImages?.map((item) => item.largeImageUrl)}
          />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {product && (
            <ProductDetailsSummary
              product={product}
              // items={checkout.items}
              // onAddCart={checkout.onAddToCart}
              // onGotoStep={checkout.onGotoStep}
              // disableActions={!product?.available}
            />
          )}
        </Grid>
      </Grid>

      <MyCarousel
        title="Khuyến mãi và Mã giảm giá vận chuyển"
        list={_coursesFeatured}
        sx={{
          mt: 5,
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? 'white' : 'grey.800',
          p: 2,
          borderRadius: 1.5,
          boxShadow: 1,
        }}
      />

      <Card sx={{ mt: 5 }}>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            { value: 'information', label: 'Thông tin sản phẩm' },
            { value: 'description', label: 'Mô tả sản phẩm' },
            ...(ratings
              ? [
                  {
                    value: 'reviews',
                    label: `Đánh giá (${ratings?.totalRating})`,
                  },
                ]
              : []),
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
        {tabs.value === 'information' && (
          <ProductDetailsInformation
            productTypeAttributes={product?.attributeProductValues}
          />

          // <CatalogItemCard
          //   name="Sample Product"
          //   thumbnailUrl="https://cdn0.fahasa.com/media/catalog/product/i/m/image_187010.jpg"
          //   minPrice={50000}
          //   maxPrice={50000}
          //   minDiscountPrice={50000}
          //   maxDiscountPrice={50000}
          //   rating={4.5}
          //   soldAmount={15}
          // />
        )}

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description} />
        )}

        {tabs.value === 'reviews' && <ProductDetailsReview ratings={ratings} />}
      </Card>
    </Container>
  );
}
