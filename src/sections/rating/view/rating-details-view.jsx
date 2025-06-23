import { useDispatch, useSelector } from 'react-redux';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { selectStock } from 'src/state/stock/stock.slice';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  Link,
  ListItemText,
  Paper,
  Rating,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { selectRating } from 'src/state/rating/rating.slice';
import { Label } from 'src/components/label';
import { LoadingButton } from '@mui/lab';
import {
  approveRatingAsync,
  getRatingByIdAsync,
  restoreRatingAsync,
} from 'src/services/rating/rating.service';
import { useBoolean } from 'src/hooks/use-boolean';
import { toast } from 'sonner';
import { fDate, formatStr } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function RatingDetailsView() {
  const dispatch = useDispatch();

  const { rating } = useSelector(selectRating);

  const loadingApprove = useBoolean(false);

  const loadingRestore = useBoolean(false);

  const handleApproveRating = async () => {
    try {
      loadingApprove.onTrue();

      await dispatch(approveRatingAsync(rating?.id)).unwrap();

      await dispatch(getRatingByIdAsync(rating?.id)).unwrap();

      loadingApprove.onFalse();

      toast.success('Đã duyệt đánh giá thành công!');
    } catch (error) {
      console.error('Error approving rating:', error);
      loadingApprove.onFalse();
    }
  };

  const handleRestoreRating = async () => {
    try {
      loadingRestore.onTrue();

      await dispatch(restoreRatingAsync(rating?.id)).unwrap();

      await dispatch(getRatingByIdAsync(rating?.id)).unwrap();

      loadingRestore.onFalse();

      toast.success('Đã khôi phục đánh giá thành công!');
    } catch (error) {
      console.error('Error approving rating:', error);
      loadingRestore.onFalse();
    }
  };

  if (!rating) {
    return <Skeleton />;
  }

  const Information = (
    <Card>
      <CardHeader
        title="Chi tiết đánh giá"
        sx={{ p: 2 }}
        action={
          <Box sx={{ pr: 2, pt: 1 }}>
            <Label
              variant="soft"
              color={
                (rating?.status === 1 && 'success') ||
                (rating?.status === 2 && 'warning') ||
                'error'
              }
            >
              {(rating?.status === 1 && 'Đã đăng') ||
                (rating?.status === 2 && 'Đang xem xét') ||
                'Đã ẩn'}
            </Label>
          </Box>
        }
      />

      <Divider />

      <Stack sx={{ mx: 'auto', p: 3 }} spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack sx={{ width: { xs: '100%', md: '50%' } }} spacing={1}>
            <Typography variant="subtitle1">Khách hàng</Typography>

            <Stack spacing={2} direction="row" alignItems="center" height={64}>
              <Avatar alt={rating?.fullName} src={rating?.userAvatarUrl} />

              <Stack
                sx={{
                  typography: 'body2',
                  flex: '1 1 auto',
                  alignItems: 'flex-start',
                }}
              >
                <Link
                  color="inherit"
                  sx={{ cursor: 'pointer' }}
                  href={paths.dashboard.user.edit(rating?.customerId)}
                >
                  {rating?.fullName}
                </Link>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {rating?.userName}
                </Box>
              </Stack>
            </Stack>
          </Stack>

          <Stack sx={{ width: { xs: '100%', md: '50%' } }} spacing={1}>
            <Typography variant="subtitle1">Sản phẩm</Typography>

            <Stack direction="row" alignItems="center" height={64}>
              <Avatar
                alt={rating?.product?.name}
                src={rating?.product?.thumbnailImageUrl}
                variant="rounded"
                sx={{ width: 64, height: 64, mr: 2 }}
              />

              <ListItemText
                disableTypography
                primary={
                  <Box component="div" sx={{ typography: 'body2' }}>
                    {rating?.product?.id}
                  </Box>
                }
                secondary={
                  <Tooltip title={rating?.product?.name} placement="top">
                    <Link
                      noWrap
                      color="inherit"
                      variant="subtitle2"
                      sx={{
                        cursor: 'pointer',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                      }}
                      href={paths.dashboard.product.details(
                        rating?.product?.id,
                      )}
                    >
                      {rating?.product?.name}
                    </Link>
                  </Tooltip>
                }
                sx={{ display: 'flex', flexDirection: 'column' }}
              />
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack sx={{ width: { xs: '100%', md: '50%' } }} spacing={1}>
            <Typography variant="subtitle1">Nội dung</Typography>

            <Typography
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                maxWidth: '200px',
                typography: 'body2',
              }}
            >
              {rating?.comment}
            </Typography>
          </Stack>

          <Stack sx={{ width: { xs: '100%', md: '50%' } }} spacing={1}>
            <Typography variant="subtitle1">Đánh giá</Typography>

            <Rating
              size="small"
              value={rating?.ratingValue || 0}
              precision={0.1}
              readOnly
              sx={{ mr: 1 }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const AIJudge = (
    <Card>
      <CardHeader title="Đánh giá bởi  AI" sx={{ p: 2 }} />

      <Divider />

      <Stack sx={{ mx: 'auto', p: 3 }} spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack sx={{ width: { xs: '100%', md: '50%' } }} spacing={1}>
            <Typography variant="subtitle1">Đánh giá</Typography>

            {rating?.aiModerationScore ? (
              <Label
                sx={{ width: 'fit-content' }}
                color={
                  rating?.aiModerationScore <= 30
                    ? 'success'
                    : rating?.aiModerationScore <= 50
                      ? 'warning'
                      : rating?.aiModerationScore <= 70
                        ? 'error'
                        : 'error'
                }
              >
                {rating?.aiModerationScore <= 30 && '✅ An toàn'}
                {rating?.aiModerationScore > 30 &&
                  rating?.aiModerationScore <= 50 &&
                  '⚠️ Cần xem xét'}
                {rating?.aiModerationScore > 50 &&
                  rating?.aiModerationScore <= 70 &&
                  '❗ Có vấn đề'}
                {rating?.aiModerationScore > 70 && '⛔ Vi phạm'}
              </Label>
            ) : (
              <Label sx={{ width: 'fit-content' }} color="info">
                Chưa có đánh giá từ AI
              </Label>
            )}
          </Stack>

          <Stack sx={{ width: { xs: '100%', md: '50%' } }} spacing={1}>
            <Typography variant="subtitle1">Phân loại</Typography>

            <Typography
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                maxWidth: '200px',
                typography: 'body2',
              }}
            >
              {`${rating?.aiModerationCategory}` || 'Chưa có đánh giá từ AI'}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack sx={{ width: { xs: '100%', md: '50%' } }} spacing={1}>
            <Typography variant="subtitle1">Lý do</Typography>

            <Typography
              sx={{
                // display: '-webkit-box',
                // WebkitLineClamp: 2,
                // WebkitBoxOrient: 'vertical',
                // overflow: 'hidden',
                // textOverflow: 'ellipsis',
                // whiteSpace: 'normal',
                maxWidth: '200px',
                typography: 'body2',
              }}
            >
              {rating?.aiModerationExplanation || 'Chưa có đánh giá từ AI'}
            </Typography>
          </Stack>

          <Stack sx={{ width: { xs: '100%', md: '50%' } }} spacing={1}>
            <Typography variant="subtitle1">Ngày đánh giá</Typography>

            <Typography
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                maxWidth: '200px',
                typography: 'body2',
              }}
            >
              {fDate(rating?.aiModerationDate, formatStr.myFormat.dateTime) ||
                'Chưa có đánh giá từ AI'}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
  const Report = (
    <Card>
      <CardHeader
        title="Báo cáo đánh giá"
        sx={{ p: 2 }}
        action={
          <Box sx={{ pr: 2, pt: 1 }}>
            <Label variant="soft" color="error">
              {rating?.reportsCount || 0} Báo cáo
            </Label>
          </Box>
        }
      />

      <Divider />

      <Stack sx={{ mx: 'auto', p: 2 }} spacing={3}>
        {rating?.reports?.length > 0 ? (
          rating?.reports.map((report) => (
            <Stack
              key={report.id}
              spacing={1}
              sx={{
                bgcolor: 'background.neutral',
                p: 2,
                borderRadius: 1,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle1">{report.reason}</Typography>
              <Typography variant="body2">{report.detailedReason}</Typography>
              <Typography variant="body2" color="text.secondary">
                Người báo cáo: {report.customerFullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Thời gian:{' '}
                {new Date(report.creationTime).toLocaleString('vi-VN')}
              </Typography>
            </Stack>
          ))
        ) : (
          <Typography variant="body2">Không có báo cáo nào</Typography>
        )}
      </Stack>
    </Card>
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Chi tiết đánh giá"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách đánh giá', href: paths.dashboard.rating.root },
          { name: rating?.id || 'Chi tiết đánh giá' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Stack direction="row" spacing={1}>
            {rating?.status === 2 && (
              <LoadingButton
                variant="contained"
                size="medium"
                color="primary"
                loading={loadingApprove.value}
                onClick={handleApproveRating}
              >
                Duyệt đánh giá
              </LoadingButton>
            )}
            {rating?.status === 3 && (
              <LoadingButton
                variant="contained"
                size="medium"
                color="warning"
                loading={loadingRestore.value}
                onClick={handleRestoreRating}
              >
                Hiển thị đánh giá
              </LoadingButton>
            )}
          </Stack>
        }
      />

      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', width: 1 }}>
        {Information}

        {AIJudge}

        {Report}
      </Stack>
    </DashboardContent>
  );
}
