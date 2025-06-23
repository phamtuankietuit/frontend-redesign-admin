import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';
import { fDate, formatStr, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Avatar, Box, Checkbox } from '@mui/material';

// ----------------------------------------------------------------------

export function New1ProductTableRow({ row, selected, onSelectRow, onViewRow }) {
  return (
    <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
      <TableCell padding="checkbox">
        <Checkbox
          id={String(row.id)}
          checked={selected}
          onClick={onSelectRow}
        />
      </TableCell>

      <TableCell sx={{ maxWidth: 200 }}>
        <Stack direction="row" alignItems="center">
          <Avatar
            alt={row.name}
            src={row.thumbnailImageUrl}
            variant="rounded"
            sx={{ width: 64, height: 64, mr: 2 }}
          />

          <ListItemText
            disableTypography
            primary={
              <Box component="div" sx={{ typography: 'body2' }}>
                {row.id}
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
                {row.name}
              </Link>
            }
            sx={{ display: 'flex', flexDirection: 'column' }}
          />
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

      <TableCell>{fCurrency(row.minUnitPrice)}</TableCell>

      <TableCell>
        <Label variant="soft" color={(row.isActive && 'info') || 'default'}>
          {(row.isActive && 'Hiển thị') || 'Ẩn'}
        </Label>
      </TableCell>
    </TableRow>
  );
}
