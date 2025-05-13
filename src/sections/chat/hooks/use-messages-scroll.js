import { useSelector } from 'react-redux';
import { useRef, useState, useEffect, useCallback } from 'react';

import { selectChat } from 'src/state/chat/chat.slice';

// ----------------------------------------------------------------------

export function useMessagesScroll(messages) {
  const { addTop } = useSelector(selectChat);

  const messagesRef = useRef(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const scrollHeightBeforeUpdateRef = useRef(0);
  const scrollTopBeforeUpdateRef = useRef(0);

  const [isAtTop, setIsAtTop] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);


  const handleScroll = useCallback(() => {
    if (!messagesRef.current) {
      return;
    }

    // Save scroll position when near top for maintaining position later
    if (messagesRef.current.scrollTop <= 10) {
      scrollHeightBeforeUpdateRef.current = messagesRef.current.scrollHeight;
      scrollTopBeforeUpdateRef.current = messagesRef.current.scrollTop;
    }

    const isNearTop = messagesRef.current.scrollTop <= 10;
    setIsAtTop(isNearTop);
  }, []);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    // eslint-disable-next-line consistent-return
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [messages, handleScroll]);

  // This effect handles scroll position maintenance when messages change
  useEffect(() => {
    // Skip on first render
    if (!messagesRef.current) return;

    const currentLength = messages.length;
    const previousLength = prevMessagesLengthRef.current;

    // If messages were added to the top (previous messages loaded)
    if (currentLength > previousLength) {
      // Calculate how much new content was added
      const newHeight = messagesRef.current.scrollHeight;
      const heightDifference = newHeight - scrollHeightBeforeUpdateRef.current;

      // Adjust scroll position to maintain the same relative position
      if (heightDifference > 0) {
        messagesRef.current.scrollTop = scrollTopBeforeUpdateRef.current + heightDifference;
      }
    }

    // Update the previous length reference
    prevMessagesLengthRef.current = currentLength;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTop]);

  return { messagesRef, isAtTop };
}
