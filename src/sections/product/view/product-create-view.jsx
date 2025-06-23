import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewForm } from '../product-new-form';

// ----------------------------------------------------------------------

export function ProductCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo mới sản phẩm"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách sản phẩm', href: paths.dashboard.product.root },
          { name: 'Tạo mới sản phẩm' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewForm />
    </DashboardContent>
  );
}
