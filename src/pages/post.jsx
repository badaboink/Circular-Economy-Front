import { Helmet } from 'react-helmet-async';

import { NotFoundView } from 'src/sections/error';
import { PostInput } from 'src/sections/post/index';

import {isLoggedIn} from '../utils/logic';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const userIsLoggedIn = isLoggedIn();
  return (
    <>
      {!userIsLoggedIn ? (
        <NotFoundView />
      ) : (
        <>
          <Helmet>
          <title> Post</title>
          </Helmet>

          <PostInput />
        </>
      )}
    </>
  );
}
