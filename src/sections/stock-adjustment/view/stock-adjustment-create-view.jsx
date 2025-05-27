import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StockAdjustmentNewEditForm } from '../stock-adjustment-new-edit-form';

// ----------------------------------------------------------------------

export function StockAdjustmentCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo đơn cập nhật tồn kho"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          {
            name: 'Đơn cập nhật tồn kho',
            href: paths.dashboard.stockAdjustment.root,
          },
          { name: 'Đơn nhập hàng mới' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StockAdjustmentNewEditForm />
    </DashboardContent>
  );
}
