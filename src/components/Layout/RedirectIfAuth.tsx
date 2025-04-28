'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const RedirectIfAuth = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/'); // ou página inicial logada
        }
    }, [isAuthenticated]);

    if (isAuthenticated) return null;

    return <>{children}</>;
};