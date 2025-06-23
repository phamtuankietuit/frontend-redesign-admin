import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { z as zod } from 'zod';
import { paths } from 'src/routes/paths';
import { toast } from 'sonner';
import { useParams, useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { selectBanner } from 'src/state/banner/banner.slice';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import { getProductTypesFlattenAsync } from 'src/services/product-type/product-type.service';
import {
  createBannerAsync,
  updateBannerAsync,
  getBannerByIdAsync,
} from 'src/services/banner/banner.service';
import { uploadImagesAsync } from 'src/services/file/file.service';
import { LoadingButton } from '@mui/lab';
import { Skeleton, Stack } from '@mui/material';
import { Form, schemaHelper } from 'src/components/hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BannerInfo } from '../banner-info';

const bannerSchema = zod.object({
  title: zod.string().min(1, {
    message: 'Không được bỏ trống!',
  }),
  image: schemaHelper.file({
    message: { required_error: 'Chưa thêm hình ảnh!' },
  }),
  productTypeId: schemaHelper.objectOrNull(),
  isActive: zod.boolean(),
});

export function BannerCreateView() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  const { banner, bannerLoading } = useSelector(selectBanner);

  const { productTypesFlatten, productTypesFlattenLoading } =
    useSelector(selectProductType);

  const defaultValues = useMemo(
    () => ({
      title: banner?.title || '',
      image: banner?.imageUrl || null,
      productTypeId:
        productTypesFlatten.find((item) => item.id === banner?.productTypeId) ||
        productTypesFlatten[0] ||
        null,
      isActive: banner?.isActive ?? true,
    }),
    [banner, productTypesFlatten],
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(bannerSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (id) {
      dispatch(getBannerByIdAsync(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (banner && !bannerLoading) {
      reset(defaultValues);
    }
  }, [banner, bannerLoading, reset, defaultValues, productTypesFlatten]);

  useEffect(() => {
    dispatch(getProductTypesFlattenAsync());
  }, [dispatch]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let newImage = data.image;

      if (typeof data.image === 'object' && data.image !== null) {
        const imgUrls = await dispatch(
          uploadImagesAsync([data.image]),
        ).unwrap();

        newImage = imgUrls[0];
      }

      const body = {
        title: data.title,
        imageUrl: newImage,
        productTypeId: data.productTypeId?.id || null,
        isActive: data.isActive,
        targetUrl: data?.targetUrl || '',
      };

      if (banner) {
        await dispatch(
          updateBannerAsync({
            id: banner.id,
            body,
          }),
        ).unwrap();

        toast.success('Cập nhật banner thành công!');
      } else {
        await dispatch(createBannerAsync(body))
          .unwrap()
          .then((response) => {
            router.push(paths.dashboard.banner.edit(response.id));
          });

        toast.success('Tạo banner thành công!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    }
  });

  if (bannerLoading || productTypesFlattenLoading) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading={banner ? 'Chỉnh sửa banner' : 'Tạo banner mới'}
          links={[
            { name: 'Trang chủ', href: paths.dashboard.root },
            {
              name: 'Danh sách banner',
              href: paths.dashboard.banner.root,
            },
            { name: banner ? banner?.id : 'Banner mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          animation="wave"
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Form methods={methods} onSubmit={onSubmit}>
        <CustomBreadcrumbs
          heading={banner ? 'Chỉnh sửa banner' : 'Tạo banner mới'}
          links={[
            { name: 'Trang chủ', href: paths.dashboard.root },
            {
              name: 'Danh sách banner',
              href: paths.dashboard.banner.root,
            },
            { name: banner ? banner?.id : 'Banner mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
          <BannerInfo />
        </Stack>

        <Stack
          justifyContent="flex-end"
          direction="row"
          spacing={2}
          sx={{ mt: 3 }}
        >
          <LoadingButton
            type="submit"
            size="large"
            variant="contained"
            loading={isSubmitting}
          >
            {banner ? 'Cập nhật' : 'Tạo mới'}
          </LoadingButton>
        </Stack>
      </Form>
    </DashboardContent>
  );
}
