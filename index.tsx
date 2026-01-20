
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, TrendingUp, Users, HeartPulse, PlayCircle, Activity,
  ChevronDown, CheckCircle2, RotateCw, Smartphone, Dumbbell, AlertTriangle, XCircle
} from 'lucide-react';
import * as THREE from 'three';

const THEME = {
  blue: "#3B82F6",
  gold: "#F59E0B",
  red: "#EF4444",
  cyan: "#22D3EE",
  white: "#FFFFFF",
};

const SLIDES = [
  { id: 1, type: "HERO", title: "Nestlé Nutrición", subtitle: "Quiénes somos", description: "Unidad líder en salud y nutrición con base científica.", highlight: "Ciencia aplicada + Capacidad de escala global" },
  { id: 2, type: "DATA", title: "Escala Real", subtitle: "Nestlé", stats: [{v: "185", l: "Países"}, {v: "CHF 91B", l: "Ventas"}, {v: "277k", l: "Talento"}] },
  { 
    id: 3, 
    type: "TIMELINE_ACTIVE", 
    title: "Nuestra Historia", 
    subtitle: "Evolución", 
    timeline: [
      {y: "1866", l: "Inicios"}, 
      {y: "1980", l: "Expansión global"}, 
      {y: "2011", l: "NHS Fundada"}
    ]
  },
  {
    id: 4,
    type: "LIST",
    title: "Nestlé Health Science",
    subtitle: "Health & Nutrition continuum",
    items: [
      "Enfoque en salud",
      "Ciencia aplicada + productos + servicios",
      "Capacidad de escala global"
    ]
  },
  { 
    id: 5, 
    type: "DATA_FOCUS", 
    title: "NHS en Cifras", 
    subtitle: "Impacto Actual NHS", 
    stats: [
      {v: "150", l: "Países", icon: <Globe />}, 
      {v: "$7.6B", l: "Ventas USD", icon: <TrendingUp />}, 
      {v: "11k+", l: "Talento", icon: <Users />}
    ]
  },
  { 
    id: 6, 
    type: "SPLIT_INTERACTIVE", 
    title: "Salud Digital = Caos", 
    subtitle: "Señales", 
    description: "68% de usuarios buscan salud online sin guía. La demanda es masiva pero desordenada.", 
    flipBullets: [
      { front: "Búsqueda online de salud", back: "Hábito Instalado" },
      { front: "Decisiones diarias", back: "Sin guía clínica" },
      { front: "Creciente interés", back: "En prevención" }
    ] 
  },
  { id: 7, type: "ALERT", title: "3 Frenos Críticos", subtitle: "En una encuesta europea, la preocupación por uso indebido de datos fue del 72%", cards: [{t: "Info-xicación", d: "Exceso de ruido"}, {t: "Desconfianza", d: "Fake news de salud"}, {t: "Privacidad", d: "Miedo al uso de datos"}] },
  { 
    id: 8, 
    type: "TABLE_3COL", 
    title: "El mercado está lleno… y sigue abierto.", 
    subtitle: "Competencia", 
    description: "70% de abandono en apps de salud. El mercado mide, pero no retiene.",
    tableData: [
      { h: "Players", items: ["Ecosistemas tech", "Apps de nutrición/fitness"], icon: <Smartphone size={24} className="text-blue-400"/> },
      { h: "Qué hacen bien", items: ["Medición", "Registro"], icon: <CheckCircle2 size={24} className="text-green-400"/> },
      { h: "Qué dejan sin resolver", items: ["Cambio de hábitos", "Abandono"], icon: <XCircle size={24} className="text-red-400"/> }
    ]
  },
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
  const count = 5000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      color.set(THEME.blue);
      col[i*3] = color.r; col[i*3+1] = color.g; col[i*3+2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    const cols = points.current.geometry.attributes.color.array as Float32Array;
    const targetCol = new THREE.Color();

    if (slideIndex < 5) targetCol.set(THEME.blue);
    else if (slideIndex >= 5 && slideIndex <= 8) targetCol.set(THEME.red);
    else if (slideIndex >= 23) targetCol.set(THEME.gold);
    else targetCol.set(THEME.cyan);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let amp = 0.005;
      if (slideIndex >= 5 && slideIndex <= 8) amp = 0.05; 
      
      pos[i3] += Math.sin(time + i) * amp;
      pos[i3+1] += Math.cos(time + i) * amp;
      
      cols[i3] += (targetCol.r - cols[i3]) * 0.05;
      cols[i3+1] += (targetCol.g - cols[i3+1]) * 0.05;
      cols[i3+2] += (targetCol.b - cols[i3+2]) * 0.05;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    points.current.rotation.y = time * 0.03;
    points.current.rotation.z = time * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

const FlipBullet = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div 
      className="perspective-1000 w-full cursor-pointer h-24"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden flex items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-2xl group hover:border-blue-500/40 transition-all">
          <CheckCircle2 className="text-blue-500 flex-shrink-0" size={32} /> 
          <span className="text-2xl font-medium text-gray-300 group-hover:text-white transition-colors">{front}</span>
          <RotateCw size={16} className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity text-blue-400" />
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden flex items-center gap-6 p-8 bg-blue-600/20 border border-blue-500/50 rounded-[2rem] backdrop-blur-2xl"
          style={{ transform: 'rotateX(180deg)' }}
        >
          <Activity className="text-white flex-shrink-0 animate-pulse" size={32} /> 
          <span className="text-2xl font-black text-white">{back}</span>
        </div>
      </motion.div>
    </div>
  );
};

