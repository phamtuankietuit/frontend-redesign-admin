import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function OrderDetailsItems({ order }) {
  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ p: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Tổng tiền hàng</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>
          {fCurrency(order?.priceSummary?.subtotal) || '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Giảm giá</Box>
        <Box
          sx={{
            width: 160,
            ...(order?.priceSummary?.productDiscount && {
              color: 'error.main',
            }),
          }}
        >
          {order?.priceSummary?.productDiscount
            ? `- ${fCurrency(order?.priceSummary?.productDiscount)}`
            : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Khuyến mãi</Box>
        <Box
          sx={{
            width: 160,
            ...(order?.priceSummary?.orderVoucherDiscount && {
              color: 'error.main',
            }),
          }}
        >
          {order?.priceSummary?.orderVoucherDiscount
            ? `- ${fCurrency(order?.priceSummary?.orderVoucherDiscount)}`
            : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Phí vận chuyển</Box>
        <Box sx={{ width: 160 }}>
          {order?.priceSummary?.shippingFee
            ? `${fCurrency(order?.priceSummary?.shippingFee)}`
            : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Giảm giá phí vận chuyển</Box>
        <Box
          sx={{
            width: 160,
            ...(order?.priceSummary?.shippingDiscount && {
              color: 'error.main',
            }),
          }}
        >
          {order?.priceSummary?.shippingDiscount
            ? `- ${fCurrency(order?.priceSummary?.shippingDiscount)}`
            : '-'}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <div>Tổng cộng</div>
        <Box sx={{ width: 160 }}>
          {fCurrency(order?.priceSummary?.total) || '-'}
        </Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader title="Chi tiết đơn hàng" />

      <Scrollbar>
        {order?.orderLines?.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            alignItems="center"
            sx={{
              p: 3,
              minWidth: 640,
              borderBottom: (theme) =>
                `dashed 2px ${theme.vars.palette.background.neutral}`,
            }}
          >
            <Avatar
              src={item?.thumbnailUrl}
              variant="rounded"
              sx={{ width: 48, height: 48, mr: 2 }}
            />

            <ListItemText
              primary={item?.productName}
              secondary={item?.productVariantName}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                mt: 0.5,
              }}
            />

            <Box sx={{ typography: 'body2' }}>x{item.quantity}</Box>

            <Stack>
              {item?.recommendedRetailPrice && (
                <Box
                  sx={{
                    textAlign: 'right',
                    color: 'text.disabled',
                    textDecoration: 'line-through',
                    typography: 'subtitle2',
                  }}
                >
                  {fCurrency(item?.recommendedRetailPrice)}
                </Box>
              )}
              <Box
                sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}
              >
                {fCurrency(item?.total)}
              </Box>
            </Stack>
          </Stack>
        ))}
      </Scrollbar>

      {renderTotal}
    </Card>
  );
}
