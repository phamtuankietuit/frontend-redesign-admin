import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toastMessage } from 'src/utils/constant';
import { fastMessageRegex } from 'src/utils/regex';

import {
  setFastMessage,
  selectFastMessage,
} from 'src/state/fast-message/fast-message.slice';
import {
  getFastMessagesAsync,
  createFastMessageAsync,
  updateFastMessageAsync,
} from 'src/services/fast-message/fast-message.service';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const FastMessageSchema = zod.object({
  shorthand: zod
    .string()
    .min(1, { message: toastMessage.error.empty })
    .regex(fastMessageRegex, {
      message: toastMessage.error.invalidShortHand,
    }),
  body: zod.string().min(1, { message: toastMessage.error.empty }),
});

export function FastMessageForm({ open, onClose }) {
  const dispatch = useDispatch();

  const { fastMessage, tableFilters } = useSelector(selectFastMessage);

  const defaultValues = useMemo(
    () => ({
      name: fastMessage?.shorthand || '',
      description: fastMessage?.body || '',
    }),

    [fastMessage],
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(FastMessageSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset({
        shorthand: fastMessage?.shorthand || '',
        body: fastMessage?.body || '',
      });
    }
  }, [open, fastMessage, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (fastMessage) {
        await dispatch(
          updateFastMessageAsync({ id: fastMessage.id, body: data }),
        ).unwrap();
        toast.success('Cập nhật tin nhắn nhanh thành công!');
      } else {
        await dispatch(createFastMessageAsync(data)).unwrap();
        toast.success('Thêm tin nhắn nhanh thành công!');
      }

      dispatch(getFastMessagesAsync(tableFilters));

      handleClearForm();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClearForm = () => {
    dispatch(setFastMessage(null));
    reset({
      shorthand: '',
      body: '',
    });
    onClose();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      disableRestoreFocus
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {fastMessage ? 'Cập nhật tin nhắn nhanh' : 'Thêm tin nhắn nhanh'}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Field.Text name="shorthand" label="Cú pháp" />

            <Field.Text
              name="body"
              rows={4}
              fullWidth
              multiline
              label="Nội dung"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={handleClearForm}>
            Hủy
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
