import { Helmet } from 'react-helmet-async';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { selectProduct } from 'src/state/product/product.slice';
import {
  getProductAsync,
  getProductRatingsAsync,
} from 'src/services/product/product.service';

import { ProductShopDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `${CONFIG.appName}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  const { product, productError, ratings } = useSelector(selectProduct);

  const fetchData = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    dispatch(getProductAsync(id)).then((action) => {
      if (getProductAsync.fulfilled.match(action)) {
        return dispatch(
          getProductRatingsAsync({
            productId: id,
            pageSize: 10,
            pageNumber: 1,
          }),
        );
      }
    });
  }, [dispatch, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductShopDetailsView
        product={product}
        loading={!product}
        // error={productError}
      />
    </>
  );
}
