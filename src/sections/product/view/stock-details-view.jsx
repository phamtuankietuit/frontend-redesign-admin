import { useSelector } from 'react-redux';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { selectStock } from 'src/state/stock/stock.slice';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { fCurrency } from 'src/utils/format-number';
import { selectBranch } from 'src/state/branch/branch.slice';

// ----------------------------------------------------------------------

export function StockDetailsView() {
  const { product } = useSelector(selectStock);
  const { branches } = useSelector(selectBranch);

  const variants = product?.productVariants;
  if (!variants || variants.length === 0) return null;

  // Extract option names from the first variant (assumes all variants share the same option structure)
  const optionNames = variants[0].variantOptions.map((opt) => opt.name);

  // Build a 2D array of values: each row is an array of values for that variant
  const data = variants.map((variant) =>
    variant.variantOptions.map((opt) => opt.value),
  );

  // Calculate row spans for each column
  const rowSpans = optionNames.map((_, colIndex) => {
    const spans = Array(variants.length).fill(0);
    for (let i = 0; i < variants.length; i += 1) {
      // If first row or value differs from previous, start a new rowspan
      if (i === 0 || data[i][colIndex] !== data[i - 1][colIndex]) {
        let count = 1;
        for (let j = i + 1; j < variants.length; j += 1) {
          if (data[j][colIndex] === data[i][colIndex]) {
            count += 1;
          } else {
            break;
          }
        }
        spans[i] = count;
      } else {
        // Otherwise, this cell is merged into previous, so no render
        spans[i] = 0;
      }
    }
    return spans;
  });

  const Information = (
    <Card>
      <CardHeader title="Thông tin sản phẩm" sx={{ p: 2 }} />

      <Divider />

      <Grid container sx={{ mx: 'auto', p: 2 }} rowSpacing={2}>
        <Grid item xs={12} md={6}>
          <ListItemText
            primary="Mã sản phẩm"
            secondary={product?.id || ''}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              typography: 'body1',
              mt: 0.5,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ListItemText
            primary="Tên sản phẩm"
            secondary={product?.name || ''}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              typography: 'body1',
              mt: 0.5,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ListItemText
            primary="Loại sản phẩm"
            secondary={product?.productType?.displayName || ''}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              typography: 'body1',
              mt: 0.5,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ListItemText
            primary="Tổng tồn kho"
            secondary={fCurrency(product?.totalStockQuantity || 0, {
              currencyDisplay: 'code',
            })}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              typography: 'body1',
              mt: 0.5,
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );

  const Details = (
    <Card>
      <CardHeader title="Chi tiết tồn kho" sx={{ p: 2 }} />

      <Divider />

      <Box sx={{ p: 1 }}>
        <TableContainer component={Paper} sx={{ p: 1, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {optionNames.map((name) => (
                  <TableCell
                    key={name}
                    style={{ borderColor: '#ddd' }}
                    sx={{
                      minWidth: 100,
                      textAlign: 'center',
                      border: '1px solid #ddd',
                    }}
                  >
                    {name}
                  </TableCell>
                ))}
                {branches.map((branch, index) => (
                  <TableCell
                    key={branch.id || index}
                    style={{ borderColor: '#ddd' }}
                    sx={{
                      minWidth: 100,
                      textAlign: 'center',
                      border: '1px solid #ddd',
                    }}
                  >
                    {branch.name}
                  </TableCell>
                ))}
                <TableCell
                  key="head-total"
                  style={{ borderColor: '#ddd' }}
                  sx={{
                    minWidth: 100,
                    textAlign: 'center',
                    border: '1px solid #ddd',
                  }}
                >
                  Tổng
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variants.map((variant, rowIndex) => (
                <TableRow key={variant.id}>
                  {optionNames.map((_, colIndex) => {
                    const span = rowSpans[colIndex][rowIndex];
                    if (span > 0) {
                      return (
                        <TableCell
                          key={colIndex}
                          rowSpan={span}
                          style={{ borderColor: '#ddd' }}
                          sx={{ border: '1px solid #ddd' }}
                        >
                          {data[rowIndex][colIndex]}
                        </TableCell>
                      );
                    }
                    return null;
                  })}

                  {variant?.stockBreakdowns?.map((breakdown, index) => (
                    <TableCell
                      key={breakdown.branchId || index}
                      style={{ borderColor: '#ddd' }}
                      sx={{
                        minWidth: 100,
                        textAlign: 'center',
                        border: '1px solid #ddd',
                      }}
                    >
                      {fCurrency(breakdown.stockQuantity || 0, {
                        currencyDisplay: 'code',
                      })}
                    </TableCell>
                  ))}

                  <TableCell
                    key={`${variant.id}-total`}
                    style={{ borderColor: '#ddd' }}
                    sx={{
                      minWidth: 100,
                      textAlign: 'center',
                      border: '1px solid #ddd',
                    }}
                  >
                    {fCurrency(variant.stockQuantity || 0, {
                      currencyDisplay: 'code',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Chi tiết tồn kho"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Tồn kho', href: paths.dashboard.product.stock },
          { name: product?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', width: 1 }}>
        {Information}

        {Details}
      </Stack>
    </DashboardContent>
  );
}
