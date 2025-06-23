import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { CONFIG } from 'src/config-global';
import { RatingDetailsView } from 'src/sections/rating/view';
import { getRatingByIdAsync } from 'src/services/rating/rating.service';

// ----------------------------------------------------------------------

const metadata = { title: `Chi tiết đánh giá - ${CONFIG.appName}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  useEffect(() => {
    dispatch(getRatingByIdAsync(id));
  }, [id, dispatch]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RatingDetailsView />
    </>
  );
}
