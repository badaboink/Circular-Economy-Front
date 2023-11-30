import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/login';
import { NotFoundView } from 'src/sections/error';

import {isLoggedIn} from '../utils/logic';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const userIsLoggedIn = isLoggedIn();

  return (
    <>
      {userIsLoggedIn ? (
        <NotFoundView />
      ) : (
        <>
          <Helmet>
            <title> Login </title>
          </Helmet>

          <LoginView />
        </>
      )}
    </>
  );
}