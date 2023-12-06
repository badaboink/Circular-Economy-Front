import { Helmet } from 'react-helmet-async';

import { NotFoundView } from 'src/sections/error';
import { UserView } from 'src/sections/user-posts/view';

import {isLoggedIn} from '../utils/logic';

// ----------------------------------------------------------------------

export default function UserPosts() {
  const userIsLoggedIn = isLoggedIn();
  return (
    <>
      {!userIsLoggedIn ? (
        <NotFoundView />
      ) : (
        <>
          <Helmet>
          <title> My posts</title>
          </Helmet>

          <UserView />
        </>
      )}
    </>
  );
}
