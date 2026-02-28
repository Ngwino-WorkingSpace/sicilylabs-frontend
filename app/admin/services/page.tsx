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

interface ServiceStep {
    year: string;
    title: string;
    description: string;
}

interface Service {
    id: string;
    slug: string;
    title: string;
    description: string;
    tagline: string;
    hook: string;
    steps: ServiceStep[];
    number: string;
    icon: string;
}

const emptyStep: ServiceStep = { year: '', title: '', description: '' };
const emptyForm = { slug: '', title: '', description: '', tagline: '', hook: '', number: '', icon: '' };

export default function ServicesAdmin() {
    const { token } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [steps, setSteps] = useState<ServiceStep[]>([{ ...emptyStep }]);
    const [saving, setSaving] = useState(false);

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setServices(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { if (token) fetchServices(); }, [token]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setSteps([{ ...emptyStep }]);
        setShowForm(true);
    };

    const openEdit = (s: Service) => {
        setEditing(s);
        setForm({
            slug: s.slug || '',
            title: s.title || '',
            description: s.description || '',
            tagline: s.tagline || '',
            hook: s.hook || '',
            number: s.number || '',
            icon: s.icon || '',
        });
        setSteps(s.steps && s.steps.length > 0 ? s.steps : [{ ...emptyStep }]);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Filter out empty steps
            const validSteps = steps.filter(s => s.title.trim());
            const payload = { ...form, steps: validSteps };

            const url = editing ? `/api/services/${editing.id}` : '/api/services';
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
            if (res.ok) {
                setShowForm(false);
                fetchServices();
                toast.success(editing ? 'Service updated' : 'Service created');
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

    const handleDelete = async (s: Service) => {
        if (!confirm(`Delete "${s.title}"?`)) return;
        try {
            const res = await fetch(`/api/services/${s.id}`, { method: 'DELETE', headers });
            if (res.ok) {
                toast.success('Service deleted');
                fetchServices();
            } else {
                toast.error('Failed to delete service');
            }
        } catch {
            toast.error('Network error');
        }
    };

    const updateStep = (idx: number, field: keyof ServiceStep, value: string) => {
        setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    };

    const addStep = () => setSteps(prev => [...prev, { ...emptyStep }]);
    const removeStep = (idx: number) => setSteps(prev => prev.filter((_, i) => i !== idx));

    return (
        <>
            <style>{modalCSS}</style>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', color: '#000', margin: 0 }}>Services</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px' }}>Manage your offered services</p>
                    </div>
                    <button onClick={openCreate} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ New Service</button>
                </div>

                {showForm && (
                    <div style={modalOverlayStyle} onClick={() => setShowForm(false)}>
                        <div className="modal-box" style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                            <div style={modalHeaderStyle}>
                                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
                                    {editing ? 'Edit Service' : 'New Service'}
                                </h2>
                                <button style={closeBtnStyle} onClick={() => setShowForm(false)}>✕</button>
                            </div>

                            <div style={modalBodyStyle}>

                                <form onSubmit={handleSubmit}>
                                    {/* Section: Service Details */}
                                    <h3 style={sectionTitleStyle}>Service Details</h3>
                                    <div style={fieldGroupStyle}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Title *</label>
                                            <input className="modal-input" style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brand Identity" required />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Slug</label>
                                            <input className="modal-input" style={inputStyle} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="brand-identity" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Number</label>
                                            <input className="modal-input" style={inputStyle} value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="01" />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Icon</label>
                                            <input className="modal-input" style={inputStyle} value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Icon name or URL" />
                                        </div>
                                    </div>

                                    {/* Section: Service Page Content */}
                                    <h3 style={sectionTitleStyle}>Service Page Content</h3>
                                    <div style={{ ...fieldStyle, marginBottom: '12px' }}>
                                        <label style={labelStyle}>Tagline</label>
                                        <input className="modal-input" style={inputStyle} value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. Forging Visual Legacies" />
                                    </div>
                                    <div style={{ ...fieldStyle, marginBottom: '12px' }}>
                                        <label style={labelStyle}>Hook / Pitch</label>
                                        <textarea className="modal-input" style={{ ...textareaStyle, minHeight: '60px' }} value={form.hook} onChange={e => setForm({ ...form, hook: e.target.value })} placeholder="Short compelling pitch shown on the service detail page..." />
                                    </div>

                                    {/* Section: Description */}
                                    <h3 style={sectionTitleStyle}>Description</h3>
                                    <div style={{ ...fieldStyle, marginBottom: '12px' }}>
                                        <label style={labelStyle}>Service Description *</label>
                                        <textarea className="modal-input" style={textareaStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe what this service offers..." required />
                                    </div>

                                    {/* Section: Process Steps */}
                                    <h3 style={sectionTitleStyle}>Process Steps</h3>
                                    <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.35)', marginBottom: '12px' }}>Define the methodology steps shown on the service detail page.</p>
                                    {steps.map((step, idx) => (
                                        <div key={idx} style={{ background: '#fafafa', borderRadius: '10px', padding: '14px', marginBottom: '10px', border: '1px solid rgba(0,0,0,0.04)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {idx + 1}</span>
                                                {steps.length > 1 && (
                                                    <button type="button" onClick={() => removeStep(idx)} style={{ fontSize: '10px', color: '#991b1b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                                                )}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '8px', marginBottom: '8px' }}>
                                                <input className="modal-input" style={inputStyle} value={step.year} onChange={e => updateStep(idx, 'year', e.target.value)} placeholder="01" />
                                                <input className="modal-input" style={inputStyle} value={step.title} onChange={e => updateStep(idx, 'title', e.target.value)} placeholder="Step title" />
                                            </div>
                                            <textarea className="modal-input" style={{ ...textareaStyle, minHeight: '50px' }} value={step.description} onChange={e => updateStep(idx, 'description', e.target.value)} placeholder="Step description..." />
                                        </div>
                                    ))}
                                    <button type="button" onClick={addStep} style={{ fontSize: '11px', fontWeight: 700, color: '#000', background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', marginBottom: '16px' }}>+ Add Step</button>

                                    {/* Footer */}
                                    <div style={modalFooterStyle}>
                                        <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
                                        <button type="submit" disabled={saving} style={{ ...submitBtnStyle, opacity: saving ? 0.6 : 1 }}>
                                            {saving ? 'Saving...' : (editing ? 'Update Service' : 'Create Service')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid View */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {loading ? (
                        <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>Loading...</p>
                    ) : services.length === 0 ? (
                        <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>No services yet.</p>
                    ) : services.map(s => (
                        <div key={s.id} style={{
                            background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', padding: '20px',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#000' }} />
                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(0,0,0,0.2)' }}>{s.number || '—'}</span>
                            <h3 style={{ fontSize: '15px', fontWeight: 900, margin: '4px 0 4px', letterSpacing: '-0.02em' }}>{s.title}</h3>
                            {s.tagline && <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.3)', fontStyle: 'italic', marginBottom: '6px' }}>{s.tagline}</p>}
                            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.5, marginBottom: '8px' }}>{s.description}</p>
                            {s.steps && s.steps.length > 0 && (
                                <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginBottom: '12px' }}>{s.steps.length} process steps</p>
                            )}
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => openEdit(s)} style={{ padding: '6px 14px', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(s)} style={{ padding: '6px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#991b1b' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
