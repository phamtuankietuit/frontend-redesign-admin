import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { logOutAsync, signOut } from 'src/services/auth/auth.service';
import { signOut as signOutSlice } from 'src/state/auth/auth.slice';

import { toast } from 'src/components/snackbar';

export function SignOutButton({ onClose, ...other }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    try {
      dispatch(signOutSlice());
      dispatch(logOutAsync());
      signOut();
      router.refresh();
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    }
  }, [dispatch, onClose, router]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      {...other}
    >
      Đăng xuất
    </Button>
  );
}
