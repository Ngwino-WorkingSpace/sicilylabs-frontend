'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const validateToken = useCallback(async (storedToken: string) => {

        try {
            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${storedToken}` },
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                setToken(storedToken);
            } else {
                localStorage.removeItem('sl_token');
                setUser(null);
                setToken(null);
            }
        } catch {
            localStorage.removeItem('sl_token');
            setUser(null);
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('sl_token');
        if (storedToken) {
            validateToken(storedToken);
        } else {
            setIsLoading(false);
        }
    }, [validateToken]);

    const login = async (email: string, password: string) => {

        // ── Real backend login ──
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem('sl_token', data.token);
                setToken(data.token);
                setUser({ id: data._id || data.id, name: data.name, email: data.email, role: data.role });
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Invalid credentials' };
            }
        } catch {
            return { success: false, message: 'Invalid credentials' };
        }
    };

    const logout = () => {
        localStorage.removeItem('sl_token');
        setUser(null);
        setToken(null);
        router.push('/admin/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user && !!token,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
