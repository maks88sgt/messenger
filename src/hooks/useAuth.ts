import { useContext } from 'react';
import { AuthContext } from '../components/auth-provider/AuthProvider';

export const useAuth = () => useContext(AuthContext);
