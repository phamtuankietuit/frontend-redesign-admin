import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

// import { socket } from 'src/hooks/use-socket';

import { selectChat, addCustomerMessage } from 'src/state/chat/chat.slice';

import { Scrollbar } from 'src/components/scrollbar';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { useMessagesScroll } from './hooks/use-messages-scroll';
import { CustomerChatMessageItem } from './customer-chat-message-item';

// ----------------------------------------------------------------------

export function CustomerChatMessageList() {
  const { customer } = useSelector(selectChat);

  const { messages, conversation } = customer;

  const { messagesEndRef } = useMessagesScroll(messages);

  const dispatch = useDispatch();

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  // useEffect(() => {
  //   if (!conversation) return;

  //   socket.on('msg-receive', (message) => {
  //     dispatch(addCustomerMessage(message));
  //   });

  //   // eslint-disable-next-line consistent-return
  //   return () => {
  //     socket.off('msg-receive');
  //   };
  // }, [conversation, dispatch]);

  if (!conversation) {
    return (
      <Stack sx={{ flex: '1 1 auto', position: 'relative' }}>
        <LinearProgress
          color="inherit"
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 2,
            borderRadius: 0,
            position: 'absolute',
          }}
        />
      </Stack>
    );
  }

  return (
    <>
      <Scrollbar
        key={conversation._id}
        ref={messagesEndRef}
        sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}
      >
        {messages.map((message, index) => (
          <CustomerChatMessageItem
            key={`${message.id}-${index}`}
            message={message}
            onOpenLightbox={() => lightbox.onOpen(message.body)}
          />
        ))}
      </Scrollbar>

      <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      />
    </>
  );
}
