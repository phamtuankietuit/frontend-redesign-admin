import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { ListItemText } from '@mui/material';
import { fDate, formatStr, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function UserTableRow({ row, onEditRow }) {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.name} src={row.imageUrl} />

          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Link
              color="inherit"
              onClick={onEditRow}
              sx={{ cursor: 'pointer' }}
            >
              {row.fullName}
            </Link>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.email}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phoneNumber}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 1 && 'success') ||
            (row.status === 4 && 'warning') ||
            'error'
          }
        >
          {(row.status === 1 && 'Đang hoạt động') ||
            (row.status === 4 && 'Không hoạt động') ||
            'Khóa tài khoản'}
        </Label>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.customerTypeName === 'Kim cương' && 'info') ||
            (row.customerTypeName === 'Vàng' && 'warning') ||
            (row.customerTypeName === 'Bạc' && 'default') ||
            'primary'
          }
        >
          {row.customerTypeName}
        </Label>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.creationTime, formatStr.myFormat.date)}
          secondary={fTime(row.creationTime, formatStr.myFormat.time)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
    </TableRow>
  );
}
