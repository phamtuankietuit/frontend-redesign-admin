import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Radio, RadioGroup, Typography, FormControlLabel } from '@mui/material';

import { toastMessage } from 'src/utils/constant';
import { phoneNumberRegex } from 'src/utils/regex';

import { selectAuth } from 'src/state/auth/auth.slice';
import { updateMeAsync } from 'src/services/auth/auth.service';
import { uploadImagesAsync } from 'src/services/file/file.service';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  fullName: zod.string().min(1, { message: toastMessage.error.empty }),
  email: zod
    .string()
    .min(1, { message: toastMessage.error.empty })
    .email({ message: toastMessage.error.invalidEmail }),
  imageUrl: schemaHelper.file().nullable(),
  phoneNumber: zod
    .string()
    .min(1, { message: toastMessage.error.empty })
    .regex(phoneNumberRegex, {
      message: toastMessage.error.invalidPhoneNumber,
    }),
  dateOfBirth: schemaHelper.date().nullable(),
  gender: zod.string().min(1, { message: toastMessage.error.empty }),
});

export function AccountGeneral() {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const defaultValues = useMemo(
    () => ({
      fullName: user?.fullName || '',
      email: user?.email || '',
      imageUrl: user.imageUrl || null,
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: dayjs(new Date(user?.dateOfBirth)) || null,
      gender: String(user?.gender || '1'),
    }),
    [user],
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (typeof data.imageUrl === 'object') {
        await dispatch(uploadImagesAsync([data.imageUrl]))
          .unwrap()
          .then((response) => {
            data.imageUrl = response[0];
          });
      }

      const { id, email, status } = user;

      await dispatch(
        updateMeAsync({
          id: user.id,
          body: {
            ...data,
            gender: Number(data.gender),
            id,
            email,
            status,
          },
        }),
      ).unwrap();

      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              p: 5,
            }}
          >
            <Label
              color="success"
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              Đang hoạt động
            </Label>

            <Field.UploadAvatar
              name="imageUrl"
              maxSize={3145728}
              sx={{
                mt: 3,
              }}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Định dạng jpeg, jpg, png
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="fullName" label="Tên" />
              <Field.Text name="email" label="Email" />
              <Field.Text name="phoneNumber" label="Số điện thoại" />

              <Field.DatePicker
                name="dateOfBirth"
                openTo="year"
                views={['day', 'month', 'year']}
                label="Ngày sinh"
                slotProps={{ textField: { fullWidth: true } }}
                disableFuture
              />

              <Box>
                <Typography variant="subtitle2">Giới tính</Typography>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel
                        value="1"
                        control={<Radio size="medium" />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio size="medium" />}
                        label="Nữ"
                      />
                      <FormControlLabel
                        value="3"
                        control={<Radio size="medium" />}
                        label="Khác"
                      />
                    </RadioGroup>
                  )}
                />
              </Box>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Lưu
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
