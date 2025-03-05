import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toastMessage } from 'src/utils/constant';

import { PasswordIcon } from 'src/assets/icons';
import { setVerifyEmail } from 'src/state/auth/auth.slice';

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
  const router = useRouter();

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
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
      dispatch(setVerifyEmail(data.email));
      router.push(paths.auth.verify);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label="Email"
        placeholder="example@gmail.com"
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
        description="Hãy nhập email để hệ thống gửi đường dẫn đặt lại mật khẩu."
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormReturnLink label="Trở về Đăng nhập" href={paths.auth.signIn} />
    </>
  );
}
