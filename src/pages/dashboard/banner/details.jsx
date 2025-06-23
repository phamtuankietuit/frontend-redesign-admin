import { Helmet } from 'react-helmet-async';

import { BannerDetailsView } from 'src/sections/banner';

// ----------------------------------------------------------------------

const metadata = { title: `Chi tiết banner` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BannerDetailsView />
    </>
  );
}
