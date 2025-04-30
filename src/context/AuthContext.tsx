'use client';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
    id: string;
    email: string;
    tenant_id: number | null;
    role: string
    [key: string]: any;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // impede renderização precoce
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                login(token)
            } catch (err) {
                logout()
            }
        } else {
            logout()
        }

        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/auth');
    };
    const login = (token: string) => {
        try {
            const decoded = jwtDecode<User & { exp: number }>(token);
            setUser(decoded.user);
        } catch (ex) {
            console.error('Token inválido:', ex);
            localStorage.removeItem('token');
            setUser(null);
            if (pathname !== '/auth') router.push('/auth');
        }
    }

    if (loading) return null; // ou um <Loading />

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider');
    return context;
};
