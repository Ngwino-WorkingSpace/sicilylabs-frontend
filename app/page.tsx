"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import OnboardingGuide from './components/OnboardingGuide';
import ProjectShowcase from './components/ProjectShowcase';
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.5,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: "easeOut", delay: 0.2 }
  }
};

const PATH_D_SERVICES =
  "M 180 120 C 350 120, 350 120, 480 120 C 600 120, 750 120, 820 120 C 950 120, 950 320, 820 320 C 700 320, 600 320, 480 320 C 350 320, 150 320, 180 320 C 50 320, 50 520, 340 520 C 450 520, 500 520, 660 520";

// Cubic bezier that passes through every cx/cy
const PATH_D =
  'M 45 255 C 150 255, 200 170, 297 170 C 400 170, 455 100, 558 100 C 665 100, 720 40, 792 40';

// SVG viewBox dimensions
const VB_W = 900;
const VB_H = 340;

import Footer from './components/Footer';

interface Milestone {
  id: number;
  label: string;
  number: string;
  year: string;
  title: string;
  company: string;
  description: string;
  cx: number;
  cy: number;
}

interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  number: string;
}

export default function Home() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch('/api/milestones').then(res => res.json()),
      fetch('/api/services').then(res => res.json())
    ])
      .then(([milestonesData, servicesData]) => {
        setMilestones(Array.isArray(milestonesData) ? milestonesData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) =>
    setActiveNode(prev => (prev === id ? null : id));

  function ServiceCard({ data }: { data: Service }) {
    if (!data) return null;
    return (
      <Link href={`/services/${data.slug}`}
        className="bg-[#fcfcfc] border border-black/5 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-500 w-full max-w-[190px] relative group reveal block"
      >
        {/* Decorative bar at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-black rounded-b-sm group-hover:w-12 transition-all duration-500" />

        <div className="pt-2">
          <span className="text-[10px] font-black text-black/20 block mb-1">{data.number}</span>
          <h3 className="text-sm font-black uppercase tracking-tighter text-black mb-2 leading-tight group-hover:text-zinc-700 transition-colors">{data.title}</h3>
          <p className="text-[10px] font-medium text-black/60 leading-tight italic">{data.description}</p>
        </div>

        {/* Arrow hint */}
        <div className="absolute bottom-3 right-3 text-black/10 group-hover:text-black/40 transition-colors text-[10px] font-black">→</div>
        {/* Decorative bar at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-black/10 rounded-t-sm" />
      </Link>
    );
  }

  return (
    <div className="bg-white min-h-screen">

      {/* ── SECTION 1: COVER ── */}
      <section id="hero" className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans px-4">
        <div className="relative w-full max-w-4xl px-8 py-16 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 md:mb-10"
          >
            <span className="text-black text-xs md:text-sm font-medium tracking-tight">2024 ~ NOW</span>
          </motion.div>

          <div className="relative w-full flex flex-col items-start">
            <motion.h2
              initial="hidden"
              animate="visible"
              variants={titleVariants}
              className="text-[12vw] md:text-[10vw] font-bold text-[#e0e0e0] leading-none select-none tracking-tight"
            >
              VISUAL
            </motion.h2>

            <div className="relative -mt-[6vw] md:-mt-[5vw] flex items-baseline w-full">
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-[14vw] md:text-[12vw] font-extrabold text-black leading-none tracking-tighter z-10 uppercase flex whitespace-nowrap overflow-visible"
              >
                {"SICILYLABS".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1.4, ease: "circOut" }}
                className="flex-1 h-[4px] bg-black self-end mb-[2.5vw] ml-4 origin-left z-10"
              />
            </div>

            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-[12vw] md:text-[10vw] font-bold text-[#e0e0e0] leading-none select-none tracking-tight -mt-[4vw] md:-mt-[3vw]"
            >
              DESIGN
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="w-full flex justify-end mt-4 md:mt-0"
          >
            <span className="text-black text-xs md:text-sm font-bold tracking-wide italic">young Innovators</span>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-gray-400">
          <span className="text-[10px] uppercase tracking-[0.2em] mb-2">Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* ── SECTION 2: OUR SERVICES ── */}
      <section id="services" className="bg-white pt-16 pb-0 md:pt-24 md:pb-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">Our Services</h2>
          </div>

          <div className="relative md:min-h-[550px]">
            {/* Connecting Dashed Path (High Contrast) */}
            <div className="hidden md:block absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 550" fill="none" preserveAspectRatio="none">
                <path
                  d={PATH_D_SERVICES}
                  stroke="black"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  strokeOpacity="0.4"
                />
              </svg>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-full min-h-[550px]">
                <p className="text-zinc-400 font-medium">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[550px]">
                <p className="text-zinc-400 font-medium">No services found.</p>
              </div>
            ) : (
              /* 3-3-2 Tiered Layout (Centered) */
              <div className="flex flex-col gap-10 md:block">
                {/* Row 1: 3 cards */}
                {services[0] && <div className="md:absolute md:top-0 md:left-[80px]"><ServiceCard data={services[0]} /></div>}
                {services[1] && <div className="md:absolute md:top-0 md:left-[405px]"><ServiceCard data={services[1]} /></div>}
                {services[2] && <div className="md:absolute md:top-0 md:left-[730px]"><ServiceCard data={services[2]} /></div>}

                {/* Row 2: 3 cards */}
                {services[3] && <div className="md:absolute md:top-[200px] md:left-[80px]"><ServiceCard data={services[3]} /></div>}
                {services[4] && <div className="md:absolute md:top-[200px] md:left-[405px]"><ServiceCard data={services[4]} /></div>}
                {services[5] && <div className="md:absolute md:top-[200px] md:left-[730px]"><ServiceCard data={services[5]} /></div>}

                {/* Row 3: 2 cards */}
                {services[6] && <div className="md:absolute md:top-[400px] md:left-[240px]"><ServiceCard data={services[6]} /></div>}
                {services[7] && <div className="md:absolute md:top-[400px] md:left-[560px]"><ServiceCard data={services[7]} /></div>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ABOUT US / EVOLUTION TIMELINE ── */}
      <section id="about" className="bg-white pt-16 pb-8 md:pt-24 md:pb-12 overflow-hidden">
        <div className="relative w-full max-w-5xl mx-auto px-6 md:px-12">

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black mb-2">About Us</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-10 md:mb-16">Our Journey</h2>

          {/* Timeline container — overflow:visible so cards can pop above */}
          <div className="relative w-full" style={{ height: '360px' }}>

            {/* EVOLUTION watermark — sized to fill the box width exactly */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span
                className="font-black uppercase tracking-tighter leading-none whitespace-nowrap"
                style={{ fontSize: 'clamp(90px, 13vw, 160px)', color: 'rgba(0,0,0,0.07)' }}
              >
                EVOLUTION
              </span>
            </div>

            {/* SVG: path only — dots are HTML so click + card works cleanly */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d={PATH_D}
                stroke="black"
                strokeWidth="1.5"
                strokeOpacity="0.2"
                fill="none"
              />
            </svg>

            {/* Dots + labels + cards — HTML layers on top of SVG */}
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-zinc-400 font-medium">Loading history...</p>
              </div>
            ) : milestones.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-zinc-400 font-medium">No history found.</p>
              </div>
            ) : (
              milestones.map((m, idx) => {
                const leftPct = (m.cx / VB_W) * 100;
                const topPct = (m.cy / VB_H) * 100;
                const isActive = activeNode === m.id;
                const isRight = leftPct > 70;
                const dotSize = idx === 1 ? 18 : 10; // making the second dot slightly bigger for effect

                return (
                  <div
                    key={m.id}
                    className="absolute"
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      // Centre exactly on the path coordinate
                      transform: 'translate(-50%, -50%)',
                      zIndex: isActive ? 40 : 10,
                    }}
                  >
                    {/* ── Dot ── */}
                    <button
                      onClick={() => toggle(m.id)}
                      className="rounded-full bg-black flex items-center justify-center hover:scale-125 transition-transform duration-200 focus:outline-none"
                      style={{
                        width: dotSize,
                        height: dotSize,
                        boxShadow: isActive ? '0 0 0 3px rgba(0,0,0,0.15)' : 'none',
                      }}
                      aria-label={m.label}
                    />

                    {/* ── Label below ── */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none">
                      <p className="text-[8px] font-bold text-black tracking-widest leading-none mb-0.5">{m.number}</p>
                      <p className="text-[9px] font-bold text-black">{m.label}</p>
                    </div>

                    {/* ── Card (shows on click) ── */}
                    {isActive && (
                      <div
                        className={`absolute z-50 w-[210px] bg-white border border-black/10 rounded-2xl p-5 shadow-2xl ${isRight ? 'right-0' : 'left-0'}`}
                        style={{ bottom: '26px' }}
                      >
                        <p className="text-[9px] font-bold text-black/40 tracking-widest mb-1">{m.year}</p>
                        <h4 className="text-sm font-black leading-tight mb-0.5 text-black">{m.title}</h4>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-black mb-3">{m.company}</p>
                        <p className="text-[10px] text-black leading-relaxed">{m.description}</p>
                        <button
                          onClick={() => setActiveNode(null)}
                          className="mt-3 text-[8px] font-black uppercase tracking-widest text-black/25 hover:text-black transition-colors"
                        >
                          Close ×
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <div id="projects"><ProjectShowcase /></div>

      <OnboardingGuide />
      <Footer />
    </div>
  );
}
