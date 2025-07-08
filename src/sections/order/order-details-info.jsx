import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate, formatStr } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function OrderDetailsInfo({ order }) {
  const renderCustomer = (
    <>
      <CardHeader title="Thông tin khách hàng" />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={order?.shippingAddress?.receiverName}
          src={order?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack
          spacing={0.5}
          alignItems="flex-start"
          sx={{ typography: 'body2' }}
        >
          <Typography variant="subtitle2">
            {order?.customer?.fullName}
          </Typography>

          <Box sx={{ color: 'text.secondary' }}>{order?.customer?.email}</Box>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader title="Đơn vị vận chuyển" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Giao bởi
          </Box>
          GHN
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Dự kiến giao
          </Box>
          {fDate(order?.expectedDeliveryWhen, formatStr.myFormat.date)}
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader title="Địa chỉ nhận hàng" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Người nhận
          </Box>
          {order?.shippingAddress?.receiverName}
        </Stack>

        <Stack direction="row">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Địa chỉ
          </Box>
          {order?.shippingAddress?.detailedFullAddress}
        </Stack>

        <Stack direction="row">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Số điện thoại
          </Box>
          {order?.shippingAddress?.phoneNumber}
        </Stack>
      </Stack>
    </>
  );

  const renderPayment = (
    <>
      <CardHeader title="Phương thức thanh toán" />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ p: 3, gap: 0.5, typography: 'body2' }}
      >
        {order?.paymentMethod?.name}
      </Box>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderPayment}
    </Card>
  );
}
