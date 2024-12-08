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
import { CustomerChatMessageItem } from './customer-chat-message-item';

// ----------------------------------------------------------------------

export function CustomerChatMessageList() {
  // const { admin } = useSelector(selectChat);

  // const { messages, conversation } = admin;

  const messages = [
    {
      id: 'd18d709b-f081-4435-9a87-2e6d83220f18',
      senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      body: 'She eagerly opened the gift, her eyes sparkling with excitement.',
      contentType: 'text',
      attachments: [
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
          name: 'cover-2.jpg',
          path: 'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-3.webp',
          preview:
            'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-3.webp',
          size: 48000000,
          createdAt: '2024-12-08T10:39:55+00:00',
          modifiedAt: '2024-12-08T10:39:55+00:00',
          type: 'jpg',
        },
      ],
      createdAt: '2024-12-08T05:39:55+00:00',
    },
    {
      id: '2debb5a6-9a32-40a4-86fa-2b7e2346ce41',
      senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      body: 'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
      contentType: 'text',
      attachments: [
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
          name: 'design-suriname-2015.mp3',
          path: 'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
          preview:
            'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
          size: 24000000,
          createdAt: '2024-12-07T09:39:55+00:00',
          modifiedAt: '2024-12-07T09:39:55+00:00',
          type: 'mp3',
        },
      ],
      createdAt: '2024-12-08T06:39:55+00:00',
    },
    {
      id: 'b2d9f567-091c-45da-9e7f-4d976367a4c8',
      senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      body: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
      contentType: 'text',
      attachments: [
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
          name: 'expertise-2015-conakry-sao-tome-and-principe-gender.mp4',
          path: 'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
          preview:
            'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
          size: 16000000,
          createdAt: '2024-12-06T08:39:55+00:00',
          modifiedAt: '2024-12-06T08:39:55+00:00',
          type: 'mp4',
        },
      ],
      createdAt: '2024-12-08T07:39:55+00:00',
    },
    {
      id: '47df4f97-0ac9-4ab4-bc15-89b23b5292e4',
      senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      body: 'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
      contentType: 'text',
      attachments: [
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
          name: 'money-popup-crack.pdf',
          path: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
          preview:
            'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
          size: 12000000,
          createdAt: '2024-12-05T07:39:55+00:00',
          modifiedAt: '2024-12-05T07:39:55+00:00',
          type: 'pdf',
        },
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
          name: 'cover-4.jpg',
          path: 'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-4.webp',
          preview:
            'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-4.webp',
          size: 9600000,
          createdAt: '2024-12-04T06:39:55+00:00',
          modifiedAt: '2024-12-04T06:39:55+00:00',
          type: 'jpg',
        },
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
          name: 'cover-6.jpg',
          path: 'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-6.webp',
          preview:
            'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-6.webp',
          size: 8000000,
          createdAt: '2024-12-03T05:39:55+00:00',
          modifiedAt: '2024-12-03T05:39:55+00:00',
          type: 'jpg',
        },
      ],
      createdAt: '2024-12-08T08:39:55+00:00',
    },
    {
      id: 'd07d05fe-a84e-454f-ba45-41e4952a1896',
      senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      body: 'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
      contentType: 'text',
      attachments: [
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
          name: 'large-news.txt',
          path: 'https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt',
          preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt',
          size: 6857142.857142857,
          createdAt: '2024-12-02T04:39:55+00:00',
          modifiedAt: '2024-12-02T04:39:55+00:00',
          type: 'txt',
        },
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
          name: 'nauru-6015-small-fighter-left-gender.psd',
          path: 'https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd',
          preview:
            'https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd',
          size: 6000000,
          createdAt: '2024-12-01T03:39:55+00:00',
          modifiedAt: '2024-12-01T03:39:55+00:00',
          type: 'psd',
        },
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
          name: 'tv-xs.doc',
          path: 'https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc',
          preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc',
          size: 5333333.333333333,
          createdAt: '2024-11-30T02:39:55+00:00',
          modifiedAt: '2024-11-30T02:39:55+00:00',
          type: 'doc',
        },
        {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
          name: 'gustavia-entertainment-productivity.docx',
          path: 'https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx',
          preview:
            'https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx',
          size: 4800000,
          createdAt: '2024-11-29T01:39:55+00:00',
          modifiedAt: '2024-11-29T01:39:55+00:00',
          type: 'docx',
        },
      ],
      createdAt: '2024-12-08T09:39:55+00:00',
    },
    {
      id: '6b64569c-0c2f-4951-a88d-a3a55359c30a',
      senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      attachments: [],
      contentType: 'image',
      body: 'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-5.webp',
      createdAt: '2024-12-08T10:24:55+00:00',
    },
    {
      id: '31d83669-9189-4f38-be06-c5f2e798393a',
      senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      contentType: 'text',
      attachments: [],
      body: 'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
      createdAt: '2024-12-08T10:38:55+00:00',
    },
    {
      id: '0dffa6ea-6b5c-40a5-8eca-6de6728ad508',
      senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      body: 'The waves crashed against the shore, creating a soothing symphony of sound.',
      contentType: 'text',
      attachments: [],
      createdAt: '2024-12-08T10:39:55+00:00',
    },
  ];

  const { messagesEndRef } = useMessagesScroll(messages);

  // const loading = useBoolean(true);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getConversationByIdAsync(conversationId)).then((action) => {
  //     if (getConversationByIdAsync.fulfilled.match(action)) {
  //       loading.onFalse();
  //     }
  //   });
  // }, [dispatch, conversationId, loading]);

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
          <CustomerChatMessageItem
            key={message.id}
            message={message}
            participants={[
              {
                id: '8864c717-587d-472a-929a-8e5f298024da-0',
                role: 'admin',
                status: 'online',
                name: 'Jaydon Frankie',
                email: 'demo@minimals.cc',
                phoneNumber: '+40 777666555',
                address: '90210 Broadway Blvd',
                avatarUrl:
                  'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-25.webp',
                lastActivity: '2024-12-08T10:38:55+00:00',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                role: 'CTO',
                email: 'ashlynn.ohara62@gmail.com',
                name: 'Lucian Obrien',
                lastActivity: '2024-12-07T09:39:55+00:00',
                address: '1147 Rohan Drive Suite 819 - Burlington, VT / 82021',
                avatarUrl:
                  'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-2.webp',
                phoneNumber: '+1 416-555-0198',
                status: 'online',
              },
            ]}
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
