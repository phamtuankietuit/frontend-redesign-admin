import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import { Stack, Skeleton, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { getProductTypesFlattenAsync } from 'src/services/product-type/product-type.service';
import {
  setFormMode,
  selectProductType,
} from 'src/state/product-type/product-type.slice';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ComponentBlock } from 'src/sections/_examples/component-block';
import { CustomStyling } from 'src/sections/_examples/mui/tree-view/custom-styling';

import { ProductTypeNewEditForm } from '../product-type-new-edit-form';

export function ProductTypeListView() {
  const confirmRows = useBoolean();

  const newForm = useBoolean(false);

  const dispatch = useDispatch();

  const {
    productTypesFlatten,
    treeView: { items },
  } = useSelector(selectProductType);

  const [selectedProductType, setSelectedProductType] = useState(null);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(getProductTypesFlattenAsync());
    }
  }, [dispatch, items.length]);

  const defaultValues = {
    productTypeId: '',
  };

  const methods = useForm({ defaultValues });

  const { control, getValues, watch } = methods;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'productTypeId') {
        const productType = productTypesFlatten.find(
          (item) => item.id === Number(value.productTypeId),
        );
        setSelectedProductType(productType);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, productTypesFlatten, dispatch]);

  const handleOpenNewForm = () => {
    if (getValues('productTypeId') !== '') {
      dispatch(setFormMode('new'));
      newForm.onTrue();
    } else {
      toast.warning(
        'Vui lòng chọn loại sản phẩm cha trước khi thêm loại sản phẩm mới',
      );
    }
  };

  const handleOpenEditForm = () => {
    dispatch(setFormMode('edit'));
    newForm.onTrue();
  };

  const handleCloseNewForm = () => {
    newForm.onFalse();
  };

  return (
    <>
      <DashboardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Loại sản phẩm"
          links={[{ name: 'Trang chủ', href: '/' }, { name: 'Loại sản phẩm' }]}
          action={
            <Stack direction="row" spacing={2} alignItems="center">
              {selectedProductType && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: '14px',
                      }}
                    >
                      Đã chọn:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '400px',
                        display: 'block',
                      }}
                    >
                      {selectedProductType?.displayName}
                    </Typography>
                  </Stack>

                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<Iconify icon="mingcute:delete-2-fill" />}
                    onClick={() => confirmRows.onTrue()}
                  >
                    Xóa đã chọn
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:pencil-fill" />}
                    onClick={handleOpenEditForm}
                    sx={{
                      flex: '1 1 auto',
                    }}
                  >
                    Cập nhật
                  </Button>
                </Stack>
              )}

              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleOpenNewForm}
                color="primary"
              >
                Thêm mới
              </Button>
            </Stack>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ComponentBlock title="Loại sản phẩm" sx={{ p: 2 }}>
          {items.length === 0 ? (
            <Skeleton animation="wave" height={30} width="100%" />
          ) : (
            <CustomStyling
              name="productTypeId"
              control={control}
              items={items}
            />
          )}
        </ComponentBlock>
      </DashboardContent>

      <ProductTypeNewEditForm
        open={newForm.value}
        onClose={handleCloseNewForm}
        selectedProductType={selectedProductType}
      />

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Xóa"
        content={<>Bạn có chắc chắn muốn xóa loại sản phẩm đã chọn?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirmRows.onFalse();
            }}
          >
            Xóa
          </Button>
        }
      />
    </>
  );
}