const DynamicLayout = ({ slide }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.25 } }
  };

  const itemVariants = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  switch (slide.type) {
    case "HERO":
    case "HERO_GLOW":
    case "HERO_FINAL":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="mb-8 p-6 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <HeartPulse size={64} strokeWidth={1.5} />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            {slide.title}
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-light text-blue-400 uppercase tracking-[0.4em] mb-12">
            {slide.subtitle}
          </motion.h2>
          {slide.highlight && (
            <motion.div variants={itemVariants} className="p-10 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl">
              <p className="text-2xl md:text-4xl font-medium italic text-gray-200 leading-tight">"{slide.highlight}"</p>
            </motion.div>
          )}
        </motion.div>
      );

    case "TIMELINE_ACTIVE":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full flex flex-col items-center">
          <motion.h2 variants={itemVariants} className="text-3xl font-black text-blue-500 uppercase tracking-widest mb-16">{slide.subtitle}</motion.h2>
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
            {slide.timeline.map((item, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="flex-1 p-10 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/50 transition-colors"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Activity size={80} />
                </div>
                <div className="text-5xl font-black text-blue-500 mb-4 group-hover:scale-110 transition-transform origin-left">{item.y}</div>
                <div className="text-2xl font-bold text-gray-100">{item.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "DATA":
    case "DATA_FOCUS":
    case "DATA_FOCUS_RED":
      const colorClass = slide.type.includes("RED") ? "text-red-500" : "text-blue-500";
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="w-full max-w-6xl">
          <motion.h2 variants={itemVariants} className={`text-center text-3xl font-black ${colorClass} uppercase tracking-widest mb-16`}>{slide.subtitle}</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {slide.stats?.map((s, i) => (
              <motion.div key={i} variants={itemVariants} className="group p-12 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all text-center">
                {s.icon && <div className={`${colorClass} mb-6 flex justify-center opacity-40 group-hover:opacity-100 transition-opacity`}>{React.cloneElement(s.icon, {size: 48})}</div>}
                <div className="text-6xl md:text-8xl font-black text-white mb-4 group-hover:scale-105 transition-transform">{s.v}</div>
                <div className={`text-sm font-bold ${colorClass} uppercase tracking-[0.2em]`}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "SPLIT_INTERACTIVE":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full max-w-7xl">
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="w-20 h-20 bg-red-500/20 rounded-[1.5rem] flex items-center justify-center text-red-400 shadow-xl">
              <Activity size={40} />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-none">{slide.title}</motion.h1>
            <motion.p variants={itemVariants} className="text-2xl text-gray-400 leading-relaxed max-w-lg">{slide.description}</motion.p>
          </div>
          <div className="flex flex-col gap-6 w-full">
            {slide.flipBullets.map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="w-full">
                <FlipBullet front={item.front} back={item.back} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "TABLE_3COL":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col w-full max-w-7xl">
           <div className="mb-12 text-center lg:text-left">
              <motion.h2 variants={itemVariants} className="text-red-500 font-black text-3xl uppercase tracking-widest mb-4">{slide.subtitle}</motion.h2>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter">{slide.title}</motion.h1>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {slide.tableData.map((col, i) => (
                <motion.div key={i} variants={itemVariants} className="flex flex-col bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                    {col.icon}
                    <div className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">{col.h}</div>
                  </div>
                  <div className="space-y-6">
                    {col.items.map((text, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                        <span className="text-xl md:text-2xl font-medium text-gray-300 group-hover:text-white transition-colors leading-tight">{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                    {React.cloneElement(col.icon, { size: 180 })}
                  </div>
                </motion.div>
              ))}
           </div>
        </motion.div>
      )

    case "DAFO":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          {Object.entries(slide.dafo).map(([k, v], i) => (
            <motion.div key={i} variants={itemVariants} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col justify-between hover:border-blue-500/30 group transition-all">
              <div className="text-6xl font-black opacity-10 group-hover:opacity-40 text-blue-400 mb-8">{k}</div>
              <div className="text-2xl font-bold text-gray-100 leading-tight">{v as string}</div>
            </motion.div>
          ))}
        </motion.div>
      );

    case "STACK":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-6 items-center w-full">
          {slide.layers.map((l, i) => (
            <motion.div key={i} 
              variants={itemVariants}
              className="w-full max-w-xl p-8 bg-blue-600/20 rounded-[2rem] shadow-2xl border border-white/10 text-center text-2xl font-black backdrop-blur-md hover:bg-blue-600/40 transition-colors"
            >
              {l}
            </motion.div>
          ))}
        </motion.div>
      );

    case "DASHBOARD":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {slide.metrics?.map((m, i) => (
            <motion.div key={i} variants={itemVariants} className="p-12 bg-gradient-to-br from-blue-600/10 to-transparent border border-white/10 rounded-[3rem] backdrop-blur-2xl text-center group">
              <div className="text-blue-500/50 text-xs uppercase mb-4 tracking-[0.3em] font-black group-hover:text-blue-400 transition-colors">{m.l}</div>
              <div className="text-7xl font-black text-white group-hover:scale-110 transition-transform">{m.v}</div>
            </motion.div>
          ))}
        </motion.div>
      );

    case "VIDEO_LAYOUT":
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col items-center w-full max-w-5xl">
          <motion.div variants={itemVariants} className="w-full aspect-video rounded-[3rem] bg-slate-900/50 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-2xl">
            <PlayCircle size={100} strokeWidth={1} className="text-blue-500 group-hover:scale-125 transition-transform" />
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-8 text-white/20 font-mono tracking-widest text-xs uppercase">Preview: BioLife Engine v2.4</div>
          </motion.div>
          <motion.p variants={itemVariants} className="mt-12 text-3xl font-medium text-gray-400 italic">"{slide.video_desc}"</motion.p>
        </motion.div>
      );

    default: // Standard GRID/SPLIT/LIST
      return (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full max-w-7xl">
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="w-20 h-20 bg-blue-500/20 rounded-[1.5rem] flex items-center justify-center text-blue-400 shadow-xl">
              <Activity size={40} />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-none">{slide.title}</motion.h1>
            <motion.p variants={itemVariants} className="text-2xl text-gray-400 leading-relaxed max-w-xl">{slide.subtitle || slide.description}</motion.p>
          </div>
          <div className="flex flex-col gap-6">
            {(slide.cards || slide.bullets || slide.items || slide.steps || slide.phases)?.map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-2xl group hover:border-blue-500/40 transition-all">
                {typeof item === 'string' ? (
                   <div className="flex items-center gap-6 text-2xl font-medium">
                     <CheckCircle2 className="text-blue-500 flex-shrink-0" size={32} /> 
                     <span className="group-hover:text-white transition-colors">{item}</span>
                   </div>
                ) : (
                  <>
                    <div className="text-blue-400 font-black text-2xl mb-2 uppercase tracking-wide">{item.t}</div>
                    <div className="text-gray-400 text-lg leading-snug">{item.d}</div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
  }
};

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
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={40} />
          <Scene3D slideIndex={current} />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#050810_120%)] pointer-events-none" />
      
      <main className="relative z-20 h-full w-full flex items-center justify-center px-8 md:px-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, x: direction * -100, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="w-full flex items-center justify-center"
          >
            <DynamicLayout slide={slide} />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="absolute bottom-12 left-12 flex items-center gap-8 z-50">
        <div className="flex gap-3 p-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl">
          <button 
            onClick={() => paginate(-1)} 
            disabled={current === 0} 
            className="p-5 rounded-full hover:bg-white/10 disabled:opacity-10 transition-all group"
          >
            <ChevronDown className="rotate-90 text-white/50 group-hover:text-white" size={28} />
          </button>
          <button 
            onClick={() => paginate(1)} 
            disabled={current === SLIDES.length - 1} 
            className="p-5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-10 shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all group"
          >
            <ChevronDown className="-rotate-90 text-white group-hover:scale-110" size={28} />
          </button>
        </div>
        <div className="hidden md:block">
          <div className="text-[11px] font-black text-blue-500/50 uppercase tracking-[0.4em] mb-1">Coming Next</div>
          <div className="text-lg font-bold text-white/80 tracking-tight">{SLIDES[current + 1]?.title || "Estrategia BioLife 2026"}</div>
        </div>
      </nav>

      <footer className="absolute bottom-12 right-12 text-right z-50 hidden md:block">
        <div className="text-4xl font-black tracking-tighter mb-1">BioLife<span className="text-blue-500">.</span></div>
        <div className="text-[11px] font-mono text-white/20 uppercase tracking-[0.3em]">Nestlé Health Science • Exec Deck v1.02</div>
      </footer>

      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-50">
        <motion.div 
          className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
