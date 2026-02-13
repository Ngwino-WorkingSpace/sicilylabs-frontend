'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DropdownItem {
    label: string;
    href: string;
}

interface NavLinkProps {
    label: string;
    href: string;
    dropdown?: DropdownItem[];
}

function NavLink({ label, href, dropdown }: NavLinkProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative group h-full flex flex-col items-center justify-center px-3"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Top indicator (visible on hover) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

            <Link
                href={href}
                className="text-[10px] font-black uppercase tracking-wider text-black/60 group-hover:text-black transition-colors flex items-center gap-1"
            >
                {label}
                {dropdown && (
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-300 text-black/40">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                )}
            </Link>

            {/* Dropdown Menu */}
            {dropdown && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-44 bg-white border border-black/5 shadow-xl rounded-lg overflow-hidden transition-all duration-300 z-[110] ${isOpen ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-4 invisible'}`}>
                    <div className="h-[2px] w-full bg-black" />
                    <div className="py-1">
                        {dropdown.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="block px-3 py-1.5 text-[9px] font-bold uppercase tracking-tight text-black/60 hover:text-black hover:bg-zinc-50 transition-all border-b border-black/[0.02] last:border-0"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

interface Service {
    id: number;
    slug: string;
    title: string;
}

interface Role {
    id: number;
    name: string;
}

export default function Navbar() {
    const [serviceItems, setServiceItems] = useState<DropdownItem[]>([]);
    const [teamItems, setTeamItems] = useState<DropdownItem[]>([]);

    useEffect(() => {
        // Fetch services for dropdown
        fetch('/api/services')
            .then(r => r.json())
            .then((data: Service[]) => {
                if (Array.isArray(data)) {
                    setServiceItems(data.map(s => ({
                        label: s.title,
                        href: `/services/${s.slug}`,
                    })));
                }
            })
            .catch(() => { });

        // Fetch roles for team dropdown
        fetch('/api/roles')
            .then(r => r.json())
            .then((data: Role[]) => {
                if (Array.isArray(data)) {
                    setTeamItems(data.map(r => ({
                        label: r.name,
                        href: `/team#${r.name.toLowerCase().replace(/\s+/g, '-')}`,
                    })));
                }
            })
            .catch(() => { });
    }, []);

    return (
        <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-full max-w-3xl px-4 pointer-events-none">
            <div className="w-full bg-white/80 backdrop-blur-md border border-black/5 rounded-full h-11 shadow-2xl pointer-events-auto flex items-center justify-between px-5 relative transition-all duration-300">

                {/* Left: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-black flex items-center justify-center group-hover:border-black/50 transition-all">
                            <Image src="/logo.png" alt="SicilyLabs Logo" width={24} height={24} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-black tracking-tighter text-black uppercase hidden sm:block">SICILYLABS</span>
                    </Link>
                </div>

                {/* Right: Links Grouped */}
                <div className="flex h-full items-center">
                    <NavLink label="Home" href="/" />
                    <NavLink label="Explore" href="/" dropdown={[
                        { label: 'Hero', href: '/#hero' },
                        { label: 'Our Services', href: '/#services' },
                        { label: 'About Us', href: '/#about' },
                        { label: 'Featured Projects', href: '/#projects' },
                        { label: 'Get Started', href: '/contact' },
                    ]} />
                    <NavLink label="Services" href="/services" dropdown={serviceItems.length > 0 ? serviceItems : undefined} />
                    <NavLink label="Blog" href="/blog" />
                    <NavLink label="Our Team" href="/team" dropdown={teamItems.length > 0 ? teamItems : undefined} />
                    <NavLink label="Contact Us" href="/contact" />
                </div>
            </div>
        </nav>
    );
}
