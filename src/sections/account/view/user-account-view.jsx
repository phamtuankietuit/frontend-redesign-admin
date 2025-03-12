import { Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'Thông tin chung',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
    path: paths.account.general,
  },
  {
    value: 'address',
    label: 'Địa chỉ',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
    path: paths.account.address,
  },
  {
    value: 'notifications',
    label: 'Thông báo',
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    path: paths.account.notifications,
  },
  {
    value: 'security',
    label: 'Đổi mật khẩu',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
    path: paths.account.security,
  },
];

// ----------------------------------------------------------------------

export function AccountView({ children, title }) {
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {title}
      </Typography>

      {children}
    </DashboardContent>
  );
}
