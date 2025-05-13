import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { selectChat } from 'src/state/chat/chat.slice';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  getAllUsers,
  getConversationsAsync,
} from 'src/services/chat/chat.service';

import { EmptyContent } from 'src/components/empty-content';

import { Layout } from '../layout';
import { ChatNav } from '../chat-nav';
import { ChatRoom } from '../chat-room';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { ChatHeaderDetail } from '../chat-header-detail';
import { useCollapseNav } from '../hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export function ChatView() {
  const dispatch = useDispatch();

  const {
    customerIds,
    conversationsCombined,
    tableFiltersConversations,
    loading,
  } = useSelector(selectChat);

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  useEffect(() => {
    if (customerIds.length > 0) {
      dispatch(getAllUsers(customerIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerIds]);

  const fetchData = useCallback(async () => {
    dispatch(getConversationsAsync(tableFiltersConversations));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFiltersConversations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
    >
      <Layout
        sx={{
          minHeight: 0,
          flex: '1 1 0',
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
        }}
        slots={{
          header: selectedConversationId && (
            <ChatHeaderDetail collapseNav={roomNav} />
          ),
          nav: (
            <ChatNav
              conversations={conversationsCombined}
              loading={loading}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                <ChatMessageList />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                  title="Xin chào!"
                  description="Bắt đầu trao đổi ngay..."
                />
              )}

              <ChatMessageInput
                selectedConversationId={selectedConversationId}
                disabled={!selectedConversationId}
              />
            </>
          ),
          details: selectedConversationId && <ChatRoom collapseNav={roomNav} />,
        }}
      />
    </DashboardContent>
  );
}
