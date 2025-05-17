import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toastMessage } from 'src/utils/constant';
import { phoneNumberRegex } from 'src/utils/regex';

import { setBranch, selectBranch } from 'src/state/branch/branch.slice';
import {
  setWards,
  setDistricts,
  selectAddress,
} from 'src/state/address/address.slice';
import {
  getWardsAsync,
  getDistrictsAsync,
  getProvincesAsync,
} from 'src/services/address/address.service';
import {
  getBranchesAsync,
  createBranchAsync,
  updateBranchAsync,
} from 'src/services/branch/branch.service';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const BranchSchema = zod.object({
  name: zod.string().min(1, { message: toastMessage.error.empty }),
  detailAddress: zod.string().min(1, { message: toastMessage.error.empty }),
  phoneNumber: zod
    .string()
    .min(1, { message: toastMessage.error.empty })
    .regex(phoneNumberRegex, {
      message: toastMessage.error.invalidPhoneNumber,
    }),
  province: schemaHelper.objectOrNull(),
  district: schemaHelper.objectOrNull(),
  ward: schemaHelper.objectOrNull(),
  email: zod
    .string()
    .min(1, { message: toastMessage.error.empty })
    .email({ message: toastMessage.error.invalidEmail }),
  // Not required
  isDefault: zod.boolean(),
  description: zod.string().optional(),
});

export function BranchForm({ open, onClose }) {
  const dispatch = useDispatch();

  const { branch, tableFilters } = useSelector(selectBranch);

  const { provinces, districts, wards } = useSelector(selectAddress);

  const defaultValues = useMemo(
    () => ({
      name: branch?.name || '',
      description: branch?.description || '',
      email: branch?.email || '',
      phoneNumber: branch?.address?.phoneNumber || '',
      detailAddress: branch?.address?.detailAddress || '',
      province:
        provinces.find(
          (province) => province.ProvinceID === branch?.address?.provinceId,
        ) || null,
      district:
        districts.find(
          (district) => district.DistrictID === branch?.address?.districtId,
        ) || null,
      ward:
        wards.find((ward) => ward.WardCode === branch?.address?.communeCode) ||
        null,
      isDefault: !!branch?.isDefault,
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [branch, provinces, districts, wards],
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(BranchSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (provinces.length === 0) {
      dispatch(getProvincesAsync());
    }
    if (branch) {
      dispatch(getDistrictsAsync(branch.address.provinceId));
      dispatch(getWardsAsync(branch.address.districtId));
    }
  }, [dispatch, provinces, branch]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'province' && value.province) {
        dispatch(getDistrictsAsync(value.province.ProvinceID));
        setValue('district', null);
        setValue('ward', null);
      } else if (name === 'district' && value.district) {
        dispatch(getWardsAsync(value.district.DistrictID));
        setValue('ward', null);
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch, watch, setValue]);

  useEffect(() => {
    const canInitForm =
      branch &&
      provinces.some((p) => p.ProvinceID === branch.address.provinceId) &&
      districts.some((d) => d.DistrictID === branch.address.districtId) &&
      wards.some((w) => w.WardCode === branch.address.communeCode);

    if (canInitForm) {
      reset(defaultValues);
    }
  }, [branch, defaultValues, reset, provinces, districts, wards]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = {
        ...(branch && { id: branch?.id }),
        name: data.name,
        description: data.description,
        email: data.email,
        isDefault: data.isDefault,
        phoneNumber: data.phoneNumber,
        provinceId: data.province.ProvinceID,
        provinceName: data.province.ProvinceName,
        districtId: data.district.DistrictID,
        districtName: data.district.DistrictName,
        communeCode: data.ward.WardCode,
        communeName: data.ward.WardName,
        detailAddress: data.detailAddress,
        addressType: 1,
      };

      if (branch) {
        await dispatch(updateBranchAsync({ id: branch.id, body })).unwrap();
        toast.success('Cập nhật chi nhánh thành công!');
      } else {
        await dispatch(createBranchAsync(body)).unwrap();
        toast.success('Thêm chi nhánh thành công!');
      }

      dispatch(getBranchesAsync(tableFilters));

      handleClearForm();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClearForm = () => {
    dispatch(setDistricts([]));
    dispatch(setWards([]));
    dispatch(setBranch(null));
    reset({
      name: '',
      description: '',
      email: '',
      phoneNumber: '',
      detailAddress: '',
      province: null,
      district: null,
      ward: null,
      isDefault: false,
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
          {branch ? 'Cập nhật chi nhánh' : 'Thêm chi nhánh'}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="name" label="Tên" />

              <Field.Text
                name="phoneNumber"
                label="Số điện thoại"
                placeholder="Số điện thoại"
              />
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns="repeat(1, 1fr)"
            >
              <Field.Text
                name="email"
                label="Email"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="description"
                rows={4}
                fullWidth
                multiline
                label="Mô tả"
              />

              <Field.Autocomplete
                name="province"
                fullWidth
                options={provinces}
                getOptionLabel={(option) => option.ProvinceName}
                isOptionEqualToValue={(option, value) =>
                  option.ProvinceID === value.ProvinceID ||
                  value === null ||
                  value === undefined ||
                  value === ''
                }
                label="Tỉnh/Thành phố"
                renderOption={(props, option) => (
                  <li {...props} key={option.ProvinceID}>
                    {option.ProvinceName}
                  </li>
                )}
              />

              <Field.Autocomplete
                name="district"
                fullWidth
                options={districts}
                getOptionLabel={(option) => option.DistrictName}
                isOptionEqualToValue={(option, value) =>
                  option.DistrictID === value.DistrictID ||
                  value === null ||
                  value === undefined ||
                  value === ''
                }
                label="Quận/Huyện"
                renderOption={(props, option) => (
                  <li {...props} key={option.DistrictID}>
                    {option.DistrictName}
                  </li>
                )}
              />

              <Field.Autocomplete
                name="ward"
                fullWidth
                options={wards}
                getOptionLabel={(option) => option.WardName}
                isOptionEqualToValue={(option, value) =>
                  option.WardCode === value.WardCode ||
                  value === null ||
                  value === undefined ||
                  value === ''
                }
                label="Phường/Xã"
                renderOption={(props, option) => (
                  <li {...props} key={option.WardCode}>
                    {option.WardName}
                  </li>
                )}
              />
            </Box>

            <Field.Text
              name="detailAddress"
              label="Địa chỉ chi tiết"
              placeholder="Số nhà, tên đường"
            />

            <Field.Checkbox
              name="isDefault"
              label="Đặt làm mặc định"
              disabled={branch?.isDefault}
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
