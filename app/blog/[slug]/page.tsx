"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';

interface BlogPost {
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

export default function BlogPostDetail() {
    const params = useParams();
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const found = data.find((b: BlogPost) => b.slug === slug);
                    setPost(found || null);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f9f9f9] font-sans flex flex-col items-center justify-center">
                <Navbar />
                <p className="text-zinc-400 font-medium">Loading story...</p>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="min-h-screen bg-[#f9f9f9] font-sans flex flex-col items-center justify-center">
                <Navbar />
                <h1 className="text-4xl font-black tracking-tighter text-black mb-4">Post Not Found</h1>
                <p className="text-zinc-500 font-medium mb-8">The story you're looking for doesn't exist or has been moved.</p>
                <Link href="/blog" className="bg-black text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-zinc-800 transition-colors">
                    Back to Blogs
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white font-sans flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-8 max-w-4xl mx-auto w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-6"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-zinc-50 px-4 py-1.5 rounded-full">
                        {post.category}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-300">•</span>
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">{post.readTime} read</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] text-black mb-8 max-w-3xl mx-auto"
                >
                    {post.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl font-medium text-zinc-500 leading-relaxed max-w-2xl mx-auto mb-10"
                >
                    {post.excerpt}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center justify-center gap-4"
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-black flex items-center justify-center">
                        <Image src="/logo.png" alt="SicilyLabs" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                        <p className="text-[12px] font-black text-black">SicilyLabs Team</p>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{post.date}</p>
                    </div>
                </motion.div>
            </section>

            {/* Image Section (if available) - Currently using background color as placeholder if no image */}
            {post.image ? (
                <section className="px-8 max-w-5xl mx-auto w-full mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="w-full aspect-[16/9] md:aspect-[2/1] relative rounded-3xl overflow-hidden bg-zinc-100"
                    >
                        <Image
                            src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </section>
            ) : (
                <section className="px-8 max-w-5xl mx-auto w-full mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="w-full aspect-[21/9] relative rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100 flex items-center justify-center"
                    >
                        <Image src="/logo.png" alt="SicilyLabs" width={80} height={80} className="opacity-10" />
                    </motion.div>
                </section>
            )}

            {/* Content Section */}
            <section className="px-8 max-w-3xl mx-auto w-full mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="prose prose-zinc prose-lg mx-auto"
                >
                    <div
                        className="whitespace-pre-wrap text-[15px] md:text-[17px] leading-relaxed text-zinc-700 font-medium"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </motion.div>
            </section>

            {/* Footer / CTA inside blog */}
            <section className="border-t border-zinc-100 py-16 px-8 bg-zinc-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h3 className="text-2xl font-black tracking-tighter mb-4">Enjoyed this story?</h3>
                    <p className="text-sm font-medium text-zinc-500 mb-8">Reach out to us to start building your next big project.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/blog" className="px-6 py-3 rounded-full border border-zinc-200 text-[11px] font-black uppercase tracking-widest text-zinc-600 hover:bg-white hover:text-black transition-colors">
                            More Stories
                        </Link>
                        <Link href="/contact" className="px-6 py-3 rounded-full bg-black text-[11px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 transition-colors">
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
