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

interface Project {
    id: string;
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
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
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

            const url = editing ? `/api/projects/${editing.id}` : '/api/projects';
            const method = editing ? 'PUT' : 'POST';

            const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            if (res.ok) {
                setShowForm(false);
                fetchProjects();
                toast.success(editing ? 'Project updated' : 'Project created');
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

    const handleDelete = async (p: Project) => {
        if (!confirm(`Delete "${p.title}"?`)) return;
        try {
            const res = await fetch(`/api/projects/${p.id}`, { method: 'DELETE', headers });
            if (res.ok) {
                toast.success('Project deleted');
                fetchProjects();
            } else {
                toast.error('Failed to delete project');
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
                        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', color: '#000', margin: 0 }}>Projects</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage your portfolio projects</p>
                    </div>
                    <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Project</button>
                </div>

                {showForm && (
                    <div style={modalOverlayStyle} onClick={() => setShowForm(false)}>
                        <div className="modal-box" style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                            <div style={modalHeaderStyle}>
                                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
                                    {editing ? 'Edit Project' : 'New Project'}
                                </h2>
                                <button style={closeBtnStyle} onClick={() => setShowForm(false)}>✕</button>
                            </div>

                            <div style={modalBodyStyle}>

                                <form onSubmit={handleSubmit}>
                                    {/* Section: Project Info */}
                                    <h3 style={sectionTitleStyle}>Project Info</h3>
                                    <div style={fieldGroupStyle}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Title *</label>
                                            <input className="modal-input" style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project name" required />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Project ID</label>
                                            <input className="modal-input" style={inputStyle} value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} placeholder="01" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Subtitle</label>
                                            <input className="modal-input" style={inputStyle} value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Short subtitle" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Accent</label>
                                            <input className="modal-input" style={inputStyle} value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} placeholder="Accent color or text" />
                                        </div>
                                    </div>

                                    {/* Section: Classification */}
                                    <h3 style={sectionTitleStyle}>Classification</h3>
                                    <div style={fieldGroupStyle}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Category</label>
                                            <input className="modal-input" style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Web App" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Tag</label>
                                            <input className="modal-input" style={inputStyle} value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="Featured" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Link</label>
                                            <input className="modal-input" style={inputStyle} value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Icons (comma separated)</label>
                                            <input className="modal-input" style={inputStyle} value={form.icons} onChange={e => setForm({ ...form, icons: e.target.value })} placeholder="react, node, figma" />
                                        </div>
                                    </div>

                                    {/* Mirrored checkbox */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '12px 14px', background: '#fafafa', borderRadius: '10px' }}>
                                        <input type="checkbox" checked={form.mirrored} onChange={e => setForm({ ...form, mirrored: e.target.checked })} id="mirrored" style={{ width: '16px', height: '16px', accentColor: '#000' }} />
                                        <label htmlFor="mirrored" style={{ fontSize: '13px', fontWeight: 600, color: '#333', cursor: 'pointer' }}>Mirrored Layout</label>
                                    </div>

                                    {/* Section: Description */}
                                    <h3 style={sectionTitleStyle}>Description</h3>
                                    <div style={{ ...fieldStyle, marginBottom: '20px' }}>
                                        <label style={labelStyle}>Project Description *</label>
                                        <textarea className="modal-input" style={textareaStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the project..." required />
                                    </div>

                                    {/* Section: Cover Image */}
                                    <h3 style={sectionTitleStyle}>Cover Image</h3>
                                    <div style={{ marginBottom: '8px' }}>
                                        <label htmlFor="proj-image">
                                            <div className="file-drop" style={fileInputWrapperStyle}>
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}>
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{imageFile ? imageFile.name : 'PNG, JPG or JPEG, smaller than 10MB'}</p>
                                                <p style={{ fontSize: '11px', color: '#bbb', margin: '4px 0 0' }}>Click to browse or drag and drop</p>
                                            </div>
                                        </label>
                                        <input id="proj-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                    </div>

                                    {/* Footer */}
                                    <div style={modalFooterStyle}>
                                        <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
                                        <button type="submit" disabled={saving} style={{ ...submitBtnStyle, opacity: saving ? 0.6 : 1 }}>
                                            {saving ? 'Saving...' : (editing ? 'Update Project' : 'Create Project')}
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
                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, color: 'rgba(0,0,0,0.3)' }}>{p.projectId || '—'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{p.title}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{p.category || '—'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{p.tag || '—'}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => openEdit(p)} style={{ padding: '6px 14px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDelete(p)} style={{ padding: '6px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
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
