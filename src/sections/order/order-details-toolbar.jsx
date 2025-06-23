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
import { confirmPackagingCompleteAsync } from 'src/services/order/order.service';

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

  const loadingPickBranch = useBoolean(false);
  const handlePickBranch = async () => {
    try {
      loadingPickBranch.onTrue();
      // Simulate API call to pick branch
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Chọn kho thành công');
    } catch (error) {
      toast.error('Chọn kho thất bại');
    } finally {
      loadingPickBranch.onFalse();
    }
  };

  const confirmPacked = useBoolean(false);

  const handleConfirmPacked = async () => {
    try {
      confirmPacked.onTrue();

      await dispatch(
        confirmPackagingCompleteAsync({ id: order.id, body: {} }),
      ).unwrap();

      toast.success('Xác nhận đóng hàng thành công');
    } catch (error) {
      toast.error('Xác nhận đóng hàng thất bại');
    } finally {
      confirmPacked.onFalse();
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
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
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
          </Button>
          <LoadingButton
            color="inherit"
            variant="contained"
            onClick={handlePickBranch}
            loading={loadingPickBranch.value}
          >
            Chọn kho
          </LoadingButton>

          <LoadingButton
            color="primary"
            variant="contained"
            onClick={handleConfirmPacked}
            loading={confirmPacked.value}
          >
            Xác nhận đóng hàng
          </LoadingButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {statusOptions?.map((option) => (
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
