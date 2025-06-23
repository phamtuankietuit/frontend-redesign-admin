import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { PromotionListView } from 'src/sections/promotion/view';

// ----------------------------------------------------------------------

const metadata = { title: `Khuyến mãi - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PromotionListView />
    </>
  );
}
