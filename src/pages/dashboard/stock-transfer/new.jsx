import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { setCurrentStockAdjustment } from 'src/state/stock-adjustment/stock-adjustment.slice';
import { StockTransferCreateView } from 'src/sections/stock-transfer/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Tạo đơn luân chuyển - ${CONFIG.appName}`,
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

      <StockTransferCreateView />
    </>
  );
}
