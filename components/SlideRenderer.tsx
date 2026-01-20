
import React from 'react';
import { motion, Variants } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Slide } from '../types';

const IconMapper: React.FC<{ name?: string; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  if (!name) return null;
  const LucideIcon = (Icons as any)[name];
  return LucideIcon ? <LucideIcon size={size} className={className} /> : null;
};

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants: Variants = {
  initial: { y: 40, opacity: 0, scale: 0.95 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", damping: 15 } }
};

export const SlideRenderer: React.FC<{ slide: Slide }> = ({ slide }) => {
  switch (slide.type) {
    case "HERO":
    case "HERO_GLOW":
    case "HERO_FINAL":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center text-center max-w-5xl mx-auto px-4">
          <motion.div variants={itemVariants} className="mb-8 p-6 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Icons.HeartPulse size={48} className="animate-pulse" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            {slide.title}
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-xl md:text-3xl font-light text-blue-400 uppercase tracking-[0.4em] mb-12 opacity-80">
            {slide.subtitle}
          </motion.h2>
          {slide.highlight && (
            <motion.div variants={itemVariants} className="p-10 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[3rem] shadow-2xl">
              <p className="text-2xl md:text-4xl font-medium italic text-gray-100">"{slide.highlight}"</p>
            </motion.div>
          )}
        </motion.div>
      );

    case "DATA":
    case "DATA_FOCUS":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-6xl px-4 flex flex-col items-center">
          <motion.h2 variants={itemVariants} className="text-center text-3xl font-black text-blue-500 uppercase tracking-[0.3em] mb-16">{slide.subtitle}</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {slide.stats?.map((s, i) => (
              <motion.div key={i} variants={itemVariants} className="p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl text-center flex flex-col items-center">
                {s.icon && <IconMapper name={s.icon} size={40} className="text-blue-500 mb-6 opacity-50" />}
                <div className="text-6xl font-black text-white mb-4 tracking-tighter">{s.v}</div>
                <div className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em]">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "TABLE_3COL":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col w-full max-w-7xl px-4">
          <div className="mb-12">
            <motion.h2 variants={itemVariants} className="text-red-500 font-black text-2xl uppercase tracking-[0.3em] mb-4">{slide.subtitle}</motion.h2>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter">{slide.title}</motion.h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {slide.tableData?.map((col, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl group hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <IconMapper name={col.icon} className="text-blue-400" />
                  <div className="text-2xl font-black uppercase text-white group-hover:text-blue-400">{col.h}</div>
                </div>
                <div className="space-y-4">
                  {col.items.map((text, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500/30" />
                      <span className="text-xl font-medium text-gray-300">{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    default:
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-6xl px-6">
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="w-20 h-20 bg-blue-500/20 rounded-[1.5rem] flex items-center justify-center text-blue-400 border border-white/5">
              <Icons.Activity size={40} />
            </motion.div>
            <div className="space-y-6">
              <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">{slide.title}</motion.h1>
              <motion.p variants={itemVariants} className="text-xl md:text-3xl text-gray-400 font-light">{slide.subtitle}</motion.p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {(slide.cards || slide.items)?.map((item: any, i: number) => (
              <motion.div key={i} variants={itemVariants} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl hover:border-blue-500/50 transition-all">
                {typeof item === 'string' ? (
                  <div className="flex items-center gap-6 text-2xl font-medium">
                    <Icons.CheckCircle2 className="text-blue-500" size={28} />
                    <span>{item}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="text-blue-400 font-black text-2xl uppercase tracking-[0.1em]">{item.t}</div>
                    <div className="text-gray-400 text-lg font-light">{item.d}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
  }
};
