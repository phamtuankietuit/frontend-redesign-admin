import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StockAdjustmentListView } from 'src/sections/stock-adjustment/view';

// ----------------------------------------------------------------------

const metadata = { title: `Đơn cập nhật tồn kho - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockAdjustmentListView />
    </>
  );
}
