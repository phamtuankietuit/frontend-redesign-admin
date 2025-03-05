import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { passwordRegex } from 'src/utils/regex';
import { toastMessage } from 'src/utils/constant';

import { EmailInboxIcon } from 'src/assets/icons';
import { selectAuth } from 'src/state/auth/auth.slice';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';
import { FormReturnLink } from '../components/form-return-link';
import { FormResendCode } from '../components/form-resend-code';

// ----------------------------------------------------------------------

export const VerifySchema = zod
  .object({
    code: zod
      .string()
      .min(1, { message: toastMessage.error.empty })
      .min(6, { message: 'Mã xác thực phải đủ 6 ký tự!' }),
    password: zod
      .string()
      .min(1, { message: toastMessage.error.empty })
      .regex(passwordRegex, {
        message:
          'Chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và ít nhất 8 ký tự!',
      }),
    confirmPassword: zod.string().min(1, { message: toastMessage.error.empty }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function CenteredVerifyView() {
  const password = useBoolean();
  const confirmPassword = useBoolean();

  const { verifyEmail } = useSelector(selectAuth);

  const [secondsResendCode, setSecondsResendCode] = useState(0);

  const defaultValues = {
    code: '',
    email: verifyEmail || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
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
      toast.success('Cập nhật mật khẩu thành công!');
    } catch (error) {
      console.error(error);
      toast.success('Có lỗi xảy ra vui lòng thử lại!');
    }
  });

  const handleResendCode = async () => {
    setSecondsResendCode(1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.info('Đã gửi lại mã xác thực!');
    setSecondsResendCode(0);
  };

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label="Email"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          readOnly: true,
        }}
      />

      <Field.Code name="code" />

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
        loadingIndicator="Đang xác thực..."
      >
        Xác thực
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Kiểm tra email của bạn!"
        description={`Hệ thống đã gửi mã xác thực qua email của bạn. \nVui lòng nhập mã xác thực vào ô bên dưới!.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormResendCode
        onResendCode={handleResendCode}
        value={secondsResendCode}
        disabled={secondsResendCode > 0}
      />

      <FormReturnLink label="Trở về" href={-1} />
    </>
  );
}
