import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StockAdjustmentCreateView } from 'src/sections/stock-adjustment/view';
import { setCurrentStockAdjustment } from 'src/state/stock-adjustment/stock-adjustment.slice';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

const metadata = {
  title: `Tạo đơn cập nhật - ${CONFIG.appName}`,
};

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentStockAdjustment(null));
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockAdjustmentCreateView />
    </>
  );
}
