'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import {
    modalOverlayStyle, modalBoxStyle, modalHeaderStyle, modalBodyStyle,
    sectionTitleStyle, fieldGroupStyle, fieldStyle, labelStyle, inputStyle,
    textareaStyle, modalFooterStyle,
    cancelBtnStyle, submitBtnStyle, closeBtnStyle, modalCSS,
} from '../components/ModalStyles';
import { toast } from 'react-toastify';

interface Milestone {
    id: string;
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

    const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };

    const openEdit = (m: Milestone) => {
        setEditing(m);
        setForm({ label: m.label || '', number: m.number || '', year: m.year || '', title: m.title || '', company: m.company || '', description: m.description || '', cx: String(m.cx || ''), cy: String(m.cy || '') });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { ...form, cx: form.cx ? Number(form.cx) : undefined, cy: form.cy ? Number(form.cy) : undefined };
            const url = editing ? `/api/milestones/${editing.id}` : '/api/milestones';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers, body: JSON.stringify(payload) });
            if (res.ok) {
                setShowForm(false);
                fetchData();
                toast.success(editing ? 'Milestone updated' : 'Milestone created');
            }
            else {
                const d = await res.json();
                toast.error(d.message || 'Failed');
            }
        } catch {
            toast.error('Network error');
        }
        setSaving(false);
    };

    const handleDelete = async (m: Milestone) => {
        if (!confirm(`Delete "${m.title}"?`)) return;
        try {
            const res = await fetch(`/api/milestones/${m.id}`, { method: 'DELETE', headers });
            if (res.ok) {
                toast.success('Milestone deleted');
                fetchData();
            } else {
                toast.error('Failed to delete milestone');
            }
        } catch {
            toast.error('Network error');
        }
    };

    return (
        <>
            <style>{modalCSS}</style>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Milestones</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage your journey timeline</p>
                    </div>
                    <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Milestone</button>
                </div>

                {showForm && (
                    <div style={modalOverlayStyle} onClick={() => setShowForm(false)}>
                        <div className="modal-box" style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                            <div style={modalHeaderStyle}>
                                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
                                    {editing ? 'Edit Milestone' : 'New Milestone'}
                                </h2>
                                <button style={closeBtnStyle} onClick={() => setShowForm(false)}>✕</button>
                            </div>

                            <div style={modalBodyStyle}>

                                <form onSubmit={handleSubmit}>
                                    {/* Section: Milestone Info */}
                                    <h3 style={sectionTitleStyle}>Milestone Details</h3>
                                    <div style={fieldGroupStyle}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Title *</label>
                                            <input className="modal-input" style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Product Launch" required />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Label</label>
                                            <input className="modal-input" style={inputStyle} value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="The First Gig" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Number</label>
                                            <input className="modal-input" style={inputStyle} value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="0 1." />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Year</label>
                                            <input className="modal-input" style={inputStyle} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2024" />
                                        </div>
                                        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                                            <label style={labelStyle}>Company</label>
                                            <input className="modal-input" style={inputStyle} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="SicilyLabs" />
                                        </div>
                                    </div>

                                    {/* Section: Position */}
                                    <h3 style={sectionTitleStyle}>Timeline Position</h3>
                                    <div style={{ ...fieldGroupStyle, marginBottom: '20px' }}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>CX (X Position)</label>
                                            <input className="modal-input" type="number" style={inputStyle} value={form.cx} onChange={e => setForm({ ...form, cx: e.target.value })} placeholder="0" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>CY (Y Position)</label>
                                            <input className="modal-input" type="number" style={inputStyle} value={form.cy} onChange={e => setForm({ ...form, cy: e.target.value })} placeholder="0" />
                                        </div>
                                    </div>

                                    {/* Section: Description */}
                                    <h3 style={sectionTitleStyle}>Description</h3>
                                    <div style={{ ...fieldStyle, marginBottom: '8px' }}>
                                        <label style={labelStyle}>Milestone Description *</label>
                                        <textarea className="modal-input" style={textareaStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this milestone..." required />
                                    </div>

                                    {/* Footer */}
                                    <div style={modalFooterStyle}>
                                        <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
                                        <button type="submit" disabled={saving} style={{ ...submitBtnStyle, opacity: saving ? 0.6 : 1 }}>
                                            {saving ? 'Saving...' : (editing ? 'Update Milestone' : 'Create Milestone')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            {['#', 'Title', 'Year', 'Company', 'Actions'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>Loading...</td></tr>
                                : milestones.length === 0 ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>No milestones yet.</td></tr>
                                    : milestones.map(m => (
                                        <tr key={m.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, color: 'rgba(0,0,0,0.3)' }}>{m.number || '—'}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#000' }}>{m.title}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{m.year || '—'}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{m.company || '—'}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button onClick={() => openEdit(m)} style={{ padding: '6px 14px', background: '#f5f5f5', color: '#000', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                                                    <button onClick={() => handleDelete(m)} style={{ padding: '6px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
