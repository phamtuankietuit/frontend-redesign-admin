import { useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { selectChat } from 'src/state/chat/chat.slice';

import { Iconify } from 'src/components/iconify';

import { CollapseButton } from './styles';

// ----------------------------------------------------------------------

export function ChatRoomSingle() {
  const { customerId, cCombined, cLoading } = useSelector(selectChat);

  const collapse = useBoolean(true);

  const renderInfo = (
    <Stack alignItems="center" sx={{ py: 5 }}>
      <Avatar
        alt={cCombined?.customer?.fullName}
        src={cCombined?.customer?.imageUrl}
        sx={{ width: 96, height: 96, mb: 2 }}
      />
      <Typography variant="subtitle1">
        {cCombined?.customer?.fullName}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        KHÁCH HÀNG
      </Typography>
    </Stack>
  );

  const renderContact = (
    <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
      {[
        {
          icon: 'fluent:calendar-12-filled',
          value: new Date(cCombined?.customer?.dateOfBirth).toLocaleDateString(
            'vi-VN',
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            },
          ),
        },
        { icon: 'solar:phone-bold', value: cCombined?.customer?.phoneNumber },
        { icon: 'fluent:mail-24-filled', value: cCombined?.customer?.email },
      ].map((item) => (
        <Stack
          key={item.icon}
          spacing={1}
          direction="row"
          sx={{ typography: 'body2', wordBreak: 'break-all' }}
        >
          <Iconify
            icon={item.icon}
            sx={{ flexShrink: 0, color: 'text.disabled' }}
          />
          {item.value}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      {renderInfo}

      <CollapseButton selected={collapse.value} onClick={collapse.onToggle}>
        Thông tin khách hàng
      </CollapseButton>

      <Collapse in={collapse.value}>{renderContact}</Collapse>
    </>
  );
}
