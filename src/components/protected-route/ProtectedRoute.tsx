import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to={'/sign-in'} />;
    }

    return <>{children}</>;
};
