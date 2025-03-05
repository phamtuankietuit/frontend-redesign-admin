import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { toastMessage } from 'src/utils/constant';
import { phoneNumberRegex } from 'src/utils/regex';

import { selectAuth, setSignUp } from 'src/state/auth/auth.slice';

import { toast } from 'src/components/snackbar';
import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Không được bỏ trống!' })
    .email({ message: toastMessage.error.invalidEmail }),
  name: zod.string().min(1, { message: 'Không được bỏ trống!' }),
  phoneNumber: zod
    .string()
    .min(1, { message: 'Không được bỏ trống!' })
    .regex(phoneNumberRegex, {
      message: 'Số điện thoại không hợp lệ!',
    }),
});

// ----------------------------------------------------------------------

export function CenteredSignUpView() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { signUp } = useSelector(selectAuth);

  const defaultValues = {
    email: signUp?.email || '',
    name: signUp?.name || '',
    phoneNumber: signUp?.phoneNumber || '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
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
      toast.success('Vui lòng kiểm tra email!');
      dispatch(
        setSignUp({
          email: data.email,
          name: data.name,
          phoneNumber: data.phoneNumber,
        }),
      );
      router.push(paths.auth.verify);
    } catch (error) {
      console.error(error);
      toast.success('Có lỗi xảy ra vui lòng thử lại!');
    }
  });

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label="Email"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text name="name" label="Tên" InputLabelProps={{ shrink: true }} />

      <Field.Text
        name="phoneNumber"
        label="Số điện thoại"
        type="tel"
        InputLabelProps={{ shrink: true }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Đang xác thực..."
      >
        Đăng ký
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {renderLogo}

      <FormHead
        title="Đăng ký"
        description={
          <>
            {`Đã có tài khoản? `}
            <Link
              component={RouterLink}
              href={paths.auth.signIn}
              variant="subtitle2"
            >
              Đăng nhập
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
