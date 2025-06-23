import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import { Avatar, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  blockCustomerAsync,
  unblockCustomerAsync,
} from 'src/services/user/user.service';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  status: zod.number(),
});

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || 1,
    }),
    [currentUser],
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.status !== 6) {
        await dispatch(unblockCustomerAsync(currentUser.id)).unwrap();
        toast.success('Mở khóa người dùng thành công!');
      } else {
        await dispatch(blockCustomerAsync(currentUser.id)).unwrap();
        toast.success('Khóa người dùng thành công!');
      }

      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 1 && 'success') ||
                  (values.status === 4 && 'warning') ||
                  'error'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {(values.status === 1 && 'Đang hoạt động') ||
                  (values.status === 4 && 'Không hoạt động') ||
                  'Cấm hoạt động'}
              </Label>
            )}

            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
              <Avatar
                key={128}
                alt={currentUser ? currentUser.fullName : 'Avatar'}
                src={currentUser?.imageUrl || ''}
                sx={{ width: 128, height: 128 }}
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value === 6}
                        onChange={(event) => {
                          field.onChange(
                            event.target.checked
                              ? 6
                              : currentUser.status !== 6
                                ? currentUser.status
                                : 1,
                          );
                        }}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2">Khóa</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Khóa người dùng
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}
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
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Họ tên"
                value={currentUser?.fullName || ''}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                value={currentUser?.email || ''}
                label="Email"
              />
              <TextField
                label="Số điện thoại"
                type="tel"
                value={currentUser?.phoneNumber || ''}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={currentUser?.status === values.status}
              >
                {!currentUser ? 'Tạo người dùng' : 'Lưu'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
