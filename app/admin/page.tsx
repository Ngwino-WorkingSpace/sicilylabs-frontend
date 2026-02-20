'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthProvider';
import Link from 'next/link';

interface Blog {
    id: string;
    title: string;
    category: string;
    date: string;
    readTime: string;
}

interface Contact {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
}

interface Stats {
    blogs: number;
    projects: number;
    services: number;
    team: number;
    milestones: number;
    contacts: number;
}

export default function AdminDashboard() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState<Stats>({ blogs: 0, projects: 0, services: 0, team: 0, milestones: 0, contacts: 0 });
    const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
    const [latestMessage, setLatestMessage] = useState<Contact | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const headers = { 'Authorization': `Bearer ${token}` };

        Promise.all([
            fetch('/api/blogs').then(r => r.json()),
            fetch('/api/projects').then(r => r.json()),
            fetch('/api/services').then(r => r.json()),
            fetch('/api/team').then(r => r.json()),
            fetch('/api/milestones').then(r => r.json()),
            fetch('/api/contacts', { headers }).then(r => r.json()),
        ]).then(([blogs, projects, services, team, milestones, contacts]) => {
            const blogsArr = Array.isArray(blogs) ? blogs : [];
            const contactsArr = Array.isArray(contacts) ? contacts : [];
            const teamArr = Array.isArray(team) ? team : [];

            setStats({
                blogs: blogsArr.length,
                projects: Array.isArray(projects) ? projects.length : 0,
                services: Array.isArray(services) ? services.length : 0,
                team: teamArr.length,
                milestones: Array.isArray(milestones) ? milestones.length : 0,
                contacts: contactsArr.length,
            });

            setRecentBlogs(blogsArr.slice(0, 4));
            setLatestMessage(contactsArr.length > 0 ? contactsArr[contactsArr.length - 1] : null);
            setTeamMembers(teamArr.slice(0, 5));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [token]);

    const formatDate = (d: string) => {
        try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
        catch { return d; }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const statCards = [
        {
            label: 'Blogs', value: stats.blogs, href: '/admin/blogs', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            )
        },
        {
            label: 'Projects', value: stats.projects, href: '/admin/projects', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
            )
        },
        {
            label: 'Services', value: stats.services, href: '/admin/services', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.26.46.6.84 1.01 1.12" /></svg>
            )
        },
        {
            label: 'Team', value: stats.team, href: '/admin/team', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            )
        },
        {
            label: 'Milestones', value: stats.milestones, href: '/admin/milestones', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            )
        },
        {
            label: 'Messages', value: stats.contacts, href: '/admin/inbox', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            )
        },
    ];

    return (
        <>
            <style>{`
                .dash-card {
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.06);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }
                .dash-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 18px 20px;
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.06);
                    border-radius: 14px;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                .stat-card:hover {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
                    transform: translateY(-1px);
                }

                .action-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 18px;
                    background: #000;
                    color: #fff;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .action-pill:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

                .timeline-item {
                    display: flex;
                    gap: 14px;
                    padding: 14px 0;
                    border-bottom: 1px solid rgba(0,0,0,0.04);
                    transition: background 0.1s;
                }
                .timeline-item:last-child { border-bottom: none; }

                @media (max-width: 1024px) {
                    .dash-grid-main { grid-template-columns: 1fr !important; }
                    .dash-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 640px) {
                    .dash-stats-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <div>
                {/* Header */}
                <div style={{ marginBottom: '28px' }}>
                    <p style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(0,0,0,0.3)',
                        margin: '0 0 6px',
                    }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        color: '#000',
                        margin: 0,
                    }}>{getGreeting()}, {user?.name || 'Admin'} 👋</h1>
                </div>

                {/* Main Grid: Left (hero + timeline) / Right (stats + message) */}
                <div className="dash-grid-main" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 380px',
                    gap: '24px',
                    alignItems: 'start',
                }}>
                    {/* ======= LEFT COLUMN ======= */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Hero Banner */}
                        <div className="dash-card" style={{
                            background: 'linear-gradient(135deg, #000 0%, #1a1a1a 50%, #2d2d2d 100%)',
                            border: 'none',
                            padding: '36px 32px',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '180px',
                        }}>
                            {/* Decorative circles */}
                            <div style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '-20px',
                                width: '200px',
                                height: '200px',
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '-60px',
                                right: '80px',
                                width: '160px',
                                height: '160px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.03)',
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '40px',
                                width: '80px',
                                height: '80px',
                                borderRadius: '16px',
                                background: 'rgba(255,255,255,0.04)',
                                transform: 'rotate(15deg)',
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.4)',
                                    margin: '0 0 12px',
                                }}>Dashboard</p>
                                <h2 style={{
                                    fontSize: '26px',
                                    fontWeight: 900,
                                    color: '#fff',
                                    margin: '0 0 8px',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.2,
                                    maxWidth: '360px',
                                }}>Manage Your Content & Team.</h2>
                                <p style={{
                                    fontSize: '13px',
                                    color: 'rgba(255,255,255,0.45)',
                                    margin: '0 0 24px',
                                    maxWidth: '320px',
                                    lineHeight: 1.5,
                                }}>Create, update, and organize everything in one place.</p>
                                <Link
                                    href="/admin/blogs"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        background: '#fff',
                                        color: '#000',
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        fontWeight: 800,
                                        textDecoration: 'none',
                                        letterSpacing: '0.02em',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    Start Writing →
                                </Link>
                            </div>
                        </div>

                        {/* Stat Cards Grid */}
                        <div className="dash-stats-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '14px',
                        }}>
                            {statCards.map((card) => (
                                <Link key={card.label} href={card.href} className="stat-card">
                                    <div style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '12px',
                                        background: '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        color: 'rgba(0,0,0,0.5)',
                                    }}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <p style={{
                                            fontSize: '24px',
                                            fontWeight: 900,
                                            color: '#000',
                                            margin: 0,
                                            letterSpacing: '-0.03em',
                                            lineHeight: 1,
                                        }}>
                                            {loading ? '—' : card.value}
                                        </p>
                                        <p style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: 'rgba(0,0,0,0.4)',
                                            margin: '2px 0 0',
                                        }}>{card.label}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="dash-card" style={{ padding: '24px' }}>
                            <h3 style={{
                                fontSize: '14px',
                                fontWeight: 800,
                                color: '#000',
                                margin: '0 0 16px',
                                letterSpacing: '-0.01em',
                            }}>Quick Actions</h3>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {[
                                    { label: '+ New Blog', href: '/admin/blogs' },
                                    { label: '+ New Project', href: '/admin/projects' },
                                    { label: '+ New Service', href: '/admin/services' },
                                    { label: '+ Team Member', href: '/admin/team' },
                                    { label: '+ Milestone', href: '/admin/milestones' },
                                ].map((action) => (
                                    <Link key={action.label} href={action.href} className="action-pill">
                                        {action.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ======= RIGHT COLUMN ======= */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Recent Blogs / Timeline */}
                        <div className="dash-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: '#000',
                                    margin: 0,
                                    letterSpacing: '-0.01em',
                                }}>Recent Posts</h3>
                                <Link href="/admin/blogs" style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: 'rgba(0,0,0,0.35)',
                                    textDecoration: 'none',
                                }}>View all →</Link>
                            </div>
                            {loading ? (
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.3)', textAlign: 'center', padding: '20px 0' }}>Loading...</p>
                            ) : recentBlogs.length === 0 ? (
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.3)', textAlign: 'center', padding: '20px 0' }}>No blog posts yet.</p>
                            ) : recentBlogs.map((blog, i) => (
                                <div key={blog.id || i} className="timeline-item">
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: i === 0 ? '#000' : '#e0e0e0',
                                        marginTop: '5px',
                                        flexShrink: 0,
                                    }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            color: '#000',
                                            margin: '0 0 4px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>{blog.title}</p>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {blog.category && (
                                                <span style={{
                                                    fontSize: '9px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.08em',
                                                    color: 'rgba(0,0,0,0.3)',
                                                    background: '#f5f5f5',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                }}>{blog.category}</span>
                                            )}
                                            <span style={{
                                                fontSize: '10px',
                                                color: 'rgba(0,0,0,0.3)',
                                                fontWeight: 500,
                                            }}>{blog.date || '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Latest Message */}
                        <div className="dash-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: '#000',
                                    margin: 0,
                                    letterSpacing: '-0.01em',
                                }}>Latest Message</h3>
                                <Link href="/admin/inbox" style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: 'rgba(0,0,0,0.35)',
                                    textDecoration: 'none',
                                }}>Inbox →</Link>
                            </div>
                            {loading ? (
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.3)', textAlign: 'center', padding: '20px 0' }}>Loading...</p>
                            ) : !latestMessage ? (
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.3)', textAlign: 'center', padding: '20px 0' }}>No messages yet.</p>
                            ) : (
                                <div style={{
                                    background: '#fafafa',
                                    borderRadius: '12px',
                                    padding: '18px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            background: '#000',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '13px',
                                            fontWeight: 800,
                                            flexShrink: 0,
                                        }}>{latestMessage.name.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#000', margin: 0 }}>{latestMessage.name}</p>
                                            <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)', margin: 0 }}>{latestMessage.email}</p>
                                        </div>
                                        <span style={{
                                            marginLeft: 'auto',
                                            fontSize: '9px',
                                            fontWeight: 600,
                                            color: 'rgba(0,0,0,0.25)',
                                        }}>{formatDate(latestMessage.createdAt)}</span>
                                    </div>
                                    <p style={{
                                        fontSize: '12px',
                                        color: 'rgba(0,0,0,0.5)',
                                        margin: 0,
                                        lineHeight: 1.6,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical' as const,
                                        overflow: 'hidden',
                                    }}>{latestMessage.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Team Preview */}
                        <div className="dash-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: '#000',
                                    margin: 0,
                                    letterSpacing: '-0.01em',
                                }}>Team</h3>
                                <Link href="/admin/team" style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: 'rgba(0,0,0,0.35)',
                                    textDecoration: 'none',
                                }}>Manage →</Link>
                            </div>
                            {loading ? (
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.3)', textAlign: 'center', padding: '20px 0' }}>Loading...</p>
                            ) : teamMembers.length === 0 ? (
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.3)', textAlign: 'center', padding: '20px 0' }}>No team members yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {teamMembers.map((member, i) => (
                                        <div key={member.id || i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '8px 0',
                                        }}>
                                            <div style={{
                                                width: '34px',
                                                height: '34px',
                                                borderRadius: '10px',
                                                background: '#f0f0f0',
                                                overflow: 'hidden',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '13px',
                                                fontWeight: 800,
                                                color: 'rgba(0,0,0,0.4)',
                                            }}>
                                                {member.imageUrl ? (
                                                    <img src={member.imageUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    member.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '12px', fontWeight: 700, color: '#000', margin: 0 }}>{member.name}</p>
                                                <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)', margin: 0 }}>{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
