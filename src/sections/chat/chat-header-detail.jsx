import { useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { selectChat } from 'src/state/chat/chat.slice';

import { Iconify } from 'src/components/iconify';

import { ChatHeaderSkeleton } from './chat-skeleton';

// ----------------------------------------------------------------------

export function ChatHeaderDetail({ collapseNav }) {
  const lgUp = useResponsive('up', 'lg');

  const { admin } = useSelector(selectChat);

  const { contact } = admin;

  const { avatarUrl, name, status, lastActivity } = contact;

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const renderSingle = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Badge
        variant={status}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={avatarUrl} alt={name} />
      </Badge>

      <ListItemText
        primary={name}
        secondary={status === 'offline' ? fToNow(lastActivity) : status}
        secondaryTypographyProps={{
          component: 'span',
          ...(status !== 'offline' && {
            textTransform: 'capitalize',
          }),
        }}
      />
    </Stack>
  );

  return <>{renderSingle}</>;
}
