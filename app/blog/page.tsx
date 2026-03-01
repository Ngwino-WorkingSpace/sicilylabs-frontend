"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

interface BlogPost {
    id: number;
    slug: string;
    category: string;
    date: string;
    title: string;
    excerpt: string;
    readTime: string;
}

export default function BlogPage() {
    const [active, setActive] = useState(0);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => {
                setPosts(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const featured = posts[active];

    const scrollLeft = () => {
        setActive(prev => Math.max(0, prev - 1));
        scrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
    };

    const scrollRight = () => {
        setActive(prev => Math.min(posts.length - 1, prev + 1));
        scrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f9f9f9] font-sans flex flex-col items-center justify-center">
                <Navbar />
                <p className="text-zinc-400 font-medium">Loading stories...</p>
            </main>
        );
    }

    if (posts.length === 0 || !featured) {
        return (
            <main className="min-h-screen bg-[#f9f9f9] font-sans flex flex-col items-center justify-center">
                <Navbar />
                <p className="text-zinc-400 font-medium">No stories currently available.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f9f9f9] font-sans flex flex-col">
            <Navbar />

            {/* Top right profile / logo */}
            <div className="pt-28 px-8 max-w-6xl mx-auto w-full flex justify-end items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-black flex items-center justify-center">
                        <Image src="/logo.png" alt="SicilyLabs" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-700 hidden sm:block">SicilyLabs</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                </div>
            </div>

            {/* Hero Section: Split */}
            <section className="flex-1 px-8 max-w-6xl mx-auto w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* Left: Headline + CTA */}
                <div className="pt-4">
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-5"
                    >
                        The Hustle Logs
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.05] text-black mb-6"
                    >
                        Keep the<br />story going..
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-[12px] font-medium text-zinc-500 leading-relaxed mb-8 max-w-xs"
                    >
                        Don't let the story end just yet. Real accounts from the lab — how we build, what we've learned, and what's next.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link
                            href={`/blog/${featured.slug}`}
                            className="inline-flex items-center gap-2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-zinc-800 transition-colors"
                        >
                            Start reading →
                        </Link>
                    </motion.div>
                </div>

                {/* Right: Featured Article Info */}
                <div className="pt-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={featured.id}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white border border-zinc-100 rounded-2xl p-8 shadow-sm"
                        >
                            {/* Author row */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0">
                                    <Image src="/logo.png" alt="SicilyLabs" width={36} height={36} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-black">SicilyLabs</p>
                                    <p className="text-[9px] text-zinc-400 font-medium">{featured.date} · {featured.readTime} read</p>
                                </div>
                                <div className="ml-auto">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300 bg-zinc-50 px-3 py-1 rounded-full">{featured.category}</span>
                                </div>
                            </div>

                            <h2 className="text-lg font-black tracking-tighter text-black leading-tight mb-4">
                                {featured.title}
                            </h2>

                            <p className="text-[12px] font-medium italic text-zinc-500 leading-relaxed mb-6">
                                "{featured.excerpt}"
                            </p>

                            {/* Prev / Next arrows */}
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{active + 1} of {posts.length}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={scrollLeft}
                                        disabled={active === 0}
                                        className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-black hover:border-zinc-300 transition-all disabled:opacity-30"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={scrollRight}
                                        disabled={active === posts.length - 1}
                                        className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-black hover:border-zinc-300 transition-all disabled:opacity-30"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Horizontal Scrolling Cards */}
            <section className="px-8 max-w-6xl mx-auto w-full mt-12 pb-16">
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {posts.map((post, i) => (
                        <motion.button
                            key={post.id}
                            onClick={() => setActive(i)}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className={`snap-start shrink-0 w-[200px] text-left rounded-2xl p-5 border transition-all duration-300 ${active === i
                                ? 'bg-black text-white border-black shadow-xl scale-[1.02]'
                                : 'bg-white text-black border-zinc-100 hover:border-zinc-300 hover:shadow-sm'
                                }`}
                        >
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] mb-3 block ${active === i ? 'text-zinc-400' : 'text-zinc-300'}`}>
                                {post.category}
                            </span>
                            <h3 className={`text-[12px] font-black tracking-tight leading-snug mb-3 ${active === i ? 'text-white' : 'text-black'}`}>
                                {post.title}
                            </h3>
                            <div className="flex justify-between items-center">
                                <span className={`text-[8px] font-medium ${active === i ? 'text-zinc-500' : 'text-zinc-300'}`}>{post.readTime}</span>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    onClick={e => e.stopPropagation()}
                                    className={`text-[8px] font-black uppercase ${active === i ? 'text-zinc-400 hover:text-white' : 'text-zinc-300 hover:text-black'} transition-colors`}
                                >
                                    Read →
                                </Link>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </section>
        </main>
    );
}
