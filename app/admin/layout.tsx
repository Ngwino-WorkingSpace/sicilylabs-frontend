'use client';

import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const NAV_ITEMS = [
    {
        label: 'Overview', href: '/admin', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
        )
    },
    {
        label: 'Blogs', href: '/admin/blogs', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
        )
    },
    {
        label: 'Projects', href: '/admin/projects', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
        )
    },
    {
        label: 'Services', href: '/admin/services', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        )
    },
    {
        label: 'Team', href: '/admin/team', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        )
    },
    {
        label: 'Roles', href: '/admin/roles', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M12 8v4l3 3" /></svg>
        )
    },
    {
        label: 'Milestones', href: '/admin/milestones', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
        )
    },
    {
        label: 'Inbox', href: '/admin/inbox', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
        )
    },
];

function AdminShell({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                background: '#f8f8fa',
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        margin: '0 auto 16px',
                    }}>
                        <img src="/logo.png" alt="SicilyLabs" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(0,0,0,0.3)',
                    }}>Loading...</div>
                </div>
            </div>
        );
    }

    // Not authenticated — show nothing (redirect will happen)
    if (!isAuthenticated) {
        return null;
    }

    const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'A';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                .admin-shell { display: flex; min-height: 100vh; font-family: 'Inter', -apple-system, sans-serif; background: #f5f5f7; }

                .admin-sidebar {
                    width: 260px;
                    background: #fff;
                    border-right: 1px solid rgba(0,0,0,0.06);
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                    position: fixed;
                    top: 0; left: 0; bottom: 0;
                    z-index: 50;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .admin-sidebar-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.3);
                    z-index: 45;
                }

                .admin-main {
                    flex: 1;
                    margin-left: 260px;
                    min-height: 100vh;
                }

                .admin-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 14px;
                    border-radius: 12px;
                    font-size: 13px;
                    text-decoration: none;
                    margin-bottom: 2px;
                    transition: all 0.15s ease;
                    cursor: pointer;
                    border: none;
                    width: 100%;
                    text-align: left;
                    background: transparent;
                }
                .admin-nav-item:hover { background: rgba(0,0,0,0.04); }
                .admin-nav-item.active {
                    background: #000;
                    color: #fff !important;
                    font-weight: 700;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .admin-nav-item.active svg { stroke: #fff; }

                .admin-mobile-toggle {
                    display: none;
                    position: fixed;
                    top: 16px; left: 16px;
                    z-index: 55;
                    width: 40px; height: 40px;
                    border-radius: 12px;
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.08);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 1024px) {
                    .admin-sidebar { transform: translateX(-100%); }
                    .admin-sidebar.open { transform: translateX(0); }
                    .admin-sidebar-overlay.open { display: block; }
                    .admin-main { margin-left: 0; }
                    .admin-mobile-toggle { display: flex; }
                }
            `}</style>

            <div className="admin-shell">
                {/* Mobile toggle */}
                <button
                    className="admin-mobile-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                {/* Overlay */}
                <div
                    className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                />

                {/* Sidebar */}
                <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    {/* Brand */}
                    <div style={{
                        padding: '24px 20px 20px',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}>
                        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}>
                                <Image src="/logo.png" alt="SicilyLabs" width={36} height={36} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h1 style={{
                                    fontSize: '15px',
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                    color: '#000',
                                    margin: 0,
                                    lineHeight: 1.2,
                                }}>SicilyLabs</h1>
                                <p style={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(0,0,0,0.3)',
                                    margin: 0,
                                }}>Admin Panel</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav style={{ flex: 1, padding: '16px 14px', overflowY: 'auto' }}>
                        <p style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'rgba(0,0,0,0.25)',
                            margin: '0 0 8px 14px',
                        }}>Menu</p>
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                                    style={{
                                        color: isActive ? '#fff' : 'rgba(0,0,0,0.55)',
                                        fontWeight: isActive ? 700 : 500,
                                    }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', width: '20px', justifyContent: 'center' }}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                    {item.label === 'Inbox' && (
                                        <span style={{
                                            marginLeft: 'auto',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: isActive ? 'rgba(255,255,255,0.2)' : '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '9px',
                                            fontWeight: 800,
                                            color: isActive ? '#fff' : 'rgba(0,0,0,0.4)',
                                        }}>•</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Pro Banner (decorative) */}
                    <div style={{ padding: '0 14px 12px' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%)',
                            borderRadius: '14px',
                            padding: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.04)',
                            }} />
                            <p style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#000',
                                margin: '0 0 2px',
                            }}>Need help?</p>
                            <p style={{
                                fontSize: '10px',
                                color: 'rgba(0,0,0,0.4)',
                                margin: '0 0 10px',
                                lineHeight: 1.4,
                            }}>View the docs or reach out.</p>
                            <Link
                                href="/contact"
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: '#000',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                            >
                                Contact Us →
                            </Link>
                        </div>
                    </div>

                    {/* User info & logout */}
                    <div style={{
                        padding: '16px 20px',
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: '#000',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 800,
                            flexShrink: 0,
                        }}>{userInitial}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#000',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>{user?.name || 'Admin'}</div>
                            <div style={{
                                fontSize: '10px',
                                color: 'rgba(0,0,0,0.35)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>{user?.email}</div>
                        </div>
                        <button
                            onClick={logout}
                            title="Sign Out"
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(0,0,0,0.04)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s',
                                flexShrink: 0,
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    <div style={{ padding: '28px 36px', maxWidth: '1400px' }}>
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminShell>{children}</AdminShell>
        </AuthProvider>
    );
}
