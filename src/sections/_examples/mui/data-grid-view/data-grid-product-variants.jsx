import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import {
  Box,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  TableContainer,
  InputAdornment,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';
import { generateCombinations } from 'src/utils/helper';

export function DataGridProductVariants({ data, control }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(generateCombinations(data));
  }, [data]);

  return (
    <TableContainer component={Paper} sx={{ p: 1 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {data.map((variant) => (
              <TableCell key={variant.id}>{variant.variantName}</TableCell>
            ))}
            <TableCell>Giá bán</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => {
                if (rowIndex !== 0 && cell === rows[rowIndex - 1][cellIndex]) {
                  return null;
                }

                let rowSpan = 1;
                for (let i = rowIndex + 1; i < rows.length; i += 1) {
                  if (cell === rows[i][cellIndex]) {
                    rowSpan += 1;
                  } else {
                    break;
                  }
                }

                return (
                  <TableCell
                    style={{ borderColor: '#ddd' }}
                    sx={{ border: '1px solid #ddd' }}
                    rowSpan={rowSpan}
                    key={`${cell}-${cellIndex}`}
                  >
                    {cell}
                  </TableCell>
                );
              })}
              <TableCell
                key={rowIndex}
                sx={{ border: '1px solid #ddd' }}
                style={{ borderColor: '#ddd' }}
              >
                <Controller
                  name={row.join('-')}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      type="text"
                      label="Giá bán"
                      InputLabelProps={{ shrink: true }}
                      value={fCurrency(value, { currencyDisplay: 'code' })}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        onChange(Number(rawValue));
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{ color: 'text.disabled' }}
                            >
                              ₫
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
