import React from 'react';
import { Box, Rating, Paper, Typography } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';

export const CatalogItemCard = ({
  name = 'Sample Product',
  thumbnailUrl = '/api/placeholder/300/300',
  minPrice = 0,
  maxPrice = 0,
  minDiscountPrice = 0,
  maxDiscountPrice = 0,
  rating = 4.5,
  soldAmount = 0,
}) => (
  <Paper className="max-w-sm overflow-hidden transition-shadow hover:shadow-lg m-2">
    <div className="relative">
      {/* Sale badge */}
      {(minDiscountPrice > 0 || maxDiscountPrice > 0) && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            SALE
          </span>
        </div>
      )}

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
    </div>

    <Box className="p-4">
      {/* Product name */}
      <Typography className="text-lg font-semibold mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
        {name}
      </Typography>

      {/* Price section */}
      <div className="mb-2">
        {minDiscountPrice > 0 || maxDiscountPrice > 0 ? (
          <div className="flex flex-col">
            <span className="text-gray-400 line-through text-sm">
              {fCurrency(minPrice)} - {fCurrency(maxPrice)}
            </span>
            <span className="text-red-500 font-semibold">
              {fCurrency(minDiscountPrice)} - {fCurrency(maxDiscountPrice)}
            </span>
          </div>
        ) : (
          <span className="text-gray-900 font-semibold">
            {fCurrency(minPrice)} - {fCurrency(maxPrice)}
          </span>
        )}
      </div>

      {/* Rating and sold amount */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Rating
            size="small"
            value={rating}
            precision={0.1}
            readOnly
            sx={{ mr: 1 }}
          />
        </div>
        <span className="text-sm text-gray-500">
          {soldAmount.toLocaleString()} sold
        </span>
      </div>
    </Box>
  </Paper>
);
