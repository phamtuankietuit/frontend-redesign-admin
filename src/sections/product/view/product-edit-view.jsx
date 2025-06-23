import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductEditForm } from '../product-edit-form';

// ----------------------------------------------------------------------

export function ProductEditView({ product }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cập nhật sản phẩm"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách sản phẩm', href: paths.dashboard.product.root },
          { name: product?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductEditForm product={product} />
    </DashboardContent>
  );
}
