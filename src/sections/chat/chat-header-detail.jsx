import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { selectChat } from 'src/state/chat/chat.slice';
import {
  getUserByIdAsync,
  getConversationByIdAsync,
} from 'src/services/chat/chat.service';

import { Iconify } from 'src/components/iconify';

import { ChatHeaderSkeleton } from './chat-skeleton';

// ----------------------------------------------------------------------

export function ChatHeaderDetail({ collapseNav }) {
  const lgUp = useResponsive('up', 'lg');

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const dispatch = useDispatch();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const { customerId, cCombined, cLoading } = useSelector(selectChat);

  useEffect(() => {
    if (customerId !== '') {
      dispatch(getUserByIdAsync(Number(customerId)));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const fetchData = useCallback(async () => {
    dispatch(getConversationByIdAsync(selectedConversationId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderSingle = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        src={cCombined?.customer?.imageUrl}
        alt={cCombined?.customer?.fullName}
      />

      <ListItemText
        primary={`${cCombined?.customer?.firstName} ${cCombined?.customer?.lastName}`}
      />
    </Stack>
  );

  if (cLoading) {
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
