'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';

interface Milestone {
    id: string;
    _id?: string;
    label: string;
    number: string;
    year: string;
    title: string;
    company: string;
    description: string;
    cx: number;
    cy: number;
}

const emptyForm = { label: '', number: '', year: '', title: '', company: '', description: '', cx: '', cy: '' };

export default function MilestonesAdmin() {
    const { token } = useAuth();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Milestone | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchData = async () => {
        try {
            const res = await fetch('/api/milestones');
            const data = await res.json();
            setMilestones(Array.isArray(data) ? data : []);
        } catch { /* */ }
        setLoading(false);
    };

    useEffect(() => { if (token) fetchData(); }, [token]);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };

    const openEdit = (m: Milestone) => {
        setEditing(m);
        setForm({ label: m.label || '', number: m.number || '', year: m.year || '', title: m.title || '', company: m.company || '', description: m.description || '', cx: String(m.cx || ''), cy: String(m.cy || '') });
        setError(''); setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const payload = { ...form, cx: form.cx ? Number(form.cx) : undefined, cy: form.cy ? Number(form.cy) : undefined };
            const url = editing ? `/api/milestones/${editing.id || editing._id}` : '/api/milestones';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers, body: JSON.stringify(payload) });
            if (res.ok) { setShowForm(false); fetchData(); }
            else { const d = await res.json(); setError(d.message || 'Failed'); }
        } catch { setError('Network error'); }
        setSaving(false);
    };

    const handleDelete = async (m: Milestone) => {
        if (!confirm(`Delete "${m.title}"?`)) return;
        await fetch(`/api/milestones/${m.id || m._id}`, { method: 'DELETE', headers });
        fetchData();
    };

    const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '13px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none', background: '#fafafa', boxSizing: 'border-box', marginTop: '4px' };
    const lbl: React.CSSProperties = { fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Milestones</h1>
                    <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage your journey timeline</p>
                </div>
                <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Milestone</button>
            </div>

            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>{editing ? 'Edit Milestone' : 'New Milestone'}</h2>
                        {error && <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#991b1b' }}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                <div><label style={lbl}>Title *</label><input style={inp} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                                <div><label style={lbl}>Label</label><input style={inp} value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="The First Gig" /></div>
                                <div><label style={lbl}>Number</label><input style={inp} value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="0 1." /></div>
                                <div><label style={lbl}>Year</label><input style={inp} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2019" /></div>
                                <div><label style={lbl}>Company</label><input style={inp} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <div><label style={lbl}>CX</label><input type="number" style={inp} value={form.cx} onChange={e => setForm({ ...form, cx: e.target.value })} /></div>
                                    <div><label style={lbl}>CY</label><input type="number" style={inp} value={form.cy} onChange={e => setForm({ ...form, cy: e.target.value })} /></div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}><label style={lbl}>Description *</label><textarea style={{ ...inp, minHeight: '80px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
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
                        {['#', 'Title', 'Year', 'Company', 'Actions'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>Loading...</td></tr>
                            : milestones.length === 0 ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>No milestones yet.</td></tr>
                                : milestones.map(m => (
                                    <tr key={m.id || m._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, color: 'rgba(0,0,0,0.3)' }}>{m.number || '—'}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{m.title}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{m.year || '—'}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{m.company || '—'}</td>
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
