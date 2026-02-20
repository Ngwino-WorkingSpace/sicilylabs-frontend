"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100,
        },
    },
};

const teamMembers = [
    {
        id: 1,
        name: "John Doe",
        role: "Project Manager",
        category: "Project Managers",
        bio: "Driving projects from conceptualization to deployment with acute precision and leadership.",
        imageUrl: "https://i.pravatar.cc/300?img=11"
    },
    {
        id: 2,
        name: "Jane Smith",
        role: "Lead Designer",
        category: "Designers",
        bio: "Crafting beautiful, intuitive interfaces that speak directly to the user's needs.",
        imageUrl: "https://i.pravatar.cc/300?img=5"
    },
    {
        id: 3,
        name: "Michael Johnson",
        role: "Senior Engineer",
        category: "Engineers",
        bio: "Architecting robust and scalable software solutions tailored for high performance.",
        imageUrl: "https://i.pravatar.cc/300?img=60"
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "QA Lead",
        category: "QA Leads",
        bio: "Ensuring top-tier quality and flawless execution before any feature sees the light of day.",
        imageUrl: "https://i.pravatar.cc/300?img=9"
    },
    {
        id: 5,
        name: "Robert Brown",
        role: "Frontend Engineer",
        category: "Engineers",
        bio: "Translating pixel-perfect designs into fluid, interactive, and fast web experiences.",
        imageUrl: "https://i.pravatar.cc/300?img=12"
    },
    {
        id: 6,
        name: "Sarah Wilson",
        role: "Product Designer",
        category: "Designers",
        bio: "Connecting user psychology with modern aesthetics to build meaningful products.",
        imageUrl: "https://i.pravatar.cc/300?img=44"
    },
    { id: 7, name: "David Wilson", role: "Backend Engineer", category: "Engineers", bio: "Building resilient systems and API layers that scale seamlessly under load.", imageUrl: "https://i.pravatar.cc/300?img=15" },
    { id: 8, name: "Laura Martinez", role: "Project Manager", category: "Project Managers", bio: "Orchestrating agile workflows and ensuring transparent communication across teams.", imageUrl: "https://i.pravatar.cc/300?img=16" },
    { id: 9, name: "Kevin Taylor", role: "UI Designer", category: "Designers", bio: "Fusing form and function to create stunning user interfaces and micro-interactions.", imageUrl: "https://i.pravatar.cc/300?img=17" },
    { id: 10, name: "Amanda Lee", role: "DevOps Engineer", category: "Engineers", bio: "Streamlining deployment pipelines and optimizing cloud infrastructure.", imageUrl: "https://i.pravatar.cc/300?img=20" },
    { id: 11, name: "Jason White", role: "QA Engineer", category: "QA Leads", bio: "Implementing comprehensive automated test suites and preventing regressions.", imageUrl: "https://i.pravatar.cc/300?img=33" },
    { id: 12, name: "Sophia Green", role: "Brand Designer", category: "Designers", bio: "Developing holistic brand identities that resonate with global audiences.", imageUrl: "https://i.pravatar.cc/300?img=32" },
    { id: 13, name: "Chris Evans", role: "Project Manager", category: "Project Managers", bio: "Specializing in enterprise product delivery and timeline optimization.", imageUrl: "https://i.pravatar.cc/300?img=50" },
    { id: 14, name: "Emma Thomas", role: "Fullstack Engineer", category: "Engineers", bio: "Bridging the gap between beautiful frontends and powerful backend systems.", imageUrl: "https://i.pravatar.cc/300?img=47" },
    { id: 15, name: "Brian Hall", role: "QA Analyst", category: "QA Leads", bio: "Detail-oriented analyst ensuring every release meets our rigorous standards.", imageUrl: "https://i.pravatar.cc/300?img=51" }
];

const categories = [
    { name: "Project Managers", id: "project-managers" },
    { name: "Designers", id: "designers" },
    { name: "Engineers", id: "engineers" },
    { name: "QA Leads", id: "qa-leads" }
];

