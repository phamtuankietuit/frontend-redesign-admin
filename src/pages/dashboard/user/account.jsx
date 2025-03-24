import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AccountView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

const metadata = { title: `Cài đặt tài khoản - ${CONFIG.appName}` };

export default function Page({ children, title }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccountView title={title}>{children}</AccountView>
    </>
  );
}
