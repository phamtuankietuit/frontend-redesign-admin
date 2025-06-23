import dayjs from 'dayjs';
import { useRouter } from 'src/routes/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { z as zod } from 'zod';
import { paths } from 'src/routes/paths';
import { toast } from 'sonner';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useBoolean } from 'src/hooks/use-boolean';

import { selectPromotion } from 'src/state/promotion/promotion.slice';
import { getCustomerTypesAsync } from 'src/services/customer-type/customer-type.service';
import { getProductTypesFlattenAsync } from 'src/services/product-type/product-type.service';
import {
  createPromotionAsync,
  getPromotionByIdAsync,
  updatePromotionActionAsync,
  updatePromotionAsync,
} from 'src/services/promotion/promotion.service';
import { LoadingButton } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { today } from 'src/utils/format-time';
import PromotionInfo from '../promotion-info';
import {
  DISCOUNT_VOUCHER_TYPE_OPTIONS,
  VALUE_TYPE_OPTIONS,
} from '../constants';

const NewPromotionSchema = zod
  .object({
    code: zod.string().min(1, {
      message: 'Không được bỏ trống!',
    }),
    description: zod.string().min(1, {
      message: 'Không được bỏ trống!',
    }),
    startTime: schemaHelper.date({
      message: { required_error: 'Không được bỏ trống!' },
    }),
    endTime: schemaHelper.date({
      message: { required_error: 'Không được bỏ trống!' },
    }),
    usageLimitOverall: zod.number().min(1, {
      message: 'Số lượng phải lớn hơn 0',
    }),
    usageLimitPerUser: zod.number().min(1, {
      message: 'Số lượng phải lớn hơn 0',
    }),
    minimumSpend: zod.number().min(1, {
      message: 'Số tiền tối thiểu phải lớn hơn 0',
    }),
    maximumDiscountValue: zod.number().min(1, {
      message: 'Giảm giá tối đa phải lớn hơn 0',
    }),
    customerTypeIds: zod.array(schemaHelper.objectOrNull()).min(1, {
      message: 'Chưa chọn phân loại khách hàng',
    }),
    applyToProductTypeId: schemaHelper.objectOrNull(),
    valueType: zod.number(),
    value: zod.number(),
    status: zod.number(),
    voucherType: zod.number(),
    objectStatus: schemaHelper.objectOrNull(),
    discountVoucherType: zod.number(),
    discountVoucherTypeObject: schemaHelper.objectOrNull(),
  })
  .refine((data) => data.endTime >= data.startTime, {
    message: 'Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu',
    path: ['endTime'],
  })
  .refine(
    (data) => {
      if (data.valueType === 1) {
        return data.value > 0;
      }
      if (data.valueType === 2) {
        return data.value >= 1 && data.value <= 100;
      }
      return true;
    },
    {
      message: 'Giá trị không hợp lệ',
      path: ['value'],
    },
  )
  .refine(
    (data) => {
      if (data.valueType === 1 && data.value <= 0) {
        return false;
      }
      return !(data.valueType === 2 && (data.value < 1 || data.value > 100));
    },
    {
      message: (data) => {
        if (data.valueType === 1) {
          return 'Giá trị phải lớn hơn 0';
        }
        if (data.valueType === 2) {
          return 'Giá trị phải từ 1 đến 100';
        }
        return 'Giá trị không hợp lệ';
      },
      path: ['value'],
    },
  );

const STATUS_OPTIONS = [
  { value: 1, label: 'Bản nháp' },
  { value: 2, label: 'Hoạt động' },
  { value: 3, label: 'Tạm dừng' },
  { value: 4, label: 'Hết hạn' },
  { value: 5, label: 'Đã hủy' },
];

