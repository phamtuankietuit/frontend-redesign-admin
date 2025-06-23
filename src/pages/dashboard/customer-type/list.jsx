import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CustomerTypeListView } from 'src/sections/customer-type/view';

// ----------------------------------------------------------------------

const metadata = { title: `Loại sản phẩm - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomerTypeListView />
    </>
  );
}
