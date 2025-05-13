import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LinearProgress from '@mui/material/LinearProgress';

import { useSearchParams } from 'src/routes/hooks';

import { getMessagesAsync } from 'src/services/chat/chat.service';
import { selectChat, setTableFiltersMessages } from 'src/state/chat/chat.slice';

import { Scrollbar } from 'src/components/scrollbar';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from './hooks/use-messages-scroll';

// ----------------------------------------------------------------------

export function ChatMessageList() {
  const dispatch = useDispatch();

  const { messages, mLoading, tableFiltersMessages, mIsEnd } =
    useSelector(selectChat);

  const { messagesRef, isAtTop } = useMessagesScroll(messages);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  const searchParams = useSearchParams();

  const conversationId = searchParams.get('id') || '';

  useEffect(() => {
    if (isAtTop && messages.length > 0 && !mIsEnd) {
      dispatch(
        setTableFiltersMessages({
          fromId: messages[0].id,
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAtTop]);

  useEffect(() => {
    if (conversationId) {
      dispatch(getMessagesAsync({ conversationId, ...tableFiltersMessages }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, tableFiltersMessages]);

  return (
    <>
      <Scrollbar
        ref={messagesRef}
        sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}
      >
        {(isAtTop || mLoading) && !mIsEnd && (
          <LinearProgress
            color="primary"
            sx={{
              top: 0,
              left: 0,
              width: 1,
              height: 2,
              borderRadius: 0,
              position: 'absolute',
            }}
          />
        )}

        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
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