export default function TeamPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 md:px-12 mt-10">

                {/* Header Section */}
                <section className="mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-4"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">The Crew</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-6"
                    >
                        MEET OUR<br /> EXPERTS
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="max-w-xl text-sm md:text-base text-gray-500 font-medium leading-relaxed"
                    >
                        A collective of innovative thinkers, builders, and creators. We combine our diverse
                        expertises to deliver studio-quality solutions that push the boundaries of digital experiences.
                    </motion.p>
                </section>

                {/* Categories Sections */}
                <div className="flex flex-col gap-20">
                    {categories.map((category) => {
                        const categoryMembers = teamMembers.filter(m => m.category === category.name);

                        if (categoryMembers.length === 0) return null;

                        return (
                            <section key={category.id} id={category.id} className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-black flex-shrink-0">
                                        {category.name}
                                    </h2>
                                    <div className="h-[2px] w-full bg-black/5 flex-grow" />
                                </div>

                                <div className="flex flex-col gap-24 md:gap-32 w-full mt-16 pb-24 relative overflow-visible">
                                    {/* Subtle Brick Pattern Background (Matches Screenshot aesthetic) */}
                                    <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.17 29.17v-29.17h-29.17v29.17h29.17zm30 30v-29.17h-29.17v29.17h29.17z\' fill=\'%23000000\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

                                    {categoryMembers.map((member, idx) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={`relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-8 w-full ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                                        >
                                            {/* Text Content */}
                                            <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left px-4 md:px-12">
                                                <motion.h3
                                                    initial={{ opacity: 0, x: idx % 2 === 1 ? 20 : -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.6, delay: 0.2 }}
                                                    className="text-3xl md:text-[40px] font-bold text-gray-800 mb-2 leading-tight"
                                                >
                                                    {member.name}
                                                </motion.h3>
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.4, delay: 0.4 }}
                                                    className="text-[11px] font-semibold tracking-widest text-[#a8a8a8] uppercase mb-6"
                                                >
                                                    {member.role}
                                                </motion.p>
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.4, delay: 0.5 }}
                                                    className="text-[#888888] leading-relaxed text-sm md:text-[15px] font-medium max-w-md"
                                                >
                                                    {member.bio}
                                                </motion.p>
                                            </div>

                                            {/* Image Content */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className="flex-1 flex justify-center items-center w-full pt-8 md:pt-0"
                                            >
                                                <div className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px] group">
                                                    {/* Main Avatar */}
                                                    <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a] relative z-10 flex-shrink-0 transition-transform duration-700 group-hover:scale-[1.03]">
                                                        <img
                                                            src={member.imageUrl}
                                                            alt={member.name}
                                                            className="w-full h-full object-cover filter grayscale transition-all duration-700 group-hover:grayscale-0"
                                                        />
                                                    </div>

                                                    {/* Orbiting Icons */}
                                                    {/* Top Orbit -> Email */}
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.4, delay: 0.4, type: "spring" }}
                                                        className={`absolute ${idx % 2 === 1 ? 'top-[14.6%] right-[14.6%] translate-x-1/2' : 'top-[14.6%] left-[14.6%] -translate-x-1/2'} -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black flex items-center justify-center z-20 text-white shadow-sm border-[2px] md:border-[3px] border-white hover:scale-110 transition-all cursor-pointer hover:bg-zinc-800`}
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                    </motion.div>

                                                    {/* Side Orbit -> LinkedIn */}
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.4, delay: 0.5, type: "spring" }}
                                                        className={`absolute top-1/2 ${idx % 2 === 1 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black flex items-center justify-center z-20 text-white shadow-sm border-[2px] md:border-[3px] border-white hover:scale-110 transition-all cursor-pointer hover:bg-zinc-800`}
                                                    >
                                                        <span className="text-xs md:text-[13px] font-bold">in</span>
                                                    </motion.div>

                                                    {/* Bottom Orbit -> GitHub */}
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.4, delay: 0.6, type: "spring" }}
                                                        className={`absolute ${idx % 2 === 1 ? 'bottom-[14.6%] right-[14.6%] translate-x-1/2' : 'bottom-[14.6%] left-[14.6%] -translate-x-1/2'} translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black flex items-center justify-center z-20 text-white shadow-sm border-[2px] lg:border-[3px] border-white hover:scale-110 transition-all cursor-pointer hover:bg-zinc-800`}
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}
