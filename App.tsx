
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, StickyNote, Maximize2, Minimize2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Scene3D } from './components/Scene3D';
import { SlideRenderer } from './components/SlideRenderer';
import { ContentData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ContentData | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentBuildIndex, setCurrentBuildIndex] = useState(-1);
  const [direction, setDirection] = useState(0);
  
  const [showOverview, setShowOverview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('./content.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error loading content:", err));
  }, []);

  const navigateForward = useCallback(() => {
    if (!data) return;
    const currentSlide = data.slides[currentSlideIndex];
    const maxBuilds = (currentSlide.builds?.length || 0) - 1;

    if (currentBuildIndex < maxBuilds) {
      setCurrentBuildIndex(prev => prev + 1);
    } else if (currentSlideIndex < data.slides.length - 1) {
      setDirection(1);
      setCurrentSlideIndex(prev => prev + 1);
      setCurrentBuildIndex(-1);
    }
  }, [data, currentSlideIndex, currentBuildIndex]);

  const navigateBackward = useCallback(() => {
    if (!data) return;
    
    if (currentBuildIndex > -1) {
      setCurrentBuildIndex(prev => prev - 1);
    } else if (currentSlideIndex > 0) {
      setDirection(-1);
      const prevSlideIndex = currentSlideIndex - 1;
      const prevSlide = data.slides[prevSlideIndex];
      setCurrentSlideIndex(prevSlideIndex);
      setCurrentBuildIndex((prevSlide.builds?.length || 0) - 1);
    }
  }, [data, currentSlideIndex, currentBuildIndex]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showOverview && e.key !== 'Escape') return;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case ' ': e.preventDefault(); navigateForward(); break;
        case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); navigateBackward(); break;
        case 'Escape': setShowOverview(prev => !prev); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'n': case 'N': setShowNotes(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigateForward, navigateBackward, showOverview, toggleFullscreen]);

  if (!data) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050810] text-blue-500 font-sans">
      <div className="text-4xl font-black animate-pulse uppercase tracking-tighter italic mb-4">BIO_LIFE_SYSTEM_INIT...</div>
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} />
      </div>
    </div>
  );

  const currentSlide = data.slides[currentSlideIndex];

  return (
    <div ref={containerRef} className="w-full h-screen bg-[#050810] text-white overflow-hidden relative outline-none select-none" tabIndex={0}>
      
      {/* Background 3D */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
          <Scene3D slideIndex={currentSlideIndex} slideCount={data.slides.length} />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#050810_130%)] pointer-events-none" />
      
      <main className="relative z-20 h-full w-full flex items-center justify-center px-6 md:px-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlideIndex}
            custom={direction}
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(30px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(30px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            <SlideRenderer slide={currentSlide} buildIndex={currentBuildIndex} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* HUD - Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-50">
        <motion.div 
          className="h-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
          animate={{ width: `${((currentSlideIndex + 1) / data.slides.length) * 100}%` }} 
          transition={{ duration: 0.8, ease: "circOut" }} 
        />
      </div>

      {/* Controls HUD */}
      <div className="absolute bottom-8 right-8 z-50 flex items-center gap-4 opacity-40 hover:opacity-100 transition-all duration-500">
         <div className="hidden md:flex flex-col items-end mr-4">
           <span className="text-[9px] font-bold text-blue-500 tracking-[0.4em] uppercase">Phase</span>
           <span className="text-2xl font-black tracking-tighter italic">0{currentSlideIndex + 1}</span>
         </div>
         <button onClick={navigateBackward} className="p-3 glass rounded-full hover:bg-white/10 transition-all"><ChevronLeft size={20}/></button>
         <button onClick={navigateForward} className="p-3 glass rounded-full hover:bg-white/10 transition-all"><ChevronRight size={20}/></button>
         <div className="h-8 w-px bg-white/10 mx-2" />
         <button onClick={() => setShowOverview(true)} className="p-3 glass rounded-xl hover:bg-white/10 transition-all"><Grid size={18} /></button>
         <button onClick={() => setShowNotes(prev => !prev)} className={`p-3 glass rounded-xl hover:bg-white/10 transition-all ${showNotes ? 'text-blue-400 border-blue-500/50' : ''}`}><StickyNote size={18} /></button>
         <button onClick={toggleFullscreen} className="p-3 glass rounded-xl hover:bg-white/10 transition-all">{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
      </div>

      {/* Speaker Notes */}
      <AnimatePresence>
        {showNotes && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-24 right-8 z-50 w-72 p-6 glass-strong rounded-3xl shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
               <StickyNote size={12} className="text-blue-500" />
               <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Speaker Notes</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic font-light">
              {currentSlide.speakerNotes || "Iniciando secuencia estratégica..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Modal */}
      <AnimatePresence>
        {showOverview && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(30px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[100] bg-black/80 flex flex-col p-12 md:p-24 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-5xl font-black tracking-tighter uppercase italic">BIO_SYSTEM<span className="text-blue-500">.</span>MAP</h2>
              <button onClick={() => setShowOverview(false)} className="p-4 glass rounded-full"><X size={30} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.slides.map((s, idx) => (
                <button 
                  key={s.id} 
                  onClick={() => { setCurrentSlideIndex(idx); setCurrentBuildIndex(-1); setShowOverview(false); }}
                  className={`group relative text-left transition-all duration-300 rounded-3xl overflow-hidden ${currentSlideIndex === idx ? 'ring-2 ring-blue-500' : 'opacity-40 hover:opacity-100'}`}
                >
                  <div className="aspect-video p-6 glass flex flex-col justify-end">
                     <span className="text-[9px] font-black text-blue-500 uppercase mb-1">0{idx + 1}</span>
                     <h3 className="text-sm font-bold truncate uppercase">{s.title}</h3>
                     <p className="text-[10px] text-gray-400 truncate">{s.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="absolute bottom-8 left-8 z-50 opacity-10 pointer-events-none">
        <div className="text-3xl font-black tracking-tighter italic">BIO<span className="text-blue-500">.</span>LIFE</div>
      </footer>
    </div>
  );
};

export default App;
