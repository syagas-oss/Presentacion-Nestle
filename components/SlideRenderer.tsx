
import React from 'react';
import { motion, Variants } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Slide, BentoItem } from '../types';

const IconMapper: React.FC<{ name?: string; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  if (!name) return null;
  const LucideIcon = (Icons as any)[name];
  return LucideIcon ? <LucideIcon size={size} className={className} /> : null;
};

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: "spring", damping: 25 } }
};

export const SlideRenderer: React.FC<{ slide: Slide; buildIndex: number }> = ({ slide, buildIndex }) => {
  const isVisible = (index: number) => !slide.builds || index <= buildIndex;

  switch (slide.type) {
    case "BENTO_GRID":
    case "BENTO_DATA":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-7xl">
          <div className="mb-12 text-center">
            <motion.span variants={itemVariants} className="text-blue-500 font-bold tracking-[0.3em] text-xs uppercase mb-2 block">{slide.subtitle}</motion.span>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter uppercase">{slide.title}</motion.h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(slide.bentoItems || slide.stats)?.map((item: any, i) => (
              <motion.div
                key={i}
                initial="initial"
                animate={isVisible(i) ? "animate" : "initial"}
                variants={itemVariants}
                className={`${item.span === 'lg' ? 'md:col-span-2 md:row-span-2' : item.span === 'md' ? 'md:col-span-2' : 'md:col-span-1'} glass rounded-[2rem] p-8 flex flex-col justify-between group hover:border-white/30 transition-all`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-2xl text-blue-400"><IconMapper name={item.icon} /></div>
                  {item.trend && <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-1 rounded-full">+{item.trend}%</span>}
                </div>
                <div>
                  {item.value || item.v ? <div className="text-5xl font-black mb-2">{item.value || item.v}</div> : null}
                  <h3 className="text-xl font-bold mb-2">{item.title || item.l}</h3>
                  <p className="text-sm text-gray-400 font-light">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "ALERT":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-6xl">
           <div className="mb-16 text-center">
              <motion.h2 variants={itemVariants} className="text-red-500 font-bold uppercase tracking-[0.5em] text-sm mb-4">Urgent Signals</motion.h2>
              <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic">{slide.title}</motion.h1>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {slide.cards?.map((card, i) => (
                <motion.div key={i} animate={isVisible(i) ? "animate" : "initial"} variants={itemVariants} className="glass-strong rounded-[2.5rem] p-10 text-center border-red-500/20">
                   <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                      <IconMapper name={card.icon} size={30} />
                   </div>
                   <h3 className="text-2xl font-black mb-4">{card.t}</h3>
                   <p className="text-gray-400 font-light leading-relaxed">{card.d}</p>
                </motion.div>
              ))}
           </div>
        </motion.div>
      );

    case "KINETIC_BRIDGE":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="text-center">
          <motion.h1 variants={itemVariants} className="text-[15vw] leading-none font-black italic mix-blend-overlay opacity-50 uppercase tracking-tighter">
            {slide.title}
          </motion.h1>
          <motion.div variants={itemVariants} className="mt-[-4vw] glass rounded-full px-12 py-6 inline-block">
             <p className="text-2xl md:text-4xl font-light italic">"{slide.highlight}"</p>
          </motion.div>
        </motion.div>
      );

    default:
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center text-center max-w-5xl">
          <motion.div variants={itemVariants} className="mb-8 glass p-6 rounded-full text-blue-400 border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <Icons.Activity size={48} className="animate-pulse" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.8] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 uppercase italic">
            {slide.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-2xl font-bold text-blue-500 uppercase tracking-[0.8em] mb-12">
            {slide.subtitle}
          </motion.p>
          {slide.highlight && (
            <motion.div variants={itemVariants} className="glass rounded-[3rem] p-12 max-w-4xl shadow-2xl">
              <p className="text-2xl md:text-4xl font-light leading-tight italic">"{slide.highlight}"</p>
            </motion.div>
          )}
        </motion.div>
      );
  }
};
