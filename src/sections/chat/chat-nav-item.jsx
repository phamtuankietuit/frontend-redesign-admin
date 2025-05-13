import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { resetChatSelected } from 'src/state/chat/chat.slice';
import { updateConversationReadAsync } from 'src/services/chat/chat.service';

// ----------------------------------------------------------------------

export function ChatNavItem({
  selected,
  collapse,
  onCloseMobile,
  conversation,
}) {
  const dispatch = useDispatch();

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const {
    customer: { fullName, imageUrl },
    latestMessage,
    unreadCount,
    conversationReadId,
  } = conversation;

  const handleClickConversation = useCallback(async () => {
    try {
      if (selectedConversationId !== conversation.id) {
        if (!mdUp) {
          onCloseMobile();
        }

        dispatch(resetChatSelected());

        dispatch(
          updateConversationReadAsync({
            conversationReadId,
            lastReadMessageId: latestMessage.id,
          }),
        );

        router.push(`${paths.dashboard.chat}?id=${conversation.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    selectedConversationId,
    conversation.id,
    mdUp,
    dispatch,
    router,
    onCloseMobile,
    conversationReadId,
    latestMessage,
  ]);

  const renderSingle = (
    <Avatar alt={fullName} src={imageUrl} sx={{ width: 48, height: 48 }} />
  );

  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          ...(selected && { bgcolor: 'action.selected' }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? unreadCount : 0}
        >
          {renderSingle}
        </Badge>

        {!collapse && (
          <>
            <ListItemText
              primary={fullName}
              primaryTypographyProps={{
                noWrap: true,
                component: 'span',
                variant: 'subtitle2',
              }}
              secondary={
                latestMessage?.contentType === 'text'
                  ? latestMessage?.body
                  : 'Hình ảnh'
              }
              secondaryTypographyProps={{
                noWrap: true,
                component: 'span',
                variant: 'body2',
                color: 'text.secondary',
              }}
            />

            <Stack
              alignItems="flex-end"
              sx={{ alignSelf: 'stretch' }}
              spacing={0.5}
            >
              <Typography
                noWrap
                variant="body2"
                component="span"
                sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
              >
                {fToNow(latestMessage?.createdAt)}
              </Typography>

              {!!unreadCount && (
                <Badge
                  badgeContent={unreadCount}
                  max={99}
                  color="error"
                  sx={{
                    mr: 1,
                  }}
                />
              )}
            </Stack>
          </>
        )}
      </ListItemButton>
    </Box>
  );
}
