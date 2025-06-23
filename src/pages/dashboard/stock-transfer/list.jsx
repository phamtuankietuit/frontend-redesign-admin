import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StockTransferListView } from 'src/sections/stock-transfer/view';

// ----------------------------------------------------------------------

const metadata = { title: `Đơn luân chuyển hàng hóa - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockTransferListView />
    </>
  );
}
