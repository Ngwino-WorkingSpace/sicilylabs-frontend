'use client';

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

// ── Error Boundary for Spline ──
class SplineErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error, info: ErrorInfo) {
        console.warn('Spline error caught:', error.message, info);
    }
    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (isAuthenticated) router.push('/admin');
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            toast.success('Welcome back!');
            router.push('/admin');
        }
        else { toast.error(result.message || 'Login failed'); }
        setLoading(false);
    };

    return (
        <>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .login-input {
                    width: 100%;
                    padding: 14px 16px;
                    font-size: 14px;
                    color: #111;
                    border: 1.5px solid #e0e0e0;
                    border-radius: 10px;
                    outline: none;
                    background: #fff;
                    box-sizing: border-box;
                    transition: border-color 0.25s, box-shadow 0.25s;
                }
                .login-input::placeholder { color: #aaa; }
                .login-input:focus {
                    border-color: #000;
                    box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
                }
                .login-btn {
                    width: 100%;
                    padding: 15px;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
                }
                .login-btn:active { transform: translateY(0); }
                .login-btn:disabled {
                    background: #555;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                /* ── Responsive ── */
                .login-wrapper {
                    min-height: 100vh;
                    display: flex;
                    font-family: Arial, Helvetica, sans-serif;
                    background: #fff;
                    padding: 32px;
                    gap: 0px;
                    box-sizing: border-box;
                }
                .login-left {
                    flex: 0 0 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                }
                .login-right {
                    flex: 0 0 50%;
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                    background: #222;
                    min-height: calc(100vh - 64px);
                }

                @media (max-width: 1024px) {
                    .login-wrapper {
                        flex-direction: column;
                        padding: 20px;
                    }
                    .login-left {
                        flex: none;
                        padding: 30px 20px;
                    }
                    .login-right {
                        flex: none;
                        min-height: 300px;
                        border-radius: 20px;
                    }
                }

                @media (max-width: 640px) {
                    .login-wrapper {
                        padding: 16px;
                    }
                    .login-left {
                        padding: 24px 12px;
                    }
                    .login-right {
                        display: none;
                    }
                }
            `}</style>

            <div className="login-wrapper">

                {/* ── LEFT: Login Form (centered with logo above) ── */}
                <div className="login-left">
                    <div style={{
                        width: '100%',
                        maxWidth: '360px',
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                        {/* Logo centered */}
                        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                            <div style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '14px',
                                overflow: 'hidden',
                                marginBottom: '24px',
                                display: 'inline-block',
                            }}>
                                <img src="/logo.png" alt="SicilyLabs Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: 900,
                                color: '#000',
                                margin: '0 0 6px',
                                letterSpacing: '-0.03em',
                            }}>Welcome back</h1>
                            <p style={{
                                fontSize: '14px',
                                color: '#888',
                                margin: 0,
                            }}>Please enter your details.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: '#333',
                                    marginBottom: '8px',
                                }}>Email</label>
                                <input
                                    className="login-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: '#333',
                                    marginBottom: '8px',
                                }}>Password</label>
                                <input
                                    className="login-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            <button className="login-btn" type="submit" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <p style={{
                            textAlign: 'center',
                            marginTop: '28px',
                            marginBottom: 0,
                            fontSize: '10px',
                            color: '#bbb',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase' as const,
                        }}>Secured by Sicily Labs</p>
                    </div>
                </div>

                {/* ── RIGHT: Spline 3D (rounded) ── */}
                <div className="login-right">
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: mounted ? 1 : 0,
                        transition: 'opacity 1.5s ease 0.3s',
                    }}>
                        <SplineErrorBoundary fallback={
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="/logo.png" alt="SicilyLabs Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', opacity: 0.15 }} />
                            </div>
                        }>
                            <Spline
                                scene="https://prod.spline.design/oeKmWN4mwzDSMNxH/scene.splinecode"
                            />
                        </SplineErrorBoundary>
                    </div>
                </div>
            </div>
        </>
    );
}
