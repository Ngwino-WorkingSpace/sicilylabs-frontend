"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  number: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 px-8 max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-4"
        >
          What We Build
        </motion.p>
        <div className="flex items-end justify-between mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[13vw] md:text-[7vw] font-black uppercase tracking-tighter leading-none text-black"
          >
            Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[11px] font-bold text-black/30 uppercase tracking-widest max-w-[160px] text-right hidden md:block"
          >
            Click a service to explore our methodology
          </motion.p>
        </div>

        {/* Service List */}
        <div className="flex flex-col">
          {loading ? (
            <p className="text-center text-zinc-400 text-sm py-12">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-center text-zinc-400 text-sm py-12">No services available yet.</p>
          ) : (
            services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * i }}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex items-center gap-6 py-5 border-b border-zinc-100 hover:border-zinc-300 transition-colors"
                >
                  <span className="text-[11px] font-black text-zinc-300 w-6 shrink-0">{s.number}</span>
                  <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-black group-hover:translate-x-2 transition-transform duration-300">
                    {s.title}
                  </h2>
                  <p className="text-[11px] font-medium text-zinc-400 hidden md:block flex-1">{s.description}</p>
                  <svg
                    className="w-4 h-4 text-zinc-200 group-hover:text-black group-hover:translate-x-1 transition-all duration-300 shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
