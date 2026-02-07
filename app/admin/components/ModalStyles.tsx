'use client';

import React from 'react';

/* ─── Shared Modal Styles for Admin Forms ─── */

export const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
};

export const modalBoxStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '620px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
    position: 'relative',
};

export const modalHeaderStyle: React.CSSProperties = {
    padding: '28px 32px 20px',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

export const modalBodyStyle: React.CSSProperties = {
    padding: '24px 32px 32px',
};

export const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 800,
    color: '#000',
    margin: '0 0 16px',
    letterSpacing: '-0.01em',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
};

export const fieldGroupStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px',
};

export const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
};

export const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 700,
    color: '#333',
    letterSpacing: '0.01em',
};

export const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#111',
    border: '1.5px solid #e5e5e5',
    borderRadius: '10px',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
};

export const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical' as const,
    lineHeight: 1.6,
};

export const fileInputWrapperStyle: React.CSSProperties = {
    border: '2px dashed #e0e0e0',
    borderRadius: '12px',
    padding: '28px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    background: '#fafafa',
};

export const errorStyle: React.CSSProperties = {
    padding: '12px 16px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#991b1b',
    fontWeight: 600,
};

export const modalFooterStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    paddingTop: '24px',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    marginTop: '8px',
};

export const cancelBtnStyle: React.CSSProperties = {
    padding: '12px 24px',
    background: '#f5f5f5',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    color: '#333',
    transition: 'all 0.15s',
};

export const submitBtnStyle: React.CSSProperties = {
    padding: '12px 28px',
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s',
    letterSpacing: '0.02em',
};

export const closeBtnStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#f5f5f5',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: 'rgba(0,0,0,0.4)',
    transition: 'all 0.15s',
};

/* ─── CSS for focus states (inject in pages) ─── */
export const modalCSS = `
    .modal-input:focus {
        border-color: #000 !important;
        box-shadow: 0 0 0 3px rgba(0,0,0,0.06) !important;
    }
    .modal-input::placeholder {
        color: #bbb;
    }
    .file-drop:hover {
        border-color: #bbb !important;
        background: #f5f5f5 !important;
    }
    .modal-box::-webkit-scrollbar {
        width: 6px;
    }
    .modal-box::-webkit-scrollbar-track {
        background: transparent;
    }
    .modal-box::-webkit-scrollbar-thumb {
        background: #e0e0e0;
        border-radius: 3px;
    }
`;
