
import React from 'react';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Slide, BentoItem } from '../types';

// Design Tokens 2026
const TOKENS = {
  glass: "bg-white/[0.03] border border-white/10 backdrop-blur-md",
  glassStrong: "bg-white/[0.08] border border-white/20 backdrop-blur-xl",
  glassAccent: "bg-blue-500/10 border border-blue-500/30 backdrop-blur-xl",
  glassOutline: "bg-transparent border border-white/10 backdrop-blur-sm border-dashed",
  radiusLg: "rounded-[3rem]",
  radiusMd: "rounded-[2rem]",
  radiusSm: "rounded-[1.5rem]",
  shadow: "shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]",
  textGradient: "bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40",
};

const IconMapper: React.FC<{ name?: string; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  if (!name) return null;
  const LucideIcon = (Icons as any)[name];
  return LucideIcon ? <LucideIcon size={size} className={className} aria-hidden="true" /> : null;
};

interface SlideRendererProps {
  slide: Slide;
  buildIndex: number;
}

// Subcomponent for Generic Bento Item
const BentoCard: React.FC<{ item: BentoItem; delay: number; isVisible: boolean }> = ({ item, delay, isVisible }) => {
  const getSpan = (s?: string) => {
    switch(s) {
      case 'xl': return 'md:col-span-4';
      case 'lg': return 'md:col-span-2 md:row-span-2';
      case 'md': return 'md:col-span-2';
      default: return 'md:col-span-1';
    }
  };

  const getVariant = (v?: string) => {
    switch(v) {
      case 'glassStrong': return TOKENS.glassStrong;
      case 'accent': return TOKENS.glassAccent;
      case 'outline': return TOKENS.glassOutline;
      default: return TOKENS.glass;
    }
  };

  return (
    <motion.div
      initial="initial"
      animate={isVisible ? "animate" : "initial"}
      variants={{
        initial: { opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' },
        animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", damping: 20, delay } }
      }}
      className={`${getSpan(item.span)} ${getVariant(item.variant)} ${TOKENS.radiusMd} ${TOKENS.shadow} p-8 flex flex-col justify-between group hover:border-white/30 transition-colors relative overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-4">
        {item.icon && (
          <div className="p-3 bg-white/5 rounded-2xl text-blue-400 group-hover:text-white transition-colors">
            <IconMapper name={item.icon} size={24} />
          </div>
        )}
        {item.subtitle && <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{item.subtitle}</span>}
      </div>
      
      <div className="relative z-10">
        {item.value && <div className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-white">{item.value}</div>}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
        {item.description && <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">{item.description}</p>}
      </div>

      {/* Micro-interaction: Hover Gradient */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, buildIndex }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } }
  };

  const itemVariants: Variants = {
    initial: { y: shouldReduceMotion ? 0 : 30, opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 },
    animate: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", damping: 20, stiffness: 100 } }
  };

  const isVisible = (index: number) => {
    if (!slide.builds) return true;
    return index <= buildIndex;
  };

  switch (slide.type) {
    case "KINETIC_BRIDGE":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-center text-center px-4 max-w-7xl h-full">
          <motion.div variants={itemVariants} className="mb-8">
            <span className="text-blue-500 font-bold uppercase tracking-[1em] text-xs md:text-sm">{slide.subtitle}</span>
          </motion.div>
          <motion.h1 
            variants={itemVariants} 
            className="text-[10vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase italic mix-blend-overlay"
            style={{ color: 'white' }}
          >
            {slide.title.split(' ').map((word, i) => (
              <span key={i} className="inline-block mr-4 relative">
                <span className="absolute top-0 left-0 text-blue-500 blur-lg opacity-30">{word}</span>
                <motion.span 
                  className="relative z-10 block"
                  animate={{ x: [0, 10, 0], skewX: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>
          {slide.highlight && (
            <motion.div variants={itemVariants} className="mt-16 p-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-full max-w-2xl">
              <div className="bg-black/40 backdrop-blur-xl p-8 text-center">
                <p className="text-xl md:text-3xl font-light text-gray-200 italic">"{slide.highlight}"</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      );

    case "BENTO_GRID":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-7xl px-4 flex flex-col h-full justify-center">
          <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-6">
            <div>
              <motion.span variants={itemVariants} className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-2 block">{slide.subtitle}</motion.span>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tight">{slide.title}</motion.h1>
            </div>
            <motion.div variants={itemVariants} className="hidden md:block text-right">
              <Icons.Grid className="text-white/20" size={32} />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-min gap-6">
            {slide.bentoItems?.map((item, i) => (
              <BentoCard key={i} item={item} delay={i * 0.1} isVisible={isVisible(i)} />
            ))}
          </div>
        </motion.div>
      );

    case "BENTO_DATA":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 w-full max-w-7xl px-4 items-center justify-center">
          <div className="md:col-span-4 mb-4 text-center">
            <motion.h2 variants={itemVariants} className="text-blue-500 uppercase tracking-[0.3em] font-bold text-sm mb-2">{slide.subtitle}</motion.h2>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black">{slide.title}</motion.h1>
          </div>
          {slide.stats?.map((s, i) => {
            const spanClass = s.size === 'lg' ? 'md:col-span-2 md:row-span-2' : s.size === 'md' ? 'md:col-span-2' : 'md:col-span-1';
            return (
              <motion.div 
                key={i} 
                variants={itemVariants}
                initial="initial"
                animate={isVisible(i) ? "animate" : "initial"}
                className={`${spanClass} ${TOKENS.glass} ${TOKENS.radiusMd} ${TOKENS.shadow} p-8 flex flex-col justify-between group hover:bg-white/[0.05] transition-all duration-500`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                    <IconMapper name={s.icon} size={s.size === 'lg' ? 32 : 24} />
                  </div>
                  {s.trend && (
                    <div className="flex items-center gap-1 text-xs font-mono text-green-400 bg-green-900/20 px-2 py-1 rounded-full">
                      <Icons.ArrowUpRight size={12} />
                      {s.trend}%
                    </div>
                  )}
                </div>
                <div>
                  <div className={`${s.size === 'lg' ? 'text-7xl md:text-8xl' : 'text-4xl'} font-black tracking-tighter mb-2 text-white`}>{s.v}</div>
                  <div className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">{s.l}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      );

    case "BENTO_MARKET":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col w-full max-w-7xl px-4 justify-center h-full">
          <div className="mb-12 text-center md:text-left">
            <motion.span variants={itemVariants} className="text-blue-500 font-bold tracking-widest text-xs uppercase">{slide.subtitle}</motion.span>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tight">{slide.title}</motion.h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {slide.tableData?.map((col, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants} 
                initial="initial"
                animate={isVisible(i) ? "animate" : "initial"}
                className={`${TOKENS.glass} ${TOKENS.radiusMd} p-10 flex flex-col gap-8 relative overflow-hidden group hover:bg-white/[0.05] transition-colors`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12 scale-150 pointer-events-none">
                  <IconMapper name={col.icon} size={100} />
                </div>
                <div className="flex items-center gap-4 border-b border-white/10 pb-6 z-10">
                  <div className={`p-3 rounded-xl ${i === 1 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' : 'bg-white/5 text-gray-400'}`}>
                    <IconMapper name={col.icon} size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white">{col.h}</h3>
                </div>
                <ul className="space-y-4 z-10">
                  {col.items.map((it, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-lg font-light text-gray-300">
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-blue-400 shadow-[0_0_10px_#3b82f6]' : 'bg-white/20'}`} />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "ALERT":
    case "STEPS":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl px-4 items-center h-full">
          <div className="md:col-span-3 mb-8 text-center">
            <motion.h2 variants={itemVariants} className="text-red-500 font-bold uppercase tracking-[0.3em] mb-4">{slide.subtitle}</motion.h2>
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-none">{slide.title}</motion.h1>
          </div>
          {(slide.cards || slide.items)?.map((item, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants} 
              initial="initial"
              animate={isVisible(i) ? "animate" : "initial"}
              className={`${TOKENS.glassStrong} ${TOKENS.radiusMd} ${TOKENS.shadow} p-10 text-center relative overflow-hidden group`}
            >
               {typeof item === 'string' ? (
                   <div className="flex items-center gap-4 text-2xl font-medium">
                     <span className="text-blue-500 font-mono">0{i+1}.</span>
                     <span>{item}</span>
                   </div>
               ) : (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform duration-300">
                      <IconMapper name={item.icon} size={40} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">{item.t}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light">{item.d}</p>
                </>
               )}
            </motion.div>
          ))}
        </motion.div>
      );

    default: // HERO / FINAL fallback
      return (
        <motion.article variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center text-center max-w-5xl mx-auto px-4">
          <motion.div variants={itemVariants} className="mb-10 relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
             <div className={`${TOKENS.glassStrong} p-8 rounded-full text-blue-400 relative border border-blue-500/20`}>
                <Icons.Activity size={56} className="animate-pulse" />
             </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className={`text-6xl md:text-[8rem] font-black mb-8 tracking-tighter leading-[0.9] uppercase ${TOKENS.textGradient}`}>
            {slide.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-2xl font-bold text-blue-500 uppercase tracking-[0.6em] mb-12">
            {slide.subtitle}
          </motion.p>
          {slide.highlight && (
            <motion.div variants={itemVariants} className={`${TOKENS.glass} ${TOKENS.radiusLg} ${TOKENS.shadow} p-12 max-w-4xl border-t border-white/20`}>
              <blockquote className="text-2xl md:text-4xl font-light text-gray-100 leading-tight">"{slide.highlight}"</blockquote>
            </motion.div>
          )}
        </motion.article>
      );
  }
};
