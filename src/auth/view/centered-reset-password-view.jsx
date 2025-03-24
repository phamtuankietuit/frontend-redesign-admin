import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { toastMessage } from 'src/utils/constant';

import { CONFIG } from 'src/config-global';
import { PasswordIcon } from 'src/assets/icons';
import { sendEmailForgotPasswordAsync } from 'src/services/auth/auth.service';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';
import { FormReturnLink } from '../components/form-return-link';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: toastMessage.error.empty })
    .email({ message: toastMessage.error.invalidEmail }),
});

// ----------------------------------------------------------------------

export function CenteredResetPasswordView() {
  const dispatch = useDispatch();

  const defaultValues = { email: '' };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await dispatch(
        sendEmailForgotPasswordAsync({
          email: data.email,
          redirectUrlBase: CONFIG.frontendUrl + paths.auth.updatePassword,
        }),
      ).unwrap();

      toast.success('Vui lòng kiểm tra email để đặt lại mật khẩu');
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi, vui lòng thử lại');
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label="Email"
        autoFocus
        InputLabelProps={{ shrink: true }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Đang gửi..."
      >
        Gửi
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Quên mật khẩu?"
        description="Nhập email để đặt lại mật khẩu"
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormReturnLink label="Trở về Đăng nhập" href={paths.auth.signIn} />
    </>
  );
}
