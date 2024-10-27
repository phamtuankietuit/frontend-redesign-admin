import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { signOut } from 'src/services/auth/auth.service';

import { toast } from 'src/components/snackbar';

export function SignOutButton({ onClose, ...other }) {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      signOut();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    }
  }, [onClose, router]);

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
