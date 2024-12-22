import { useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { selectAuth } from 'src/state/auth/auth.slice';
import { sendAdminMessageAsync } from 'src/services/chat/chat.service';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ChatMessageInput({ disabled, selectedConversationId }) {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const fileRef = useRef(null);

  const [message, setMessage] = useState('');

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event) => {
      if (event.key !== 'Enter' || !message) return;

      try {
        dispatch(
          sendAdminMessageAsync({
            body: message,
            senderId: user.id.toString(),
            conversationId: selectedConversationId,
          }),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setMessage('');
      }
    },
    [message, dispatch, selectedConversationId, user.id],
  );

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Nhập tin nhắn"
        disabled={disabled}
        startAdornment={
          <IconButton>
            <Iconify icon="solar:chat-line-bold" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
