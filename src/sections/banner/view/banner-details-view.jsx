import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'src/routes/hooks';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import { selectBanner } from 'src/state/banner/banner.slice';
import { getBannerByIdAsync } from 'src/services/banner/banner.service';

// ----------------------------------------------------------------------

export function BannerDetailsView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { banner, bannerLoading } = useSelector(selectBanner);

  const getStatusColor = (active) => (active ? 'success' : 'error');

  const getStatusLabel = (active) => (active ? 'Hoạt động' : 'Không hoạt động');

  useEffect(() => {
    if (id) {
      dispatch(getBannerByIdAsync(id));
    }
  }, [dispatch, id]);

  if (bannerLoading) {
    return <LoadingScreen />;
  }

  if (!banner) {
    return (
      <DashboardContent>
        <Typography variant="h6">Banner không tìm thấy</Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Chi tiết banner"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          {
            name: 'Danh sách banner',
            href: paths.dashboard.banner.root,
          },
          { name: banner.title },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={() => router.push(paths.dashboard.banner.edit(id))}
          >
            Chỉnh sửa
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        <Card>
          <CardHeader title="Thông tin banner" sx={{ mb: 3 }} />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tiêu đề:
                    </Typography>
                    <Typography variant="body2">{banner.title}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mô tả:
                    </Typography>
                    <Typography variant="body2">
                      {banner.description || 'Không có mô tả'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Link:
                    </Typography>
                    <Typography variant="body2">
                      {banner.linkUrl || 'Không có link'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Loại sản phẩm:
                    </Typography>
                    <Typography variant="body2">
                      {banner.productTypeName || 'Tất cả sản phẩm'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Thứ tự hiển thị:
                    </Typography>
                    <Typography variant="body2">
                      {banner.displayOrder}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2" color="text.secondary">
                      Trạng thái:
                    </Typography>
                    <Label
                      variant="soft"
                      color={getStatusColor(banner.isActive)}
                    >
                      {getStatusLabel(banner.isActive)}
                    </Label>
                  </Stack>
                </Stack>

                <Box sx={{ width: { xs: '100%', md: 300 } }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Hình ảnh banner:
                  </Typography>
                  {banner.imageUrl ? (
                    <Box
                      component="img"
                      src={banner.imageUrl}
                      alt={banner.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: 'background.neutral',
                      }}
                    >
                      <Typography color="text.disabled">
                        Không có hình ảnh
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
