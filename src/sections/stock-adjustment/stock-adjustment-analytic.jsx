import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { stylesMode, varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function StockAdjustmentAnalytic({
  title,
  total,
  icon,
  color,
  percent,
  increase = 0,
  decrease = 0,
}) {
  const theme = useTheme();

  return (
    <Stack
      spacing={3}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 200 }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ position: 'relative' }}
      >
        <Iconify icon={icon} width={32} sx={{ color, position: 'absolute' }} />

        <CircularProgress
          size={56}
          thickness={2}
          value={percent}
          variant="determinate"
          sx={{ color, opacity: 0.48 }}
        />

        <CircularProgress
          size={56}
          value={100}
          thickness={3}
          variant="determinate"
          sx={{
            top: 0,
            left: 0,
            opacity: 0.48,
            position: 'absolute',
            color: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
          }}
        />
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="subtitle1">{title}</Typography>

        <Box
          component="span"
          sx={{ color: 'text.disabled', typography: 'body2' }}
        >
          {fShortenNumber(total)} đơn
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="span"
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              borderRadius: '50%',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: varAlpha(theme.vars.palette.success.mainChannel, 0.16),
              color: 'success.dark',
              [stylesMode.dark]: { color: 'success.light' },
            }}
          >
            <Iconify width={16} icon="eva:trending-up-fill" />
          </Box>
          <Typography variant="subtitle2">{fCurrency(increase)}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="span"
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              borderRadius: '50%',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
              color: 'error.dark',
              [stylesMode.dark]: { color: 'error.light' },
            }}
          >
            <Iconify width={16} icon="eva:trending-down-fill" />
          </Box>

          <Typography variant="subtitle2">{fCurrency(decrease)}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
