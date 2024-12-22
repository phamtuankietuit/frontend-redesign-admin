import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { Grow, Badge } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { selectAuth } from 'src/state/auth/auth.slice';
import { getMeAsync } from 'src/services/auth/auth.service';
import {
  getConversationsAsync,
  getConversationByIdAsync,
} from 'src/services/chat/chat.service';

import { Iconify } from 'src/components/iconify';

import { Layout } from 'src/sections/chat/layout';
import { CustomerChatMessageList } from 'src/sections/chat/customer-chat-message-list';
import { CustomerChatHeaderDetail } from 'src/sections/chat/customer-header-chat-detail';
import { CustomerChatMessageInput } from 'src/sections/chat/customer-chat-message-input';

// ----------------------------------------------------------------------

export function ChatIcon() {
  const isOpen = useBoolean(false);

  const handleClose = () => {
    isOpen.onFalse();
  };

  const handleOpen = () => {
    isOpen.onTrue();
  };

  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (!user) {
      dispatch(getMeAsync());
      return;
    }

    dispatch(getConversationsAsync(user.id)).then((action) => {
      if (
        getConversationsAsync.fulfilled.match(action) &&
        action.payload.length > 0
      ) {
        dispatch(getConversationByIdAsync(action.payload[0].conversation._id));
      }
    });
  }, [user, dispatch]);

  return (
    <Box>
      <Grow in={!isOpen.value} style={{ transformOrigin: 'left top' }}>
        <Box
          onClick={handleOpen}
          sx={{
            right: 40,
            bottom: 40,
            zIndex: 999,
            position: 'fixed',
            width: 'fit-content',
            display: 'flex',
            cursor: 'pointer',
            color: 'text.primary',
            borderRadius: 16,
            bgcolor: 'background.paper',
            padding: (theme) => theme.spacing(2, 2, 2, 2),
            boxShadow: (theme) => theme.customShadows.dropdown,
            transition: (theme) => theme.transitions.create(['opacity']),
            '&:hover': { opacity: 0.72 },
          }}
        >
          <Badge showZero badgeContent={1} color="error" max={99}>
            <Iconify icon="solar:chat-line-bold" width={24} />
          </Badge>
        </Box>
      </Grow>

      <Grow in={isOpen.value} style={{ transformOrigin: 'right bottom' }}>
        <Box
          sx={{
            right: 40,
            bottom: 40,
            zIndex: 999,
            position: 'fixed',
          }}
        >
          <Layout
            sx={{
              height: 500,
              width: 500,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.customShadows.card,
            }}
            slots={{
              header: <CustomerChatHeaderDetail onClose={handleClose} />,
              main: (
                <>
                  <CustomerChatMessageList />

                  <CustomerChatMessageInput />
                </>
              ),
            }}
          />
        </Box>
      </Grow>
    </Box>
  );
}
