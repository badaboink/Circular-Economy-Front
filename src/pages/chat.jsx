import { Helmet } from 'react-helmet-async';

// import { BlogView } from 'src/sections/chat/view';

import ChatRoom from 'src/sections/chat/ChatRoom';
// ----------------------------------------------------------------------

export default function ChatRoomPage() {
  return (
    <>
      <Helmet>
        <title> Chats </title>
      </Helmet>

      <ChatRoom />
    </>
  );
}
