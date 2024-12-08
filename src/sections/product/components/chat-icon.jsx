import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Badge, Grow } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { Layout } from 'src/sections/chat/layout';
import { CustomerChatMessageList } from 'src/sections/chat/customer-chat-message-list';
import { CustomerChatHeaderDetail } from 'src/sections/chat/customer-header-chat-detail';
import { CustomerChatMessageInput } from 'src/sections/chat/customer-chat-message-input';

// ----------------------------------------------------------------------

export function ChatIcon() {
  const isOpen = useBoolean(false);

  const [recipients, setRecipients] = useState([]);

  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);

  const handleClose = () => {
    isOpen.onFalse();
    setRecipients([]);
  };

  const handleOpen = () => {
    isOpen.onTrue();
  };

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

                  <CustomerChatMessageInput
                    recipients={recipients}
                    onAddRecipients={handleAddRecipients}
                    selectedConversationId="e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2"
                    disabled={
                      !recipients.length &&
                      !'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2'
                    }
                  />
                </>
              ),
            }}
          />
        </Box>
      </Grow>
    </Box>
  );
}
