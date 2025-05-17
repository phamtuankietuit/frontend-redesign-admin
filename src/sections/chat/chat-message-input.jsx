import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { lowercaseAlphanumRegex } from 'src/utils/regex';

import { uploadImagesAsync } from 'src/services/file/file.service';
import { createMessageAsync } from 'src/services/chat/chat.service';
import { getFastMessagesAsync } from 'src/services/fast-message/fast-message.service';
import {
  selectFastMessage,
  setTop3FastMessages,
} from 'src/state/fast-message/fast-message.slice';

import { Iconify } from 'src/components/iconify';

import { FastMessage } from './fast-message';

// ----------------------------------------------------------------------

export function ChatMessageInput({ disabled, selectedConversationId }) {
  const dispatch = useDispatch();

  const { fastMessages, top3FastMessages } = useSelector(selectFastMessage);

  const fileRef = useRef(null);
  const inputRef = useRef(null);

  const [message, setMessage] = useState('');

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback(
    (event) => {
      const { value } = event.target;

      setMessage(value);

      if (
        value.startsWith('/') &&
        lowercaseAlphanumRegex.test(value.slice(1))
      ) {
        const query = value.slice(1).toLowerCase();
        const topMatches = fastMessages.filter((msg) =>
          msg.shorthand?.toLowerCase().includes(query),
        );
        // .slice(0, 3);

        dispatch(setTop3FastMessages(topMatches));
      } else {
        dispatch(setTop3FastMessages([]));
      }
    },
    [dispatch, fastMessages],
  );

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await dispatch(uploadImagesAsync([file]))
        .unwrap()
        .then((urls) => {
          dispatch(
            createMessageAsync({
              conversationId: selectedConversationId,
              contentType: 'image',
              body: urls[0],
            }),
          );
        });
    }
  };

  const handleSendMessage = useCallback(
    async (event) => {
      if (event.key !== 'Enter' || !message) return;

      try {
        dispatch(
          createMessageAsync({
            conversationId: selectedConversationId,
            body: message,
          }),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setMessage('');
      }
    },
    [message, dispatch, selectedConversationId],
  );
  const handleClickFastMessage = useCallback(
    (value) => {
      setMessage(value);
      dispatch(setTop3FastMessages([]));
      // Focus vào input sau khi chọn fast message

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(
      getFastMessagesAsync({
        pageNumber: 1,
        pageSize: 10,
        searchQuery: '',
        sortBy: 'shorthand',
        sortDirection: 'asc',
      }),
    );
  }, [dispatch]);

  return (
    <>
      {top3FastMessages.length > 0 && (
        <FastMessage onClickFastMessage={handleClickFastMessage} />
      )}
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Nhập tin nhắn"
        disabled={disabled}
        inputRef={inputRef}
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
      <input
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
