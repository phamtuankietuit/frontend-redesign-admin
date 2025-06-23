import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { CONFIG } from 'src/config-global';
import { NewPromotionView } from 'src/sections/promotion/view';
import { getPromotionByIdAsync } from 'src/services/promotion/promotion.service';

// ----------------------------------------------------------------------

const metadata = { title: `Chỉnh sửa khuyến mãi - ${CONFIG.appName}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getPromotionByIdAsync(id));
    }
  }, [id, dispatch]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NewPromotionView />
    </>
  );
}
