import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Globe, TrendingUp, Users, HeartPulse, PlayCircle, Activity,
  ChevronDown, CheckCircle2, RotateCw, Smartphone, AlertTriangle, XCircle,
  Zap
} from 'lucide-react';
import * as THREE from 'three';

const THEME = {
  blue: "#3B82F6",
  gold: "#F59E0B",
  red: "#EF4444",
  cyan: "#22D3EE",
  white: "#FFFFFF",
  deep: "#050810"
};

const SLIDES = [
  { id: 1, type: "HERO", title: "Nestlé Nutrición", subtitle: "Quiénes somos", description: "Unidad líder en salud y nutrición con base científica.", highlight: "Ciencia aplicada + Capacidad de escala global" },
  { id: 2, type: "DATA", title: "Escala Real", subtitle: "Nestlé", stats: [{v: "185", l: "Países"}, {v: "CHF 91B", l: "Ventas"}, {v: "277k", l: "Talento"}] },
  { id: 3, type: "TIMELINE_ACTIVE", title: "Nuestra Historia", subtitle: "Evolución", timeline: [{y: "1866", l: "Inicios"}, {y: "1980", l: "Expansión global"}, {y: "2011", l: "NHS Fundada"}] },
  { id: 4, type: "LIST", title: "Nestlé Health Science", subtitle: "Health & Nutrition continuum", items: ["Enfoque en salud", "Ciencia aplicada + productos + servicios", "Capacidad de escala global"] },
  { id: 5, type: "DATA_FOCUS", title: "NHS en Cifras", subtitle: "Impacto Actual NHS", stats: [{v: "150", l: "Países", icon: <Globe />}, {v: "$7.6B", l: "Ventas USD", icon: <TrendingUp />}, {v: "11k+", l: "Talento", icon: <Users />}] },
  { id: 6, type: "SPLIT_INTERACTIVE", title: "Salud Digital = Caos", subtitle: "Señales", description: "68% de usuarios buscan salud online sin guía. La demanda es masiva pero desordenada.", flipBullets: [{ front: "Búsqueda online de salud", back: "Hábito Instalado" }, { front: "Decisiones diarias", back: "Sin guía clínica" }, { front: "Creciente interés", back: "En prevención" }] },
  { id: 7, type: "ALERT", title: "3 Frenos Críticos", subtitle: "En una encuesta europea, la preocupación por uso indebido de datos fue del 72%", cards: [{t: "Info-xicación", d: "Exceso de ruido"}, {t: "Desconfianza", d: "Fake news de salud"}, {t: "Privacidad", d: "Miedo al uso de datos"}] },
  { id: 8, type: "TABLE_3COL", title: "El mercado está lleno…", subtitle: "Competencia", description: "70% de abandono en apps de salud. El mercado mide, pero no retiene.", tableData: [{ h: "Players", items: ["Ecosistemas tech", "Apps de nutrición"], icon: <Smartphone size={24} className="text-blue-400"/> }, { h: "Éxito", items: ["Medición", "Registro"], icon: <CheckCircle2 size={24} className="text-green-400"/> }, { h: "Fallo", items: ["Hábitos", "Abandono"], icon: <XCircle size={24} className="text-red-400"/> }] },
  { id: 9, type: "HERO", title: "El Hueco", subtitle: "Oportunidad", highlight: "Ser la capa de decisión confiable entre el dato y el hábito." },
  { id: 10, type: "DAFO", title: "DAFO 2026", subtitle: "Estrategia", dafo: {F: "Escala/Ciencia", D: "B2C Directo", O: "NaaS/Suscripción", A: "Big Tech"} },
  { id: 11, type: "GRID", title: "Escenarios", subtitle: "Caminos", cards: [{t: "Marketplace", d: "Transacción"}, {t: "Certificación", d: "Autoridad"}, {t: "BioLife NaaS", d: "Relación"}] },
  { id: 12, type: "LIST", title: "Criterios", subtitle: "Selección", items: ["Impacto", "Diferencia", "Viabilidad", "Confianza", "Economía"] },
  { id: 13, type: "HERO_GLOW", title: "BioLife", subtitle: "La Propuesta", highlight: "Plan personal, claro y sostenible para la salud diaria." },
  { id: 14, type: "DATA_FOCUS_RED", title: "Nuestra Ventaja", subtitle: "Estrategia", stats: [{v: "70%", l: "Tasa de abandono hoy"}, {v: "12.99€", l: "Precio Competitivo"}] },
  { id: 15, type: "SPLIT", title: "Valor Real", subtitle: "Suscripción", bullets: ["Claridad Ejecutable", "Trazabilidad Total", "Ajuste Semanal"] },
  { id: 16, type: "TIMELINE_H", title: "Roadmap", subtitle: "Crecimiento", phases: ["MVP", "Integración", "Escala"] },
  { id: 17, type: "LIST_ICON", title: "MVP Release", subtitle: "Foco", items: ["Onboarding", "Plan 7D", "Weekly Check-in", "Métricas"] },
  { id: 18, type: "VIDEO_LAYOUT", title: "Demo BioLife", subtitle: "90 Segundos", video_desc: "Experiencia fluida: del síntoma a la acción." },
  { id: 19, type: "STACK", title: "Arquitectura", subtitle: "Capas Tech", layers: ["Experiencia", "Inteligencia", "Datos", "Trust Layer"] },
  { id: 20, type: "ALERT", title: "Data Trust", subtitle: "Gobierno", cards: [{t: "Consentimiento", d: "Granular"}, {t: "Minimización", d: "Solo lo útil"}, {t: "Auditoría", d: "Trazable"}] },
  { id: 21, type: "GRID", title: "Legal by Design", subtitle: "Compliance", cards: [{t: "GDPR", d: "Core"}, {t: "Ethics", d: "Claims"}, {t: "Security", d: "Soc2"}] },
  { id: 22, type: "STEPS", title: "Operativa", subtitle: "Procesos", steps: ["1. Capture", "2. Analyze", "3. Plan", "4. Follow-up"] },
  { id: 23, type: "SPLIT", title: "Targeting", subtitle: "Marketing", bullets: ["25-45 Rendimiento", "35-55 Bienestar", "Paid & Content"] },
  { id: 24, type: "DASHBOARD", title: "North Star", subtitle: "KPIs", metrics: [{l: "Adherencia", v: "80%"}, {l: "Retention", v: "D30"}, {l: "LTV/CAC", v: "3.5x"}] },
  { id: 25, type: "GRID", title: "BioLife Squads", subtitle: "Talento", cards: [{t: "Clinical", d: "Ciencia"}, {t: "Product", d: "UX/Dev"}, {t: "Trust", d: "Legal/Data"}] },
  { id: 26, type: "HERO", title: "ESG & Nestlé", subtitle: "Propósito", highlight: "Salud social, privacidad individual y eficiencia ambiental." },
  { id: 27, type: "DATA", title: "Economía", subtitle: "Suscripción", stats: [{v: "12,99€", l: "MRR Unit"}, {v: "0€", l: "Venta Datos"}, {v: "High", l: "Margin"}] },
  { id: 28, type: "HERO_FINAL", title: "BioLife 2026", subtitle: "Confianza • Decisión • Adherencia", highlight: "Tenemos la escala. Tenemos la ciencia. Vamos a ejecutar." }
];

