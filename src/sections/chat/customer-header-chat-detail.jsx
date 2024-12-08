import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

export function CustomerChatHeaderDetail({ onClose }) {
  const renderSingle = (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{
        width: 1,
      }}
    >
      <Badge
        variant="standard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={`${CONFIG.assetsDir}/logo/my-logo-single.svg`} alt="img" />
      </Badge>

      <ListItemText
        primary="KKBooks"
        secondaryTypographyProps={{
          component: 'span',
          textTransform: 'capitalize',
        }}
      />

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  return <>{renderSingle}</>;
}
