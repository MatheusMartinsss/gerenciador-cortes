'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return <>{children}</>;
};

export const RequireAuthAdmin = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.replace('/');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated || user?.role !== 'admin') return null;

    return <>{children}</>;
};