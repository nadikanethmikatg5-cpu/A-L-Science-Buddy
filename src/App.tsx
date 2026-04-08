import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text, ContactShadows, Environment, MeshWobbleMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Droplets,
  Waves,
  ArrowDown,
  ArrowUp,
  Gauge,
  Anchor,
  Scale,
  Settings2, 
  Info, 
  Play, 
  Zap,
  CircleDot,
  MoveRight,
  RefreshCw,
  Box,
  User,
  RotateCw,
  Compass,
  Torus,
  Activity,
  BookOpen,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Pause,
  Calculator,
  Plus,
  Trash2,
  Keyboard,
  Delete
} from 'lucide-react';

import { Mafs, Coordinates, Plot, Theme } from "mafs";
import * as math from "mathjs";
import "mafs/core.css";
import "mafs/font.css";

// --- Types ---
type Category = 'newton' | 'circular' | 'rotational' | 'hydrostatics' | 'math';
type SimulationType = 'newton1' | 'newton2' | 'newton3' | 'centripetal' | 'torque' | 'inertia' | 'rolling' | 'origin' | 'apparent' | 'flotation' | 'stability' | 'hydrometer' | 'graphing' | null;

// --- Reusable UI Components ---

const LoadingIndicator = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
    <div className="flex flex-col items-center gap-4">
      <RefreshCw className="text-blue-500 animate-spin" size={48} />
      <div className="text-white font-black text-xs uppercase tracking-[0.3em] animate-pulse">Loading Simulation...</div>
    </div>
  </div>
);

