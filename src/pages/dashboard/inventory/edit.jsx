import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { selectProduct } from 'src/state/product/product.slice';
import { getProductAsync } from 'src/services/product/product.service';

import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Cập nhật sản phẩm - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const dispatch = useDispatch();

  const { updateProductPage } = useSelector(selectProduct);

  useEffect(() => {
    if (!updateProductPage?.product) {
      dispatch(getProductAsync(id));
    }
  }, [dispatch, id, updateProductPage?.product]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductEditView product={updateProductPage?.product} />
    </>
  );
}
