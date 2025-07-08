import { useDispatch } from 'react-redux';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime, formatStr } from 'src/utils/format-time';

import { useBoolean } from 'src/hooks/use-boolean';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { LoadingButton } from '@mui/lab';
import {
  confirmPackagingCompleteAsync,
  getOrderByIdAsync,
  updateOrderStatusAsync,
} from 'src/services/order/order.service';
import { OrderBranchDialog } from './order-branch-dialog';

// ----------------------------------------------------------------------

export function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  statusOptions,
  onChangeStatus,
  order,
}) {
  const popover = usePopover();

  const dispatch = useDispatch();

  const branchDialog = useBoolean(false);

  const buttonLoading = useBoolean(false);

  // Tạo logic hiển thị options theo từng bước
  const getAvailableStatusOptions = (currentStatus) => {
    const statusOrder = [
      'Pending',
      'WaitForConfirmPackageBranch',
      'Packaging',
      'Processing',
      'Shipped',
      'Delivered',
      'Received',
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);

    // Chỉ cho phép chuyển đến bước tiếp theo
    const nextSteps = [];

    if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
      // Thêm bước tiếp theo
      nextSteps.push(statusOrder[currentIndex + 1]);
    }

    // Luôn có thể hủy và hoàn trả (trừ khi đã là Cancelled hoặc Refunded)
    if (currentStatus !== 'Cancelled' && currentStatus !== 'Refunded') {
      nextSteps.push('Cancelled');
      nextSteps.push('Refunded');
    }

    return statusOptions.filter((option) => nextSteps.includes(option.value));
  };

  const handleConfirmPacked = async () => {
    try {
      buttonLoading.onTrue();

      await dispatch(
        confirmPackagingCompleteAsync({ id: order.id, body: { notes: '' } }),
      ).unwrap();

      await dispatch(getOrderByIdAsync(order?.id)).unwrap();

      toast.success('Xác nhận đóng hàng thành công');
    } catch (error) {
      console.error('Error confirming packed:', error);
      toast.error('Xác nhận đóng hàng thất bại');
    } finally {
      buttonLoading.onFalse();
    }
  };

  const handleCancelOrder = async () => {
    try {
      buttonLoading.onTrue();

      await dispatch(
        updateOrderStatusAsync({
          id: order.id,
          body: { status: 7, reason: '', notes: '' },
        }),
      ).unwrap();

      await dispatch(getOrderByIdAsync({ id: order?.id })).unwrap();

      toast.success('Hủy đơn hàng thành công');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Hủy đơn hàng thất bại');
    } finally {
      buttonLoading.onFalse();
    }
  };

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> Đơn hàng {orderNumber} </Typography>{' '}
              <Label
                variant="soft"
                color={
                  (status === 'Pending' && 'warning') ||
                  (status === 'WaitForConfirmPackageBranch' && 'warning') ||
                  (status === 'Packaging' && 'warning') ||
                  (status === 'Processing' && 'info') ||
                  (status === 'Shipped' && 'info') ||
                  (status === 'Delivered' && 'success') ||
                  (status === 'Received' && 'success') ||
                  (status === 'Cancelled' && 'error') ||
                  (status === 'Refunded' && 'error') ||
                  'default'
                }
              >
                {status === 'Pending' && 'Chờ xác nhận'}
                {status === 'WaitForConfirmPackageBranch' && 'Chờ chọn kho'}
                {status === 'Packaging' && 'Đang đóng hàng'}
                {status === 'Processing' && 'Chờ lấy hàng'}
                {status === 'Shipped' && 'Đang giao hàng'}
                {status === 'Delivered' && 'Đã giao'}
                {status === 'Received' && 'Đã nhận'}
                {status === 'Cancelled' && 'Đã hủy'}
                {status === 'Refunded' && 'Trả hàng'}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt, formatStr.myFormat.dateTime)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {/* Chỉ hiển thị dropdown button từ Processing trở đi và không phải Cancelled/Refunded */}
          {(status === 'Processing' ||
            status === 'Shipped' ||
            status === 'Delivered' ||
            status === 'Received') &&
            status !== 'Cancelled' &&
            status !== 'Refunded' && (
              <Button
                color="inherit"
                variant="outlined"
                endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                onClick={popover.onOpen}
              >
                {status === 'Processing' && 'Chờ lấy hàng'}
                {status === 'Shipped' && 'Đang giao hàng'}
                {status === 'Delivered' && 'Đã giao'}
                {status === 'Received' && 'Đã nhận'}
              </Button>
            )}

          {status === 'WaitForConfirmPackageBranch' && (
            <LoadingButton
              color="inherit"
              variant="contained"
              onClick={branchDialog.onTrue}
            >
              Chọn kho
            </LoadingButton>
          )}

          {status === 'Packaging' && (
            <LoadingButton
              color="primary"
              variant="contained"
              onClick={handleConfirmPacked}
              loading={buttonLoading.value}
            >
              Hoàn tất đóng hàng
            </LoadingButton>
          )}

          {status === 'Pending' &&
            (() => {
              if (!order?.orderWhen) return false;
              const orderTime = new Date(order.orderWhen);
              const currentTime = new Date();
              const timeDifferenceHours =
                (currentTime - orderTime) / (1000 * 60 * 60);
              return timeDifferenceHours >= 3;
            })() && (
              <LoadingButton
                color="error"
                variant="outlined"
                onClick={handleCancelOrder}
                loading={buttonLoading.value}
              >
                Hủy đơn hàng
              </LoadingButton>
            )}
        </Stack>
      </Stack>

      <OrderBranchDialog
        title="Chọn chi nhánh giao hàng"
        open={branchDialog.value}
        onClose={branchDialog.onFalse}
        list={order?.fulfillments || []}
        order={order}
      />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {getAvailableStatusOptions(status)?.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === status}
              onClick={() => {
                popover.onClose();
                onChangeStatus(option.value);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
