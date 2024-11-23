import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import {
  Carousel,
  useCarousel,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

export function MyCarousel({ title, list, sx, ...other }) {
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: { xs: 1, sm: 2, md: 3, lg: '40%', xl: '30%' },
  });

  return (
    <Box sx={sx} {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <CarouselArrowBasicButtons {...carousel.arrows} />
      </Box>

      <Carousel
        carousel={carousel}
        slotProps={{
          slide: { py: 3 },
        }}
        sx={{ px: 0.5 }}
      >
        {list?.map((item, index) => (
          <CarouselItem
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 1,
            }}
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </Carousel>
    </Box>
  );
}

// ----------------------------------------------------------------------

function CarouselItem({ item, sx, index, ...other }) {
  const renderImage = (
    <Box
      sx={{
        px: 1,
        pt: 1,
      }}
    >
      {index % 2 === 0 ? (
        <Box
          sx={{
            backgroundColor: 'info.main',
            borderRadius: 1.5,
            width: '100%',
            height: '128px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <Iconify width={72} icon="bxs:truck" />
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: 'warning.main',
            borderRadius: 1.5,
            width: '100%',
            height: '128px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <Iconify width={72} icon="iconamoon:discount-fill" />
        </Box>
      )}
    </Box>
  );

  return (
    <Card sx={{ width: 1, ...sx }} {...other}>
      {renderImage}

      <Box sx={{ px: 2, py: 2.5 }}>
        {index % 2 === 0 ? (
          <>
            <Typography variant="subtitle1" color="inherit" sx={{ pb: 1 }}>
              GIẢM 5% PHÍ VẬN CHUYỂN
            </Typography>
            <Typography variant="subtitle2" color="grey.600" sx={{ pb: 1 }}>
              Đơn hàng từ 500.000đ
            </Typography>
            <Typography variant="subtitle2" color="grey.600" sx={{ pb: 1 }}>
              Giảm tối đa 50.000đ
            </Typography>
            <Typography variant="subtitle2" color="grey.500">
              01/08/2024 - 31/08/2024
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" color="inherit" sx={{ pb: 1 }}>
              GIẢM 5% CHO ĐƠN HÀNG ĐẦU TIÊN
            </Typography>
            <Typography variant="subtitle2" color="grey.600" sx={{ pb: 1 }}>
              Đơn hàng từ 500.000đ
            </Typography>
            <Typography variant="subtitle2" color="grey.600" sx={{ pb: 1 }}>
              Giảm tối đa 50.000đ
            </Typography>
            <Typography variant="subtitle2" color="grey.500">
              01/08/2024 - 31/08/2024
            </Typography>
          </>
        )}
      </Box>
    </Card>
  );
}
