'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import {
    modalOverlayStyle, modalBoxStyle, modalHeaderStyle, modalBodyStyle,
    sectionTitleStyle, fieldStyle, labelStyle, inputStyle,
    errorStyle, modalFooterStyle,
    cancelBtnStyle, submitBtnStyle, closeBtnStyle, modalCSS,
} from '../components/ModalStyles';

interface Role {
    id: string;
    name: string;
}

export default function RolesAdmin() {
    const { token } = useAuth();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Role | null>(null);
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchRoles = async () => {
        try {
            const res = await fetch('/api/roles');
            const data = await res.json();
            setRoles(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { if (token) fetchRoles(); }, [token]);

    const openCreate = () => { setEditing(null); setName(''); setError(''); setShowForm(true); };

    const openEdit = (r: Role) => { setEditing(r); setName(r.name); setError(''); setShowForm(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const url = editing ? `/api/roles/${editing.id}` : '/api/roles';
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers, body: JSON.stringify({ name }) });
            if (res.ok) { setShowForm(false); fetchRoles(); }
            else { const d = await res.json(); setError(d.message || 'Failed to save'); }
        } catch { setError('Network error'); }
        setSaving(false);
    };

    const handleDelete = async (r: Role) => {
        if (!confirm(`Delete role "${r.name}"?`)) return;
        await fetch(`/api/roles/${r.id}`, { method: 'DELETE', headers });
        fetchRoles();
    };

    return (
        <>
            <style>{modalCSS}</style>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', color: '#000', margin: 0 }}>Roles</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage team member roles to keep data consistent</p>
                    </div>
                    <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Role</button>
                </div>

                {showForm && (
                    <div style={modalOverlayStyle} onClick={() => setShowForm(false)}>
                        <div className="modal-box" style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                            <div style={modalHeaderStyle}>
                                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
                                    {editing ? 'Edit Role' : 'New Role'}
                                </h2>
                                <button style={closeBtnStyle} onClick={() => setShowForm(false)}>✕</button>
                            </div>
                            <div style={modalBodyStyle}>
                                {error && <div style={errorStyle}>{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <h3 style={sectionTitleStyle}>Role Details</h3>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Role Name *</label>
                                        <input className="modal-input" style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Project Manager" required />
                                    </div>
                                    <div style={modalFooterStyle}>
                                        <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
                                        <button type="submit" disabled={saving} style={{ ...submitBtnStyle, opacity: saving ? 0.6 : 1 }}>
                                            {saving ? 'Saving...' : (editing ? 'Update Role' : 'Create Role')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Role Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                    {loading ? (
                        <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>Loading...</p>
                    ) : roles.length === 0 ? (
                        <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>No roles yet. Create your first role.</p>
                    ) : roles.map(r => (
                        <div key={r.id} style={{
                            background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', padding: '20px',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#000' }} />
                            <h3 style={{ fontSize: '15px', fontWeight: 900, margin: '4px 0 12px', letterSpacing: '-0.02em' }}>{r.name}</h3>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => openEdit(r)} style={{ padding: '6px 14px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(r)} style={{ padding: '6px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
