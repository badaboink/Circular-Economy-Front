import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/user-posts/view';

// ----------------------------------------------------------------------

export default function UserPosts() {
  return (
    <>
      <Helmet>
        <title> My posts </title>
      </Helmet>

      <UserView />
    </>
  );
}
