'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';

interface TeamMember {
    id: string;
    _id?: string;
    name: string;
    role: string;
    category: string;
    bio: string;
    imageUrl: string;
    socialLinks: { github?: string; linkedin?: string; email?: string };
}

const emptyForm = { name: '', role: '', category: '', bio: '', imageUrl: '', github: '', linkedin: '', email: '' };

export default function TeamAdmin() {
    const { token } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<TeamMember | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team');
            const data = await res.json();
            setMembers(Array.isArray(data) ? data : []);
        } catch { /* */ }
        setLoading(false);
    };

    useEffect(() => { if (token) fetchTeam(); }, [token]);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };

    const openEdit = (m: TeamMember) => {
        setEditing(m);
        setForm({ name: m.name || '', role: m.role || '', category: m.category || '', bio: m.bio || '', imageUrl: m.imageUrl || '', github: m.socialLinks?.github || '', linkedin: m.socialLinks?.linkedin || '', email: m.socialLinks?.email || '' });
        setError(''); setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const payload = { name: form.name, role: form.role, category: form.category, bio: form.bio, imageUrl: form.imageUrl, socialLinks: { github: form.github, linkedin: form.linkedin, email: form.email } };
            const url = editing ? `/api/team/${editing.id || editing._id}` : '/api/team';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers, body: JSON.stringify(payload) });
            if (res.ok) { setShowForm(false); fetchTeam(); }
            else { const d = await res.json(); setError(d.message || 'Failed'); }
        } catch { setError('Network error'); }
        setSaving(false);
    };

    const handleDelete = async (m: TeamMember) => {
        if (!confirm(`Remove "${m.name}"?`)) return;
        await fetch(`/api/team/${m.id || m._id}`, { method: 'DELETE', headers });
        fetchTeam();
    };

    const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '13px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none', background: '#fafafa', boxSizing: 'border-box', marginTop: '4px' };
    const lbl: React.CSSProperties = { fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Team</h1>
                    <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage team members</p>
                </div>
                <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Member</button>
            </div>

            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>{editing ? 'Edit Member' : 'New Member'}</h2>
                        {error && <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#991b1b' }}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                <div><label style={lbl}>Name *</label><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                                <div><label style={lbl}>Role *</label><input style={inp} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required /></div>
                                <div><label style={lbl}>Category</label><input style={inp} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                                <div><label style={lbl}>Image URL</label><input style={inp} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} /></div>
                            </div>
                            <div style={{ marginBottom: '14px' }}><label style={lbl}>Bio</label><textarea style={{ ...inp, minHeight: '80px' }} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
                            <p style={{ ...lbl, color: 'rgba(0,0,0,0.25)', marginBottom: '10px' }}>Social Links</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                                <div><label style={lbl}>GitHub</label><input style={inp} value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} /></div>
                                <div><label style={lbl}>LinkedIn</label><input style={inp} value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} /></div>
                                <div><label style={lbl}>Email</label><input style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        {['Name', 'Role', 'Category', 'Actions'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>Loading...</td></tr>
                            : members.length === 0 ? <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>No team members yet.</td></tr>
                                : members.map(m => (
                                    <tr key={m.id || m._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{m.name}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{m.role}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{m.category || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => openEdit(m)} style={{ padding: '6px 12px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                                                <button onClick={() => handleDelete(m)} style={{ padding: '6px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
