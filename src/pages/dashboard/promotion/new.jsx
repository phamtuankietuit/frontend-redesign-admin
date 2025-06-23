import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PromotionCreateView } from 'src/sections/promotion/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tạo mới khuyến mãi - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PromotionCreateView />
    </>
  );
}
