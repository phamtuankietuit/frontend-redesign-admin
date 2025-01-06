import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InvoiceNewEditForm } from '../invoice-new-edit-form';

// ----------------------------------------------------------------------

export function InvoiceCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo đơn nhập hàng"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Đơn nhập hàng', href: paths.dashboard.invoice.root },
          { name: 'Đơn nhập hàng mới' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceNewEditForm />
    </DashboardContent>
  );
}
