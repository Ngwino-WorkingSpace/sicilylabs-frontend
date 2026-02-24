'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';

interface Contact {
    _id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function InboxAdmin() {
    const { token } = useAuth();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Contact | null>(null);

    useEffect(() => {
        if (!token) return;
        fetch('/api/contacts', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setContacts(Array.isArray(data) ? data : []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [token]);

    const formatDate = (d: string) => {
        try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
        catch { return d; }
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Inbox</h1>
                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Contact form submissions ({contacts.length})</p>
            </div>

            {/* Message Detail Modal */}
            {selected && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 4px' }}>{selected.name}</h3>
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', margin: 0 }}>{selected.email}</p>
                                <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.25)', margin: '4px 0 0' }}>{formatDate(selected.createdAt)}</p>
                            </div>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'rgba(0,0,0,0.3)' }}>✕</button>
                        </div>
                        <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px', fontSize: '13px', lineHeight: 1.7, color: '#333' }}>
                            {selected.message}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                {loading ? (
                    <p style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '13px' }}>Loading...</p>
                ) : contacts.length === 0 ? (
                    <p style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '13px' }}>No messages yet.</p>
                ) : contacts.map(c => (
                    <div
                        key={c._id}
                        onClick={() => setSelected(c)}
                        style={{
                            padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)',
                            cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center',
                            transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, flexShrink: 0 }}>
                            {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700 }}>{c.name}</span>
                                <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)' }}>{formatDate(c.createdAt)}</span>
                            </div>
                            <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', margin: 0 }}>{c.email}</p>
                            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
