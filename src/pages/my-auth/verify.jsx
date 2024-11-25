import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CenteredVerifyView } from 'src/auth/view';

// ----------------------------------------------------------------------

const metadata = { title: `Verify - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredVerifyView />
    </>
  );
}
