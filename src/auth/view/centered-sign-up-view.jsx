import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { passwordRegex, phoneNumberRegex } from 'src/utils/regex';

import { Iconify } from 'src/components/iconify';
import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  name: zod.string().min(1, { message: 'Không được bỏ trống!' }),
  phoneNumber: zod
    .string()
    .min(1, { message: 'Không được bỏ trống!' })
    .regex(phoneNumberRegex, {
      message: 'Số điện thoại không hợp lệ!',
    }),
  email: zod
    .string()
    .min(1, { message: 'Không được bỏ trống!' })
    .email({ message: 'Email không hợp lệ!' }),
  password: zod
    .string()
    .min(1, { message: 'Không được bỏ trống!' })
    .regex(passwordRegex, {
      message: 'Chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và ít nhất 8 ký tự!',
    }),
});

// ----------------------------------------------------------------------

export function CenteredSignUpView() {
  const password = useBoolean();

  const defaultValues = {
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
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
    } catch (error) {
      console.error(error);
    }
  });

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      {/* <Box display="flex" gap={{ xs: 3, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Field.Text name="firstName" label="First name" InputLabelProps={{ shrink: true }} />
        <Field.Text name="lastName" label="Last name" InputLabelProps={{ shrink: true }} />
      </Box> */}

      <Field.Text name="name" label="Tên" InputLabelProps={{ shrink: true }} />

      <Field.Text
        name="phoneNumber"
        label="Số điện thoại"
        type="tel"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="email"
        label="Email"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="password"
        label="Mật khẩu"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
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
              href={paths.myAuth.signIn}
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
