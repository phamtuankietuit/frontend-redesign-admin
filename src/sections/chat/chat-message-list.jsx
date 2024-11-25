import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { selectChat } from 'src/state/chat/chat.slice';
import { getConversationByIdAsync } from 'src/services/chat/chat.service';

import { Scrollbar } from 'src/components/scrollbar';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from './hooks/use-messages-scroll';

// ----------------------------------------------------------------------

export function ChatMessageList({ conversationId }) {
  const { admin } = useSelector(selectChat);

  const { messages, conversation } = admin;

  const { messagesEndRef } = useMessagesScroll(messages);

  const loading = useBoolean(true);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConversationByIdAsync(conversationId)).then((action) => {
      if (getConversationByIdAsync.fulfilled.match(action)) {
        loading.onFalse();
      }
    });
  }, [dispatch, conversationId, loading]);

  // if (loading) {
  //   return (
  //     <Stack sx={{ flex: '1 1 auto', position: 'relative' }}>
  //       <LinearProgress
  //         color="inherit"
  //         sx={{
  //           top: 0,
  //           left: 0,
  //           width: 1,
  //           height: 2,
  //           borderRadius: 0,
  //           position: 'absolute',
  //         }}
  //       />
  //     </Stack>
  //   );
  // }

  return (
    <>
      <Scrollbar
        ref={messagesEndRef}
        sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}
      >
        {messages.map((message) => (
          <ChatMessageItem
            key={message._id}
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
