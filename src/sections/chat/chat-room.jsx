import { useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

import { selectChat } from 'src/state/chat/chat.slice';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const NAV_DRAWER_WIDTH = 320;

export function ChatRoom({ collapseNav }) {
  const { collapseDesktop, openMobile, onCloseMobile } = collapseNav;

  const { cLoading } = useSelector(selectChat);

  const renderContent = cLoading ? (
    <ChatRoomSkeleton />
  ) : (
    <Scrollbar>
      <div>
        <ChatRoomSingle />
      </div>
    </Scrollbar>
  );

  return (
    <>
      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', lg: 'flex' },
          borderLeft: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: 0 }),
        }}
      >
        {!collapseDesktop && renderContent}
      </Stack>

      <Drawer
        anchor="right"
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_DRAWER_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
