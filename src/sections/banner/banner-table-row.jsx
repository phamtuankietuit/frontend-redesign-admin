import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { IconButton, Link } from '@mui/material';
import { fDate, formatStr } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function BannerTableRow({ row, onEditRow, onDeleteRow }) {
  const getStatusColor = (active) => (active ? 'success' : 'error');

  const getStatusLabel = (active) => (active ? 'Hoạt động' : 'Không hoạt động');

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={row?.imageUrl}
          alt={row?.title}
          sx={{ width: 48, height: 48, mr: 2 }}
          variant="rounded"
        />
        <Link underline="hover" color="inherit" onClick={onEditRow}>
          <ListItemText primary={row?.title} secondary={row?.description} />
        </Link>
      </TableCell>
      <TableCell>
        <Label variant="soft" color="info">
          {row?.productTypeName || 'Tất cả sản phẩm'}
        </Label>
      </TableCell>

      <TableCell>
        {fDate(row?.creationTime, formatStr.myFormat.dateTime)}
      </TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row?.isActive)}>
          {getStatusLabel(row?.isActive)}
        </Label>
      </TableCell>

      <TableCell sx={{ px: 1 }}>
        <IconButton color="error" onClick={onDeleteRow}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