export function PromotionCreateView() {
  const router = useRouter();

  const dispatch = useDispatch();

  const { promotion, promotionLoading } = useSelector(selectPromotion);

  const loadingActive = useBoolean(false);
  const loadingPaused = useBoolean(false);
  const loadingCancelled = useBoolean(false);

  const defaultValues = useMemo(
    () => ({
      code: promotion?.code || '',
      description: promotion?.description || '',
      usageLimitOverall: promotion?.usageLimitOverall || 1,
      usageLimitPerUser: promotion?.usageLimitPerUser || 1,
      minimumSpend: promotion?.minimumSpend || 1,
      maximumDiscountValue: promotion?.maximumDiscountValue || 1,
      startTime: dayjs(promotion?.startTime) || today(),
      endTime: dayjs(promotion?.endTime) || today(),
      customerTypeIds: promotion?.customerTypes || [],
      applyToProductTypeId: promotion?.applyToProductType || {
        id: 1,
        displayName: 'Tất Cả Nhóm Sản Phẩm',
      },
      status: promotion?.status || 1,
      voucherType: promotion?.voucherType || 1,
      valueType: promotion?.valueType || 2,
      valueTypeObject:
        VALUE_TYPE_OPTIONS.find(
          (option) => option.value === promotion?.valueType,
        ) || VALUE_TYPE_OPTIONS[1],
      value: promotion?.value || 0,
      objectStatus:
        STATUS_OPTIONS.find((option) => option.value === promotion?.status) ||
        STATUS_OPTIONS[0],
      discountVoucherTypeObject:
        DISCOUNT_VOUCHER_TYPE_OPTIONS.find(
          (option) => option.value === promotion?.voucherType,
        ) || DISCOUNT_VOUCHER_TYPE_OPTIONS[0],
      discountVoucherType: promotion?.voucherType || 1,
    }),
    [promotion],
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPromotionSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (promotion && !promotionLoading) {
      reset(defaultValues);
    }
  }, [promotion, promotionLoading, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = {
        code: data.code,
        description: data.description,
        valueType: data.valueType,
        status: data.status || 1,
        value: data.value,
        maximumDiscountValue: data.maximumDiscountValue,
        minimumSpend: data.minimumSpend,
        usageLimitPerUser: data.usageLimitPerUser,
        usageLimitOverall: data.usageLimitOverall,
        startTime: data.startTime,
        endTime: data.endTime,
        applyToProductTypeId: data.applyToProductTypeId?.id || 1,
        customerTypeIds: data.customerTypeIds.map((item) => item.id),
        voucherType: data.discountVoucherType,
      };

      if (promotion) {
        await dispatch(
          updatePromotionAsync({ id: promotion.id, body }),
        ).unwrap();

        await dispatch(getPromotionByIdAsync(promotion.id)).unwrap();

        toast.success('Cập nhật khuyến mãi thành công!');
      } else {
        await dispatch(createPromotionAsync(body))
          .unwrap()
          .then((response) => {
            router.push(paths.dashboard.promotion.edit(response.id));
          });

        toast.success('Tạo khuyến mãi thành công!');
      }
    } catch (error) {
      console.error(error);

      if (
        error?.message === 'Start time must be at least 15 minutes from now'
      ) {
        toast.error('Thời gian bắt đầu cách ít nhất 15 phút kể từ lúc tạo!');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
      }
    }
  });

  useEffect(() => {
    dispatch(
      getCustomerTypesAsync({
        pageNumber: 1,
        pageSize: 10,
        searchQuery: '',
        sortBy: 'CreationTime',
        sortDirection: 'desc',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProductTypesFlattenAsync());
  }, [dispatch]);

  const handleChangeStatus = (event, value) => {
    const selectedStatus = value?.value || 1;
    setValue('objectStatus', value);
    setValue('status', selectedStatus);
  };

  const handleAction = async (action, loadingState) => {
    loadingState.onTrue();
    try {
      if (promotion) {
        await dispatch(
          updatePromotionActionAsync({
            id: promotion.id,
            body: { action },
          }),
        ).unwrap();

        await dispatch(getPromotionByIdAsync(promotion.id)).unwrap();

        toast.success('Cập nhật trạng thái khuyến mãi thành công!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái khuyến mãi!');
    } finally {
      loadingState.onFalse();
    }
  };

  return (
    <DashboardContent>
      <Form methods={methods} onSubmit={onSubmit}>
        <CustomBreadcrumbs
          heading="Tạo khuyến mãi mới"
          links={[
            { name: 'Trang chủ', href: paths.dashboard.root },
            {
              name: 'Danh sách khuyến mãi',
              href: paths.dashboard.promotion.root,
            },
            { name: 'Khuyến mãi mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
            promotion && (
              <Field.Autocomplete
                name="objectStatus"
                sx={{ minWidth: { xs: 1, md: 200 } }}
                options={STATUS_OPTIONS}
                onChange={handleChangeStatus}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Trạng thái"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            )
          }
        />

        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
          <PromotionInfo />
        </Stack>

        <Stack
          justifyContent="flex-end"
          direction="row"
          spacing={2}
          sx={{ mt: 3 }}
        >
          {promotion && (values.status === 1 || values.status === 3) && (
            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              loading={loadingActive.value}
              onClick={() => handleAction(0, loadingActive)}
            >
              Hoạt động
            </LoadingButton>
          )}

          {promotion && values.status === 2 && (
            <LoadingButton
              size="large"
              variant="contained"
              color="warning"
              loading={loadingPaused.value}
              onClick={() => handleAction(1, loadingPaused)}
            >
              Tạm dừng
            </LoadingButton>
          )}

          {promotion && values.status !== 4 && values.status !== 5 && (
            <LoadingButton
              size="large"
              variant="outlined"
              color="error"
              loading={loadingCancelled.value}
              onClick={() => handleAction(2, loadingCancelled)}
            >
              Hủy
            </LoadingButton>
          )}

          {values.status === 1 && (
            <LoadingButton
              type="submit"
              size="large"
              variant="contained"
              loading={isSubmitting}
            >
              {promotion ? 'Cập nhật' : 'Tạo mới'}
            </LoadingButton>
          )}
        </Stack>
      </Form>
    </DashboardContent>
  );
}
