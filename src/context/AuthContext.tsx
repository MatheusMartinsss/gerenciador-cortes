'use client';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
    id: string;
    email: string;
    role: string
    [key: string]: any;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
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
        console.log(user)
        if (token) {
            try {
                const decoded = jwtDecode<User & { exp: number }>(token);
                console.log(decoded)
                setUser(decoded.user);
            } catch (err) {
                console.error('Token inválido:', err);
                localStorage.removeItem('token');
                setUser(null);
                if (pathname !== '/auth') router.push('/auth');
            }
        } else {
            setUser(null);
            if (pathname !== '/auth') router.push('/auth');
        }

        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/auth');
    };

    if (loading) return null; // ou um <Loading />

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider');
    return context;
};
