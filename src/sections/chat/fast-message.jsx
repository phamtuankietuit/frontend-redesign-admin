import { useSelector } from 'react-redux';

import {
  List,
  MenuItem,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { selectFastMessage } from 'src/state/fast-message/fast-message.slice';

// ----------------------------------------------------------------------

export function FastMessage({ onClickFastMessage }) {
  const { top3FastMessages } = useSelector(selectFastMessage);

  return (
    <List
      sx={{
        px: 1,
        flexShrink: 0,
        borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        maxHeight: 210,
        overflowY: 'auto',
      }}
    >
      {top3FastMessages.map((option) => (
        <ListItemButton
          key={option.id}
          component={MenuItem}
          sx={{
            '&:hover': {
              backgroundColor: 'action.selected',
            },
            borderRadius: 1,
            border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          }}
          onClick={() => {
            onClickFastMessage(option.body);
          }}
        >
          <ListItemText
            primary={`/${option.shorthand}`}
            secondary={
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'text.primary',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                }}
              >
                {option.body}
              </Typography>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );
}
