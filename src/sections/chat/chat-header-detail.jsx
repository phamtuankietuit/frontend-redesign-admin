import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { selectChat } from 'src/state/chat/chat.slice';

import { Iconify } from 'src/components/iconify';

import { ChatHeaderSkeleton } from './chat-skeleton';

// ----------------------------------------------------------------------

export function ChatHeaderDetail({ collapseNav, loading }) {
  const lgUp = useResponsive('up', 'lg');

  const { admin } = useSelector(selectChat);

  const { contact } = admin;

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
        variant={contact?.status}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={contact?.avatarUrl} alt={contact?.name} />
      </Badge>

      <ListItemText
        primary={contact?.name}
        secondary={
          contact?.status === 'offline'
            ? fToNow(contact?.lastActivity)
            : contact?.status
        }
        secondaryTypographyProps={{
          component: 'span',
          ...(contact?.status !== 'offline' && {
            textTransform: 'capitalize',
          }),
        }}
      />
    </Stack>
  );

  if (loading || !contact) {
    return <ChatHeaderSkeleton />;
  }

  return (
    <>
      {renderSingle}

      <Stack direction="row" flexGrow={1} justifyContent="flex-end">
        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={
              !collapseDesktop
                ? 'ri:sidebar-unfold-fill'
                : 'ri:sidebar-fold-fill'
            }
          />
        </IconButton>
      </Stack>
    </>
  );
}
