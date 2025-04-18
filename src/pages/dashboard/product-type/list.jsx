import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductTypeListView } from 'src/sections/product-type/view/product-type-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Loại sản phẩm - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductTypeListView />
    </>
  );
}
