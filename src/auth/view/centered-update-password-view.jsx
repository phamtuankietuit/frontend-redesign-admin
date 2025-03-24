import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useParams, useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { passwordRegex } from 'src/utils/regex';
import { toastMessage } from 'src/utils/constant';

import { EmailInboxIcon } from 'src/assets/icons';
import { resetPasswordAsync } from 'src/services/auth/auth.service';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';

//   ----------------------------------------------------------------------

export const UpdatePasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(1, { message: toastMessage.error.empty })
      .regex(passwordRegex, {
        message: toastMessage.error.invalidPassword,
      }),
    confirmPassword: zod.string().min(1, { message: toastMessage.error.empty }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function CenteredUpdatePasswordView() {
  const dispatch = useDispatch();

  const router = useRouter();

  const password = useBoolean();

  const confirmPassword = useBoolean();

  const token = useSearchParams().get('token').replace(/\s/g, '+');

  const { id } = useParams();

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await dispatch(
        resetPasswordAsync({
          id,
          body: {
            token,
            newPassword: data.password,
          },
        }),
      ).unwrap();

      toast.success('Cập nhật mật khẩu thành công. Vui lòng đăng nhập lại!');

      router.replace(paths.auth.signIn);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra vui lòng thử lại!');
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="password"
        label="Mật khẩu"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        type={confirmPassword.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify
                  icon={
                    confirmPassword.value
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
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Đang cập nhật..."
      >
        Cập nhật
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Đặt lại mật khẩu"
        description="Đặt lại mật khẩu cho tài khoản của bạn"
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
