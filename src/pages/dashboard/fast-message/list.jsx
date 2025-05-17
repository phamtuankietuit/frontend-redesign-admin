import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FastMessageListView } from 'src/sections/fast-message/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tin nhắn nhanh - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FastMessageListView />
    </>
  );
}
