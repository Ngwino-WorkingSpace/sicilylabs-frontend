'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import {
    modalOverlayStyle, modalBoxStyle,
    modalFooterStyle, cancelBtnStyle, submitBtnStyle, closeBtnStyle, modalCSS,
} from '../components/ModalStyles';
import { toast } from 'react-toastify';

interface Contact {
    id: string;
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

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchContacts = () => {
        if (!token) return;
        fetch('/api/contacts', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setContacts(Array.isArray(data) ? data : []))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchContacts(); }, [token]);

    const markAsRead = async (c: Contact) => {
        if (c.isRead) return;
        try {
            await fetch(`/api/contacts/${c.id}`, { method: 'PATCH', headers });
            // Update local state
            setContacts(prev => prev.map(x => x.id === c.id ? { ...x, isRead: true } : x));
            if (selected?.id === c.id) setSelected({ ...selected, isRead: true });
        } catch {
            toast.error('Failed to mark as read');
        }
    };

    const handleDelete = async (c: Contact) => {
        if (!confirm(`Delete message from "${c.name}"?`)) return;
        try {
            const res = await fetch(`/api/contacts/${c.id}`, { method: 'DELETE', headers });
            if (res.ok) {
                setContacts(prev => prev.filter(x => x.id !== c.id));
                if (selected?.id === c.id) setSelected(null);
                toast.success('Message deleted');
            } else {
                toast.error('Failed to delete message');
            }
        } catch {
            toast.error('Network error');
        }
    };

    const openMessage = (c: Contact) => {
        setSelected(c);
        markAsRead(c);
    };

    const formatDate = (d: string) => {
        try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
        catch { return d; }
    };

    const unreadCount = contacts.filter(c => !c.isRead).length;

    return (
        <>
            <style>{modalCSS}</style>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Inbox</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>
                            Contact form submissions ({contacts.length})
                            {unreadCount > 0 && <span style={{ marginLeft: '8px', padding: '2px 8px', background: '#000', color: '#fff', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>{unreadCount} new</span>}
                        </p>
                    </div>
                </div>

                {/* Message Detail Modal */}
                {selected && (
                    <div style={modalOverlayStyle} onClick={() => setSelected(null)}>
                        <div className="modal-box" style={{ ...modalBoxStyle, maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
                            <div style={{
                                padding: '28px 32px 20px',
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '10px', background: '#000', color: '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, flexShrink: 0,
                                        }}>{selected.name.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>{selected.name}</h2>
                                            <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', margin: 0 }}>{selected.email}</p>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.25)', margin: '0 0 0 46px' }}>{formatDate(selected.createdAt)}</p>
                                </div>
                                <button style={closeBtnStyle} onClick={() => setSelected(null)}>✕</button>
                            </div>

                            <div style={{ padding: '24px 32px 32px' }}>
                                <div style={{
                                    padding: '20px', background: '#fafafa', borderRadius: '12px',
                                    fontSize: '13px', lineHeight: 1.7, color: '#333', whiteSpace: 'pre-wrap',
                                }}>{selected.message}</div>

                                <div style={modalFooterStyle}>
                                    <button onClick={() => handleDelete(selected)} style={{ ...cancelBtnStyle, color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca' }}>Delete</button>
                                    <button onClick={() => setSelected(null)} style={submitBtnStyle}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages List */}
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
                    {loading ? (
                        <p style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '13px' }}>Loading...</p>
                    ) : contacts.length === 0 ? (
                        <p style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '13px' }}>No messages yet.</p>
                    ) : contacts.map(c => (
                        <div
                            key={c.id}
                            onClick={() => openMessage(c)}
                            style={{
                                padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)',
                                cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center',
                                transition: 'background 0.1s',
                                background: c.isRead ? 'transparent' : 'rgba(0,0,0,0.015)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                            onMouseLeave={e => (e.currentTarget.style.background = c.isRead ? 'transparent' : 'rgba(0,0,0,0.015)')}
                        >
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%', background: '#000', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, flexShrink: 0,
                            }}>{c.name.charAt(0).toUpperCase()}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <span style={{ fontSize: '13px', color: '#000', fontWeight: c.isRead ? 600 : 800 }}>{c.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {!c.isRead && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#000' }} />}
                                        <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)' }}>{formatDate(c.createdAt)}</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', margin: 0 }}>{c.email}</p>
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(c); }}
                                style={{ padding: '4px 10px', background: 'transparent', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', color: 'rgba(0,0,0,0.3)', flexShrink: 0 }}
                            >✕</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
