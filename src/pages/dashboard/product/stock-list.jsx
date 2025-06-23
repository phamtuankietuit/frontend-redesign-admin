import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StockListView } from 'src/sections/product/view/stock-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Tồn kho - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockListView />
    </>
  );
}
