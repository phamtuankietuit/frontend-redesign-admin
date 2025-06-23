import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { RatingListView } from 'src/sections/rating/view';

// ----------------------------------------------------------------------

const metadata = { title: `Đánh giá - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RatingListView />
    </>
  );
}
