
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Grid, StickyNote, Maximize2, Minimize2, X } from 'lucide-react';
import { Scene3D } from './components/Scene3D';
import { SlideRenderer } from './components/SlideRenderer';
import { ContentData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ContentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentBuildIndex, setCurrentBuildIndex] = useState(-1);
  const [direction, setDirection] = useState(0);
  
  const [showOverview, setShowOverview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detectar ruta base (para GitHub Pages o local)
    // El cast (import.meta as any) evita errores de TS si el tipo no está configurado
    const baseUrl = (import.meta as any).env?.BASE_URL || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    
    // La ruta correcta es public/content/content.json, que en el navegador es /content/content.json
    const contentPath = `${cleanBase}content/content.json`;

    console.log("Intentando cargar:", contentPath);

    fetch(contentPath)
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar ${contentPath}`);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        console.error("Fallo crítico:", err);
        setError(err.message);
      });
  }, []);

  const navigateForward = useCallback(() => {
    if (!data) return;
    const currentSlide = data.slides[currentSlideIndex];
    const maxBuilds = currentSlide.builds ? currentSlide.builds.length - 1 : -1;

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
      setCurrentBuildIndex(prevSlide.builds ? prevSlide.builds.length - 1 : -1);
    }
  }, [data, currentSlideIndex, currentBuildIndex]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
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

  // Loading State
  if (!data && !error) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050810] text-blue-500">
      <div className="text-4xl font-black animate-pulse uppercase tracking-tighter italic mb-4">BIO_LIFE_SYSTEM_INIT...</div>
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );

  // Error State
  if (error) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050810] text-red-500 p-8 text-center font-sans">
      <div className="text-4xl font-black uppercase tracking-tighter mb-4">SYSTEM ERROR</div>
      <p className="font-mono text-sm opacity-70 mb-2">No se pudo conectar con el sistema de datos.</p>
      <p className="font-mono text-xs opacity-50 bg-white/10 p-2 rounded">{error}</p>
    </div>
  );

  const currentSlide = data.slides[currentSlideIndex];

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen bg-[#050810] text-white overflow-hidden relative font-['Inter'] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset outline-none"
      tabIndex={0}
      aria-live="polite"
      aria-label={`Slide ${currentSlideIndex + 1} of ${data.slides.length}: ${currentSlide.title}`}
    >
      <style>{`
        .grid-bento { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
      `}</style>

      {/* Background 3D */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
          <Scene3D slideIndex={currentSlideIndex} slideCount={data.slides.length} />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#050810_120%)] pointer-events-none" />
      
      {/* Main Content */}
      <main className="relative z-20 h-full w-full flex items-center justify-center px-4 md:px-12 py-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlideIndex}
            custom={direction}
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            <SlideRenderer slide={currentSlide} buildIndex={currentBuildIndex} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* HUD - Progress */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 z-50">
        <motion.div 
          className="h-full bg-blue-600 shadow-[0_0_20px_#3b82f6]" 
          animate={{ width: `${((currentSlideIndex + 1) / data.slides.length) * 100}%` }} 
          transition={{ duration: 1, ease: "circOut" }} 
        />
      </div>

      <div className="absolute top-8 right-10 z-50 flex items-center gap-6 opacity-30 hover:opacity-100 transition-all duration-500">
         <div className="flex flex-col items-end">
           <span className="text-[10px] font-bold text-blue-500 tracking-[0.3em] uppercase mb-1">System State</span>
           <span className="text-xl font-black tracking-tighter italic">0{currentSlideIndex + 1} / 0{data.slides.length}</span>
         </div>
         <button onClick={() => setShowOverview(true)} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-blue-500" title="Overview (ESC)">
            <Grid size={22} />
         </button>
         <button onClick={() => setShowNotes(prev => !prev)} className={`p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${showNotes ? 'text-blue-400 border-blue-500/50' : ''}`} title="Speaker Notes (N)">
            <StickyNote size={22} />
         </button>
         <button onClick={toggleFullscreen} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-blue-500" title="Fullscreen (F)">
            {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
         </button>
      </div>

      {/* Custom Cursor Placeholder */}
      <motion.div 
        className="fixed w-4 h-4 bg-blue-500 rounded-full pointer-events-none z-[999] mix-blend-difference"
        style={{ top: 0, left: 0 }} 
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Speaker Notes */}
      <AnimatePresence>
        {showNotes && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-32 right-10 z-50 w-80 p-8 bg-black/60 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
               <StickyNote size={14} className="text-blue-500" />
               <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Director Notes</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-light italic">
              "{currentSlide.speakerNotes || "Awaiting transmission..."}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Modal */}
      <AnimatePresence>
        {showOverview && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col p-20 overflow-y-auto scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-20">
              <h2 className="text-6xl font-black tracking-tighter uppercase italic">Registry<span className="text-blue-500">_</span></h2>
              <button onClick={() => setShowOverview(false)} className="p-6 bg-white/5 hover:bg-white/10 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-blue-500">
                <X size={40} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {data.slides.map((s, idx) => (
                <button 
                  key={s.id} 
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setCurrentBuildIndex(-1);
                    setShowOverview(false);
                  }}
                  className={`relative group text-left transition-all duration-500 focus-visible:ring-4 focus-visible:ring-blue-500 rounded-[2rem] outline-none ${currentSlideIndex === idx ? 'scale-105 z-10' : 'opacity-40 hover:opacity-100 hover:scale-102'}`}
                >
                  <div className={`aspect-video p-8 flex flex-col justify-end bg-white/[0.03] border ${currentSlideIndex === idx ? 'border-blue-500' : 'border-white/10'} rounded-[2rem] overflow-hidden`}>
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Node 0{idx + 1}</span>
                     <h3 className="text-lg font-black text-white line-clamp-1 uppercase tracking-tight">{s.title}</h3>
                     <p className="text-xs text-gray-400 font-light truncate">{s.subtitle}</p>
                     <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="absolute bottom-10 left-10 z-50 opacity-20 pointer-events-none">
        <div className="text-4xl font-black tracking-tighter italic">BIO<span className="text-blue-500">.</span>LIFE</div>
      </footer>
    </div>
  );
};

export default App;
