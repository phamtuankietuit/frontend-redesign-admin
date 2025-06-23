import { Helmet } from 'react-helmet-async';

import { BannerCreateView } from 'src/sections/banner';

// ----------------------------------------------------------------------

const metadata = { title: `Chỉnh sửa banner` };

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
