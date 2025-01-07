import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime, formatStr } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useDispatch } from 'react-redux';
import { sendEmailAsync } from 'src/services/mail/mail.service';

// ----------------------------------------------------------------------

export function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(
      sendEmailAsync({
        emailType: 1,
        email: '21522262@gm.uit.edu.vn',
      }),
    );
    toast.success('Cập nhật đơn hàng thành công');
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
              <Typography variant="h4"> Đơn hàng {orderNumber} </Typography>
              <Label
                variant="soft"
                color={
                  (status === 'completed' && 'success') ||
                  (status === 'pending' && 'warning') ||
                  (status === 'cancelled' && 'error') ||
                  (status === 'processing' && 'warning') ||
                  (status === 'shipping' && 'info') ||
                  'default'
                }
              >
                {status === 'completed' && 'Hoàn thành'}
                {status === 'pending' && 'Chờ xác nhận'}
                {status === 'processing' && 'Đang đóng hàng'}
                {status === 'shipping' && 'Đang giao hàng'}
                {status === 'cancelled' && 'Đã hủy'}
                {status === 'refunded' && 'Trả hàng'}
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
            {status === 'completed' && 'Hoàn thành'}
            {status === 'pending' && 'Chờ xác nhận'}
            {status === 'processing' && 'Đang đóng hàng'}
            {status === 'shipping' && 'Đang giao hàng'}
            {status === 'cancelled' && 'Đã hủy'}
            {status === 'refunded' && 'Trả hàng'}
          </Button>

          <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            In
          </Button>

          <Button
            color="inherit"
            variant="contained"
            onClick={handleSubmit}
            // startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Lưu
          </Button>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {statusOptions.map((option) => (
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
