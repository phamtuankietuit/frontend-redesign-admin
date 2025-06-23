import { Helmet } from 'react-helmet-async';

import { BannerListView } from 'src/sections/banner';

// ----------------------------------------------------------------------

const metadata = { title: `Danh sách banner` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BannerListView />
    </>
  );
}
