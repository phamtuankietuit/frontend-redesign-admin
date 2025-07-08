import { Autocomplete, Stack, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';

import { fCurrency } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AnalyticsWebsiteVisits({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    hexAlpha(theme.palette.primary.dark, 0.8),
    hexAlpha(theme.palette.warning.main, 0.8),
  ];
  const chartOptions = useChart({
    colors: chartColors,
    stroke: {
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chart.categories,
    },
    yaxis: {
      labels: {
        formatter: (value) => fCurrency(value),
      },
    },
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value) => fCurrency(value),
      },
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack
        sx={{ p: 2, px: 3 }}
        spacing={1}
        direction="row"
        alignItems="center"
      >
        <DatePicker sx={{ flex: 1 }} label="Từ ngày" />

        <DatePicker sx={{ flex: 1 }} label="Đến ngày" />

        <Autocomplete
          sx={{ flex: 1 }}
          options={['Ngày', 'Tháng', 'Năm']}
          renderInput={(params) => <TextField {...params} label="Nhóm theo" />}
        />
      </Stack>

      <Chart
        type="bar"
        series={chart.series}
        options={chartOptions}
        height={364}
        sx={{ pb: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
