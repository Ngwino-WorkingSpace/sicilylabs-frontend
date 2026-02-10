"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

interface ServiceStep {
    year: string;
    title: string;
    description: string;
}

interface ServiceData {
    id: number;
    slug: string;
    title: string;
    tagline: string;
    hook: string;
    description: string;
    steps: ServiceStep[];
}

const fallbackService: Omit<ServiceData, 'id' | 'slug' | 'description'> = {
    title: 'Service',
    tagline: 'Engineering Excellence',
    hook: 'We approach every problem with precision, artistry, and relentless focus on delivery.',
    steps: [
        { year: '01', title: 'Discovery', description: 'Deep understanding of your goals, constraints, and success metrics.' },
        { year: '02', title: 'Strategy', description: 'A clear plan with milestones, deliverables, and timelines.' },
        { year: '03', title: 'Execution', description: 'Rigorous, high-quality production with ongoing reviews.' },
        { year: '04', title: 'Delivery', description: 'Final handoff with full documentation and post-launch support.' },
    ],
};

export default function ServiceDetail() {
    const params = useParams();
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const [data, setData] = useState<ServiceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        fetch('/api/services')
            .then(r => r.json())
            .then((services: ServiceData[]) => {
                if (Array.isArray(services)) {
                    const found = services.find(s => s.slug === slug);
                    if (found) setData(found);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [slug]);

    const title = data?.title || fallbackService.title;
    const tagline = data?.tagline || fallbackService.tagline;
    const hook = data?.hook || data?.description || fallbackService.hook;
    const steps = (data?.steps && data.steps.length > 0) ? data.steps : fallbackService.steps;

    if (loading) {
        return (
            <main className="min-h-screen bg-white font-sans flex items-center justify-center">
                <Navbar />
                <p className="text-zinc-400 text-sm">Loading...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* IPAC-Style Hero */}
            <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden bg-black">
                {/* Giant background title */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none px-12">
                    <motion.span
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="text-[9vw] font-black uppercase text-white/10 leading-none tracking-tighter text-center"
                    >
                        {title}
                    </motion.span>
                </div>

                {/* Floating White Card and Title */}
                <div className="relative z-10 px-8 pb-16 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-end justify-between gap-8">

                    {/* Left: Title */}
                    <div className="flex-1">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4"
                        >
                            Our Process
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight max-w-lg"
                        >
                            {tagline}
                        </motion.h1>
                    </div>

                    {/* Right: Floating Utility Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
                        className="w-full md:w-[420px] bg-white rounded-[2rem] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
                    >
                        <h2 className="text-lg font-black tracking-tighter mb-2 text-zinc-900">{tagline}</h2>
                        <p className="text-[12px] font-medium text-zinc-500 mb-8 leading-relaxed">{hook}</p>

                        <div className="flex gap-3">
                            {/* Mock Search */}
                            <div className="flex-1 flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3">
                                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                </svg>
                                <span className="text-[11px] font-medium text-zinc-400">Search resources...</span>
                            </div>

                            {/* Explore Button → Contact */}
                            <Link href="/contact" className="bg-black text-white text-[11px] font-black uppercase tracking-widest px-5 rounded-xl hover:bg-zinc-800 transition-colors flex items-center">
                                Explore
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Futureblox-style Workflow Section */}
            <section className="bg-white py-24 px-8 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-16">

                    {/* Left: Section intro */}
                    <div className="md:w-1/3">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-4">How We Do It</p>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight mb-6">
                            Our Methodology
                        </h2>
                        <p className="text-[12px] font-medium text-zinc-500 leading-relaxed">
                            A refined, milestone-driven approach that keeps you in the loop at every stage of the process.
                        </p>
                        <Link href="/services" className="inline-flex items-center gap-2 mt-8 text-[11px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
                            <span>← All Services</span>
                        </Link>
                    </div>

                    {/* Right: Timeline */}
                    <div className="md:w-2/3 relative">
                        {/* Vertical line */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-zinc-100" />

                        <div className="flex flex-col gap-12">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="flex gap-8"
                                >
                                    {/* Dot + Year */}
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-3.5 h-3.5 rounded-full bg-black border-4 border-white ring-1 ring-zinc-200 shrink-0 z-10" />
                                    </div>
                                    <div className="pb-2">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-2">{step.year}</p>
                                        <h3 className="text-lg font-black tracking-tight text-black mb-2">{step.title}</h3>
                                        <p className="text-[12px] font-medium text-zinc-500 leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-black py-24 px-8 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6"
                >
                    Ready to Build?
                </motion.h2>
                <p className="text-zinc-400 text-sm font-medium mb-10 max-w-md mx-auto">Let's turn your idea into something real — fast, polished, and ready to scale.</p>
                <Link
                    href="/contact"
                    className="inline-block bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-zinc-100 transition-colors"
                >
                    Start a Project →
                </Link>
            </section>
        </main>
    );
}
