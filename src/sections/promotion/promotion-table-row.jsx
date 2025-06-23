import { useCallback } from 'react';

import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PromotionTableRow({ row, selected, onViewRow }) {
  const {
    description,
    code,
    voucherType,
    valueType,
    value,
    status,
    startTime,
    endTime,
  } = row;

  const getStatusColor = (inStatus) => {
    switch (inStatus) {
      case 1:
      case 'Draft':
        return 'default';
      case 2:
      case 'Active':
        return 'success';
      case 3:
      case 'Paused':
        return 'warning';
      case 4:
      case 'Expired':
        return 'error';
      case 5:
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (inStatus) => {
    switch (inStatus) {
      case 1:
      case 'Draft':
        return 'Bản nháp';
      case 2:
      case 'Active':
        return 'Hoạt động';
      case 3:
      case 'Paused':
        return 'Tạm dừng';
      case 4:
      case 'Expired':
        return 'Hết hạn';
      case 5:
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getVoucherTypeLabel = (type) => {
    switch (type) {
      case 1:
      case 'Order':
        return 'Đơn hàng';
      case 2:
      case 'Shipping':
        return 'Vận chuyển';
      default:
        return type;
    }
  };

  const getValueTypeLabel = (type) => {
    switch (type) {
      case 1:
      case 'Fixed':
        return 'Giá trị cố định';
      case 2:
      case 'Percentage':
        return 'Phần trăm';
      default:
        return type;
    }
  };

  const formatValue = (inValue, inValueType) => {
    if (inValueType === 2 || inValueType === 'Percentage') {
      return `${inValue}%`;
    }
    return fCurrency(inValue);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={description}
          secondary={`Mã: ${code}`}
          primaryTypographyProps={{
            typography: 'body2',
            sx: {
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell>
        <Label variant="soft" color={voucherType === 1 ? 'info' : 'warning'}>
          {getVoucherTypeLabel(voucherType)}
        </Label>
      </TableCell>
      <TableCell>
        <Label variant="soft" color={valueType === 1 ? 'primary' : 'error'}>
          {getValueTypeLabel(valueType)}
        </Label>
      </TableCell>
      <TableCell>{formatValue(value, valueType)}</TableCell>
      <TableCell>
        <Label variant="soft" color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Label>
      </TableCell>
      <TableCell>{fDate(startTime, formatStr.myFormat.dateTime)}</TableCell>
      <TableCell>{fDate(endTime, formatStr.myFormat.dateTime)}</TableCell>
      <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Xem chi tiết" placement="top" arrow>
          <IconButton onClick={onViewRow}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
