import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/chat'));
export const UserPage = lazy(() => import('src/pages/user'));
export const UserPostPage = lazy(() => import('src/pages/user-posts'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const PostPage = lazy(() => import('src/pages/post'));
export const ChatRoomPage = lazy(() => import('src/pages/chat'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
        { path: 'resource/:index', element: <IndexPage /> },
        { path: 'personal', element: <UserPostPage /> },
        { path: 'chat', element: <ChatRoomPage /> },
        { path: 'chat/:receiver', element: <ChatRoomPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'post',
      element: <PostPage />,
    },
    {
      path: 'post/:index',
      element: <PostPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
