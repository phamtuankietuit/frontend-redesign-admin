import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDateTime, formatStr } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {
  const collapse = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Link
          color="inherit"
          onClick={onViewRow}
          underline="always"
          sx={{ cursor: 'pointer' }}
        >
          {row?.orderNumber}
        </Link>
      </TableCell>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row?.customerFullName} src={row?.customerAvartarUrl} />

          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Box component="span">{row?.customerFullName}</Box>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row?.customerEmail}
            </Box>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell>
        <ListItemText
          primary={fDateTime(row?.orderWhen, formatStr.myFormat.date)}
          secondary={fDateTime(row?.orderWhen, formatStr.myFormat.time)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell align="center"> {row?.orderLines?.length} </TableCell>
      <TableCell> {fCurrency(row?.total)} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'Pending' && 'warning') ||
            (row.status === 'WaitForConfirmPackageBranch' && 'warning') ||
            (row.status === 'Packaging' && 'warning') ||
            (row.status === 'Processing' && 'info') ||
            (row.status === 'Shipped' && 'info') ||
            (row.status === 'Delivered' && 'success') ||
            (row.status === 'Received' && 'success') ||
            (row.status === 'Cancelled' && 'error') ||
            (row.status === 'Refunded' && 'error') ||
            'default'
          }
        >
          {row.status === 'Pending' && 'Chờ xác nhận'}
          {row.status === 'WaitForConfirmPackageBranch' && 'Chờ chọn kho'}
          {row.status === 'Packaging' && 'Đang đóng hàng'}
          {row.status === 'Processing' && 'Chờ lấy hàng'}
          {row.status === 'Shipped' && 'Đang giao hàng'}
          {row.status === 'Delivered' && 'Đã giao'}
          {row.status === 'Received' && 'Đã nhận'}
          {row.status === 'Cancelled' && 'Đã hủy'}
          {row.status === 'Refunded' && 'Trả hàng'}
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
  );

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
            {row?.orderLines?.map((item) => (
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
                <Avatar
                  src={item?.thumbnailUrl}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />

                <ListItemText
                  primary={item?.productName}
                  secondary={item?.productVariantOptionName}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />

                <div>x{item.quantity} </div>

                <Box sx={{ width: 110, textAlign: 'right' }}>
                  {fCurrency(item.total)}
                </Box>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}
    </>
  );
}
