import { Helmet } from 'react-helmet-async';

import { NotFoundView } from 'src/sections/error';
import { UserView } from 'src/sections/user/view';

import {isLoggedIn} from '../utils/logic';

// ----------------------------------------------------------------------

export default function UserPage() {
  const userIsLoggedIn = isLoggedIn();
  return (
    <>
      {!userIsLoggedIn ? (
        <NotFoundView />
      ) : (
        <>
          <Helmet>
            <title> User </title>
          </Helmet>

          <UserView />
        </>
      )}
    </>
  );
}
