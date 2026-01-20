
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Scene3D } from './components/Scene3D';
import { SlideRenderer } from './components/SlideRenderer';
import { ContentData, Slide } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ContentData | null>(null);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch('./content.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error loading content:", err));
  }, []);

  const paginate = (newDirection: number) => {
    if (!data) return;
    const next = current + newDirection;
    if (next >= 0 && next < data.slides.length) {
      setDirection(newDirection);
      setCurrent(next);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) paginate(1);
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) paginate(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, data]);

  if (!data) return <div className="h-screen w-screen flex items-center justify-center text-blue-500 font-mono">LOADING_CONTENT...</div>;

  const slide = data.slides[current];

  return (
    <div className="w-full h-screen bg-[#050810] text-white overflow-hidden relative font-['Inter']">
      {/* Background 3D */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          <Scene3D slideIndex={current} slideCount={data.slides.length} />
        </Canvas>
      </div>

      {/* Overlay effects */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#050810_130%)] pointer-events-none" />
      
      {/* Main Content */}
      <main className="relative z-20 h-full w-full flex items-center justify-center px-4 md:px-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100, filter: 'blur(15px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: direction * -100, filter: 'blur(15px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            <SlideRenderer slide={slide} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Progress HUD */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-50">
        <motion.div 
          className="h-full bg-blue-600 shadow-[0_0_15px_#3b82f6]" 
          animate={{ width: `${((current + 1) / data.slides.length) * 100}%` }} 
          transition={{ duration: 0.8 }} 
        />
      </div>

      {/* Minimal Nav */}
      <nav className="absolute bottom-8 left-8 z-50 flex gap-2">
        <button 
          onClick={() => paginate(-1)} 
          disabled={current === 0}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-10 transition-all"
        >
          <ChevronDown className="rotate-90" size={18} />
        </button>
        <button 
          onClick={() => paginate(1)} 
          disabled={current === data.slides.length - 1}
          className="p-3 rounded-full bg-blue-600 border border-blue-500 hover:bg-blue-500 disabled:opacity-10 transition-all shadow-lg"
        >
          <ChevronDown className="-rotate-90" size={18} />
        </button>
      </nav>

      <footer className="absolute bottom-8 right-8 text-right z-50 opacity-40">
        <div className="text-3xl font-black tracking-tighter">BioLife<span className="text-blue-500">.</span></div>
      </footer>
    </div>
  );
};

export default App;
