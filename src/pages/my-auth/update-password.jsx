import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CenteredUpdatePasswordView } from 'src/auth/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Cập nhật mật khẩu - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredUpdatePasswordView />
    </>
  );
}
