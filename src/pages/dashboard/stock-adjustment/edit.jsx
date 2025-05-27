import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { StockAdjustmentEditView } from 'src/sections/stock-adjustment/view';
import { useEffect } from 'react';
import { getStockAdjustmentByIdAsync } from 'src/services/stock-adjustment/stock-adjustment.service';

// ----------------------------------------------------------------------

const metadata = { title: `Cập nhật đơn - ${CONFIG.appName}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getStockAdjustmentByIdAsync(id));
    }
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockAdjustmentEditView />
    </>
  );
}
