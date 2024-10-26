import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function SearchNotFound({ query, sx, ...other }) {
  if (!query) {
    return (
      <Typography variant="body2" sx={sx}>
        Hãy nhập từ khóa để tìm kiếm
      </Typography>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', borderRadius: 1.5, ...sx }} {...other}>
      <Box sx={{ mb: 1, typography: 'h6' }}>Không tìm thấy</Box>

      <Typography variant="body2">
        Không có kết quả cho &nbsp;
        <strong>{`"${query}"`}</strong>
        .
        <br /> Kiểm tra lỗi chính tả hoặc thử từ khóa khác.
      </Typography>
    </Box>
  );
}
