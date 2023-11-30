import { Helmet } from 'react-helmet-async';

import { NotFoundView } from 'src/sections/error';
import { RegisterView } from 'src/sections/register';

import {isLoggedIn} from '../utils/logic';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const userIsLoggedIn = isLoggedIn();
  return (
    <>
      {userIsLoggedIn ? (
        <NotFoundView />
      ) : (
        <>
          <Helmet>
          <title> Register</title>
          </Helmet>

          <RegisterView />
        </>
      )}
    </>
  );
}
