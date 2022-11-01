import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './pages/error-page/ErrorPage';
import { SignInPage } from './pages/sign-in-page/SignInPage';
import { AuthProvider } from './components/auth-provider/AuthProvider';
import { SignUpPage } from './pages/sign-up-page/SignUpPage';
import { ChatsPage } from './pages/chats-page/ChatsPage';
import { ProtectedRoute } from './components/protected-route/ProtectedRoute';
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <SignInPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/sign-in',
        element: <SignInPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/sign-up',
        element: <SignUpPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/chats',
        element: (
            <ProtectedRoute>
                <ChatsPage />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
]);

const AppProviders = () => {
    return (
        <ChakraProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ChakraProvider>
    );
};

root.render(
    <React.StrictMode>
        <AppProviders />
    </React.StrictMode>,
);
