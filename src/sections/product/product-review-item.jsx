import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ProductReviewItem({ review }) {
  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'row', md: 'column' }}
      sx={{ width: { md: 240 }, textAlign: { md: 'center' } }}
    >
      <Avatar
        src={review.userAvatarUrl}
        sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }}
      />

      <ListItemText
        primary={review.userName}
        // secondary={fDate(review.postedAt)}
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
          mb: 0.5,
        }}
        // secondaryTypographyProps={{ noWrap: true, typography: 'caption', component: 'span' }}
      />
    </Stack>
  );

  const renderContent = (
    <Stack
      spacing={1}
      flexGrow={1}
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Rating
        size="small"
        value={review.ratingValue}
        precision={0.1}
        readOnly
      />

      <Stack
        direction="row"
        alignItems="center"
        sx={{ color: 'success.main', typography: 'caption' }}
      >
        <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
        Đã mua hàng
      </Stack>

      <Typography variant="body2">{review.comment}</Typography>
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: 5, px: { xs: 2.5, md: 0 } }}
    >
      {renderInfo}

      {renderContent}
    </Stack>
  );
}
