import { useDispatch } from 'react-redux';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { setFastMessage } from 'src/state/fast-message/fast-message.slice';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function FastMessageTableRow({ row, onEditRow, onDeleteRow }) {
  const dispatch = useDispatch();

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack
              sx={{
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
              }}
            >
              <Link
                color="inherit"
                onClick={() => {
                  dispatch(setFastMessage(row));
                  onEditRow();
                }}
                sx={{ cursor: 'pointer' }}
              >
                {`/${row.shorthand}`}
              </Link>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            maxWidth: 800,
          }}
        >
          {row.body}
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>

          <MenuItem
            onClick={() => {
              dispatch(setFastMessage(row));
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa"
        content={`Bạn chắc chắn có muốn xóa ${row.shorthand} không?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              onDeleteRow();
            }}
          >
            Xóa
          </Button>
        }
      />
    </>
  );
}
