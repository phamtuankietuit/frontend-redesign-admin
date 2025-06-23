import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { setBranch } from 'src/state/branch/branch.slice';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {
  Avatar,
  Badge,
  ListItemText,
  Rating,
  Tooltip,
  Typography,
} from '@mui/material';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function RatingTableRow({ row, onEditRow, onClickCustomer }) {
  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        sx={{ cursor: 'pointer' }}
        onClick={onEditRow}
      >
        <TableCell sx={{ maxWidth: 250 }}>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.fullName} src={row.userAvatarUrl} />

            <Stack
              sx={{
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
              }}
            >
              <Link
                color="inherit"
                onClick={onClickCustomer}
                sx={{ cursor: 'pointer' }}
              >
                {row.fullName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.userName}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ minWidth: 250, whiteSpace: 'nowrap' }}>
          <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
            <Avatar
              alt={row.product.name}
              src={row.product.thumbnailImageUrl}
              variant="rounded"
              sx={{ width: 64, height: 64, mr: 2 }}
            />

            <ListItemText
              disableTypography
              primary={
                <Box component="div" sx={{ typography: 'body2' }}>
                  {row.product.id}
                </Box>
              }
              secondary={
                <Tooltip title={row.product.name} placement="top">
                  <Link
                    noWrap
                    color="inherit"
                    variant="subtitle2"
                    sx={{
                      cursor: 'pointer',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                    }}
                    href={paths.dashboard.product.details(row.product.id)}
                  >
                    {row.product.name}
                  </Link>
                </Tooltip>
              }
              sx={{ display: 'flex', flexDirection: 'column' }}
            />
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200 }}>
          <Typography
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              maxWidth: '200px',
              typography: 'body2',
            }}
          >
            {row.comment}
          </Typography>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Rating
            size="small"
            value={row?.ratingValue || 0}
            precision={0.1}
            readOnly
            sx={{ mr: 1 }}
          />
        </TableCell>

        <TableCell>
          <Badge color="error" badgeContent={row?.reportsCount || 0}>
            <Label
              variant="soft"
              color={
                (row.status === 1 && 'success') ||
                (row.status === 2 && 'warning') ||
                'error'
              }
            >
              {(row.status === 1 && 'Đã đăng') ||
                (row.status === 2 && 'Đang xem xét') ||
                'Đã ẩn'}
            </Label>
          </Badge>
        </TableCell>
      </TableRow>
    </>
  );
}
