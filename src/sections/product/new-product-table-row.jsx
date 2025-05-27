import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Avatar, Checkbox, Typography, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export function ProductTableRow({ row, selected, onSelectRow }) {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{
            id: `row-checkbox-${row.id}`,
            'aria-label': `Row checkbox`,
          }}
        />
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center">
          <Avatar
            alt={row.productName}
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
                sx={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 250,
                }}
              >
                {row.productName}
              </Link>
            }
            sx={{ display: 'flex', flexDirection: 'column' }}
          />
        </Stack>
      </TableCell>

      {!row.isSingle ? (
        <TableCell sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {row.variant.optionValues.map((option) => (
              <Typography key={option.name} variant="body2" noWrap>
                {option.name}: {option.value}
              </Typography>
            ))}
          </Stack>
        </TableCell>
      ) : (
        <TableCell sx={{ width: 1 }} />
      )}
    </TableRow>
  );
}
