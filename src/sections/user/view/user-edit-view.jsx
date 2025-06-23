import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';

// ----------------------------------------------------------------------

export function UserEditView({ user }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cập nhật khách hàng"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Danh sách khách hàng', href: paths.dashboard.user.list },
          { name: user?.fullName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm currentUser={user} />
    </DashboardContent>
  );
}