function Scene3D({ slideIndex }) {
  const points = useRef<THREE.Points>(null!);
  const count = 6000;
  const { mouse } = useThree();

  const formations = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const box = new Float32Array(count * 3);
    const plane = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = r * Math.cos(phi);

      box[i * 3] = (Math.random() - 0.5) * 12;
      box[i * 3 + 1] = (Math.random() - 0.5) * 12;
      box[i * 3 + 2] = (Math.random() - 0.5) * 4;

      plane[i * 3] = (Math.random() - 0.5) * 25;
      plane[i * 3 + 1] = (Math.random() - 0.5) * 15;
      plane[i * 3 + 2] = -5;

      colors[i*3] = 1; colors[i*3+1] = 1; colors[i*3+2] = 1;
    }
    return { sphere, box, plane, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    const cols = points.current.geometry.attributes.color.array as Float32Array;
    
    let formation;
    if (slideIndex <= 5 || slideIndex >= 26) formation = formations.sphere;
    else if (slideIndex >= 6 && slideIndex <= 10) formation = formations.box;
    else formation = formations.plane;

    const targetColor = new THREE.Color();
    if (slideIndex < 5) targetColor.set(THEME.blue);
    else if (slideIndex >= 5 && slideIndex <= 8) targetColor.set(THEME.red);
    else if (slideIndex >= 23) targetColor.set(THEME.gold);
    else targetColor.set(THEME.cyan);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += (formation[i3] - pos[i3]) * 0.05 + Math.sin(time + i) * 0.005;
      pos[i3+1] += (formation[i3+1] - pos[i3+1]) * 0.05 + Math.cos(time + i) * 0.005;
      pos[i3+2] += (formation[i3+2] - pos[i3+2]) * 0.05;

      cols[i3] += (targetColor.r - cols[i3]) * 0.02;
      cols[i3+1] += (targetColor.g - cols[i3+1]) * 0.02;
      cols[i3+2] += (targetColor.b - cols[i3+2]) * 0.02;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    
    state.camera.position.x += (mouse.x * 2 - state.camera.position.x) * 0.02;
    state.camera.position.y += (mouse.y * 2 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);

    points.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={formations.sphere} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={formations.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

const FlipBullet = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="perspective-1000 w-full cursor-pointer h-20 md:h-24" onMouseEnter={() => setIsFlipped(true)} onMouseLeave={() => setIsFlipped(false)}>
      <motion.div className="relative w-full h-full transition-all duration-700 preserve-3d" animate={{ rotateX: isFlipped ? 180 : 0 }}>
        <div className="absolute inset-0 backface-hidden flex items-center gap-6 p-6 md:p-8 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-2xl group hover:border-blue-500/40 transition-all">
          <CheckCircle2 className="text-blue-500 flex-shrink-0" size={24} /> 
          <span className="text-lg md:text-xl lg:text-2xl font-medium text-gray-300 group-hover:text-white transition-colors leading-tight">{front}</span>
          <RotateCw size={14} className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity text-blue-400" />
        </div>
        <div className="absolute inset-0 backface-hidden flex items-center gap-6 p-6 md:p-8 bg-blue-600/30 border border-blue-500/50 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-3xl" style={{ transform: 'rotateX(180deg)' }}>
          <Zap className="text-white flex-shrink-0 animate-pulse" size={24} /> 
          <span className="text-lg md:text-xl lg:text-2xl font-black text-white uppercase tracking-tight leading-tight">{back}</span>
        </div>
      </motion.div>
    </div>
  );
};

