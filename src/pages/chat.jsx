import { Helmet } from 'react-helmet-async';

import ChatRoom from 'src/sections/chat/Chat';
import { NotFoundView } from 'src/sections/error';

import {isLoggedIn} from '../utils/logic';
// ----------------------------------------------------------------------

export default function ChatRoomPage() {
  const userIsLoggedIn = isLoggedIn();
  return (
     <>
     {!userIsLoggedIn ? (
       <NotFoundView />
     ) : (
       <>
         <Helmet>
         <title> Messages</title>
         </Helmet>

         <ChatRoom />
       </>
     )}
   </>
  );
}
