import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fDateTime, formatStr } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.minUnitPrice);
}

// ----------------------------------------------------------------------

export function RenderCellPublish({ params }) {
  return (
    <Label variant="soft" color={(params.row.isActive && 'info') || 'default'}>
      {params.row.isActive ? 'Hiển thị' : 'Ẩn'}
    </Label>
  );
}

// ----------------------------------------------------------------------

export function RenderCellCreatedAt({ params }) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">
        {fDateTime(new Date(), formatStr.myFormat.date)}
      </Box>
      <Box
        component="span"
        sx={{ typography: 'caption', color: 'text.secondary' }}
      >
        {fDateTime(new Date(), formatStr.myFormat.time)}
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellStock({ params }) {
  return (
    <Stack
      justifyContent="center"
      sx={{ typography: 'caption', color: 'text.secondary' }}
    >
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
      />
      {params.row.inventoryType === 'out of stock' && 'hết hàng'}
      {params.row.inventoryType === 'low stock' && 'còn ít hàng'}
      {params.row.inventoryType === 'in stock' && 'còn hàng'}{' '}
      {!!params.row.available && params.row.available}
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellProduct({ params, onViewRow }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={params.row.thumbnailImageUrl}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Box component="div" sx={{ typography: 'body2' }}>
            {params.row.id}
          </Box>
        }
        secondary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
