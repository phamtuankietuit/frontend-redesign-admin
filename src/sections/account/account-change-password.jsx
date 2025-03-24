import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { passwordRegex } from 'src/utils/regex';
import { toastMessage } from 'src/utils/constant';

import { selectAuth } from 'src/state/auth/auth.slice';
import { updatePasswordAsync } from 'src/services/auth/auth.service';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

export const ChangePassWordSchema = zod
  .object({
    oldPassword: zod.string().min(1, { message: toastMessage.error.empty }),
    newPassword: zod
      .string()
      .min(1, { message: toastMessage.error.empty })
      .regex(passwordRegex, {
        message: toastMessage.error.invalidPassword,
      }),
    confirmNewPassword: zod
      .string()
      .min(1, { message: toastMessage.error.empty }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: toastMessage.error.newPasswordMatchOldPassword,
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: toastMessage.error.confirmPasswordNotMatch,
    path: ['confirmNewPassword'],
  });

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const password = useBoolean();

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await dispatch(
        updatePasswordAsync({
          id: user.id,
          body: {
            email: user.email,
            currentPassword: data.oldPassword,
            newPassword: data.newPassword,
          },
        }),
      ).unwrap();

      reset();
      toast.success('Cập nhật mật khẩu thành công!');
    } catch (error) {
      console.error(error);
      if (error.message === 'Invalid credentials were provided.') {
        toast.error('Mật khẩu cũ không đúng!');
      } else {
        toast.error('Có lỗi xảy ra vui lòng thử lại!');
      }
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="oldPassword"
          type={password.value ? 'text' : 'password'}
          label="Mật khẩu cũ"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify
                    icon={
                      password.value
                        ? 'solar:eye-bold'
                        : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Field.Text
          name="newPassword"
          label="Mật khẩu mới"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify
                    icon={
                      password.value
                        ? 'solar:eye-bold'
                        : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Field.Text
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Xác nhận mật khẩu mới"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify
                    icon={
                      password.value
                        ? 'solar:eye-bold'
                        : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ ml: 'auto' }}
        >
          Lưu
        </LoadingButton>
      </Card>
    </Form>
  );
}
