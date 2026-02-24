'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';

interface Service {
    id: string;
    _id?: string;
    slug: string;
    title: string;
    description: string;
    number: string;
    icon: string;
}

const emptyForm = { slug: '', title: '', description: '', number: '', icon: '' };

export default function ServicesAdmin() {
    const { token } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const data = await res.json();
            setServices(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { if (token) fetchServices(); }, [token]);

    const openCreate = () => {
        setForm(emptyForm);
        setError('');
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers,
                body: JSON.stringify(form),
            });
            if (res.ok) { setShowForm(false); fetchServices(); }
            else { const d = await res.json(); setError(d.message || 'Failed to save'); }
        } catch { setError('Network error'); }
        setSaving(false);
    };

    const handleDelete = async (s: Service) => {
        if (!confirm(`Delete "${s.title}"?`)) return;
        await fetch(`/api/services/${s.id || s._id}`, { method: 'DELETE', headers });
        fetchServices();
    };

    const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '13px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none', background: '#fafafa', boxSizing: 'border-box', marginTop: '4px' };
    const labelStyle: React.CSSProperties = { fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', color: '#000', margin: 0 }}>Services</h1>
                    <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage your offered services</p>
                </div>
                <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Service</button>
            </div>

            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>New Service</h2>
                        {error && <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#991b1b' }}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                                <div><label style={labelStyle}>Slug</label><input style={inputStyle} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="brand-identity" /></div>
                                <div><label style={labelStyle}>Number</label><input style={inputStyle} value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="1." /></div>
                                <div><label style={labelStyle}>Icon</label><input style={inputStyle} value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
                            </div>
                            <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Description *</label><textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Grid View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {loading ? (
                    <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>Loading...</p>
                ) : services.length === 0 ? (
                    <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>No services yet.</p>
                ) : services.map(s => (
                    <div key={s.id || s._id} style={{
                        background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#000' }} />
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(0,0,0,0.2)' }}>{s.number || '—'}</span>
                        <h3 style={{ fontSize: '15px', fontWeight: 900, margin: '4px 0 6px', letterSpacing: '-0.02em' }}>{s.title}</h3>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.5, marginBottom: '16px' }}>{s.description}</p>
                        <button onClick={() => handleDelete(s)} style={{ padding: '6px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
