import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { toast } from 'sonner';
import { paths } from 'src/routes/paths';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Skeleton } from '@mui/material';

import { selectOrder } from 'src/state/order/order.slice';
import {
  getOrderByIdAsync,
  updateOrderStatusAsync,
} from 'src/services/order/order.service';
import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';

// ----------------------------------------------------------------------

export function OrderDetailsView({ order }) {
  console.log('🚀 ~ OrderDetailsView ~ order:', order);

  const dispatch = useDispatch();

  const { orderLoading } = useSelector(selectOrder);

  const [status, setStatus] = useState(order?.status);

  const handleChangeStatus = useCallback(
    async (newValue) => {
      let orderStatus = 0;

      switch (newValue) {
        case 'Pending':
          orderStatus = 0;
          break;
        case 'Processing':
          orderStatus = 1;
          break;
        case 'WaitForConfirmPackageBranch':
          orderStatus = 2;
          break;
        case 'Packaging':
          orderStatus = 3;
          break;
        case 'Shipped':
          orderStatus = 4;
          break;
        case 'Delivered':
          orderStatus = 5;
          break;
        case 'Received':
          orderStatus = 6;
          break;
        case 'Cancelled':
          orderStatus = 7;
          break;
        case 'Refunded':
          orderStatus = 8;
          break;
        default:
          orderStatus = 0;
          break;
      }

      await dispatch(
        updateOrderStatusAsync({
          id: order.id,
          body: { status: orderStatus, reason: '', notes: '' },
        }),
      ).unwrap();

      await dispatch(getOrderByIdAsync(order?.id)).unwrap();

      toast.success('Cập nhật trạng thái đơn hàng thành công');

      setStatus(newValue);
    },
    [dispatch, order?.id],
  );

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (orderLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={400}
        sx={{ borderRadius: 1 }}
      />
    );
  }

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={order?.orderNumber}
        createdAt={order?.orderWhen}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
        order={order}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems order={order} />

            <OrderDetailsHistory
              history={order?.orderHistories || []}
              order={order}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo order={order} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
