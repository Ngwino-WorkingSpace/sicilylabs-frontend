'use client';

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
    { label: 'Overview', href: '/admin', icon: '◫' },
    { label: 'Blogs', href: '/admin/blogs', icon: '✎' },
    { label: 'Projects', href: '/admin/projects', icon: '◈' },
    { label: 'Services', href: '/admin/services', icon: '⚙' },
    { label: 'Team', href: '/admin/team', icon: '◉' },
    { label: 'Milestones', href: '/admin/milestones', icon: '◆' },
    { label: 'Inbox', href: '/admin/inbox', icon: '✉' },
];

function AdminShell({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isLoading, isAuthenticated, router, pathname]);

    // Login page — render without shell
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Loading state
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
                fontFamily: 'Arial, Helvetica, sans-serif',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        color: '#000',
                        marginBottom: '8px',
                    }}>SICILYLABS</div>
                    <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated — show nothing (redirect will happen)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px',
                background: '#0a0a0a',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 50,
            }}>
                {/* Brand */}
                <div style={{
                    padding: '28px 24px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h1 style={{
                        fontSize: '18px',
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        textTransform: 'uppercase',
                        margin: 0,
                    }}>SICILYLABS</h1>
                    <p style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                        margin: '4px 0 0',
                    }}>Admin Panel</p>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: isActive ? 800 : 500,
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                                    textDecoration: 'none',
                                    marginBottom: '2px',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info & logout */}
                <div style={{
                    padding: '16px 20px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: '2px',
                    }}>{user?.name || 'Admin'}</div>
                    <div style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.3)',
                        marginBottom: '12px',
                    }}>{user?.email}</div>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '240px',
                background: '#fafafa',
                minHeight: '100vh',
            }}>
                <div style={{ padding: '32px 40px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminShell>{children}</AdminShell>
        </AuthProvider>
    );
}
