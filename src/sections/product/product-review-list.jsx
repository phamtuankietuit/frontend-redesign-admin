import { useDispatch, useSelector } from 'react-redux';

import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { selectProduct } from 'src/state/product/product.slice';
import { getProductRatingsAsync } from 'src/services/product/product.service';

import { ProductReviewItem } from './product-review-item';

// ----------------------------------------------------------------------

export function ProductReviewList() {
  const { product, ratings } = useSelector(selectProduct);
  const dispatch = useDispatch();

  const handleOnChange = (event, page) => {
    dispatch(
      getProductRatingsAsync({
        productId: product.id,
        pageSize: 10,
        pageNumber: page,
      }),
    );
  };

  return (
    <>
      {ratings.ratings.items.map((review) => (
        <ProductReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={ratings.totalPages}
        onChange={handleOnChange}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}
