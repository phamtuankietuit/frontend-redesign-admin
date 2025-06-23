import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { fCurrency } from 'src/utils/format-number';
import { Link } from '@mui/material';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function CustomerTypeTableRow({ row, onEditRow }) {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={
            (row?.name === 'Kim cương' && 'info') ||
            (row?.name === 'Vàng' && 'warning') ||
            (row?.name === 'Bạc' && 'default') ||
            'primary'
          }
          sx={{ cursor: 'pointer' }}
          onClick={onEditRow}
        >
          {row?.name}
        </Label>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {fCurrency(row?.minSpending)}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.tier}</TableCell>
    </TableRow>
  );
}