const Dashboard = ({ onSelect }: { onSelect: (sim: SimulationType, cat: Category) => void }) => {
  const curriculum = [
    {
      subject: 'Physics',
      icon: Zap,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      units: [
        {
          name: 'Mechanics',
          topics: [
            { id: 'newton1', cat: 'newton', title: "Newton's 1st Law", desc: 'Inertia and motion in a frictionless environment.' },
            { id: 'newton2', cat: 'newton', title: "Newton's 2nd Law", desc: 'The relationship between force, mass, and acceleration.' },
            { id: 'newton3', cat: 'newton', title: "Newton's 3rd Law", desc: 'Action and reaction forces in collisions.' },
            { id: 'centripetal', cat: 'circular', title: 'Centripetal Force', desc: 'Forces keeping objects in circular motion.' },
            { id: 'torque', cat: 'rotational', title: 'Torque Lab', desc: 'Rotational dynamics and lever arm effects.' },
            { id: 'inertia', cat: 'rotational', title: 'Moment of Inertia', desc: 'How mass distribution affects rotation.' },
            { id: 'rolling', cat: 'rotational', title: 'Rolling Incline', desc: 'Energy conservation in rolling objects.' },
          ]
        },
        {
          name: 'Fluid Dynamics',
          topics: [
            { id: 'origin', cat: 'hydrostatics', title: 'Origin of Upthrust', desc: 'Visualize the pressure difference that creates buoyancy.' },
            { id: 'apparent', cat: 'hydrostatics', title: 'Apparent Weight', desc: "Verify Archimedes' Principle using a spring balance." },
            { id: 'flotation', cat: 'hydrostatics', title: 'Law of Flotation', desc: 'Explore equilibrium at the fluid surface.' },
            { id: 'stability', cat: 'hydrostatics', title: 'Stability Lab', desc: 'Center of Buoyancy and rotational equilibrium.' },
            { id: 'hydrometer', cat: 'hydrostatics', title: 'Hydrometer', desc: 'Measure fluid density using flotation principles.' },
          ]
        }
      ]
    },
    {
      subject: 'Mathematics',
      icon: Calculator,
      color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-400/10',
      units: [
        {
          name: 'Tools',
          topics: [
            { id: 'graphing', cat: 'math', title: 'Graphing Calculator', desc: 'Interactive graphing calculator for mathematical functions.' },
          ]
        }
      ]
    }
  ];

  return (
    <div className="py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-10 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6"
          >
            <Activity size={14} /> Interactive Laboratory
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.9]"
          >
            Explore & Learn
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed mb-10"
          >
            Master complex concepts through high-fidelity simulations. 
            Experiment with forces, motion, energy, and mathematics in a controlled virtual environment.
          </motion.p>
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="space-y-16">
        {curriculum.map((subject, sIdx) => (
          <motion.div 
            key={subject.subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sIdx * 0.1 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${subject.bg} ${subject.color}`}>
                <subject.icon size={24} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">{subject.subject}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {subject.units.map((unit, uIdx) => (
                <div key={unit.name} className="bg-slate-900/50 rounded-[2rem] border border-slate-800 p-8">
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">{unit.name}</h3>
                  <div className="space-y-4">
                    {unit.topics.map((topic, tIdx) => (
                      <button
                        key={topic.id}
                        onClick={() => onSelect(topic.id as SimulationType, topic.cat as Category)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all group text-left"
                      >
                        <div>
                          <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{topic.title}</h4>
                          <p className="text-slate-500 text-sm line-clamp-1">{topic.desc}</p>
                        </div>
                        <ChevronRight size={20} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ForceArrow3D = ({ position, direction, length, color, label, value, unit = 'N', opacity = 1 }: any) => {
  const dir = new THREE.Vector3(...direction).normalize();
  const origin = new THREE.Vector3(...position);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  
  const displayLabel = value !== undefined ? `${label}: ${value.toFixed(1)}${unit}` : label;
  
  return (
    <group position={origin}>
      <group quaternion={quaternion}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, length, 16]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} depthTest={true} />
        </mesh>
        <mesh position={[0, length, 0]}>
          <coneGeometry args={[0.06, 0.15, 16]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} depthTest={true} />
        </mesh>
      </group>
      {displayLabel && (
        <Text
          position={[dir.x * (length + 0.3), dir.y * (length + 0.3), dir.z * (length + 0.3)]}
          fontSize={0.18}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {displayLabel}
        </Text>
      )}
    </group>
  );
};

const ForceArrow2D = ({ x, y, angle, length, color, label, value, unit = 'N' }: any) => {
  const displayLabel = value !== undefined ? `${label}: ${value.toFixed(1)}${unit}` : label;
  
  return (
    <div 
      className="absolute pointer-events-none z-20 flex flex-col items-center"
      style={{ 
        left: x, 
        top: y, 
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0'
      }}
    >
      <div className="w-[2px] bg-current" style={{ height: length * 10, color }} />
      <div 
        className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[8px]" 
        style={{ borderTopColor: color }} 
      />
      {displayLabel && (
        <div 
          className="absolute whitespace-nowrap text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/80 text-white border border-white/20 shadow-lg"
          style={{ 
            top: length * 10 + 10,
            transform: `rotate(${-angle}deg)`,
            left: '50%',
            transformOrigin: 'center'
          }}
        >
          {displayLabel}
        </div>
      )}
    </div>
  );
};

const View2D = ({ children, zoom, setZoom }: { children: React.ReactNode, zoom: number, setZoom: React.Dispatch<React.SetStateAction<number>> }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.2), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ 
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'center'
        }}
      >
        {children}
      </div>
      
      {/* Zoom Indicator */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
          Zoom: {Math.round(zoom * 100)}%
        </div>
        <div className="flex gap-2">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 5))} className="p-2 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/10">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.2))} className="p-2 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/10">
            <ZoomOut size={16} />
          </button>
          <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="p-2 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/10">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Pan Hint */}
      <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[8px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
        Drag to Pan • Scroll to Zoom
      </div>
    </div>
  );
};

const Scene3D = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingIndicator />}>
    {children}
  </Suspense>
);

const TheoryPanel = ({ title, content, isOpen, onClose }: any) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm p-8 overflow-y-auto rounded-2xl border-2 border-blue-100 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Theory: {title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <RefreshCw size={24} className="text-gray-400 rotate-45" />
          </button>
        </div>
        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
          {content}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const SimulationCard = ({ title, description, icon: Icon, active, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all text-left w-full group ${
      active 
        ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-900/20' 
        : 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:shadow-lg'
    }`}
  >
    <div className={`p-2.5 rounded-xl mb-4 transition-colors ${active ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20'}`}>
      <Icon size={22} />
    </div>
    <h3 className={`font-black text-sm mb-1.5 tracking-tight ${active ? 'text-white' : 'text-slate-200'}`}>{title}</h3>
    <p className={`text-[10px] leading-relaxed font-medium ${active ? 'text-blue-100' : 'text-slate-500'}`}>{description}</p>
  </motion.button>
);

const ControlField = ({ label, value, onChange, min, max, step, unit, presets }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{label}</label>
      <div className="flex items-center gap-2">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-20 text-right text-xs font-black text-blue-400 bg-slate-800 border-none rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        />
        <span className="text-[10px] font-black text-slate-600">{unit}</span>
      </div>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600"
    />
    {presets && (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {presets.map((p: any) => (
          <button 
            key={p.label} 
            onClick={() => onChange(p.value)}
            className="text-[9px] px-2.5 py-1 bg-slate-800 text-slate-400 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

// --- Hydrostatics Simulations ---

const RollingInclineSim = () => {
  const [objectType, setObjectType] = useState<'sphere' | 'cylinder' | 'hoop'>('sphere');
  const [angle, setAngle] = useState(30);
  const [mass, setMass] = useState(1);
  const [radius, setRadius] = useState(0.5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [useFriction, setUseFriction] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [time, setTime] = useState(0);
  const [showTheory, setShowTheory] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

  const g = 10;
  const radAngle = (angle * Math.PI) / 180;
  
  // Moment of inertia factor (I = k * m * r^2)
  const k = objectType === 'sphere' ? 0.4 : objectType === 'cylinder' ? 0.5 : 1;
  
  // If no friction, it slides without rolling
  const acceleration = useFriction ? (g * Math.sin(radAngle)) / (1 + k) : g * Math.sin(radAngle);

  useEffect(() => {
    let interval: any;
    if (isSimulating && !isPaused) {
      interval = setInterval(() => {
        setTime(t => t + 0.016);
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isSimulating, isPaused]);

  const distance = 0.5 * acceleration * time * time;
  const velocity = acceleration * time;
  
  // Max distance of the incline
  const maxDistance = 10;
  const currentDistance = Math.min(distance, maxDistance);
  
  // Energy calculations
  const initialHeight = maxDistance * Math.sin(radAngle);
  const currentHeight = (maxDistance - currentDistance) * Math.sin(radAngle);
  const pe = mass * g * currentHeight;
  const ke_trans = 0.5 * mass * velocity * velocity;
  const angularVelocity = useFriction ? velocity / radius : 0;
  const ke_rot = useFriction ? 0.5 * (k * mass * radius * radius) * Math.pow(angularVelocity, 2) : 0;
  const totalEnergy = pe + ke_trans + ke_rot;

  const frictionForce = useFriction ? k * mass * acceleration : 0;
  const normalForce = mass * g * Math.cos(radAngle);
  const weightForce = mass * g;

  const reset = () => {
    setIsSimulating(false);
    setIsPaused(false);
    setTime(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Rolling Down an Incline"
        content={
          <>
            <p>When an object rolls down an incline without slipping, it has both translational and rotational kinetic energy.</p>
            <div className="bg-blue-50 p-4 rounded-xl font-mono font-bold text-blue-700 text-center my-4">
              a = (g × sinθ) / (1 + I/mr²)
            </div>
            <p>The acceleration depends on the shape of the object (its moment of inertia factor <strong>k</strong>):</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Sphere:</strong> k = 0.4 (Fastest)</li>
              <li><strong>Cylinder:</strong> k = 0.5</li>
              <li><strong>Hoop:</strong> k = 1.0 (Slowest)</li>
            </ul>

            <div className="mt-8 p-4 bg-amber-900/20 rounded-2xl border border-amber-500/20">
              <h4 className="text-sm font-black text-amber-400 mb-2 uppercase tracking-tight flex items-center gap-2">
                <Compass size={16} /> Physics Paradox: Rolling Uphill?
              </h4>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                The "rolling uphill" phenomenon is an optical illusion. In experiments like the <strong>Double Cone</strong>, the object's geometry and the widening tracks mean its <strong>Center of Mass</strong> is actually descending, even if the object appears to move up. In this simulation, gravity always pulls the object down the incline.
              </p>
            </div>
          </>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-0 flex flex-col overflow-hidden min-h-[500px]">
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Maximize2 className="text-blue-400" /> Rolling Lab {viewMode.toUpperCase()}
          </h2>
          <div className="flex gap-2">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-blue-300 uppercase tracking-wider">
              {objectType}
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-green-300 uppercase tracking-wider">
              θ = {angle}°
            </div>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-10">
          <div className="bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10 flex gap-1">
            <button 
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === '2d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              2D
            </button>
            <button 
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === '3d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              3D
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          {viewMode === '3d' ? (
            <Scene3D>
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[8, 5, 12 / zoom]} fov={45} />
                <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Environment preset="city" />

                {/* Incline */}
                <group rotation={[0, 0, -radAngle]}>
                  <mesh receiveShadow position={[5, -0.1, 0]}>
                    <boxGeometry args={[12, 0.2, 4]} />
                    <meshStandardMaterial color="#1e293b" />
                  </mesh>
                  
                  {/* Rolling Object - Start at top (x=0) and move to x=10 */}
                  <group position={[currentDistance, radius, 0]}>
                    {/* Rotating Body */}
                    <group rotation={[0, 0, useFriction ? -currentDistance / radius : 0]}>
                      {objectType === 'sphere' && (
                        <mesh castShadow>
                          <sphereGeometry args={[radius, 32, 32]} />
                          <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.8} />
                          <mesh position={[0, 0, 0]}>
                            <ringGeometry args={[radius - 0.05, radius, 32]} />
                            <meshBasicMaterial color="white" transparent opacity={0.5} />
                          </mesh>
                        </mesh>
                      )}
                      {objectType === 'cylinder' && (
                        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                          <cylinderGeometry args={[radius, radius, 1, 32]} />
                          <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.8} />
                          <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[radius - 0.1, radius, 32]} />
                            <meshBasicMaterial color="white" transparent opacity={0.5} />
                          </mesh>
                        </mesh>
                      )}
                      {objectType === 'hoop' && (
                        <mesh castShadow>
                          <torusGeometry args={[radius, 0.05, 16, 100]} />
                          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
                        </mesh>
                      )}
                    </group>

                    {/* Force Vectors in Incline Space (Non-rotating) */}
                    <ForceArrow3D 
                      position={[0, 0, 0]} 
                      direction={[Math.sin(radAngle), -Math.cos(radAngle), 0]} 
                      length={1.5} 
                      color="#fbbf24" 
                      label="mg" 
                      value={weightForce}
                    />
                    {/* Normal N - Points perpendicular to incline */}
                    <ForceArrow3D 
                      position={[0, -radius, 0]} 
                      direction={[0, 1, 0]} 
                      length={1.5 * Math.cos(radAngle)} 
                      color="#3b82f6" 
                      label="N" 
                      value={normalForce}
                    />
                    {useFriction && (
                      <ForceArrow3D 
                        position={[0, -radius, 0]} 
                        direction={[-1, 0, 0]} 
                        length={0.8} 
                        color="#ef4444" 
                        label="f" 
                        value={frictionForce}
                      />
                    )}
                  </group>
                </group>

                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
                  <planeGeometry args={[100, 100]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
                <ContactShadows position={[0, -4.99, 0]} opacity={0.4} scale={20} blur={2} far={10} />
              </Canvas>
            </Scene3D>
          ) : (
            <View2D zoom={zoom} setZoom={setZoom}>
              <div className="relative w-[1000px] h-[600px] flex items-center justify-center">
                {/* 2D Incline */}
                <div 
                  className="absolute w-[1200px] h-4 bg-slate-700 origin-center shadow-xl"
                  style={{ transform: `rotate(${angle}deg)` }}
                />
                
                {/* 2D Object */}
                <motion.div 
                  className="absolute"
                  style={{ 
                    x: (currentDistance - 5) * 100 * Math.cos(radAngle), 
                    y: (currentDistance - 5) * 100 * Math.sin(radAngle) - radius * 100,
                  }}
                >
                  <motion.div 
                    className={`rounded-full border-4 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden relative`}
                    style={{ 
                      width: radius * 200, 
                      height: radius * 200,
                      rotate: useFriction ? `${(currentDistance / radius) * (180 / Math.PI)}deg` : '0deg',
                      backgroundColor: objectType === 'sphere' ? '#3b82f6' : objectType === 'cylinder' ? '#ef4444' : 'transparent',
                      border: objectType === 'hoop' ? '12px solid #f59e0b' : 'none',
                    }}
                  >
                    <div className="w-full h-1 bg-white/40" />
                  </motion.div>

                  {/* Force Vectors - Centered on object */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    {/* Weight mg - Points straight down from center */}
                    <ForceArrow2D x={0} y={0} angle={0} length={weightForce * 5} color="#fbbf24" label="mg" value={weightForce} />
                    
                    {/* Normal N - Points from contact point towards center */}
                    <ForceArrow2D 
                      x={-radius * 100 * Math.sin(radAngle)} 
                      y={radius * 100 * Math.cos(radAngle)} 
                      angle={180 - angle} 
                      length={normalForce * 5} 
                      color="#3b82f6" 
                      label="N" 
                      value={normalForce} 
                    />
                    
                    {/* Friction f - Points from contact point up the incline */}
                    {useFriction && (
                      <ForceArrow2D 
                        x={-radius * 100 * Math.sin(radAngle)} 
                        y={radius * 100 * Math.cos(radAngle)} 
                        angle={90 + angle} 
                        length={frictionForce * 10} 
                        color="#ef4444" 
                        label="f" 
                        value={frictionForce} 
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </View2D>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (!isSimulating) setIsSimulating(true);
                  else setIsPaused(!isPaused);
                }}
                className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${isSimulating && !isPaused ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-blue-600 text-white shadow-blue-600/20'}`}
              >
                {!isSimulating ? 'Start' : isPaused ? 'Resume' : 'Pause'}
              </button>
              <button onClick={reset} className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10 shadow-xl">
                <RefreshCw size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Energy (J)</div>
                <div className="flex gap-4 font-mono text-xs">
                  <div><span className="text-slate-500">PE:</span> <span className="text-white">{pe.toFixed(1)}</span></div>
                  <div><span className="text-slate-500">KE:</span> <span className="text-white">{(ke_trans + ke_rot).toFixed(1)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest">
            <Settings2 size={18} /> Lab Config
          </h3>
          <button onClick={() => setShowTheory(true)} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all">
            <Info size={18} />
          </button>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
              <span>Object Type</span>
              <span className="text-blue-400">{objectType}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['sphere', 'cylinder', 'hoop'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => { setObjectType(type); reset(); }}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${objectType === type ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <ControlField label="Incline Angle" value={angle} onChange={(v: any) => { setAngle(v); reset(); }} min={0} max={60} step={1} unit="°" />
          <ControlField label="Mass" value={mass} onChange={(v: any) => { setMass(v); reset(); }} min={0.1} max={5} step={0.1} unit="kg" />
          <ControlField label="Radius" value={radius} onChange={(v: any) => { setRadius(v); reset(); }} min={0.2} max={1} step={0.1} unit="m" />
          
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${useFriction ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                <Zap size={16} />
              </div>
              <div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest">Friction</div>
                <div className="text-[9px] text-slate-500 uppercase">{useFriction ? 'Rolling' : 'Sliding'}</div>
              </div>
            </div>
            <button 
              onClick={() => setUseFriction(!useFriction)}
              className={`w-12 h-6 rounded-full relative transition-all ${useFriction ? 'bg-green-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useFriction ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="mt-auto p-5 bg-slate-800/50 rounded-2xl border border-slate-700 text-white">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Real-time Dynamics</div>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Angular Vel:</span>
              <span className="text-blue-400 font-bold">{angularVelocity.toFixed(2)} rad/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kinetic Energy:</span>
              <span className="text-green-400 font-bold">{(ke_trans + ke_rot).toFixed(2)} J</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiskScene = ({ radius, mass, force, rotation, zoom = 1 }: any) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5 / zoom]} fov={45} />
      <OrbitControls enablePan={false} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Environment preset="city" />

      <group rotation={[0, rotation, 0]}>
        {/* The Disk */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius * 2, radius * 2, 0.2, 64]} />
          <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Lever Arm */}
        <mesh position={[radius, 0.11, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, radius * 2, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>

        {/* Force Application Point */}
        <mesh position={[radius * 2, 0.2, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>

        {/* Tangential Force Arrow */}
        <ForceArrow3D 
          position={[radius * 2, 0.2, 0]} 
          direction={[0, 0, -1]} 
          length={force / 20} 
          color="#ef4444" 
          label="F_tang" 
          value={force}
        />

        {/* Weight Arrow */}
        <ForceArrow3D 
          position={[0, 0, 0]} 
          direction={[0, -1, 0]} 
          length={2} 
          color="#fbbf24" 
          label="mg" 
          value={5 * 10}
        />

        {/* Centripetal Force Arrow (towards axis) */}
        <ForceArrow3D 
          position={[radius * 2, 0, 0]} 
          direction={[-1, 0, 0]} 
          length={1.5} 
          color="#3b82f6" 
          label="Fc" 
          value={5 * Math.pow(rotation, 2) * radius * 2}
        />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <ContactShadows position={[0, -0.99, 0]} opacity={0.4} scale={20} blur={2} far={10} />
    </>
  );
};

const RotationalMotionSim = () => {
  const [force, setForce] = useState(50);
  const [radius, setRadius] = useState(0.8);
  const [showTheory, setShowTheory] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Force is now always tangential (sin(90) = 1)
  const torque = force * radius;
  const momentOfInertia = 0.5 * 5 * radius * radius; // Disk I = 1/2 mr^2, mass=5kg
  const angularAcceleration = torque / momentOfInertia;

  useEffect(() => {
    let lastTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (isRotating && !isPaused) {
        setRotation(r => r + angularAcceleration * delta);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [isRotating, isPaused, angularAcceleration]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Torque & Rotation"
        content={
          <>
            <p>Torque is the rotational equivalent of linear force. It measures how much a force acting on an object causes that object to rotate.</p>
            <div className="bg-purple-500/10 p-4 rounded-xl font-mono text-xs text-purple-400 space-y-2 border border-purple-500/20 my-4">
              <p>τ = r × F</p>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm mt-4">
              <li><strong>r (Lever Arm):</strong> The distance from the pivot point to the point where force is applied.</li>
              <li><strong>F (Force):</strong> The magnitude of the applied force.</li>
            </ul>
            <p className="mt-4">In this demonstration, the force is applied <strong>tangentially</strong> (perpendicular to the lever arm) to maximize torque.</p>
          </>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <RotateCw className="text-purple-400" /> Torque Lab (3D)
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all border border-purple-500/20"><Info size={20} /></button>
            <div className="bg-purple-600/20 backdrop-blur-md px-4 py-2 rounded-full text-purple-400 font-mono font-bold text-sm border border-purple-500/20">
              τ = {torque.toFixed(2)} N·m
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 45 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault />

            <DiskScene 
              radius={radius} 
              rotation={rotation} 
              setRotation={setRotation} 
              isRotating={isRotating} 
              angularAcceleration={angularAcceleration} 
              force={force}
              zoom={1}
            />
          </Canvas>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-4 z-20">
            <button 
              onClick={() => {
                if (!isRotating) setIsRotating(true);
                else setIsPaused(!isPaused);
              }}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${isRotating && !isPaused ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-purple-600 text-white shadow-purple-600/20'}`}
            >
              {!isRotating ? 'Start' : isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={() => { setIsRotating(false); setIsPaused(false); setRotation(0); }} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Applied Force (F)" value={force} onChange={setForce} min={0} max={200} step={5} unit="N" />
          <ControlField label="Lever Arm (r)" value={radius} onChange={setRadius} min={0.1} max={1} step={0.05} unit="m" />
        </div>
        <div className="mt-auto p-5 bg-purple-500/5 rounded-2xl border border-purple-500/10 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Angular Accel (α)</span>
            <span className="text-sm font-mono font-bold text-purple-400">{angularAcceleration.toFixed(2)} rad/s²</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Moment of Inertia (I)</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{momentOfInertia.toFixed(2)} kg·m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OriginOfUpthrustSim = () => {
  const [depth, setDepth] = useState(2); // h in meters
  const [height, setHeight] = useState(3); // H-h in meters
  const [radius, setRadius] = useState(1); // r in meters
  const [density, setDensity] = useState(1000); // rho in kg/m^3
  const [gravity] = useState(10); // g in m/s^2
  const [showTheory, setShowTheory] = useState(false);

  const area = Math.PI * radius * radius;
  const H = depth + height;
  const P1 = depth * density * gravity; // Pressure at top
  const P2 = H * density * gravity; // Pressure at bottom
  const F1 = P1 * area; // Force at top
  const F2 = P2 * area; // Force at bottom
  const upthrust = F2 - F1;
  const volume = area * height;
  const archimedesUpthrust = volume * density * gravity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Origin of Upthrust"
        content={
          <div className="space-y-4 text-slate-300">
            <p>Upthrust arises from the difference in fluid pressure at different depths.</p>
            <div className="bg-blue-500/10 p-4 rounded-xl font-mono text-xs text-blue-400 space-y-2 border border-blue-500/20">
              <p>P = hρg</p>
              <p>F_top = A × h × ρ × g (Downward)</p>
              <p>F_bottom = A × H × ρ × g (Upward)</p>
              <p>U = F_bottom - F_top = A(H-h)ρg = Vρg</p>
            </div>
            <p>Since pressure increases with depth (H &gt; h), the upward force on the bottom is always greater than the downward force on the top.</p>
          </div>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Gauge className="text-blue-400" /> Pressure Cylinder Model (3D)
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20"><Info size={20} /></button>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 2, 12], fov: 50 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault />

            {/* Water Tank */}
            <mesh position={[0, -2, 0]} receiveShadow>
              <boxGeometry args={[10, 10, 10]} />
              <meshPhysicalMaterial color="#3b82f6" transmission={0.8} opacity={1} transparent roughness={0.1} thickness={2} />
            </mesh>

            {/* Water Surface Grid */}
            <gridHelper args={[10, 10, '#60a5fa', '#1e3a8a']} position={[0, 3, 0]} />

            {/* Cylinder */}
            <mesh position={[0, 3 - depth - height / 2, 0]} castShadow>
              <cylinderGeometry args={[radius, radius, height, 32]} />
              <meshStandardMaterial color="#f59e0b" transparent opacity={0.9} />
            </mesh>

            {/* Top Force Arrow (F1) */}
            <ForceArrow3D 
              position={[0, 3 - depth, 0]} 
              direction={[0, -1, 0]} 
              length={Math.max(1, F1 / 20000)} 
              color="#ef4444" 
              label={`F1 = ${(F1/1000).toFixed(1)}kN`} 
            />

            {/* Bottom Force Arrow (F2) */}
            <ForceArrow3D 
              position={[0, 3 - depth - height, 0]} 
              direction={[0, 1, 0]} 
              length={Math.max(1, F2 / 20000)} 
              color="#10b981" 
              label={`F2 = ${(F2/1000).toFixed(1)}kN`} 
            />
            
            {/* Lateral Pressure Arrows */}
            {[0, 1, 2, 3].map(i => {
              const angle = (i * Math.PI) / 2;
              const x = Math.cos(angle) * (radius + 0.5);
              const z = Math.sin(angle) * (radius + 0.5);
              const midY = 3 - depth - height / 2;
              return (
                <ForceArrow3D 
                  key={i}
                  position={[x, midY, z]} 
                  direction={[-Math.cos(angle), 0, -Math.sin(angle)]} 
                  length={1.5} 
                  color="#3b82f6" 
                />
              )
            })}
          </Canvas>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Top Depth (h)" value={depth} onChange={setDepth} min={0.5} max={5} step={0.1} unit="m" />
          <ControlField label="Cylinder Height" value={height} onChange={setHeight} min={1} max={4} step={0.1} unit="m" />
          <ControlField label="Cylinder Radius" value={radius} onChange={setRadius} min={0.5} max={2} step={0.1} unit="m" />
          <ControlField label="Fluid Density (ρ)" value={density} onChange={setDensity} min={500} max={2000} step={50} unit="kg/m³" presets={[{label:'Oil',value:800},{label:'Water',value:1000},{label:'Brine',value:1200}]} />
        </div>
        <div className="mt-auto p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase">Net Upthrust</span>
            <span className="text-sm font-mono font-bold text-blue-400">{(upthrust/1000).toFixed(1)} kN</span>
          </div>
          <div className="text-[8px] text-blue-500/60 leading-relaxed italic">
            Verification: Vρg = {volume.toFixed(2)} × {density} × 10 = {(archimedesUpthrust/1000).toFixed(1)} kN
          </div>
        </div>
      </div>
    </div>
  );
};

const ApparentWeightSim = () => {
  const [immersion, setImmersion] = useState(0); // 0 to 1
  const [mass, setMass] = useState(5); // kg
  const [volume, setVolume] = useState(0.002); // m^3
  const [density, setDensity] = useState(1000); // kg/m^3
  const [showTheory, setShowTheory] = useState(false);

  const gravity = 10;
  const realWeight = mass * gravity;
  const submergedVolume = volume * immersion;
  const upthrust = submergedVolume * density * gravity;
  const apparentWeight = Math.max(0, realWeight - upthrust);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Apparent Weight & Archimedes' Principle"
        content={
          <div className="space-y-4 text-slate-300">
            <p>When an object is immersed in a fluid, it experiences an upward buoyant force (upthrust) equal to the weight of the fluid displaced.</p>
            <div className="bg-blue-500/10 p-4 rounded-xl font-mono text-xs text-blue-400 space-y-2 border border-blue-500/20">
              <p>W_apparent = W_real - Upthrust</p>
              <p>Upthrust = V_submerged × ρ_fluid × g</p>
            </div>
            <p>This causes the object to feel lighter when submerged.</p>
          </div>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Scale className="text-blue-400" /> Archimedes' Principle (3D)
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20"><Info size={20} /></button>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault target={[0, 0, 0]} />

            {/* Stand Base & Pole */}
            <mesh position={[-2, -3, 0]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.2, 2]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[-2, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 7, 16]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[-1, 3.9, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 2, 16]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>

            {/* Spring Scale */}
            <mesh position={[0, 3, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
              <meshStandardMaterial color="#eab308" />
            </mesh>
            <Text position={[0, 3, 0.31]} fontSize={0.3} color="black" anchorX="center" anchorY="middle">
              {apparentWeight.toFixed(1)}N
            </Text>

            {/* String */}
            <mesh position={[0, 1.5 - immersion, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 3 + immersion * 2, 8]} />
              <meshStandardMaterial color="#cbd5e1" />
            </mesh>

            {/* Block */}
            <mesh position={[0, -immersion * 2, 0]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>

            {/* Beaker */}
            <mesh position={[0, -2, 0]} receiveShadow>
              <cylinderGeometry args={[1.5, 1.5, 2, 32]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.3} transparent roughness={0.1} />
            </mesh>

            {/* Water inside Beaker */}
            <mesh position={[0, -2 + (immersion * 0.5), 0]}>
              <cylinderGeometry args={[1.45, 1.45, 1.8 + (immersion * 0.5), 32]} />
              <meshPhysicalMaterial color="#3b82f6" transmission={0.8} opacity={1} transparent roughness={0.1} thickness={2} />
            </mesh>

            {/* Force Arrows */}
            <ForceArrow3D 
              position={[1, -immersion * 2, 0]} 
              direction={[0, -1, 0]} 
              length={realWeight / 20} 
              color="#ef4444" 
              label={`W = ${realWeight.toFixed(1)}N`} 
            />
            {upthrust > 0 && (
              <ForceArrow3D 
                position={[-1, -immersion * 2, 0]} 
                direction={[0, 1, 0]} 
                length={upthrust / 20} 
                color="#10b981" 
                label={`U = ${upthrust.toFixed(1)}N`} 
              />
            )}
          </Canvas>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Immersion" value={immersion} onChange={setImmersion} min={0} max={1} step={0.01} unit="" />
          <ControlField label="Object Mass" value={mass} onChange={setMass} min={1} max={10} step={0.5} unit="kg" />
          <ControlField label="Object Volume" value={volume} onChange={setVolume} min={0.001} max={0.01} step={0.001} unit="m³" />
          <ControlField label="Fluid Density" value={density} onChange={setDensity} min={500} max={2000} step={50} unit="kg/m³" presets={[{label:'Oil',value:800},{label:'Water',value:1000},{label:'Brine',value:1200}]} />
        </div>
        <div className="mt-auto p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Real Weight</span>
            <span className="text-sm font-mono font-bold text-slate-300">{realWeight.toFixed(1)} N</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Upthrust</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{upthrust.toFixed(1)} N</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-blue-500/20">
            <span className="text-[10px] font-black text-slate-500 uppercase">Apparent Weight</span>
            <span className="text-sm font-mono font-bold text-blue-400">{apparentWeight.toFixed(1)} N</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlotationSim = () => {
  const [blockDensity, setBlockDensity] = useState(600); // kg/m^3
  const [fluidDensity, setFluidDensity] = useState(1000); // kg/m^3
  const [showTheory, setShowTheory] = useState(false);

  // Block is 2x2x2 m
  const blockVolume = 8;
  const blockMass = blockDensity * blockVolume;
  const gravity = 10;
  const weight = blockMass * gravity;

  const submergedFraction = Math.min(1, blockDensity / fluidDensity);
  const isSinking = blockDensity > fluidDensity;
  
  const blockY = isSinking ? -2 : 1 - 2 * submergedFraction;
  const upthrust = isSinking ? fluidDensity * blockVolume * gravity : weight;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Flotation & Sinking"
        content={
          <div className="space-y-4 text-slate-300">
            <p>An object floats if its density is less than or equal to the fluid's density.</p>
            <div className="bg-blue-500/10 p-4 rounded-xl font-mono text-xs text-blue-400 space-y-2 border border-blue-500/20">
              <p>Float: ρ_object ≤ ρ_fluid</p>
              <p>Sink: ρ_object &gt; ρ_fluid</p>
              <p>Submerged Fraction = ρ_object / ρ_fluid</p>
            </div>
            <p>When floating, the upthrust exactly balances the object's weight.</p>
          </div>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Waves className="text-blue-400" /> Flotation & Sinking (3D)
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20"><Info size={20} /></button>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 2, 10], fov: 50 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault />

            {/* Water Tank */}
            <mesh position={[0, -1.5, 0]} receiveShadow>
              <boxGeometry args={[8, 5, 8]} />
              <meshPhysicalMaterial color="#3b82f6" transmission={0.8} opacity={1} transparent roughness={0.1} thickness={2} />
            </mesh>
            <gridHelper args={[8, 8, '#60a5fa', '#1e3a8a']} position={[0, 1, 0]} />

            {/* Block */}
            <mesh position={[0, blockY, 0]} castShadow>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color={isSinking ? "#64748b" : "#f59e0b"} />
            </mesh>

            {/* Force Arrows */}
            <ForceArrow3D 
              position={[1.5, blockY, 0]} 
              direction={[0, -1, 0]} 
              length={weight / 20000} 
              color="#ef4444" 
              label={`W = ${(weight/1000).toFixed(1)}kN`} 
            />
            <ForceArrow3D 
              position={[-1.5, blockY, 0]} 
              direction={[0, 1, 0]} 
              length={upthrust / 20000} 
              color="#10b981" 
              label={`U = ${(upthrust/1000).toFixed(1)}kN`} 
            />
          </Canvas>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Block Density" value={blockDensity} onChange={setBlockDensity} min={100} max={2000} step={50} unit="kg/m³" presets={[{label:'Wood',value:600},{label:'Ice',value:920},{label:'Brick',value:1800}]} />
          <ControlField label="Fluid Density" value={fluidDensity} onChange={setFluidDensity} min={500} max={2000} step={50} unit="kg/m³" presets={[{label:'Oil',value:800},{label:'Water',value:1000},{label:'Brine',value:1200}]} />
        </div>
        <div className="mt-auto p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Status</span>
            <span className={`text-sm font-mono font-bold ${isSinking ? 'text-red-400' : 'text-emerald-400'}`}>
              {isSinking ? 'SINKING' : 'FLOATING'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Submerged Fraction</span>
            <span className="text-sm font-mono font-bold text-blue-400">{(submergedFraction * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StabilitySim = () => {
  const [angle, setAngle] = useState(30); // degrees
  const [immersion, setImmersion] = useState(0.5); // 0 to 1
  const [showTheory, setShowTheory] = useState(false);

  // Rod properties
  const length = 4; // meters
  const mass = 10;
  const gravity = 10;
  const weight = mass * gravity;
  const upthrust = weight; // Assume floating at equilibrium for simplicity

  // Geometry
  const rad = (angle * Math.PI) / 180;
  const submergedLength = length * immersion;
  const B = { 
    x: (length/2 - submergedLength/2) * Math.cos(rad), 
    y: (length/2 - submergedLength/2) * Math.sin(rad) 
  };

  // Torque
  const leverArm = Math.abs(B.x);
  const torque = upthrust * leverArm;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Stability & Center of Buoyancy"
        content={
          <div className="space-y-4 text-slate-300">
            <p>Stability depends on the relative positions of the Center of Gravity (G) and the Center of Buoyancy (B).</p>
            <div className="bg-blue-500/10 p-4 rounded-xl font-mono text-xs text-blue-400 space-y-2 border border-blue-500/20">
              <p>G: Center of mass of the object.</p>
              <p>B: Center of mass of the displaced fluid.</p>
              <p>Torque = r × F</p>
            </div>
            <p>If G and B are not vertically aligned, they create a couple that rotates the object until they align. This is the restoring torque.</p>
          </div>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Anchor className="text-blue-400" /> Center of Buoyancy Lab (3D)
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20"><Info size={20} /></button>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault />

            {/* Water */}
            <mesh position={[0, -2, 0]} receiveShadow>
              <boxGeometry args={[10, 4, 10]} />
              <meshPhysicalMaterial color="#3b82f6" transmission={0.8} opacity={1} transparent roughness={0.1} thickness={2} />
            </mesh>
            <gridHelper args={[10, 10, '#60a5fa', '#1e3a8a']} position={[0, 0, 0]} />

            {/* Rod */}
            <group rotation={[0, 0, -rad]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.2, length, 32]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#b45309" />
              </mesh>

              {/* Submerged Part Overlay */}
              <mesh position={[(length/2) - (submergedLength/2), 0, 0]}>
                <cylinderGeometry args={[0.21, 0.21, submergedLength, 32]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#3b82f6" opacity={0.3} transparent />
              </mesh>

              {/* Center of Gravity (G) */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.3]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
              <Text position={[0, 0.5, 0]} fontSize={0.4} color="#ef4444" rotation={[0, 0, rad]}>G</Text>

              {/* Center of Buoyancy (B) */}
              <mesh position={[(length/2) - (submergedLength/2), 0, 0]}>
                <sphereGeometry args={[0.3]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
              <Text position={[(length/2) - (submergedLength/2), -0.5, 0]} fontSize={0.4} color="#10b981" rotation={[0, 0, rad]}>B</Text>
            </group>

            {/* Force Arrows (Global coordinates) */}
            <ForceArrow3D 
              position={[0, 0, 0]} 
              direction={[0, -1, 0]} 
              length={weight / 20} 
              color="#ef4444" 
              label={`W = ${weight.toFixed(1)}N`} 
            />
            <ForceArrow3D 
              position={[B.x, B.y, 0]} 
              direction={[0, 1, 0]} 
              length={upthrust / 20} 
              color="#10b981" 
              label={`U = ${upthrust.toFixed(1)}N`} 
            />

          </Canvas>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Tilt Angle" value={angle} onChange={setAngle} min={-90} max={90} step={1} unit="°" />
          <ControlField label="Immersion Level" value={immersion} onChange={setImmersion} min={0.1} max={0.9} step={0.05} unit="" />
        </div>
        <div className="mt-auto p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Lever Arm</span>
            <span className="text-sm font-mono font-bold text-blue-400">{leverArm.toFixed(2)} m</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Restoring Torque</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{torque.toFixed(1)} N·m</span>
          </div>
          <div className="text-[8px] text-blue-500/60 leading-relaxed italic mt-2">
            The rod will rotate until G and B are vertically aligned (Torque = 0).
          </div>
        </div>
      </div>
    </div>
  );
};

const HydrometerSim = () => {
  const [density, setDensity] = useState(1000); // kg/m^3
  const [mass, setMass] = useState(0.2); // kg
  const [stemArea, setStemArea] = useState(0.0001); // m^2 (1cm^2)
  const [bulbVolume, setBulbVolume] = useState(0.00015); // m^3 (150ml)
  const [gravity] = useState(10);
  const [showTheory, setShowTheory] = useState(false);
  const [zoom, setZoom] = useState(1);

  const weight = mass * gravity;
  const requiredVolume = mass / density;
  const stemImmersion = (requiredVolume - bulbVolume) / stemArea;
  
  const isSinking = requiredVolume > (bulbVolume + stemArea * 0.5); // Max height 50cm
  const displayImmersion = stemImmersion * 100; // cm

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="The Hydrometer"
        content={
          <div className="space-y-4 text-slate-300">
            <p>A hydrometer measures fluid density based on the principle of flotation.</p>
            <div className="bg-blue-500/10 p-4 rounded-xl font-mono text-xs text-blue-400 space-y-2 border border-blue-500/20">
              <p>mg = V_displaced × ρ_fluid × g</p>
              <p>V_displaced = m / ρ_fluid</p>
            </div>
            <p>In a denser liquid, the hydrometer displaces less volume and floats higher. In a less dense liquid, it sinks deeper.</p>
          </div>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Droplets className="text-blue-400" /> Density Measurement
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20"><Info size={20} /></button>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
          <View2D zoom={zoom} setZoom={setZoom}>
            <div className="relative w-[400px] h-[600px] flex items-center justify-center">
              {/* Water */}
              <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
              <div className="absolute top-[40%] left-0 right-0 h-1 bg-blue-400/30" />
              
              {/* Hydrometer */}
              <motion.div 
                className="relative flex flex-col items-center"
                animate={{ y: isSinking ? 200 : stemImmersion * 100 }}
                transition={{ type: 'spring', damping: 20, stiffness: 50 }}
              >
                {/* Stem */}
                <div className="w-4 h-64 bg-white/80 border-x-2 border-slate-300 relative">
                  {/* Scale markings */}
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="absolute w-full h-px bg-slate-400" style={{ top: `${i * 10}%` }} />
                  ))}
                </div>
                {/* Bulb */}
                <div className="w-16 h-20 bg-white/90 border-2 border-slate-300 rounded-full -mt-2 flex items-center justify-center shadow-xl">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </div>
          </View2D>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Fluid Density" value={density} onChange={setDensity} min={600} max={1500} step={10} unit="kg/m³" presets={[{label:'Petrol',value:750},{label:'Water',value:1000},{label:'Milk',value:1030}]} />
          <ControlField label="Hydrometer Mass" value={mass} onChange={setMass} min={0.1} max={0.5} step={0.01} unit="kg" />
        </div>
        <div className="mt-auto p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase">Stem Immersion</span>
            <span className="text-sm font-mono font-bold text-blue-400">{isSinking ? "SUNK" : `${displayImmersion.toFixed(1)} cm`}</span>
          </div>
          <div className="text-[8px] text-blue-500/60 leading-relaxed italic">
            Higher density fluid results in less immersion.
          </div>
        </div>
      </div>
    </div>
  );
};

const GraphingCalculatorSim = () => {
  const [expressions, setExpressions] = useState([
    { id: 1, latex: "sin(x)", color: Theme.blue },
    { id: 2, latex: "x^2", color: Theme.red }
  ]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const [xAxisUnit, setXAxisUnit] = useState<'numbers' | 'pi'>('numbers');
  const [yAxisUnit, setYAxisUnit] = useState<'numbers' | 'pi'>('numbers');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const keyboardButtons = [
    { label: 'x', value: 'x' }, { label: 'y', value: 'y' }, { label: 'a²', value: '^2' }, { label: 'a^b', value: '^' }, { label: '√', value: 'sqrt(' },
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '÷', value: '/' }, { label: 'sin', value: 'sin(' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '×', value: '*' }, { label: 'cos', value: 'cos(' },
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '−', value: '-' }, { label: 'tan', value: 'tan(' },
    { label: '0', value: '0' }, { label: '.', value: '.' }, { label: 'π', value: 'pi' }, { label: '+', value: '+' }, { label: '⌫', action: 'backspace' },
    { label: '(', value: '(' }, { label: ')', value: ')' }, { label: 'e', value: 'e' }, { label: 'ln', value: 'log(' }, { label: 'log', value: 'log10(' }
  ];

  const handleKeyPress = (btn: any) => {
    if (focusedId === null) return;
    
    const exprIndex = expressions.findIndex(e => e.id === focusedId);
    if (exprIndex === -1) return;
    
    const expr = expressions[exprIndex];
    const input = inputRefs.current[focusedId];
    
    if (!input) return;
    
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    
    let newLatex = expr.latex;
    let newCursorPos = start;
    
    if (btn.action === 'backspace') {
      if (start === end && start > 0) {
        newLatex = newLatex.slice(0, start - 1) + newLatex.slice(end);
        newCursorPos = start - 1;
      } else if (start !== end) {
        newLatex = newLatex.slice(0, start) + newLatex.slice(end);
        newCursorPos = start;
      }
    } else if (btn.value) {
      const valToInsert = btn.value;
      if (valToInsert.endsWith('(')) {
        newLatex = newLatex.slice(0, start) + valToInsert + ')' + newLatex.slice(end);
        newCursorPos = start + valToInsert.length;
      } else {
        newLatex = newLatex.slice(0, start) + valToInsert + newLatex.slice(end);
        newCursorPos = start + valToInsert.length;
      }
    }
    
    updateEquation(focusedId, newLatex);
    
    setTimeout(() => {
      if (inputRefs.current[focusedId]) {
        inputRefs.current[focusedId]?.focus();
        inputRefs.current[focusedId]?.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const addEquation = () => {
    const colors = [Theme.blue, Theme.red, Theme.green, Theme.yellow, Theme.indigo, Theme.pink];
    const newId = Date.now();
    setExpressions([...expressions, { 
      id: newId, 
      latex: "", 
      color: colors[expressions.length % colors.length] 
    }]);
    setFocusedId(newId);
  };

  const removeEquation = (id: number) => {
    setExpressions(expressions.filter(e => e.id !== id));
    if (focusedId === id) setFocusedId(null);
  };

  const updateEquation = (id: number, latex: string) => {
    setExpressions(expressions.map(e => e.id === id ? { ...e, latex } : e));
  };

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let val = input.value;
    const start = input.selectionStart || 0;
    
    const expr = expressions.find(ex => ex.id === id);
    if (expr && val.length > expr.latex.length) {
      const insertedChar = val[start - 1];
      if (insertedChar === '(') {
        val = val.slice(0, start) + ')' + val.slice(start);
        updateEquation(id, val);
        setTimeout(() => {
          if (inputRefs.current[id]) {
            inputRefs.current[id]?.setSelectionRange(start, start);
          }
        }, 0);
        return;
      }
    }
    updateEquation(id, val);
  };

  const handleInputKeyDown = (id: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ')') {
      const input = e.currentTarget;
      const start = input.selectionStart;
      if (start !== null && input.value[start] === ')') {
        e.preventDefault();
        input.setSelectionRange(start + 1, start + 1);
      }
    }
  };

  const safeCompile = (expr: string) => {
    if (!expr) return { fn: () => NaN, error: false };
    try {
      let cleanExpr = expr.replace(/y\s*=\s*/, '');
      
      // Auto-close open parentheses for evaluation
      const openParens = (cleanExpr.match(/\(/g) || []).length;
      const closeParens = (cleanExpr.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        cleanExpr += ')'.repeat(openParens - closeParens);
      }

      const compiled = math.compile(cleanExpr);
      // Test evaluation to catch errors early
      compiled.evaluate({ x: 1 });
      
      return {
        fn: (x: number) => {
          try {
            const val = compiled.evaluate({ x });
            return typeof val === 'number' ? val : NaN;
          } catch {
            return NaN;
          }
        },
        error: false
      };
    } catch {
      return { fn: () => NaN, error: true };
    }
  };

  const piLabel = (x: number) => {
    const fraction = x / Math.PI;
    if (Math.abs(fraction) < 0.01) return "0";
    if (Math.abs(fraction - 1) < 0.01) return "π";
    if (Math.abs(fraction + 1) < 0.01) return "-π";
    return `${fraction % 1 === 0 ? fraction : fraction.toFixed(2)}π`;
  };

  return (
    <div className={`grid gap-6 h-full relative transition-all duration-500 ${isSidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, width: 0, overflow: 'hidden', padding: 0, margin: 0 }}
            className="lg:col-span-1 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col gap-4 relative"
          >
            <div className="flex justify-between items-center mb-2 z-10 whitespace-nowrap">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Calculator className="text-fuchsia-400" size={20} /> Equations
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={`p-2 rounded-xl transition-all border ${showKeyboard ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
              title="Toggle Virtual Keyboard"
            >
              <Keyboard size={16} />
            </button>
            <button 
              onClick={addEquation}
              className="p-2 bg-fuchsia-500/10 text-fuchsia-400 rounded-xl hover:bg-fuchsia-500/20 transition-all border border-fuchsia-500/20"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pb-40 z-10">
          <AnimatePresence>
            {expressions.map((expr, idx) => {
              const { error } = safeCompile(expr.latex);
              return (
                <motion.div 
                  key={expr.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors cursor-text ${error && expr.latex ? 'border-red-500/50 bg-red-500/5' : focusedId === expr.id ? 'bg-slate-800 border-fuchsia-500/50' : 'bg-slate-950 border-slate-800'}`}
                  onClick={() => {
                    setFocusedId(expr.id);
                    inputRefs.current[expr.id]?.focus();
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: expr.color }}
                  />
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-sm">f(x)=</span>
                    <input 
                      ref={el => { inputRefs.current[expr.id] = el; }}
                      type="text" 
                      value={expr.latex}
                      onChange={(e) => handleInputChange(expr.id, e)}
                      onKeyDown={(e) => handleInputKeyDown(expr.id, e)}
                      onFocus={() => setFocusedId(expr.id)}
                      placeholder="e.g. sin(x)"
                      className="w-full bg-transparent text-white font-mono text-sm outline-none placeholder:text-slate-700"
                    />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeEquation(expr.id); }}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Virtual Keyboard */}
        <AnimatePresence>
          {showKeyboard && (
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-3 rounded-b-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20"
            >
              <div className="grid grid-cols-5 gap-1.5">
                {keyboardButtons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); handleKeyPress(btn); }}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs py-2.5 rounded-lg transition-colors active:bg-slate-500 flex items-center justify-center shadow-sm"
                  >
                    {btn.label === '⌫' ? <Delete size={14} /> : btn.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )}
    </AnimatePresence>

      {/* Main Graph Area */}
      <div className={`${isSidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'} bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative min-h-[500px] transition-all duration-500`}>
        {/* Graph Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            title={isSidebarCollapsed ? "Show Equations" : "Hide Equations"}
          >
            <Calculator size={18} />
          </button>
        </div>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <div className="flex bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => { setXAxisUnit('numbers'); setYAxisUnit('numbers'); }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${xAxisUnit === 'numbers' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              1, 2, 3
            </button>
            <button 
              onClick={() => { setXAxisUnit('pi'); setYAxisUnit('pi'); }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${xAxisUnit === 'pi' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              π
            </button>
          </div>
        </div>

        <Mafs pan={true} zoom={true}>
          <Coordinates.Cartesian 
            xAxis={xAxisUnit === 'pi' ? { lines: Math.PI, labels: piLabel } : { lines: 1 }}
            yAxis={yAxisUnit === 'pi' ? { lines: Math.PI, labels: piLabel } : { lines: 1 }}
          />
          {expressions.map(expr => {
            const { fn, error } = safeCompile(expr.latex);
            if (error) return null;
            return <Plot.OfX key={expr.id} y={fn} color={expr.color} />;
          })}
        </Mafs>
      </div>
    </div>
  );
};

const CircularMotionSim = () => {
  const [mass, setMass] = useState(2);
  const [radius, setRadius] = useState(1); // meters
  const [velocity, setVelocity] = useState(5);
  const [showTheory, setShowTheory] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const omega = velocity / radius; // angular velocity in rad/s
  const centripetalForce = (mass * velocity * velocity) / radius;

  useEffect(() => {
    let lastTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (!isPaused) {
        setAngle(a => (a + (omega * delta * 180 / Math.PI)) % 360);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [omega, isPaused]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Circular Motion"
        content={
          <>
            <p>Uniform circular motion describes the motion of a body traversing a circular path at a constant speed.</p>
            <div className="bg-blue-500/10 p-4 rounded-xl font-mono text-xs text-blue-400 space-y-2 border border-blue-500/20 my-4">
              <p>Fc = (m × v²) / r</p>
            </div>
            <p>The <strong>Centripetal Force</strong> is the net force that keeps an object moving along a circular path. It is always directed towards the center of the circle.</p>
            <ul className="list-disc pl-5 space-y-2 text-sm mt-4">
              <li><strong>v (Velocity):</strong> Tangential speed of the object.</li>
              <li><strong>r (Radius):</strong> Distance from the center of rotation.</li>
              <li><strong>m (Mass):</strong> Mass of the rotating object.</li>
            </ul>
          </>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Compass className="text-blue-400" /> Circular Motion (3D)
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20"><Info size={20} /></button>
            <div className="bg-blue-600/20 backdrop-blur-md px-4 py-2 rounded-full text-blue-400 font-mono font-bold text-sm border border-blue-500/20">
              Fc = {centripetalForce.toFixed(1)} N
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} />

            {/* Central Axis */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 2, 16]} />
              <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Orbit Path */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
            </mesh>

            {/* Orbiting Object */}
            <group 
              position={[
                Math.cos(angle * Math.PI / 180) * radius, 
                0, 
                Math.sin(angle * Math.PI / 180) * radius
              ]}
            >
              <mesh castShadow>
                <sphereGeometry args={[0.2 + mass * 0.05, 32, 32]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.8} />
              </mesh>

              {/* Centripetal Force Vector (Fc) - Points to center */}
              <ForceArrow3D 
                position={[0, 0, 0]} 
                direction={[
                  -Math.cos(angle * Math.PI / 180), 
                  0, 
                  -Math.sin(angle * Math.PI / 180)
                ]} 
                length={centripetalForce / 20} 
                color="#ef4444" 
                label={`Fc = ${centripetalForce.toFixed(1)}`} 
              />

              {/* Velocity Vector (v) - Points tangential */}
              <ForceArrow3D 
                position={[0, 0, 0]} 
                direction={[
                  -Math.sin(angle * Math.PI / 180), 
                  0, 
                  Math.cos(angle * Math.PI / 180)
                ]} 
                length={velocity / 2} 
                color="#10b981" 
                label={`v = ${velocity.toFixed(1)}`} 
              />
            </group>

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <gridHelper args={[30, 30, '#1e293b', '#020617']} position={[0, -0.99, 0]} />
          </Canvas>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-4 z-20">
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all border border-slate-700"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button onClick={() => setAngle(0)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Velocity (v)" value={velocity} onChange={setVelocity} min={1} max={15} step={0.5} unit="m/s" />
          <ControlField label="Radius (r)" value={radius} onChange={setRadius} min={0.5} max={2} step={0.1} unit="m" />
          <ControlField label="Mass (m)" value={mass} onChange={setMass} min={0.5} max={10} step={0.5} unit="kg" />
        </div>
        <div className="mt-auto p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Angular Velocity (ω)</span>
            <span className="text-sm font-mono font-bold text-blue-400">{omega.toFixed(2)} rad/s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Centripetal Force (Fc)</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{centripetalForce.toFixed(1)} N</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InertiaSim = () => {
  const [shape, setShape] = useState<'disk' | 'rod' | 'sphere'>('disk');
  const [mass, setMass] = useState(5);
  const [radius, setRadius] = useState(0.5);
  const [showTheory, setShowTheory] = useState(false);

  const getInertia = () => {
    switch(shape) {
      case 'disk': return 0.5 * mass * radius * radius;
      case 'rod': return (1/12) * mass * radius * radius;
      case 'sphere': return 0.4 * mass * radius * radius;
      default: return 0;
    }
  };

  const inertia = getInertia();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Moment of Inertia"
        content={
          <>
            <p>Moment of Inertia (I) is a measure of an object's resistance to rotational acceleration. It depends on the object's mass and how that mass is distributed relative to the axis of rotation.</p>
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Disk</div>
                <div className="font-mono text-xs">½mr²</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Rod</div>
                <div className="font-mono text-xs">1/12mr²</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Sphere</div>
                <div className="font-mono text-xs">2/5mr²</div>
              </div>
            </div>
          </>
        }
      />
      <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <Torus className="text-orange-600" /> Moment of Inertia
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"><Info size={22} /></button>
            <div className="bg-orange-600 px-5 py-2.5 rounded-2xl text-white font-mono font-bold text-sm shadow-lg shadow-orange-200">
              I = {inertia.toFixed(4)} kg·m²
            </div>
          </div>
        </div>
        <div className="relative flex-1 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center">
          <motion.div 
            key={shape}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            {shape === 'disk' && (
              <div className="w-48 h-48 bg-orange-100 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-4 h-4 bg-orange-500 rounded-full" />
                <div className="absolute w-full h-1 bg-orange-500/20" />
              </div>
            )}
            {shape === 'rod' && (
              <div className="w-64 h-8 bg-orange-100 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-4 h-4 bg-orange-500 rounded-full" />
              </div>
            )}
            {shape === 'sphere' && (
              <div className="w-48 h-48 bg-orange-100 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent" />
                <div className="w-4 h-4 bg-orange-500 rounded-full z-10" />
              </div>
            )}
            <div className="mt-8 text-sm font-black text-slate-400 uppercase tracking-widest">{shape}</div>
          </motion.div>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Parameters</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {(['disk', 'rod', 'sphere'] as const).map(s => (
              <button 
                key={s}
                onClick={() => setShape(s)}
                className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all border-2 ${shape === s ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <ControlField label="Mass (m)" value={mass} onChange={setMass} min={1} max={20} step={0.5} unit="kg" />
          <ControlField label="Radius (r)" value={radius} onChange={setRadius} min={0.1} max={2} step={0.1} unit="m" />
        </div>
      </div>
    </div>
  );
};

const Newton1Sim = () => {
  const [velocity, setVelocity] = useState(0);
  const [friction, setFriction] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [position, setPosition] = useState(0);
  const [showTheory, setShowTheory] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isSimulating && !isPaused) {
      interval = setInterval(() => {
        setPosition(p => p + velocity * 0.05);
        if (friction > 0) {
          setVelocity(v => {
            const nextV = v > 0 ? Math.max(0, v - friction * 0.1) : Math.min(0, v + friction * 0.1);
            if (nextV === 0) setIsSimulating(false);
            return nextV;
          });
        }
      }, 50);
    }
    if (position > 15) setPosition(-15);
    else if (position < -15) setPosition(15);
    return () => clearInterval(interval);
  }, [isSimulating, isPaused, velocity, friction, position]);

  const reset = () => {
    setIsSimulating(false);
    setIsPaused(false);
    setPosition(0);
    setVelocity(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Newton's 1st Law (Inertia)"
        content={
          <div className="space-y-4 text-slate-300">
            <p>Newton's First Law of Motion, also known as the Law of Inertia, states that an object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.</p>
            <p><strong>Inertia</strong> is the tendency of an object to resist changes in its state of motion. Mass is a measure of inertia.</p>
            <p>In this simulation, if friction is zero, the object will move forever at a constant velocity once started.</p>
          </div>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2"><Zap className="text-blue-400" /> Newton's 1st Law (3D)</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20"><Info size={20} /></button>
            <div className="bg-blue-600/20 backdrop-blur-md px-4 py-2 rounded-full text-blue-400 font-mono font-bold text-sm border border-blue-500/20">
              v = {velocity.toFixed(1)} m/s
            </div>
          </div>
        </div>
        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault />

            {/* Surface */}
            <mesh position={[0, -0.5, 0]} receiveShadow>
              <boxGeometry args={[30, 1, 10]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <gridHelper args={[30, 30, '#334155', '#0f172a']} position={[0, 0.01, 0]} />

            {/* Puck */}
            <mesh position={[position, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>

            {/* Velocity Vector */}
            {velocity !== 0 && (
              <ForceArrow3D 
                position={[position, 0.25, 0]} 
                direction={[velocity > 0 ? 1 : -1, 0, 0]} 
                length={Math.abs(velocity) / 2} 
                color="#3b82f6" 
                label={`v = ${Math.abs(velocity).toFixed(1)}`} 
              />
            )}

            {/* Friction Force */}
            {friction > 0 && isSimulating && velocity !== 0 && (
              <ForceArrow3D 
                position={[position, 0.25, 0]} 
                direction={[velocity > 0 ? -1 : 1, 0, 0]} 
                length={friction * 2} 
                color="#ef4444" 
                label={`f = ${friction.toFixed(1)}`} 
              />
            )}
          </Canvas>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-4 z-20">
            <button 
              onClick={() => { setVelocity(5); setIsSimulating(true); setIsPaused(false); }} 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-900/20 transition-all uppercase tracking-widest"
            >
              Give a Push!
            </button>
            {isSimulating && (
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all border border-slate-700"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
            )}
            <button onClick={reset} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Initial Velocity" value={velocity} onChange={setVelocity} min={-20} max={20} step={1} unit="m/s" />
          <ControlField label="Friction" value={friction} onChange={setFriction} min={0} max={1} step={0.05} unit="" presets={[{label:'Vacuum',value:0},{label:'Ice',value:0.05},{label:'Carpet',value:0.5}]} />
        </div>
        <div className="mt-auto p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-[10px] text-blue-400 leading-relaxed">
          <Info size={14} className="inline mb-1 mr-2" /> Without friction or other external forces, the puck's velocity remains constant.
        </div>
      </div>
    </div>
  );
};

const Newton2Sim = () => {
  const [mass, setMass] = useState(10); // kg
  const [force, setForce] = useState(50); // N
  const [friction, setFriction] = useState(0.2); // coefficient
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [showTheory, setShowTheory] = useState(false);

  const g = 10;
  const frictionForce = friction * mass * g;
  const netForce = Math.max(0, force - frictionForce);
  const acceleration = netForce / mass;

  useEffect(() => {
    let lastTime = Date.now();
    let interval: any;
    if (isSimulating && !isPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        
        setVelocity(v => v + acceleration * delta);
        setPosition(p => p + velocity * delta);
      }, 16);
    }
    if (position > 15) reset(); // Reset if it goes too far
    return () => clearInterval(interval);
  }, [isSimulating, isPaused, acceleration, velocity, position]);

  const reset = () => {
    setIsSimulating(false);
    setIsPaused(false);
    setPosition(0);
    setVelocity(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Newton's 2nd Law"
        content={
          <>
            <p>Newton's Second Law of Motion states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.</p>
            <div className="bg-yellow-500/10 p-4 rounded-xl font-mono text-xs text-yellow-400 space-y-2 border border-yellow-500/20 my-4">
              <p>F_net = m × a</p>
            </div>
            <p>In this simulation, the net force is the applied force minus the frictional force (F_friction = μ × m × g).</p>
          </>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Zap className="text-yellow-400" /> Newton's 2nd Law (3D)
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-yellow-500/10 text-yellow-400 rounded-xl hover:bg-yellow-500/20 transition-all border border-yellow-500/20"><Info size={20} /></button>
            <div className="bg-yellow-600/20 backdrop-blur-md px-4 py-2 rounded-full text-yellow-400 font-mono font-bold text-sm border border-yellow-500/20">
              a = {acceleration.toFixed(2)} m/s²
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [5, 5, 10], fov: 45 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault />

            {/* Floor/Track */}
            <mesh position={[0, -0.5, 0]} receiveShadow>
              <boxGeometry args={[30, 1, 10]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <gridHelper args={[30, 30, '#334155', '#0f172a']} position={[0, 0.01, 0]} />

            {/* Moving Box */}
            <group position={[position - 5, 0.5, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1 + mass * 0.02, 1 + mass * 0.02, 1 + mass * 0.02]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.8} />
              </mesh>
              
              {/* Applied Force Arrow */}
              <ForceArrow3D 
                position={[0.5 + mass * 0.01, 0, 0]} 
                direction={[1, 0, 0]} 
                length={force / 50} 
                color="#ef4444" 
                label={`F_app = ${force}N`} 
              />

              {/* Friction Force Arrow */}
              {friction > 0 && (
                <ForceArrow3D 
                  position={[-0.5 - mass * 0.01, -0.4, 0]} 
                  direction={[-1, 0, 0]} 
                  length={frictionForce / 50} 
                  color="#94a3b8" 
                  label={`f = ${frictionForce.toFixed(1)}N`} 
                />
              )}

              {/* Normal Force */}
              <ForceArrow3D 
                position={[0, 0.5 + mass * 0.01, 0]} 
                direction={[0, 1, 0]} 
                length={1.2} 
                color="#3b82f6" 
                label="N" 
              />

              {/* Weight */}
              <ForceArrow3D 
                position={[0, 0, 0]} 
                direction={[0, -1, 0]} 
                length={1.2} 
                color="#fbbf24" 
                label="mg" 
              />
            </group>
          </Canvas>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-4 z-20">
            <button 
              onClick={() => {
                if (!isSimulating) setIsSimulating(true);
                else setIsPaused(!isPaused);
              }}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${isSimulating && !isPaused ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-yellow-600 text-white shadow-yellow-600/20'}`}
            >
              {!isSimulating ? 'Start' : isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={reset} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Applied Force" value={force} onChange={setForce} min={0} max={200} step={5} unit="N" />
          <ControlField label="Mass" value={mass} onChange={setMass} min={1} max={50} step={1} unit="kg" presets={[{label:'Light',value:5},{label:'Medium',value:20},{label:'Heavy',value:50}]} />
          <ControlField label="Friction (μ)" value={friction} onChange={setFriction} min={0} max={1} step={0.05} unit="" presets={[{label:'Ice',value:0.05},{label:'Wood',value:0.3},{label:'Rubber',value:0.7}]} />
        </div>
        <div className="mt-auto p-5 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Velocity</span>
            <span className="text-sm font-mono font-bold text-yellow-400">{velocity.toFixed(2)} m/s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Net Force</span>
            <span className="text-sm font-mono font-bold text-red-400">{netForce.toFixed(1)} N</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Newton3Sim = () => {
  const [mass1, setMass1] = useState(60);
  const [mass2, setMass2] = useState(80);
  const [pushForce, setPushForce] = useState(100);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pos1, setPos1] = useState(-0.5);
  const [pos2, setPos2] = useState(0.5);
  const [vel1, setVel1] = useState(0);
  const [vel2, setVel2] = useState(0);
  const [showTheory, setShowTheory] = useState(false);

  const acc1 = pushForce / mass1;
  const acc2 = pushForce / mass2;

  useEffect(() => {
    let lastTime = Date.now();
    let interval: any;
    if (isSimulating && !isPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        setVel1(v => v - acc1 * delta);
        setVel2(v => v + acc2 * delta);
        setPos1(p => p + vel1 * delta * 5);
        setPos2(p => p + vel2 * delta * 5);
      }, 16);
    }
    if (Math.abs(pos1) > 50) reset();
    return () => clearInterval(interval);
  }, [isSimulating, isPaused, acc1, acc2, vel1, vel2, pos1]);

  const reset = () => {
    setIsSimulating(false);
    setIsPaused(false);
    setPos1(-0.5);
    setPos2(0.5);
    setVel1(0);
    setVel2(0);
  };

  useEffect(() => {
    if (pos1 === -5) reset();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
      <TheoryPanel 
        isOpen={showTheory} 
        onClose={() => setShowTheory(false)}
        title="Newton's 3rd Law"
        content={
          <>
            <p>Newton's Third Law of Motion states that for every action, there is an equal and opposite reaction.</p>
            <p>If object A exerts a force on object B, then object B exerts a force of equal magnitude and opposite direction on object A.</p>
            <div className="bg-purple-500/10 p-4 rounded-xl font-mono text-xs text-purple-400 space-y-2 border border-purple-500/20 my-4">
              <p>F_AB = -F_BA</p>
            </div>
            <p>Even though the forces are equal, the resulting accelerations depend on the masses of the objects (a = F/m).</p>
          </>
        }
      />
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Zap className="text-purple-400" /> Newton's 3rd Law (3D)
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTheory(true)} className="p-2 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all border border-purple-500/20"><Info size={20} /></button>
            <div className="bg-purple-600/20 backdrop-blur-md px-4 py-2 rounded-full text-purple-400 font-mono font-bold text-sm border border-purple-500/20">
              Action = Reaction = {pushForce} N
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 3, 10], fov: 45 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <OrbitControls makeDefault />

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 10]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <gridHelper args={[100, 50, '#334155', '#0f172a']} position={[0, 0.01, 0]} />

            {/* Object 1 (Astronaut/Box) */}
            <group position={[pos1, 0.5, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1 + mass1 * 0.01, 1 + mass1 * 0.01, 1 + mass1 * 0.01]} />
                <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.8} />
              </mesh>
              {isSimulating && (
                <ForceArrow3D 
                  position={[-0.5 - mass1 * 0.005, 0, 0]} 
                  direction={[-1, 0, 0]} 
                  length={pushForce / 100} 
                  color="#ef4444" 
                  label={`F_reaction = ${pushForce}N`} 
                />
              )}
            </group>

            {/* Object 2 (Astronaut/Box) */}
            <group position={[pos2, 0.5, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1 + mass2 * 0.01, 1 + mass2 * 0.01, 1 + mass2 * 0.01]} />
                <meshStandardMaterial color="#f43f5e" roughness={0.3} metalness={0.8} />
              </mesh>
              {isSimulating && (
                <ForceArrow3D 
                  position={[0.5 + mass2 * 0.005, 0, 0]} 
                  direction={[1, 0, 0]} 
                  length={pushForce / 100} 
                  color="#ef4444" 
                  label={`F_action = ${pushForce}N`} 
                />
              )}
            </group>

            <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          </Canvas>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-4 z-20">
            <button 
              onClick={() => {
                if (!isSimulating) setIsSimulating(true);
                else setIsPaused(!isPaused);
              }}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${isSimulating && !isPaused ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-purple-600 text-white shadow-purple-600/20'}`}
            >
              {!isSimulating ? 'Start' : isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={reset} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-8">
        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest"><Settings2 size={18} /> Lab Config</h3>
        <div className="space-y-8">
          <ControlField label="Interaction Force" value={pushForce} onChange={setPushForce} min={10} max={200} step={10} unit="N" />
          <ControlField label="Mass Object 1" value={mass1} onChange={setMass1} min={1} max={100} step={1} unit="kg" />
          <ControlField label="Mass Object 2" value={mass2} onChange={setMass2} min={1} max={100} step={1} unit="kg" />
        </div>
        <div className="mt-auto p-5 bg-purple-500/5 rounded-2xl border border-purple-500/10 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Obj 1 Vel</span>
            <span className="text-sm font-mono font-bold text-indigo-400">{vel1.toFixed(2)} m/s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Obj 2 Vel</span>
            <span className="text-sm font-mono font-bold text-rose-400">{vel2.toFixed(2)} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [activeSim, setActiveSim] = useState<SimulationType>(null);
  const [category, setCategory] = useState<Category>('newton');
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [isMainSidebarCollapsed, setIsMainSidebarCollapsed] = useState(false);

  const curriculumNav = [
    {
      subject: 'Physics',
      units: [
        {
          name: 'Mechanics',
          topics: [
            { id: 'newton1', cat: 'newton', title: "Newton's 1st Law" },
            { id: 'newton2', cat: 'newton', title: "Newton's 2nd Law" },
            { id: 'newton3', cat: 'newton', title: "Newton's 3rd Law" },
            { id: 'centripetal', cat: 'circular', title: 'Centripetal Force' },
            { id: 'torque', cat: 'rotational', title: 'Torque Lab' },
            { id: 'inertia', cat: 'rotational', title: 'Moment of Inertia' },
            { id: 'rolling', cat: 'rotational', title: 'Rolling Incline' },
          ]
        },
        {
          name: 'Fluid Dynamics',
          topics: [
            { id: 'origin', cat: 'hydrostatics', title: 'Origin of Upthrust' },
            { id: 'apparent', cat: 'hydrostatics', title: 'Apparent Weight' },
            { id: 'flotation', cat: 'hydrostatics', title: 'Law of Flotation' },
            { id: 'stability', cat: 'hydrostatics', title: 'Stability Lab' },
            { id: 'hydrometer', cat: 'hydrostatics', title: 'Hydrometer' },
          ]
        }
      ]
    },
    {
      subject: 'Mathematics',
      units: [
        {
          name: 'Tools',
          topics: [
            { id: 'graphing', cat: 'math', title: 'Graphing Calculator' },
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex overflow-hidden selection:bg-blue-500/30">
      
      {/* App Shell Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isMainSidebarCollapsed ? 80 : 320 }}
        className="h-screen bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0 z-50 transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
          {!isMainSidebarCollapsed && (
            <div className="relative cursor-pointer" onClick={() => setActiveSim(null)}>
              <h1 className="text-2xl font-black text-white tracking-tighter">
                Phys<span className="text-blue-500">Lab</span>.
              </h1>
            </div>
          )}
          {isMainSidebarCollapsed && (
            <div className="w-full flex justify-center cursor-pointer" onClick={() => setActiveSim(null)}>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black">P</div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          {!isMainSidebarCollapsed ? (
            <div className="px-4 space-y-8">
              {curriculumNav.map((subject) => (
                <div key={subject.subject}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2">{subject.subject}</h3>
                  <div className="space-y-6">
                    {subject.units.map((unit) => (
                      <div key={unit.name}>
                        <h4 className="text-xs font-bold text-slate-400 mb-2 px-2">{unit.name}</h4>
                        <div className="space-y-1">
                          {unit.topics.map((topic) => (
                            <button
                              key={topic.id}
                              onClick={() => {
                                setActiveSim(topic.id as SimulationType);
                                setCategory(topic.cat as Category);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeSim === topic.id ? 'bg-blue-500/10 text-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                              {topic.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button onClick={() => setActiveSim(null)} className="p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Home">
                <Activity size={20} />
              </button>
              <div className="w-8 h-px bg-slate-800" />
              <button onClick={() => setShowFormulaSheet(true)} className="p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Formula Sheet">
                <BookOpen size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800/50 flex justify-center">
          <button 
            onClick={() => setIsMainSidebarCollapsed(!isMainSidebarCollapsed)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ChevronRight size={16} className={`transition-transform duration-300 ${isMainSidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            {activeSim ? (
              <>
                <button onClick={() => setActiveSim(null)} className="hover:text-white transition-colors">Home</button>
                <ChevronRight size={14} className="text-slate-600" />
                <span className="capitalize">{category}</span>
                <ChevronRight size={14} className="text-slate-600" />
                <span className="text-white">
                  {curriculumNav.flatMap(s => s.units).flatMap(u => u.topics).find(t => t.id === activeSim)?.title}
                </span>
              </>
            ) : (
              <span className="text-white">Dashboard</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFormulaSheet(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors border border-slate-700"
            >
              <BookOpen size={14} /> Formula Sheet
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto">
          {!activeSim ? (
            <Dashboard onSelect={(sim, cat) => { setActiveSim(sim); setCategory(cat); }} />
          ) : (
            <div className="h-[calc(100vh-8rem)]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeSim} 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.98 }} 
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                  className="h-full"
                >
                  {activeSim === 'newton1' && <Newton1Sim />}
                  {activeSim === 'newton2' && <Newton2Sim />}
                  {activeSim === 'newton3' && <Newton3Sim />}
                  {activeSim === 'centripetal' && <CircularMotionSim />}
                  {activeSim === 'torque' && <RotationalMotionSim />}
                  {activeSim === 'inertia' && <InertiaSim />}
                  {activeSim === 'rolling' && <RollingInclineSim />}
                  {activeSim === 'origin' && <OriginOfUpthrustSim />}
                  {activeSim === 'apparent' && <ApparentWeightSim />}
                  {activeSim === 'flotation' && <FlotationSim />}
                  {activeSim === 'stability' && <StabilitySim />}
                  {activeSim === 'hydrometer' && <HydrometerSim />}
                  {activeSim === 'graphing' && <GraphingCalculatorSim />}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Formula Sheet Modal */}
      <AnimatePresence>
        {showFormulaSheet && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h2 className="text-2xl font-black tracking-tighter text-white">Formula Reference</h2>
                <button onClick={() => setShowFormulaSheet(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><RefreshCw size={20} className="rotate-45 text-slate-500" /></button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto bg-slate-900">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Dynamics</h3>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Force</span><span>F = ma</span></div>
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Friction</span><span>f = μN</span></div>
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Momentum</span><span>p = mv</span></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-400">Rotation</h3>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Torque</span><span>τ = rFsinθ</span></div>
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Centripetal</span><span>Fc = mv²/r</span></div>
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Inertia</span><span>I = Σmr²</span></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Hydrostatics</h3>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Pressure</span><span>P = hρg</span></div>
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Upthrust</span><span>U = Vρg</span></div>
                    <div className="flex justify-between p-2 bg-slate-800 rounded-lg text-slate-300"><span>Apparent W</span><span>Wa = W - U</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
