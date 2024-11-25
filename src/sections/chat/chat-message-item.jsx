import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { selectChat } from 'src/state/chat/chat.slice';
import { selectAuth } from 'src/state/auth/auth.slice';

// ----------------------------------------------------------------------

export function ChatMessageItem({ message, onOpenLightbox }) {
  const { admin } = useSelector(selectChat);
  const { user } = useSelector(selectAuth);

  const { contact } = admin;
  console.log('🚀 ~ ChatMessageItem ~ contact:', contact);

  // const { firstName, avatarUrl } = senderDetails;

  const { body, createdAt } = message;

  // const renderInfo = (
  //   <Typography
  //     noWrap
  //     variant="caption"
  //     sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
  //   >
  //     {!me && `${firstName}, `}

  //     {fToNow(createdAt)}
  //   </Typography>
  // );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        // ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
        // ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {body}
    </Stack>
  );

  if (!message.body) {
    return null;
  }

  return (
    <Stack direction="row" justifyContent="unset" sx={{ mb: 5 }}>
      {user.id.toString !== message.senderId && (
        <Avatar
          alt={contact.name}
          src={contact.avatarUrl}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack alignItems="flex-start">
        {/* {renderInfo} */}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody}
        </Stack>
      </Stack>
    </Stack>
  );
}
