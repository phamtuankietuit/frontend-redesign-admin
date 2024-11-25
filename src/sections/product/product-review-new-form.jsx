import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const ReviewSchema = zod.object({
  rating: zod.number().min(1, 'Bạn chưa đánh giá sao!'),
  review: zod.string().min(1, { message: 'Không được bỏ trống!' }),
});

// ----------------------------------------------------------------------

export function ProductReviewNewForm({ onClose, ...other }) {
  const defaultValues = {
    rating: 0,
    review: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog onClose={onClose} {...other}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle> Đánh giá sản phẩm </DialogTitle>

        <DialogContent>
          <div>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Đánh giá của bạn về sản phẩm này:
            </Typography>
            <Field.Rating name="rating" />
          </div>

          <Field.Text
            name="review"
            label="Đánh giá *"
            multiline
            rows={3}
            sx={{
              mt: 3,
              minWidth: {
                xs: 300,
                sm: 480,
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Hủy
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Đăng
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
