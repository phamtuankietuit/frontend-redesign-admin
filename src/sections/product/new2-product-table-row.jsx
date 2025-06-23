import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';
import { fDate, formatStr, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Avatar, Box, Collapse, IconButton, Paper } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function New2ProductTableRow({ row, onViewRow }) {
  const collapse = useBoolean();

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.variants.map((item) => {
              const variantName = item.optionValues
                .map((option) => `${option.name}: ${option.value}`)
                .join(', ');

              return (
                <Stack
                  key={item.id}
                  direction="row"
                  alignItems="center"
                  sx={{
                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) =>
                        `solid 2px ${theme.vars.palette.background.neutral}`,
                    },
                  }}
                >
                  <ListItemText
                    primary={variantName}
                    secondary={item?.sku}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />

                  <Box sx={{ width: 110, textAlign: 'right' }}>
                    {`Tồn kho: ${fCurrency(item?.stockQuantity, {
                      currencyDisplay: 'code',
                    })}`}
                  </Box>
                </Stack>
              );
            })}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <TableRow hover tabIndex={-1}>
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

        <TableCell>
          {fCurrency(row.totalStockQuantity, { currencyDisplay: 'code' })}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(row.stockStatus === 'In Stock' && 'success') || 'error'}
          >
            {(row.stockStatus === 'In Stock' && 'Còn hàng') || 'Hết hàng'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={collapse.value ? 'inherit' : 'default'}
            onClick={collapse.onToggle}
            sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderSecondary}
    </>
  );
}
