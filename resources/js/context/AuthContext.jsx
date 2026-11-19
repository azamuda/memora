import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(() => {
        const u = localStorage.getItem('propspace_user');
        return u ? JSON.parse(u) : null;
    });
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        const { data } = await api.post('/login', { email, password });
        localStorage.setItem('propspace_token', data.token);
        localStorage.setItem('propspace_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const register = async (payload) => {
        const { data } = await api.post('/register', payload);
        localStorage.setItem('propspace_token', data.token);
        localStorage.setItem('propspace_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        try { await api.post('/logout'); } catch (_) {}
        localStorage.removeItem('propspace_token');
        localStorage.removeItem('propspace_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
