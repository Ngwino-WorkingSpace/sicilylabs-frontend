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

interface Blog {
    id: string;
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
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
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

            const url = editing ? `/api/blogs/${editing.id}` : '/api/blogs';
            const method = editing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                setShowForm(false);
                fetchBlogs();
                toast.success(editing ? 'Blog post updated' : 'Blog post published');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to save');
            }
        } catch {
            toast.error('Network error');
        }
        setSaving(false);
    };

    const handleDelete = async (blog: Blog) => {
        if (!confirm(`Delete "${blog.title}"?`)) return;
        try {
            const res = await fetch(`/api/blogs/${blog.id}`, { method: 'DELETE', headers });
            if (res.ok) {
                toast.success('Blog post deleted');
                fetchBlogs();
            } else {
                toast.error('Failed to delete blog post');
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
                        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', color: '#000', margin: 0 }}>Blogs</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage your blog posts</p>
                    </div>
                    <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Blog</button>
                </div>

                {/* Modal Form */}
                {showForm && (
                    <div style={modalOverlayStyle} onClick={() => setShowForm(false)}>
                        <div className="modal-box" style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div style={modalHeaderStyle}>
                                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
                                    {editing ? 'Edit Blog Post' : 'New Blog Post'}
                                </h2>
                                <button style={closeBtnStyle} onClick={() => setShowForm(false)}>✕</button>
                            </div>

                            {/* Body */}
                            <div style={modalBodyStyle}>

                                <form onSubmit={handleSubmit}>
                                    {/* Section: Post Details */}
                                    <h3 style={sectionTitleStyle}>Post Details</h3>
                                    <div style={fieldGroupStyle}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Title *</label>
                                            <input className="modal-input" style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter post title" required />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Slug</label>
                                            <input className="modal-input" style={inputStyle} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="post-url-slug" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Category</label>
                                            <input className="modal-input" style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Engineering" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Date</label>
                                            <input className="modal-input" type="date" style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Read Time</label>
                                            <input className="modal-input" style={inputStyle} value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} placeholder="5 min read" />
                                        </div>
                                    </div>

                                    {/* Section: Content */}
                                    <h3 style={sectionTitleStyle}>Content</h3>
                                    <div style={{ ...fieldStyle, marginBottom: '16px' }}>
                                        <label style={labelStyle}>Excerpt</label>
                                        <textarea className="modal-input" style={{ ...textareaStyle, minHeight: '70px' }} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary of the post..." />
                                    </div>
                                    <div style={{ ...fieldStyle, marginBottom: '20px' }}>
                                        <label style={labelStyle}>Content *</label>
                                        <textarea className="modal-input" style={textareaStyle} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write the full blog content here..." />
                                    </div>

                                    {/* Section: Media */}
                                    <h3 style={sectionTitleStyle}>Cover Image</h3>
                                    <div style={{ marginBottom: '8px' }}>
                                        <label htmlFor="blog-image">
                                            <div className="file-drop" style={fileInputWrapperStyle}>
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}>
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                                                    {imageFile ? imageFile.name : 'PNG, JPG or JPEG, smaller than 10MB'}
                                                </p>
                                                <p style={{ fontSize: '11px', color: '#bbb', margin: '4px 0 0' }}>
                                                    Click to browse or drag and drop
                                                </p>
                                            </div>
                                        </label>
                                        <input id="blog-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                    </div>

                                    {/* Footer */}
                                    <div style={modalFooterStyle}>
                                        <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
                                        <button type="submit" disabled={saving} style={{ ...submitBtnStyle, opacity: saving ? 0.6 : 1 }}>
                                            {saving ? 'Saving...' : (editing ? 'Update Post' : 'Publish Post')}
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
                                <tr key={blog.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{blog.title}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{blog.category || '—'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{blog.date || '—'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{blog.readTime || '—'}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => openEdit(blog)} style={{ padding: '6px 14px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDelete(blog)} style={{ padding: '6px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
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
