import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';
import { Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  getOrderByIdAsync,
  selectBranchForPackagingAsync,
} from 'src/services/order/order.service';

// ----------------------------------------------------------------------

export function OrderBranchDialog({
  list,
  open,
  action,
  onClose,
  title = '',
  order,
}) {
  const dispatch = useDispatch();

  const [searchAddress, setSearchAddress] = useState('');

  const [selectedBranch, setSelectedBranch] = useState(null);

  const loadingButton = useBoolean(false);

  const dataFiltered = applyFilter({ inputData: list, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback((address) => {
    setSelectedBranch(address);
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      if (selectedBranch) {
        loadingButton.onTrue();

        const body = {
          branchId: selectedBranch?.branchId,
          notes: '',
        };

        await dispatch(
          selectBranchForPackagingAsync({ id: order?.id, body }),
        ).unwrap();

        await dispatch(getOrderByIdAsync({ id: order?.id })).unwrap();

        setSelectedBranch(null);
        setSearchAddress('');
        onClose();
      }
    } catch (error) {
      console.error('Error confirming branch selection:', error);
      toast.error('Xác nhận chi nhánh thất bại');
    } finally {
      loadingButton.onFalse();
    }
  }, [selectedBranch, onClose, loadingButton, dispatch, order?.id]);

  const handleCancel = useCallback(() => {
    setSelectedBranch(null);
    setSearchAddress('');
    onClose();
  }, [onClose]);

  const renderList = (
    <Scrollbar sx={{ p: 0.5, px: 2, maxHeight: 480, minHeight: 300 }}>
      {dataFiltered.map((branch) => (
        <ButtonBase
          key={branch.id}
          onClick={() => handleSelectAddress(branch)}
          sx={{
            py: 1,
            my: 0.5,
            px: 1.5,
            gap: 0.5,
            width: 1,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            bgcolor:
              selectedBranch?.id === branch.id
                ? 'action.selected'
                : 'transparent',
            border:
              selectedBranch?.id === branch.id
                ? '2px solid'
                : '2px solid transparent',
            borderColor:
              selectedBranch?.id === branch.id ? 'primary.main' : 'transparent',

            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{branch.branchName}</Typography>
            {selectedBranch?.id === branch.id && (
              <Iconify
                icon="eva:checkmark-circle-2-fill"
                sx={{ color: 'primary.main', width: 20, height: 20 }}
              />
            )}
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {branch?.address?.formattedAddress || branch?.branchAddress}
          </Typography>
        </ButtonBase>
      ))}
    </Scrollbar>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleCancel}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Stack>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="Tìm kiếm..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled' }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList
      )}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={handleCancel} color="inherit">
          Hủy
        </Button>
        <LoadingButton
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedBranch}
        >
          Xác nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

function applyFilter({ inputData, query }) {
  if (query) {
    return inputData.filter(
      (branch) =>
        branch.branchName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        branch.branchAddress.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }

  return inputData;
}
