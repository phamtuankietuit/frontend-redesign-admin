import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { getProductAsync } from 'src/services/product/product.service';
import { CONFIG } from 'src/config-global';
import { StockDetailsView } from 'src/sections/product/view/stock-details-view';
import { getBranchesAsync } from 'src/services/branch/branch.service';
import { initialState } from 'src/state/branch/branch.slice';

// ----------------------------------------------------------------------

const metadata = { title: `Chi tiết tồn kho - ${CONFIG.appName}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  useEffect(() => {
    dispatch(getProductAsync(id));
    dispatch(getBranchesAsync(initialState.tableFilters));
  }, [id, dispatch]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockDetailsView />
    </>
  );
}
