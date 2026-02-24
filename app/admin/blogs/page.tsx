'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';

interface Blog {
    id: string;
    _id?: string;
    slug: string;
    category: string;
    date: string;
    title: string;
    excerpt: string;
    readTime: string;
    content: string;
    image: string;
}

const emptyBlog = { slug: '', category: '', date: '', title: '', excerpt: '', readTime: '', content: '', image: '' };

export default function BlogsAdmin() {
    const { token } = useAuth();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Blog | null>(null);
    const [form, setForm] = useState(emptyBlog);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            setBlogs(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { if (token) fetchBlogs(); }, [token]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyBlog);
        setImageFile(null);
        setError('');
        setShowForm(true);
    };

    const openEdit = (blog: Blog) => {
        setEditing(blog);
        setForm({
            slug: blog.slug || '',
            category: blog.category || '',
            date: blog.date || '',
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            readTime: blog.readTime || '',
            content: blog.content || '',
            image: blog.image || '',
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
            formData.append('slug', form.slug);
            formData.append('category', form.category);
            formData.append('date', form.date);
            formData.append('excerpt', form.excerpt);
            formData.append('readTime', form.readTime);
            formData.append('content', form.content);
            if (imageFile) formData.append('image', imageFile);

            const url = editing ? `/api/blogs/${editing.id || editing._id}` : '/api/blogs';
            const method = editing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                setShowForm(false);
                fetchBlogs();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to save');
            }
        } catch {
            setError('Network error');
        }
        setSaving(false);
    };

    const handleDelete = async (blog: Blog) => {
        if (!confirm(`Delete "${blog.title}"?`)) return;
        try {
            await fetch(`/api/blogs/${blog.id || blog._id}`, { method: 'DELETE', headers });
            fetchBlogs();
        } catch { /* ignore */ }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 14px',
        fontSize: '13px',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: '8px',
        outline: 'none',
        background: '#fafafa',
        boxSizing: 'border-box' as const,
        marginTop: '4px',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '10px',
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: 'rgba(0,0,0,0.4)',
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', color: '#000', margin: 0 }}>Blogs</h1>
                    <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage your blog posts</p>
                </div>
                <button onClick={openCreate} style={{
                    padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                }}>+ New Blog</button>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px',
                        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>
                            {editing ? 'Edit Blog' : 'New Blog Post'}
                        </h2>
                        {error && <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#991b1b' }}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                                <div><label style={labelStyle}>Slug</label><input style={inputStyle} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
                                <div><label style={labelStyle}>Category</label><input style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                                <div><label style={labelStyle}>Date</label><input style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="Feb 18, 2026" /></div>
                                <div><label style={labelStyle}>Read Time</label><input style={inputStyle} value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} placeholder="5 min read" /></div>
                                <div><label style={labelStyle}>Image</label><input type="file" accept="image/*" style={{ ...inputStyle, padding: '8px' }} onChange={e => setImageFile(e.target.files?.[0] || null)} /></div>
                            </div>
                            <div style={{ marginBottom: '14px' }}><label style={labelStyle}>Excerpt</label><textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
                            <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Content</label><textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            {['Title', 'Category', 'Date', 'Read Time', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '13px' }}>Loading...</td></tr>
                        ) : blogs.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '13px' }}>No blog posts yet. Create your first one!</td></tr>
                        ) : blogs.map(blog => (
                            <tr key={blog.id || blog._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{blog.title}</td>
                                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{blog.category || '—'}</td>
                                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{blog.date || '—'}</td>
                                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{blog.readTime || '—'}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => openEdit(blog)} style={{ padding: '6px 12px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(blog)} style={{ padding: '6px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
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
