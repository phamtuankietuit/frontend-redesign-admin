import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetConversation } from 'src/actions/chat';
import { selectAuth } from 'src/state/auth/auth.slice';
import { DashboardContent } from 'src/layouts/dashboard';
import { selectChat, setAdminContacts } from 'src/state/chat/chat.slice';
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
  const router = useRouter();

  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const { admin } = useSelector(selectChat);

  const { contacts } = admin;

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const [recipients, setRecipients] = useState([]);

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);

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
            customerIds.map(Number).includes(userData.id),
          );

          const newContacts = customers.map((customer) => {
            const index = data.findIndex((item) =>
              item.conversation.participants.includes(customer.id.toString()),
            );

            return {
              id: customer.id,
              role: 'CUSTOMER',
              email: customer.email,
              name: customer.fullName,
              lastActivity: new Date().toISOString(),
              address: '235 Nguyễn Văn Cừ, Quận 5, TP.HCM',
              avatarUrl:
                customer.imageUrl ??
                'https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-1.webp',
              phoneNumber: customer.phoneNumber,
              status: 'online',
              conversation: data[index].conversation,
              lastMessage: data[index].lastMessage,
            };
          });

          dispatch(setAdminContacts(newContacts));
        });
      });

    // dispatch(
    //   sendMessageAsync({
    //     conversationId: '674343258bb207ba7aebcde8',
    //     senderId: '1',
    //     body: 'Hello 2',
    //   }),
    // );
  }, [user, dispatch]);

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
                recipients={recipients}
                onAddRecipients={handleAddRecipients}
                selectedConversationId={selectedConversationId}
                disabled={!recipients.length && !selectedConversationId}
              />
            </>
          ),
          details: selectedConversationId && (
            <></>
            // <ChatRoom collapseNav={roomNav} loading messages={[]} />
          ),
        }}
      />
    </DashboardContent>
  );
}
