import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StockTransferNewEditForm } from '../stock-transfer-new-edit-form';

// ----------------------------------------------------------------------

export function StockTransferCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo đơn luân chuyển hàng hóa"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          {
            name: 'Đơn luân chuyển hàng hóa',
            href: paths.dashboard.stockTransfer.root,
          },
          { name: 'Đơn mới' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StockTransferNewEditForm />
    </DashboardContent>
  );
}
