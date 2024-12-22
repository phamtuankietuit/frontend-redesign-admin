import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { selectAuth } from 'src/state/auth/auth.slice';

// ----------------------------------------------------------------------

export function CustomerChatMessageItem({
  key,
  message,
  hasImage,
  onOpenLightbox,
}) {
  const { user } = useSelector(selectAuth);

  const { body, createdAt, senderId } = message;

  const renderInfo = (
    <Typography
      key={key}
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(user.id.toString() !== senderId && { mr: 'auto' }),
      }}
    >
      {user.id.toString() !== senderId && `KKBooks, `}

      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = (
    <Stack
      key={key}
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(user.id.toString() === senderId && {
          color: 'grey.800',
          bgcolor: 'primary.lighter',
        }),
        ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {hasImage ? (
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
      ) : (
        body
      )}
    </Stack>
  );

  if (!message.body) {
    return null;
  }

  return (
    <Stack
      key={key}
      direction="row"
      justifyContent={user.id.toString() === senderId ? 'flex-end' : 'unset'}
      sx={{ mb: 5 }}
    >
      {user.id.toString() !== senderId && (
        <Avatar
          key={key}
          alt="KKBooks"
          src={`${CONFIG.assetsDir}/logo/my-logo-single.svg`}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack
        alignItems={user.id.toString() === senderId ? 'flex-end' : 'flex-start'}
      >
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
