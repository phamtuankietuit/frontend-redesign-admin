import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';
import { fDate, formatStr, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function StockAdjustmentTableRow({ row, selected, onViewRow }) {
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Link
              noWrap
              variant="body2"
              onClick={onViewRow}
              sx={{ color: 'black', cursor: 'pointer' }}
            >
              {row.code}
            </Link>
          </Stack>
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

        <TableCell>
          <ListItemText
            primary={fDate(row.transactionDate, formatStr.myFormat.date)}
            secondary={fTime(row.transactionDate, formatStr.myFormat.time)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>{fCurrency(row.totalCost)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.transactionStatus === 2 && 'success') ||
              (row.transactionStatus === 1 && 'warning') ||
              'error'
            }
          >
            {(row.transactionStatus === 2 && 'Hoàn thành') ||
              (row.transactionStatus === 1 && 'Đang đợi') ||
              'Đã hủy'}
          </Label>
        </TableCell>
      </TableRow>
    </>
  );
}
