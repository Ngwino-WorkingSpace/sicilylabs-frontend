'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';

interface Project {
    id: string;
    _id?: string;
    projectId: string;
    title: string;
    accent: string;
    subtitle: string;
    tag: string;
    description: string;
    mirrored: boolean;
    icons: string[];
    category: string;
    image: string;
    link: string;
}

const emptyForm = { projectId: '', title: '', accent: '', subtitle: '', tag: '', description: '', mirrored: false, icons: '', category: '', link: '' };

export default function ProjectsAdmin() {
    const { token } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { if (token) fetchProjects(); }, [token]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setImageFile(null);
        setError('');
        setShowForm(true);
    };

    const openEdit = (p: Project) => {
        setEditing(p);
        setForm({
            projectId: p.projectId || '',
            title: p.title || '',
            accent: p.accent || '',
            subtitle: p.subtitle || '',
            tag: p.tag || '',
            description: p.description || '',
            mirrored: p.mirrored || false,
            icons: (p.icons || []).join(', '),
            category: p.category || '',
            link: p.link || '',
        });
        setImageFile(null);
        setError('');
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('category', form.category);
            formData.append('link', form.link);
            formData.append('projectId', form.projectId);
            formData.append('accent', form.accent);
            formData.append('subtitle', form.subtitle);
            formData.append('tag', form.tag);
            formData.append('mirrored', String(form.mirrored));
            formData.append('icons', form.icons);
            if (imageFile) formData.append('image', imageFile);

            const url = editing ? `/api/projects/${editing.id || editing._id}` : '/api/projects';
            const method = editing ? 'PUT' : 'POST';

            const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            if (res.ok) { setShowForm(false); fetchProjects(); }
            else { const d = await res.json(); setError(d.message || 'Failed to save'); }
        } catch { setError('Network error'); }
        setSaving(false);
    };

    const handleDelete = async (p: Project) => {
        if (!confirm(`Delete "${p.title}"?`)) return;
        await fetch(`/api/projects/${p.id || p._id}`, { method: 'DELETE', headers });
        fetchProjects();
    };

    const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '13px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none', background: '#fafafa', boxSizing: 'border-box', marginTop: '4px' };
    const labelStyle: React.CSSProperties = { fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', color: '#000', margin: 0 }}>Projects</h1>
                    <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage your portfolio projects</p>
                </div>
                <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Project</button>
            </div>

            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>{editing ? 'Edit Project' : 'New Project'}</h2>
                        {error && <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#991b1b' }}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                                <div><label style={labelStyle}>Project ID</label><input style={inputStyle} value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} placeholder="01" /></div>
                                <div><label style={labelStyle}>Accent</label><input style={inputStyle} value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} /></div>
                                <div><label style={labelStyle}>Subtitle</label><input style={inputStyle} value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
                                <div><label style={labelStyle}>Tag</label><input style={inputStyle} value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} /></div>
                                <div><label style={labelStyle}>Category</label><input style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                                <div><label style={labelStyle}>Link</label><input style={inputStyle} value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} /></div>
                                <div><label style={labelStyle}>Image *</label><input type="file" accept="image/*" style={{ ...inputStyle, padding: '8px' }} onChange={e => setImageFile(e.target.files?.[0] || null)} /></div>
                                <div><label style={labelStyle}>Icons (comma separated)</label><input style={inputStyle} value={form.icons} onChange={e => setForm({ ...form, icons: e.target.value })} placeholder="react, node, figma" /></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                                    <input type="checkbox" checked={form.mirrored} onChange={e => setForm({ ...form, mirrored: e.target.checked })} id="mirrored" />
                                    <label htmlFor="mirrored" style={labelStyle}>Mirrored Layout</label>
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Description *</label><textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
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
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            {['ID', 'Title', 'Category', 'Tag', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '13px' }}>Loading...</td></tr>
                        ) : projects.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '13px' }}>No projects yet.</td></tr>
                        ) : projects.map(p => (
                            <tr key={p.id || p._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, color: 'rgba(0,0,0,0.3)' }}>{p.projectId || '—'}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{p.title}</td>
                                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{p.category || '—'}</td>
                                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{p.tag || '—'}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => openEdit(p)} style={{ padding: '6px 12px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(p)} style={{ padding: '6px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
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
