import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { selectChat } from 'src/state/chat/chat.slice';

import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

export function ChatMessageItem({ message, onOpenLightbox }) {
  const { body, createdAt, markdown, contentType } = message;

  const { cCombined } = useSelector(selectChat);

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(message?.customerId && { mr: 'auto' }),
      }}
    >
      {message?.customerId &&
        `${cCombined?.customer?.firstName} ${cCombined?.customer?.lastName}, `}

      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(message?.customerId && {
          color: 'grey.800',
          bgcolor: 'primary.lighter',
        }),
        ...(message?.contentType === 'image' && {
          p: 0,
          bgcolor: 'transparent',
        }),
      }}
    >
      {(() => {
        if (contentType === 'image') {
          return (
            <Box
              component="img"
              alt="attachment"
              src={body}
              onClick={() => onOpenLightbox(body)}
              sx={{
                width: 400,
                height: 'auto',
                borderRadius: 1.5,
                cursor: 'pointer',
                objectFit: 'cover',
                aspectRatio: '16/11',
                '&:hover': { opacity: 0.9 },
              }}
            />
          );
        }

        if (markdown) {
          return <Markdown>{body}</Markdown>;
        }

        return body;
      })()}
    </Stack>
  );

  if (!message.body) {
    return null;
  }

  return (
    <Stack
      direction="row"
      justifyContent={message?.customerId ? 'unset' : 'flex-end'}
      sx={{ mb: 5 }}
    >
      {message?.customerId && (
        <Avatar
          alt={cCombined?.customer?.fullName}
          src={cCombined?.customer?.imageUrl}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack alignItems={!message?.customerId ? 'flex-end' : 'flex-start'}>
        {renderInfo}

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
