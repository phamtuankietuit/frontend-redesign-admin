import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CenteredResetPasswordView } from 'src/auth/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Reset password - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredResetPasswordView />
    </>
  );
}
