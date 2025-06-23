import { Helmet } from 'react-helmet-async';

import { BannerCreateView } from 'src/sections/banner';

// ----------------------------------------------------------------------

const metadata = { title: `Tạo banner mới` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BannerCreateView />
    </>
  );
}
