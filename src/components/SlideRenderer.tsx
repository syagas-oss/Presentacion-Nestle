import React from 'react';
import { motion, Variants } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Slide } from '../types';

// Design Tokens 2026
const TOKENS = {
  glass: "bg-white/[0.03] border border-white/10 backdrop-blur-md",
  glassStrong: "bg-white/[0.08] border border-white/20 backdrop-blur-xl",
  glassAccent: "bg-blue-500/10 border border-blue-500/30 backdrop-blur-xl",
  glassGlow: "bg-blue-600/20 border border-blue-400/50 backdrop-blur-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)]",
  glassHolo: "bg-cyan-950/20 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.1)]",
  radiusMd: "rounded-[2rem]",
  shadow: "shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]",
};

const IconMapper: React.FC<{ name?: string; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  if (!name) return null;
  const LucideIcon = (Icons as any)[name];
  return LucideIcon ? <LucideIcon size={size} className={className} aria-hidden="true" /> : null;
};

interface SlideRendererProps {
  slide: Slide;
  buildIndex: number;
  staticMode?: boolean;
}

// Helper para Bento Data (Slides 2, 6, 36)
const BentoCard: React.FC<{ item: any; delay: number; isVisible: boolean; staticMode?: boolean; itemsCount?: number }> = ({ item, delay, isVisible, staticMode, itemsCount = 4 }) => {
  const getSpan = (s?: string) => {
    if (itemsCount === 3) return 'md:col-span-1'; 
    switch(s) {
      case 'xl': return 'md:col-span-3 lg:col-span-4';
      case 'lg': return 'md:col-span-2 md:row-span-2';
      case 'md': return 'md:col-span-2';
      default: return 'md:col-span-1';
    }
  };

  const getVariant = (v?: string) => {
    switch(v) {
      case 'accent': return TOKENS.glassAccent;
      case 'glassStrong': return TOKENS.glassStrong;
      case 'outline': return "border border-white/10 bg-transparent";
      default: return TOKENS.glass;
    }
  };

  const value = item.value || item.v;
  const title = item.title || item.l;

  return (
    <motion.div
      initial={staticMode ? "animate" : "initial"}
      animate={isVisible ? "animate" : "initial"}
      variants={{
        initial: { opacity: 0.1, scale: 0.95, y: 30 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 20, delay } }
      }}
      className={`${getSpan(item.span || (item.size === 'lg' ? 'lg' : item.size === 'md' ? 'md' : 'sm'))} ${getVariant(item.variant)} ${TOKENS.radiusMd} ${TOKENS.shadow} p-8 md:p-8 flex flex-col justify-center group hover:border-blue-500/50 transition-all relative overflow-hidden h-full min-h-[180px]`}
    >
      <div className="flex justify-between items-start mb-4">
        {item.icon && (
          <div className={`p-3 rounded-2xl transition-all ${item.variant === 'accent' ? 'bg-blue-500 text-white' : 'bg-white/5 text-blue-400 group-hover:text-white group-hover:bg-blue-500/20'}`}>
            <IconMapper name={item.icon} size={28} />
          </div>
        )}
        {item.trend && <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-1 rounded-full">+{item.trend}%</span>}
      </div>
      <div className="relative z-10">
        {value && <div className="text-4xl md:text-5xl font-black mb-3 text-white tracking-tight">{String(value)}</div>}
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">{String(title)}</h3>
        {item.description && <p className="text-sm text-gray-400 font-light leading-relaxed">{String(item.description)}</p>}
        {item.subtitle && <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-2">{String(item.subtitle)}</p>}
      </div>
    </motion.div>
  );
};

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, buildIndex, staticMode = false }) => {
  const containerVariants: Variants = {
    initial: { opacity: staticMode ? 1 : 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", damping: 20 } }
  };

  const isVisible = (index: number) => {
    if (staticMode) return true;
    if (!slide.builds) return true;
    return index <= buildIndex;
  };

  const slideType = (slide.type || 'HERO').toString().toUpperCase().trim();

  // --- RENDERER: EXECUTIVE SUMMARY (THE HOLOGRAPHIC DASHBOARD) ---
  if (slideType === 'EXECUTIVE_SUMMARY') {
    return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex items-center justify-center p-4 md:p-12 max-w-[1600px] mx-auto">
            
            {/* Contenedor Asimétrico */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full h-full lg:h-[80vh]">
                
                {/* Columna Izquierda: Brand & Core Vision (4 cols) */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full relative">
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-12 bg-cyan-400 shadow-[0_0_20px_cyan]" />
                            <h1 className="text-6xl font-black italic uppercase text-white leading-none tracking-tighter">Bio<span className="text-cyan-400">.</span><br/>Life</h1>
                        </div>
                        <h2 className="text-xl text-cyan-200 font-mono tracking-widest uppercase border-b border-cyan-500/30 pb-4 inline-block">
                            {slide.subtitle}
                        </h2>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className={`${TOKENS.glassHolo} p-8 rounded-[2rem] border-l-4 border-cyan-400 relative overflow-hidden group`}>
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse" />
                         <IconMapper name="Cpu" size={48} className="text-cyan-400 mb-4" />
                         <p className="text-2xl font-light text-white leading-tight italic">
                             "Nutrición personalizada, predictiva y accionable."
                         </p>
                         <p className="mt-4 text-xs text-cyan-500 font-mono">SYSTEM_STATUS: READY_FOR_DEPLOYMENT</p>
                    </motion.div>
                </div>

                {/* Columna Derecha: The Grid of Value (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full gap-4">
                    {/* Header Row */}
                    <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-4">
                        <span className="text-xs font-mono text-gray-500">INITIATIVE_SUMMARY_Protocol_v2.0</span>
                        <div className="flex gap-2">
                            {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-cyan-500/30" />)}
                        </div>
                    </div>

                    {/* The Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {slide.bentoItems?.map((item, idx) => (
                            <motion.div 
                                key={idx} 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(6, 182, 212, 0.1)" }}
                                className={`
                                    relative p-6 rounded-2xl border border-white/10 flex flex-col justify-center gap-2 group transition-all duration-300
                                    ${idx === 0 ? 'md:col-span-2 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30' : 'bg-white/[0.02]'}
                                `}
                            >
                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <IconMapper name={item.icon} size={idx === 0 ? 32 : 24} className="text-cyan-400" />
                                </div>

                                <div className="flex items-baseline gap-3">
                                    <span className="font-mono text-xs text-cyan-500">0{idx + 1}</span>
                                    <h3 className={`font-black uppercase tracking-tight ${idx === 0 ? 'text-2xl text-white' : 'text-lg text-gray-200 group-hover:text-cyan-200'}`}>
                                        {item.title}
                                    </h3>
                                </div>
                                <p className={`font-light leading-relaxed ${idx === 0 ? 'text-lg text-gray-300' : 'text-sm text-gray-400'}`}>
                                    {item.description}
                                </p>
                                
                                {idx === 0 && (
                                    <div className="absolute bottom-4 right-4 text-cyan-500/20">
                                        <Icons.Activity size={64} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
  }

  // ... REST OF THE RENDERERS (TIMELINE, PYRAMID, ETC.) REMAIN UNCHANGED ...
  // [Se mantiene el código anterior de los otros renderizadores aquí para no romper nada]
  
  if (slideType === 'TIMELINE') {
    const timelineData = (slide as any).timeline || [];
    return (
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col justify-center items-center p-4 relative z-20">
        <div className="text-center mb-16 z-30">
          <motion.span variants={itemVariants} className="text-blue-500 font-bold tracking-[0.5em] text-xs uppercase mb-3 block">{slide.subtitle}</motion.span>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white drop-shadow-2xl">{slide.title}</motion.h1>
        </div>
        <div className="w-full max-w-7xl relative min-h-[300px]">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -translate-y-1/2 w-full z-0" />
          <motion.div 
            initial={{ scaleX: 0 }} 
            animate={{ scaleX: 1 }} 
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-900 via-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.8)] -translate-y-1/2 origin-left z-0 w-full" 
          />
          <div className="flex justify-between items-center relative z-10 h-full w-full">
            {timelineData.map((item: any, i: number) => {
              const isHighlight = item.highlight === true; 
              const isTop = i % 2 === 0;
              return (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3 }}
                    className="relative flex flex-col items-center group w-32"
                >
                    <div className={`absolute bottom-10 w-48 text-center transition-all duration-500 ${isTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {isTop && (
                            <div className={`${isHighlight ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10'} backdrop-blur-md p-3 rounded-xl border`}>
                                <span className={`text-2xl font-black ${isHighlight ? 'text-cyan-400' : 'text-blue-500'} block`}>{item.year}</span>
                                <span className="text-xs font-bold uppercase text-white leading-tight block mt-1">{item.event}</span>
                            </div>
                        )}
                    </div>
                    <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center z-20 shrink-0 relative shadow-xl transition-transform duration-300 hover:scale-150 ${isHighlight ? 'bg-cyan-500 border-white scale-125' : 'bg-[#050810] border-blue-500'}`}>
                        {isHighlight && <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50" />}
                    </div>
                    <div className={`absolute top-10 w-48 text-center transition-all duration-500 ${!isTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                        {!isTop && (
                             <div className={`${isHighlight ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10'} backdrop-blur-md p-3 rounded-xl border`}>
                                <span className={`text-2xl font-black ${isHighlight ? 'text-cyan-400' : 'text-blue-500'} block`}>{item.year}</span>
                                <span className="text-xs font-bold uppercase text-white leading-tight block mt-1">{item.event}</span>
                            </div>
                        )}
                    </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  if (slideType === 'PYRAMID') {
    return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="mb-8 text-center">
                 <motion.h1 variants={itemVariants} className="text-6xl font-black italic uppercase text-white">{slide.title}</motion.h1>
                 <motion.p variants={itemVariants} className="text-blue-400 font-bold tracking-widest mt-2">{slide.subtitle}</motion.p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-5xl">
                <div className="flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
                     <motion.div variants={itemVariants} className="w-[400px] h-[100px] bg-gradient-to-r from-blue-900 to-blue-800 absolute bottom-0 clip-trapezoid flex items-center justify-center rounded-lg border border-white/10 z-10">
                        <span className="text-2xl font-black text-white/20 uppercase tracking-[1em] absolute inset-0 flex items-center justify-center">Adherencia</span>
                     </motion.div>
                     <motion.div variants={itemVariants} className="w-[300px] h-[100px] bg-gradient-to-r from-blue-700 to-blue-600 absolute bottom-[110px] flex items-center justify-center rounded-lg border border-white/10 z-20 shadow-2xl">
                         <span className="text-2xl font-black text-white/30 uppercase tracking-[0.5em] absolute inset-0 flex items-center justify-center">Decisión</span>
                     </motion.div>
                     <motion.div variants={itemVariants} className="w-[200px] h-[100px] bg-gradient-to-r from-cyan-500 to-blue-400 absolute bottom-[220px] flex items-center justify-center rounded-lg border border-white/10 z-30 shadow-[0_0_50px_rgba(34,211,238,0.4)]">
                         <IconMapper name="ShieldCheck" size={40} className="text-white" />
                     </motion.div>
                </div>
                <div className="flex-1 space-y-8">
                    {slide.bentoItems?.map((item, idx) => (
                        <motion.div key={idx} variants={itemVariants} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                            <div className={`p-4 rounded-full ${idx===0 ? 'bg-cyan-500 text-black' : 'bg-blue-900/50 text-blue-400'}`}>
                                <IconMapper name={item.icon} size={24} />
                            </div>
                            <div>
                                <h3 className={`text-2xl font-black uppercase ${idx===0 ? 'text-cyan-400' : 'text-white'}`}>{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
  }

  if (slideType === 'CIRCULAR') {
    return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col items-center justify-center relative">
             <motion.h1 variants={itemVariants} className="text-5xl font-black italic uppercase text-center mb-12">{slide.title}</motion.h1>
             <div className="relative w-[600px] h-[600px] flex items-center justify-center">
                 <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
                 <div className="absolute inset-10 border border-blue-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                 {slide.bentoItems?.slice(0, 4).map((item, idx) => {
                     const angle = (idx * 90) * (Math.PI / 180);
                     const radius = 240;
                     const x = Math.cos(angle) * radius;
                     const y = Math.sin(angle) * radius;
                     return (
                         <motion.div 
                            key={idx}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.2 }}
                            style={{ position: 'absolute', x, y }}
                            className={`${TOKENS.glassStrong} w-40 h-40 rounded-full flex flex-col items-center justify-center text-center p-4 border border-blue-500/30 z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
                         >
                             <IconMapper name={item.icon} className="mb-2 text-blue-400" />
                             <h3 className="font-bold text-sm uppercase">{item.title}</h3>
                             <p className="text-[10px] text-gray-400 mt-1">{item.description}</p>
                             <Icons.ArrowRight className="absolute -right-8 top-1/2 -translate-y-1/2 text-white/10 rotate-45 transform" size={30}/>
                         </motion.div>
                     )
                 })}
                 <div className="absolute z-10 text-center">
                     <div className="w-48 h-80 bg-black border-4 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-b-xl z-20"/>
                         <div className="flex-1 bg-gradient-to-b from-blue-900 to-black p-4 flex flex-col items-center justify-center">
                             <Icons.Activity className="text-cyan-400 mb-2 animate-pulse" size={40} />
                             <span className="text-white font-bold text-lg">BioScanner</span>
                         </div>
                     </div>
                 </div>
             </div>
        </motion.div>
    )
  }

  if (slideType === 'FUNNEL') {
    return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex items-center justify-center gap-12 max-w-7xl mx-auto px-4">
             <div className="flex-1 flex flex-col gap-6">
                 <motion.h1 variants={itemVariants} className="text-6xl font-black italic uppercase text-white mb-8">{slide.title}</motion.h1>
                 {slide.bentoItems?.filter(i => i.span === 'md').map((item, idx) => (
                     <motion.div key={idx} variants={itemVariants} className={`${TOKENS.glass} p-6 rounded-2xl border-l-4 border-blue-500`}>
                         <div className="flex items-center gap-3 mb-2">
                             <IconMapper name={item.icon} className="text-blue-400" />
                             <h3 className="font-bold text-xl uppercase">{item.title}</h3>
                         </div>
                         <p className="text-sm text-gray-300">{item.subtitle} | {item.description}</p>
                     </motion.div>
                 ))}
             </div>
             <div className="flex-1 flex flex-col items-center justify-center relative">
                 {['Adquisición', 'Activación', 'Retención', 'Suscripción'].map((step, idx) => {
                     const width = 100 - (idx * 20);
                     const opacity = 1 - (idx * 0.15);
                     return (
                         <motion.div 
                            key={idx}
                            variants={itemVariants}
                            className="h-24 mb-2 flex items-center justify-center rounded-2xl relative shadow-lg backdrop-blur-md border border-white/10"
                            style={{ 
                                width: `${width}%`, 
                                backgroundColor: `rgba(59, 130, 246, ${opacity * 0.3})`,
                            }}
                         >
                             <span className="text-xl font-black uppercase tracking-widest text-white">{step}</span>
                         </motion.div>
                     )
                 })}
                 <Icons.ArrowDown className="text-blue-500 mt-4 animate-bounce" size={40} />
             </div>
        </motion.div>
    )
  }

  if (slideType === 'ROADMAP') {
    return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col items-center justify-center px-4">
            <motion.h1 variants={itemVariants} className="text-6xl font-black italic uppercase text-white mb-20">{slide.title}</motion.h1>
            <div className="relative w-full max-w-6xl">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-800 -translate-y-1/2 rounded-full" />
                <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: '100%' }} 
                    transition={{ duration: 1.5 }}
                    className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-600 to-cyan-400 -translate-y-1/2 rounded-full" 
                />
                <div className="flex justify-between relative z-10">
                    {slide.items?.map((item: any, i: number) => (
                        <motion.div 
                            key={i} 
                            variants={itemVariants}
                            className="flex flex-col items-center group"
                        >
                            <div className="w-8 h-8 bg-[#050810] border-4 border-cyan-400 rounded-full mb-6 z-20 group-hover:scale-125 transition-transform shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                            <div className={`${TOKENS.glassStrong} p-6 rounded-2xl w-64 text-center border-t-4 border-blue-500 relative group-hover:-translate-y-2 transition-transform duration-300`}>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-white/20" />
                                <div className="flex justify-center mb-3">
                                    <IconMapper name={item.icon} size={32} className="text-blue-400" />
                                </div>
                                <h3 className="text-xl font-black uppercase text-white mb-2">{item.t}</h3>
                                <p className="text-sm text-gray-400">{item.d}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
  }

  if (slideType === 'CARDS_CHOICE') {
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col items-center justify-center px-4">
             <div className="mb-12 text-center">
                <motion.h1 variants={itemVariants} className="text-6xl font-black italic uppercase text-white">{slide.title}</motion.h1>
                <motion.p variants={itemVariants} className="text-blue-500 font-mono mt-2">{slide.subtitle}</motion.p>
             </div>
             <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl h-[50vh]">
                 {slide.items?.map((item: any, i: number) => {
                     const isHighlight = slide.id === 17 && i === 2;
                     const isDimmed = slide.id === 17 && i !== 2;
                     return (
                         <motion.div 
                            key={i}
                            variants={itemVariants}
                            className={`flex-1 relative rounded-[2rem] overflow-hidden group transition-all duration-500
                                ${isHighlight ? 'flex-[1.5] scale-105 z-10 border-2 border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.3)]' : ''}
                                ${isDimmed ? 'opacity-30 blur-sm scale-95 grayscale' : 'hover:flex-[1.2]'}
                                ${TOKENS.glassStrong}
                            `}
                         >
                             <div className={`absolute inset-0 bg-gradient-to-b ${isHighlight ? 'from-cyan-900/50 to-blue-900/80' : 'from-gray-900/50 to-black/80'} opacity-80`} />
                             <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                                 <motion.div 
                                    className={`p-6 rounded-full mb-6 ${isHighlight ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-400'}`}
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                 >
                                     <IconMapper name={item.icon} size={isHighlight ? 48 : 32} />
                                 </motion.div>
                                 <h2 className={`text-2xl md:text-3xl font-black uppercase mb-4 leading-none ${isHighlight ? 'text-white' : 'text-gray-300'}`}>{item.t}</h2>
                                 <p className={`text-sm ${isHighlight ? 'text-cyan-100 font-bold' : 'text-gray-500'}`}>{item.d}</p>
                                 {isHighlight && (
                                     <div className="mt-8 px-4 py-2 bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-full">
                                         Opción Estratégica
                                     </div>
                                 )}
                             </div>
                         </motion.div>
                     )
                 })}
             </div>
        </motion.div>
      )
  }

  if (slideType === 'SQUADS') {
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col items-center justify-center px-4">
             <motion.h1 variants={itemVariants} className="text-7xl font-black italic uppercase text-white mb-2">{slide.title}</motion.h1>
             <motion.p variants={itemVariants} className="text-xl text-blue-500 mb-12 font-light tracking-[0.5em]">{slide.subtitle}</motion.p>
             <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
                 {slide.bentoItems?.map((item, i) => (
                     <motion.div 
                        key={i}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -10 }}
                        className={`${TOKENS.glassStrong} w-64 h-64 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-6 border-2 border-white/5 hover:border-blue-500/50 relative overflow-hidden group`}
                     >
                         <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         <IconMapper name={item.icon} size={40} className="text-blue-400 mb-4 group-hover:text-white transition-colors" />
                         <h3 className="text-xl font-bold uppercase text-white leading-tight">{item.title}</h3>
                     </motion.div>
                 ))}
             </div>
        </motion.div>
      )
  }

  if (slideType === 'ECONOMIC') {
      return (
         <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col items-center justify-center px-4 max-w-7xl mx-auto">
             <motion.h1 variants={itemVariants} className="text-5xl font-black italic uppercase text-white mb-12">{slide.title}</motion.h1>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                 <motion.div variants={itemVariants} className={`${TOKENS.glassGlow} p-8 rounded-3xl flex items-center gap-6`}>
                     <div className="p-4 bg-green-500/20 rounded-full text-green-400"><IconMapper name="DollarSign" size={32}/></div>
                     <div>
                         <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">Fuentes de</h3>
                         <p className="text-2xl font-black text-white">Suscripción + Cross-sell</p>
                     </div>
                 </motion.div>
                 <motion.div variants={itemVariants} className={`${TOKENS.glassStrong} p-8 rounded-3xl flex items-center gap-6 border-red-500/20`}>
                     <div className="p-4 bg-red-500/20 rounded-full text-red-400"><IconMapper name="Ban" size={32}/></div>
                     <div>
                         <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">No Hacemos</h3>
                         <p className="text-2xl font-black text-white">Venta de datos personales</p>
                     </div>
                 </motion.div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                 {['Margen Saludable', 'LTV / CAC > 3', 'Churn < 5%'].map((metric, i) => (
                     <motion.div key={i} variants={itemVariants} className={`${TOKENS.glass} p-6 rounded-2xl text-center border-t-2 border-blue-500/50`}>
                         <p className="text-xl font-bold text-gray-200">{metric}</p>
                     </motion.div>
                 ))}
             </div>
         </motion.div>
      )
  }

    if (slideType === 'QUADRANT') {
        return (
            <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col items-center justify-center px-4 max-w-6xl mx-auto">
                <motion.h1 variants={itemVariants} className="text-5xl font-black italic uppercase text-white mb-12">{slide.title}</motion.h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[60vh]">
                    {slide.bentoItems?.map((item, i) => (
                        <motion.div 
                            key={i} 
                            variants={itemVariants} 
                            className={`p-8 rounded-3xl flex flex-col justify-start relative overflow-hidden group border border-white/5 hover:border-blue-500/30 transition-all ${item.variant === 'accent' ? 'bg-blue-900/20' : TOKENS.glassStrong}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-2xl font-black ${item.variant === 'outline' ? 'text-red-400' : 'text-blue-400'}`}>{item.title}</h3>
                                <IconMapper name={item.icon} size={24} className="opacity-50" />
                            </div>
                            <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">{item.description}</p>
                            <div className={`absolute bottom-0 right-0 p-20 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity ${item.variant==='outline' ? 'bg-red-600' : 'bg-blue-600'}`} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        )
    }

  if (slideType === 'BENTO_DATA' || slideType === 'BENTO_GRID') {
    const items = slide.stats || slide.bentoItems || [];
    const gridClass = items.length === 3 
        ? "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl" 
        : "grid grid-cols-1 md:grid-cols-4 gap-4 w-full";

    return (
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-7xl px-4 flex flex-col h-full items-center justify-center mx-auto">
        <div className="mb-8 text-center w-full">
          <motion.span variants={itemVariants} className="text-blue-500 font-bold tracking-[0.4em] text-xs uppercase mb-2 block">{slide.subtitle}</motion.span>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-8">{slide.title}</motion.h1>
        </div>
        <div className={`${gridClass} h-fit max-h-[70vh] overflow-y-auto pb-10`}>
          {items.map((item: any, i: number) => (
            <BentoCard key={i} item={item} delay={i * 0.1} isVisible={isVisible(i)} staticMode={staticMode} itemsCount={items.length} />
          ))}
        </div>
      </motion.div>
    );
  }

  if (slideType === 'BENTO_MARKET') {
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-7xl px-4 flex flex-col justify-center h-full mx-auto">
          <div className="mb-12 text-center">
            <motion.span variants={itemVariants} className="text-blue-500 font-bold tracking-widest text-xs uppercase">{slide.subtitle}</motion.span>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">{slide.title}</motion.h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {slide.tableData?.map((col, i) => (
              <motion.div key={i} variants={itemVariants} animate={isVisible(i) ? "animate" : "initial"} className={`${TOKENS.glassStrong} ${TOKENS.radiusMd} p-8 flex flex-col gap-6 relative overflow-hidden`}>
                {i===2 && <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />}
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                   <IconMapper name={col.icon} size={28} className={i===1 ? "text-blue-500" : (i===2 ? "text-cyan-400" : "text-gray-400")} />
                   <h3 className={`text-xl font-black uppercase ${i===2 ? 'text-white' : 'text-gray-400'}`}>{col.h}</h3>
                </div>
                <ul className="space-y-4">
                  {col.items.map((it, idx) => {
                      const icons = ["Activity", "Award", "Zap", "Lock", "Repeat"];
                      const iconName = icons[idx % icons.length];
                      return (
                        <li key={idx} className="flex items-center gap-3 text-sm md:text-base text-gray-300">
                          <IconMapper name={iconName} size={16} className={i===2 ? "text-cyan-400" : "text-gray-600"} />
                          {String(it)}
                        </li>
                      )
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
  }

      if (slideType === 'ALERT' || slideType === 'STEPS') {
        return (
            <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-7xl px-4 flex flex-col justify-center h-full mx-auto">
            <div className="mb-12 text-center">
                <motion.h2 variants={itemVariants} className={`font-bold uppercase tracking-[0.5em] mb-4 text-sm ${slideType === 'ALERT' ? 'text-red-500' : 'text-blue-500'}`}>{slide.subtitle}</motion.h2>
                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">{slide.title}</motion.h1>
            </div>
            <div className={`grid gap-6 ${(slide.cards || slide.items)?.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                {(slide.cards || slide.items)?.map((item: any, i: number) => {
                    const isString = typeof item === 'string';
                    return (
                        <motion.div key={i} animate={isVisible(i) ? "animate" : "initial"} variants={itemVariants} className={`${TOKENS.glassStrong} rounded-[2rem] p-8 text-center border border-white/10 h-full flex flex-col justify-center items-center group hover:border-blue-500/30 transition-all`}>
                        {isString ? (
                            <div className="text-2xl font-bold flex flex-col gap-4">
                                <span className="text-5xl font-black text-blue-500/20 group-hover:text-blue-500 transition-colors">0{i+1}</span>
                                {item}
                            </div>
                        ) : (
                            <>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${slideType === 'ALERT' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                <IconMapper name={item.icon} size={28} />
                            </div>
                            <h3 className="text-xl font-black mb-2 leading-tight">{item.t}</h3>
                            <p className="text-sm text-gray-400 font-light">{item.d}</p>
                            </>
                        )}
                        </motion.div>
                    );
                })}
            </div>
            </motion.div>
        );
    }
  
  if (slideType === 'VIDEO') {
        return (
            <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full h-full flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 z-0 bg-blue-500/5 animate-pulse" />
                <div className={`${TOKENS.glassStrong} p-20 rounded-[3rem] border border-blue-500/30 flex flex-col items-center justify-center text-center max-w-4xl relative z-10`}>
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(37,99,235,0.5)] cursor-pointer hover:scale-110 transition-transform">
                        <Icons.Play size={40} className="ml-2 text-white" />
                    </div>
                    <h1 className="text-6xl font-black italic uppercase mb-4 tracking-tighter">BioLife Demo</h1>
                    <p className="text-xl text-blue-400 font-mono">FULLSCREEN_PLAYBACK_SEQUENCE_INIT</p>
                </div>
            </motion.div>
        );
  }

  if (slideType === 'KINETIC_BRIDGE') {
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-center text-center px-4 max-w-7xl h-full w-full mx-auto relative">
          <motion.h1 variants={itemVariants} className="text-[12vw] font-black leading-none tracking-tighter uppercase italic text-white/5 absolute select-none pointer-events-none">{slide.title}</motion.h1>
          <div className="relative z-10 max-w-4xl">
             <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic mb-8 drop-shadow-2xl">{slide.title}</motion.h2>
             {slide.highlight && (
                <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border-l-4 border-blue-500">
                  <p className="text-2xl md:text-4xl font-light italic leading-tight">"{slide.highlight}"</p>
                </motion.div>
             )}
          </div>
        </motion.div>
      );
  }

      return (
        <motion.article variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center text-center max-w-6xl mx-auto px-4 justify-center h-full relative z-10">
          <motion.div variants={itemVariants} className="mb-8 relative">
             {slideType === 'HERO_GLOW' ? (
                 <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 animate-pulse" />
             ) : null}
             <div className={`${TOKENS.glassStrong} p-6 rounded-full text-blue-400 relative border border-blue-500/20`}>
                <Icons.Activity size={48} className={staticMode ? "" : "animate-pulse"} />
             </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className={`${slide.id === 12 ? 'text-[6rem] text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]' : 'text-5xl md:text-[7rem] text-white'} font-black mb-6 tracking-tighter leading-[0.9] uppercase italic drop-shadow-2xl`}>
            {slide.title}
          </motion.h1>

          {slide.subtitle && (
            <motion.div variants={itemVariants} className={`${TOKENS.glassAccent} px-8 py-3 rounded-full`}>
                <p className="text-lg md:text-xl font-bold text-blue-400 uppercase tracking-[0.3em]">
                    {slide.subtitle}
                </p>
            </motion.div>
          )}
          {slide.highlight && (
             <motion.p variants={itemVariants} className={`mt-8 max-w-2xl font-light text-lg ${slide.id === 12 ? 'text-2xl text-white font-bold tracking-widest' : 'text-gray-400'}`}>{slide.highlight}</motion.p>
          )}
        </motion.article>
      );
};
