'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthProvider';

interface Stats {
    blogs: number;
    projects: number;
    services: number;
    team: number;
    milestones: number;
    contacts: number;
}

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState<Stats>({ blogs: 0, projects: 0, services: 0, team: 0, milestones: 0, contacts: 0 });
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
            setStats({
                blogs: Array.isArray(blogs) ? blogs.length : 0,
                projects: Array.isArray(projects) ? projects.length : 0,
                services: Array.isArray(services) ? services.length : 0,
                team: Array.isArray(team) ? team.length : 0,
                milestones: Array.isArray(milestones) ? milestones.length : 0,
                contacts: Array.isArray(contacts) ? contacts.length : 0,
            });
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [token]);

    const statCards = [
        { label: 'Blog Posts', value: stats.blogs, href: '/admin/blogs', color: '#000' },
        { label: 'Projects', value: stats.projects, href: '/admin/projects', color: '#1a1a1a' },
        { label: 'Services', value: stats.services, href: '/admin/services', color: '#2a2a2a' },
        { label: 'Team Members', value: stats.team, href: '/admin/team', color: '#333' },
        { label: 'Milestones', value: stats.milestones, href: '/admin/milestones', color: '#3a3a3a' },
        { label: 'Messages', value: stats.contacts, href: '/admin/inbox', color: '#444' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    color: '#000',
                    margin: 0,
                }}>Dashboard</h1>
                <p style={{
                    fontSize: '13px',
                    color: 'rgba(0,0,0,0.4)',
                    marginTop: '4px',
                }}>Welcome back. Here&apos;s an overview of your content.</p>
            </div>

            {/* Stat Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '40px',
            }}>
                {statCards.map((card) => (
                    <a
                        key={card.label}
                        href={card.href}
                        style={{
                            display: 'block',
                            padding: '24px',
                            background: '#fff',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: card.color,
                        }} />
                        <p style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'rgba(0,0,0,0.35)',
                            margin: '0 0 8px',
                        }}>{card.label}</p>
                        <p style={{
                            fontSize: '36px',
                            fontWeight: 900,
                            color: '#000',
                            margin: 0,
                            letterSpacing: '-0.03em',
                        }}>
                            {loading ? '—' : card.value}
                        </p>
                    </a>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(0,0,0,0.3)',
                    marginBottom: '16px',
                }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                        { label: '+ New Blog Post', href: '/admin/blogs' },
                        { label: '+ New Project', href: '/admin/projects' },
                        { label: '+ New Service', href: '/admin/services' },
                        { label: '+ New Team Member', href: '/admin/team' },
                        { label: '+ New Milestone', href: '/admin/milestones' },
                    ].map((action) => (
                        <a
                            key={action.label}
                            href={action.href}
                            style={{
                                padding: '10px 20px',
                                background: '#000',
                                color: '#fff',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                transition: 'all 0.15s',
                            }}
                        >
                            {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
