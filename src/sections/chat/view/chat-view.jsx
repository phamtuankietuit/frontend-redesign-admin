import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { selectAuth } from 'src/state/auth/auth.slice';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  getAllUsers,
  getConversationsAsync,
} from 'src/services/chat/chat.service';
import {
  selectChat,
  setAdminContact,
  setAdminContacts,
} from 'src/state/chat/chat.slice';

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

  const { user } = useSelector(selectAuth);

  const { admin } = useSelector(selectChat);

  const { contacts, contact } = admin;

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  useEffect(() => {
    dispatch(getConversationsAsync(user.id))
      .then((response) => {
        const customerIds = response.payload?.map((item) =>
          item.conversation.participants.filter(
            (id) => id !== user.id.toString(),
          ),
        );

        return { customerIds, data: response.payload };
      })
      .then(({ customerIds, data }) => {
        dispatch(getAllUsers()).then((response) => {
          const customers = response.payload.items.filter((userData) =>
            customerIds?.map(Number).includes(userData.id),
          );

          const newContacts = customers?.map((customer) => {
            const index = data.findIndex((item) =>
              item.conversation.participants.includes(customer.id.toString()),
            );

            return {
              id: customer.id,
              role: 'CUSTOMER',
              email: customer.email,
              name: customer.fullName,
              lastActivity: new Date().toISOString(),
              avatarUrl:
                customer.imageUrl ??
                'https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-1.webp',
              phoneNumber: customer.phoneNumber,
              status: '',
              conversation: data[index].conversation,
              lastMessage: data[index].lastMessage,
            };
          });

          newContacts.sort((a, b) => {
            const dateA = a.lastMessage
              ? new Date(a.lastMessage.createdAt)
              : new Date(0);
            const dateB = b.lastMessage
              ? new Date(b.lastMessage.createdAt)
              : new Date(0);
            return dateB - dateA;
          });

          const newContact = newContacts.find(
            (item) => item.conversation._id === selectedConversationId,
          );

          if (newContact) {
            dispatch(setAdminContact(newContact));
          }

          dispatch(setAdminContacts(newContacts ?? []));
        });
      });
  }, [user, dispatch, selectedConversationId]);

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
            <ChatHeaderDetail collapseNav={roomNav} loading={!contact} />
          ),
          nav: (
            <ChatNav
              contacts={contacts}
              loading={!contacts}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                <ChatMessageList conversationId={selectedConversationId} />
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
          details: selectedConversationId && (
            <ChatRoom collapseNav={roomNav} messages={[]} />
          ),
        }}
      />
    </DashboardContent>
  );
}
