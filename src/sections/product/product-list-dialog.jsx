import { useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import {
  Table,
  Button,
  Divider,
  TableBody,
  Pagination,
  DialogActions,
} from '@mui/material';

import { getProductsAsync } from 'src/services/product/product.service';
import {
  setProducts,
  selectStockAdjustment,
  setProductsTableFilters,
} from 'src/state/stock-adjustment/stock-adjustment.slice';

import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
} from 'src/components/table';

import SearchBar from './components/search-bar';
import { ProductTableRow } from './new-product-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'checkbox', label: '', noSort: true },
  { id: 'Name', label: 'Sản phẩm', noSort: true },
  { id: 'Variant', label: 'Biến thể', noSort: true },
];

export function ProductListDialog({
  open,
  action,
  onClose,
  onSelect,
  title = '',
}) {
  const { watch } = useFormContext();

  const values = watch();

  const dispatch = useDispatch();

  const {
    createEditPage: {
      products,
      productsTableFilters,
      productsTotalCount,
      productsLoading,
    },
  } = useSelector(selectStockAdjustment);

  const fetchData = useCallback(async () => {
    await dispatch(getProductsAsync(productsTableFilters))
      .unwrap()
      .then((response) => {
        const { items } = response;

        const newProducts = [];

        items.forEach((item) => {
          if (item.variants.length === 1) {
            const stockQuantity = item.variants[0].stockBreakdowns.find(
              (stock) => stock.branchId === values?.branch?.id,
            )?.stockQuantity;

            newProducts.push({
              id: item.id,
              variantId: item.variants[0].id,
              productName: item.name,
              thumbnailImageUrl: item.thumbnailImageUrl,
              variant: item.variants[0],
              optionValues: item.variants[0].optionValues,
              isSingle: true,
              adjustmentType: '1',
              quantity: 0,
              totalQuantityBefore: stockQuantity,
              afterQuantity: stockQuantity,
              unitCost: item.variants[0].lastestUnitCost,
              remarks: '',
              reason: '',
            });
          } else {
            item.variants.forEach((variant) => {
              const stockQuantity = variant.stockBreakdowns.find(
                (stock) => stock.branchId === values?.branch?.id,
              )?.stockQuantity;

              newProducts.push({
                id: item.id,
                variantId: variant.id,
                productName: item.name,
                thumbnailImageUrl: item.thumbnailImageUrl,
                variant,
                optionValues: variant.optionValues,
                isSingle: false,
                adjustmentType: '1',
                quantity: 0,
                totalQuantityBefore: stockQuantity,
                afterQuantity: stockQuantity,
                unitCost: variant.lastestUnitCost,
                remarks: '',
                reason: '',
              });
            });
          }
        });

        dispatch(setProducts(newProducts));
      });
  }, [dispatch, productsTableFilters, values?.branch?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useTable();

  const notFound = products.length === 0;

  const handleSubmit = () => {
    const selectedProducts = products.filter((product) =>
      table.selected.includes(product.variantId),
    );

    table.onSelectAllRows(false);

    onSelect(selectedProducts);
    onClose();
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setProductsTableFilters({ pageNumber: newPage }));
  };

  const handleSearchChange = useCallback(
    (searchValue) => {
      dispatch(
        setProductsTableFilters({
          searchQuery: searchValue,
          pageNumber: 1,
        }),
      );
    },
    [dispatch],
  );

  const renderList = (
    <Scrollbar sx={{ position: 'relative', maxHeight: '60vh' }}>
      <Table size="medium" sx={{ minWidth: 300 }}>
        <TableHeadCustom
          headLabel={TABLE_HEAD}
          numSelected={table.selected.length}
        />

        <TableBody>
          {products.map((row) => (
            <ProductTableRow
              key={row.variantId}
              row={row}
              selected={table.selected.includes(row.variantId)}
              onSelectRow={() => table.onSelectRow(row.variantId)}
            />
          ))}

          {productsLoading &&
            [...Array(5)].map((_, index) => <TableSkeleton key={index} />)}

          <TableNoData notFound={notFound} />
        </TableBody>
      </Table>
    </Scrollbar>
  );

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Stack>

      <Divider />

      <Stack sx={{ p: 1 }}>
        <SearchBar
          placeholder="Tìm kiếm biến thể..."
          value={productsTableFilters.searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Stack>

      {renderList}

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {table.selected.length} biến thể được chọn
        </Typography>

        <Pagination
          color="primary"
          count={Math.floor(productsTotalCount / 10)}
          variant="text"
          page={productsTableFilters.pageNumber}
          onChange={handleChangePage}
        />

        <Button
          color="inherit"
          variant="outlined"
          onClick={() => {
            table.onSelectAllRows(false);
            onClose();
          }}
        >
          Hủy
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!table.selected.length}
        >
          Chọn
        </Button>
      </DialogActions>
    </Dialog>
  );
}
