'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import {
    modalOverlayStyle, modalBoxStyle, modalHeaderStyle, modalBodyStyle,
    sectionTitleStyle, fieldGroupStyle, fieldStyle, labelStyle, inputStyle,
    textareaStyle, fileInputWrapperStyle, modalFooterStyle,
    cancelBtnStyle, submitBtnStyle, closeBtnStyle, modalCSS,
} from '../components/ModalStyles';
import { toast } from 'react-toastify';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    roleId: string;
    category: string;
    bio: string;
    imageUrl: string;
    socialLinks: { github?: string; linkedin?: string; email?: string };
}

interface Role {
    id: string;
    name: string;
}

const emptyForm = { name: '', roleId: '', category: '', bio: '', github: '', linkedin: '', email: '' };

export default function TeamAdmin() {
    const { token } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<TeamMember | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setMembers(Array.isArray(data) ? data : []);
        } catch { /* */ }
        setLoading(false);
    };

    const fetchRoles = async () => {
        try {
            const res = await fetch('/api/roles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setRoles(Array.isArray(data) ? data : []);
        } catch { /* */ }
    };

    useEffect(() => {
        if (token) {
            fetchTeam();
            fetchRoles();
        }
    }, [token]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setImageFile(null);
        setShowForm(true);
    };

    const openEdit = (m: TeamMember) => {
        setEditing(m);
        setForm({
            name: m.name || '',
            roleId: m.roleId || '',
            category: m.category || '',
            bio: m.bio || '',
            github: m.socialLinks?.github || '',
            linkedin: m.socialLinks?.linkedin || '',
            email: m.socialLinks?.email || '',
        });
        setImageFile(null);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Find role name from selected roleId
            const selectedRole = roles.find(r => r.id === form.roleId);

            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('role_id', form.roleId);
            formData.append('role', selectedRole?.name || '');
            formData.append('category', form.category || selectedRole?.name || '');
            formData.append('bio', form.bio);
            formData.append('socialLinks', JSON.stringify({ github: form.github, linkedin: form.linkedin, email: form.email }));
            if (imageFile) formData.append('image', imageFile);

            const url = editing ? `/api/team/${editing.id}` : '/api/team';
            const res = await fetch(url, {
                method: editing ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            if (res.ok) {
                setShowForm(false);
                fetchTeam();
                toast.success(editing ? 'Member updated' : 'Member added');
            }
            else {
                const d = await res.json();
                toast.error(d.message || 'Failed to save');
            }
        } catch {
            toast.error('Network error');
        }
        setSaving(false);
    };

    const handleDelete = async (m: TeamMember) => {
        if (!confirm(`Remove "${m.name}"?`)) return;
        try {
            const res = await fetch(`/api/team/${m.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                toast.success('Member removed');
                fetchTeam();
            } else {
                toast.error('Failed to remove member');
            }
        } catch {
            toast.error('Network error');
        }
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        appearance: 'none' as const,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '32px',
    };

    return (
        <>
            <style>{modalCSS}</style>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Team</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage team members</p>
                    </div>
                    <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Member</button>
                </div>

                {showForm && (
                    <div style={modalOverlayStyle} onClick={() => setShowForm(false)}>
                        <div className="modal-box" style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                            <div style={modalHeaderStyle}>
                                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
                                    {editing ? 'Edit Member' : 'New Team Member'}
                                </h2>
                                <button style={closeBtnStyle} onClick={() => setShowForm(false)}>✕</button>
                            </div>

                            <div style={modalBodyStyle}>

                                <form onSubmit={handleSubmit}>
                                    {/* Section: Personal Info */}
                                    <h3 style={sectionTitleStyle}>Personal Info</h3>
                                    <div style={fieldGroupStyle}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Full Name *</label>
                                            <input className="modal-input" style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Role *</label>
                                            <select className="modal-input" style={selectStyle} value={form.roleId} onChange={e => setForm({ ...form, roleId: e.target.value })} required>
                                                <option value="">Select a role...</option>
                                                {roles.map(r => (
                                                    <option key={r.id} value={r.id}>{r.name}</option>
                                                ))}
                                            </select>
                                            {roles.length === 0 && (
                                                <p style={{ fontSize: '10px', color: '#b45309', marginTop: '4px' }}>No roles found. Create roles first in the Roles section.</p>
                                            )}
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Category</label>
                                            <select className="modal-input" style={selectStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                                <option value="">Same as role</option>
                                                {roles.map(r => (
                                                    <option key={r.id} value={r.name}>{r.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Section: Photo */}
                                    <h3 style={sectionTitleStyle}>Profile Photo</h3>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label htmlFor="team-image">
                                            <div className="file-drop" style={fileInputWrapperStyle}>
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}>
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                                                    {imageFile ? imageFile.name : (editing?.imageUrl ? 'Current photo set — upload to replace' : 'PNG, JPG or JPEG')}
                                                </p>
                                                <p style={{ fontSize: '11px', color: '#bbb', margin: '4px 0 0' }}>
                                                    Click to browse or drag and drop
                                                </p>
                                            </div>
                                        </label>
                                        <input id="team-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                    </div>

                                    {/* Section: Bio */}
                                    <h3 style={sectionTitleStyle}>Biography</h3>
                                    <div style={{ ...fieldStyle, marginBottom: '20px' }}>
                                        <label style={labelStyle}>Bio</label>
                                        <textarea className="modal-input" style={{ ...textareaStyle, minHeight: '80px' }} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short biography about the team member..." />
                                    </div>

                                    {/* Section: Social Links */}
                                    <h3 style={sectionTitleStyle}>Social Links</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '8px' }}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>GitHub</label>
                                            <input className="modal-input" style={inputStyle} value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} placeholder="github.com/..." />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>LinkedIn</label>
                                            <input className="modal-input" style={inputStyle} value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="linkedin.com/in/..." />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Email</label>
                                            <input className="modal-input" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div style={modalFooterStyle}>
                                        <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
                                        <button type="submit" disabled={saving} style={{ ...submitBtnStyle, opacity: saving ? 0.6 : 1 }}>
                                            {saving ? 'Saving...' : (editing ? 'Update Member' : 'Add Member')}
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
                            {['', 'Name', 'Role', 'Category', 'Actions'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>Loading...</td></tr>
                                : members.length === 0 ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>No team members yet.</td></tr>
                                    : members.map(m => (
                                        <tr key={m.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                            <td style={{ padding: '8px 16px', width: '44px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'rgba(0,0,0,0.3)' }}>
                                                    {m.imageUrl ? <img src={m.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : m.name.charAt(0).toUpperCase()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{m.name}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{m.role}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{m.category || '—'}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button onClick={() => openEdit(m)} style={{ padding: '6px 14px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
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