const DynamicLayout = ({ slide }) => {
  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    initial: { y: 60, opacity: 0, scale: 0.9 },
    animate: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", damping: 15, stiffness: 100 } }
  };

  switch (slide.type) {
    case "HERO":
    case "HERO_GLOW":
    case "HERO_FINAL":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center text-center max-w-6xl mx-auto px-4 w-full">
          <motion.div variants={itemVariants} className="mb-6 md:mb-8 relative">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
            <div className="relative p-6 md:p-8 rounded-full md:rounded-[2.5rem] bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-2xl">
              <HeartPulse size={clamp(40, 60)} strokeWidth={1} />
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl lg:text-9xl font-black mb-4 md:mb-6 tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 w-full text-balance">
            {slide.title}
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-lg md:text-2xl lg:text-3xl font-light text-blue-400 uppercase tracking-[0.2em] md:tracking-[0.4em] mb-8 md:mb-12 opacity-80 w-full text-balance">
            {slide.subtitle}
          </motion.h2>
          {slide.highlight && (
            <motion.div variants={itemVariants} className="p-6 md:p-10 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] shadow-2xl relative group max-w-4xl mx-auto">
              <p className="text-xl md:text-3xl lg:text-4xl font-medium italic text-gray-100 leading-tight">"{slide.highlight}"</p>
            </motion.div>
          )}
        </motion.div>
      );

    case "DATA":
    case "DATA_FOCUS":
    case "DATA_FOCUS_RED":
      const colorClass = slide.type.includes("RED") ? "text-red-500" : "text-blue-500";
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-7xl px-4 flex flex-col items-center">
          <motion.h2 variants={itemVariants} className={`text-center text-2xl md:text-4xl font-black ${colorClass} uppercase tracking-[0.2em] md:tracking-[0.3em] mb-12 md:mb-16 text-balance`}>{slide.subtitle}</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-full">
            {slide.stats?.map((s, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.02 }} className="group p-8 md:p-10 lg:p-14 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] hover:bg-white/10 transition-all text-center relative overflow-hidden flex flex-col items-center justify-center">
                {s.icon && <div className={`${colorClass} mb-6 flex justify-center opacity-30 group-hover:opacity-100 transition-all`}>{React.cloneElement(s.icon, {size: 40})}</div>}
                <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 md:mb-4 leading-none break-all w-full tracking-tighter">{s.v}</div>
                <div className={`text-xs md:text-sm lg:text-base font-bold ${colorClass} uppercase tracking-[0.2em] leading-tight text-balance`}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "TABLE_3COL":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col w-full max-w-[95rem] px-4 py-4 md:py-8 h-full justify-center">
           <div className="mb-8 md:mb-12 text-center lg:text-left">
              <motion.h2 variants={itemVariants} className="text-red-500 font-black text-xl md:text-3xl uppercase tracking-[0.2em] mb-2 md:mb-4">{slide.subtitle}</motion.h2>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] break-words text-balance">{slide.title}</motion.h1>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {slide.tableData.map((col, i) => (
                <motion.div key={i} variants={itemVariants} className="flex flex-col bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 backdrop-blur-3xl group hover:border-blue-500/50 transition-all shadow-xl">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-500/20 transition-all">{col.icon}</div>
                    <div className="text-xl md:text-2xl font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors leading-none">{col.h}</div>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    {col.items.map((text, idx) => (
                      <div key={idx} className="flex items-start gap-3 group/item">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-400 transition-all flex-shrink-0" />
                        <span className="text-lg md:text-xl font-medium text-gray-300 group-hover:text-white transition-colors leading-tight">{text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
           </div>
        </motion.div>
      )

    default:
      // This handles ALERT, GRID, LIST, STEPS types. No overflow, no sliders.
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center w-full max-w-[90rem] px-6 h-full justify-center">
          <div className="space-y-6 md:space-y-10">
            <motion.div variants={itemVariants} className="w-16 h-16 md:w-20 md:h-20 bg-blue-500/20 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center text-blue-400 shadow-2xl border border-white/5">
              {slide.type === "ALERT" ? <AlertTriangle size={32} /> : <Activity size={32} />}
            </motion.div>
            <div className="space-y-4 md:space-y-6">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] break-words text-balance">{slide.title}</motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-2xl lg:text-3xl text-gray-400 leading-relaxed font-light text-balance">{slide.subtitle || slide.description}</motion.p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 md:gap-6 w-full justify-center">
            {(slide.cards || slide.bullets || slide.items || slide.steps || slide.phases)?.map((item, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ x: 10 }} className="p-6 md:p-8 lg:p-10 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] backdrop-blur-2xl group hover:border-blue-500/50 transition-all shadow-xl">
                {typeof item === 'string' ? (
                   <div className="flex items-center gap-4 md:gap-6 text-lg md:text-2xl lg:text-3xl font-medium">
                     <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl flex-shrink-0"><CheckCircle2 className="text-blue-500" size={24} /></div>
                     <span className="group-hover:text-white transition-colors tracking-tight leading-tight">{item}</span>
                   </div>
                ) : (
                  <div className="flex flex-col gap-1 md:gap-2">
                    <div className="text-blue-400 font-black text-xl md:text-2xl lg:text-3xl uppercase tracking-[0.1em] leading-tight break-words">{item.t}</div>
                    <div className="text-gray-400 text-sm md:text-lg lg:text-xl leading-snug font-light text-balance">{item.d}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
  }
};

// Helper for responsive sizing
const clamp = (min, max) => `clamp(${min}px, 5vw, ${max}px)`;

const App = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    const next = current + newDirection;
    if (next >= 0 && next < SLIDES.length) {
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
  }, [current]);

  const slide = SLIDES[current];

  return (
    <div className="w-full h-screen bg-[#050810] text-white overflow-hidden relative selection:bg-blue-500 selection:text-white font-['Inter']">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .scanner { animation: scan 10s linear infinite; }
        /* Hide all scrollbars globally for this app */
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          <Stars radius={150} depth={50} count={4000} factor={4} />
          <Scene3D slideIndex={current} />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#050810_130%)] pointer-events-none" />
      <div className="absolute left-0 right-0 h-1 bg-blue-500/5 scanner z-10 pointer-events-none" />

      <main className="relative z-20 h-full w-full flex items-center justify-center px-4 md:px-12 lg:px-24 py-12 md:py-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100, filter: 'blur(15px)', rotateY: direction * 5 }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)', rotateY: 0 }}
            exit={{ opacity: 0, x: direction * -100, filter: 'blur(15px)', rotateY: direction * -5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            <DynamicLayout slide={slide} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MINIMAL NAVIGATION HUD */}
      <nav className="absolute bottom-8 left-8 z-50 group flex flex-col items-start gap-2">
        <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button onClick={() => paginate(-1)} disabled={current === 0} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-5 transition-all active:scale-90" title="Anterior">
            <ChevronDown className="rotate-90 text-white/60" size={16} />
          </button>
          <button onClick={() => paginate(1)} disabled={current === SLIDES.length - 1} className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-5 transition-all active:scale-90" title="Siguiente">
            <ChevronDown className="-rotate-90 text-white" size={16} />
          </button>
        </div>
      </nav>

      <footer className="absolute bottom-8 right-8 text-right z-50 hidden md:block opacity-40 hover:opacity-100 transition-opacity">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={current} className="text-3xl font-black tracking-tighter">
          BioLife<span className="text-blue-500">.</span>
        </motion.div>
      </footer>

      {/* PROGRESS TRACKER */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_20px_#3b82f6]" 
          initial={{ width: 0 }} 
          animate={{ width: `${((current + 1) / SLIDES.length) * 100}%` }} 
          transition={{ duration: 0.8, ease: "circOut" }} 
        />
      </div>

      <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);