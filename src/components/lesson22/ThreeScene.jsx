// src/components/lesson22/ThreeScene.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Float, Octahedron, Grid, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- 共通コンポーネント: 部屋の区切り (Bulkhead) ---
const Partition = ({ position, label, subLabel }) => (
  <group position={position}>
    {/* フレーム構造 */}
    <mesh position={[-5, 0, 0]}>
      <boxGeometry args={[2, 12, 1]} />
      <meshStandardMaterial color="#333" roughness={0.5} />
    </mesh>
    <mesh position={[5, 0, 0]}>
      <boxGeometry args={[2, 12, 1]} />
      <meshStandardMaterial color="#333" roughness={0.5} />
    </mesh>
    <mesh position={[0, 5, 0]}>
      <boxGeometry args={[12, 2, 1]} />
      <meshStandardMaterial color="#333" roughness={0.5} />
    </mesh>
    
    {/* ラベル */}
    <Text position={[0, 5, 0.6]} fontSize={0.5} color="white" anchorX="center" anchorY="middle" letterSpacing={0.2}>
      {label}
    </Text>
    <Text position={[0, 4.2, 0.6]} fontSize={0.25} color="#0ea5e9" anchorX="center" anchorY="middle" letterSpacing={0.1}>
      {subLabel}
    </Text>
  </group>
);

// --- 1. Gate (z: 0) ---
const Gate = ({ scrollZ }) => {
  // 改良: -10 (結構スクロールしないと開かない)
  const triggerZ = -10; 
  const isOpen = scrollZ < triggerZ;
  
  // ゲート自体の位置も少し奥まらせて、アプローチ感を作る
  const gatePos = -5;

  return (
    <group position={[0, 0, gatePos]}>
      {/* Left Door */}
      <mesh position={[-2 - (isOpen ? 3.5 : 0), 0, 0]} transition>
        <boxGeometry args={[4, 12, 0.5]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Right Door */}
      <mesh position={[2 + (isOpen ? 3.5 : 0), 0, 0]}>
        <boxGeometry args={[4, 12, 0.5]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Opening Text */}
      <Html position={[0, 1, 2]} center transform style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.5s' }}>
        <div className="pointer-events-none text-center">
          <p className="text-xs tracking-[0.5em] uppercase text-gray-500 mb-4">Security Check</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-black whitespace-nowrap">LESSON 22</h1>
          <p className="mt-8 text-[10px] uppercase tracking-widest text-emerald-600 animate-pulse">Scroll to Authorize</p>
        </div>
      </Html>
    </group>
  );
};

// --- 2. Archives (z: -25) ---
const ArchiveCard = ({ position, title, text, color }) => (
  <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
    <group position={position}>
      <mesh>
        <planeGeometry args={[3.5, 5]} />
        <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} transparent opacity={0.9} />
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(3.5, 5)]} />
          <lineBasicMaterial color={color} />
        </lineSegments>
      </mesh>
      <Html transform position={[0, 0, 0.1]} scale={0.4}>
        <div className="w-64 text-left p-6 select-none font-sans">
          <div className="border-b border-gray-700 pb-2 mb-2" style={{ borderColor: color }}>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
        </div>
      </Html>
    </group>
  </Float>
);

// --- 3. Lab (z: -45) - Interactive Crystals ---
const Crystal = ({ position, color, label, description, type, activeId, setActiveId }) => {
  const mesh = useRef();
  const isActive = activeId === type;

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.5;
    if (isActive) {
      mesh.current.rotation.x += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      <Float speed={isActive ? 0 : 3} rotationIntensity={0.5} floatIntensity={1}>
        {/* 改良: Octahedron (8角錐) */}
        <mesh 
          ref={mesh} 
          onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : type); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
          scale={isActive ? 1.5 : 1}
        >
          <octahedronGeometry args={[1.5, 0]} />
          <meshPhysicalMaterial 
            color={isActive ? '#fff' : color} 
            emissive={isActive ? color : '#000'}
            emissiveIntensity={isActive ? 2 : 0}
            roughness={0.1} 
            transmission={0.6}
            thickness={2}
          />
        </mesh>
        
        {/* 常時表示ラベル */}
        {!isActive && (
          <Html position={[0, -2.5, 0]} center>
            <div className="px-3 py-1 border border-white/20 bg-black/50 text-white text-xs uppercase tracking-widest backdrop-blur-md rounded-full pointer-events-none">
              {label}
            </div>
          </Html>
        )}

        {/* クリック時詳細パネル */}
        {isActive && (
          <Html position={[0, 3, 0]} center zIndexRange={[100, 0]}>
            <div className="w-72 bg-black/90 border border-white/30 p-6 rounded-lg backdrop-blur-xl animate-fade-in-up">
              <h3 className="text-xl font-serif mb-2" style={{ color: color }}>{label}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                className="mt-4 text-[10px] uppercase border border-white/20 px-3 py-1 rounded hover:bg-white hover:text-black transition-colors"
              >
                Close
              </button>
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
};

const LabSection = () => {
  const [activeId, setActiveId] = useState(null);

  return (
    <group position={[0, 0, -45]}>
      <Crystal 
        position={[-3, 0, 0]} 
        color="#f43f5e" 
        label="Offload" 
        type="offload"
        description="思考の丸投げ。楽だが検証コストが増大し、思考力が衰えるリスクがある。「2000行のコード生成」の落とし穴。"
        activeId={activeId}
        setActiveId={setActiveId}
      />
      <Crystal 
        position={[3, 0, 0]} 
        color="#10b981" 
        label="Augment" 
        type="augment"
        description="思考の加速。自分の脳をエンジンとし、AIをターボチャージャーとして使う。「壁打ち」「対話学習」が鍵。"
        activeId={activeId}
        setActiveId={setActiveId}
      />
      <Html position={[0, 3, 0]} center transform scale={2}>
         <div className="pointer-events-none opacity-50">
            <h2 className="text-white font-serif text-center">Touch Crystals</h2>
         </div>
      </Html>
    </group>
  );
};


// --- 4. Map (z: -65) ---
const HologramMap = () => (
  <group position={[0, -1, -65]}>
    <Grid args={[20, 20]} cellSize={0.5} cellThickness={1} cellColor="#0ea5e9" sectionSize={5} sectionThickness={1.5} sectionColor="#0284c7" fadeDistance={20} />
    <Html position={[0, 2, 0]} center transform>
       <div className="text-center p-8 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-full">
         <h2 className="text-4xl font-serif text-cyan-400 mb-2" style={{ textShadow: '0 0 20px cyan' }}>Mindset Positioning</h2>
         <p className="text-xs text-cyan-200 tracking-widest uppercase">Engine: Human / Booster: AI</p>
       </div>
    </Html>
  </group>
);

// --- 5. Destination (z: -85) & 6. Spaceship ---
const Destination = () => (
  <group position={[0, 0, -85]}>
     <Float speed={1} rotationIntensity={0.1}>
        <Html center transform>
          <div className="bg-black/80 border-l-4 border-emerald-500 p-8 rounded-r-lg text-center w-[500px] backdrop-blur-xl">
             <h2 className="text-3xl font-serif text-white mb-4">Mission Report</h2>
             <p className="text-sm text-gray-300 mb-6 leading-loose text-left">
                我々はAIに「思考」を奪われるのではない。<br/>
                <span className="text-emerald-400 font-bold">「検証」と「判断」</span>という新しい思考領域へ移行するのだ。<br/>
                良き航海を。
             </p>
             <div className="text-[10px] text-gray-600 uppercase tracking-[0.3em] text-right">End of Lesson 22</div>
          </div>
        </Html>
     </Float>
  </group>
);


// --- Main Scene Controller ---
const SceneContent = ({ scrollY }) => {
  const { camera, scene } = useThree();
  
  // スクロール感度の調整
  const targetZ = -(scrollY * 0.02); 

  useFrame(() => {
    // カメラ移動（スムーズ）
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    
    // 背景色: Gate付近は白、以降は宇宙の黒
    const z = camera.position.z;
    // z=0(白) -> z=-15(黒)
    const progress = THREE.MathUtils.clamp(-z / 15, 0, 1);
    
    const colorWhite = new THREE.Color('#f1f5f9');
    const colorBlack = new THREE.Color('#050505');
    
    const currentColor = colorWhite.clone().lerp(colorBlack, progress);
    scene.background = currentColor;
    // 霧を少し薄くして、奥の部屋が見えるようにする
    scene.fog = new THREE.FogExp2(currentColor, 0.02);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -5, -10]} color="#0ea5e9" intensity={2} />

      {/* 床 (Deck) - ずっと続くグリッド */}
      <group position={[0, -4, -50]}>
        <Grid 
            args={[10, 200]} // 幅10, 長さ200
            cellSize={1} 
            cellThickness={1} 
            cellColor="#333" 
            sectionSize={10} 
            sectionThickness={1.5} 
            sectionColor="#555" 
            fadeDistance={50} 
            infiniteGrid={true}
        />
      </group>

      {/* 1. Gate Area */}
      <Gate scrollZ={targetZ} />

      {/* Partition 1: Archive Entrance */}
      <Partition position={[0, -4, -15]} label="SECTOR A" subLabel="ARCHIVES" />

      {/* 2. Archives Area */}
      <group position={[0, 0, -25]}>
        <ArchiveCard position={[-3.5, 1, 0]} title="Deep Think" text="2025年、AIは推論能力を獲得。答えを即答せず、思考プロセスを持つようになった。" color="#34d399" />
        <ArchiveCard position={[3.5, -1, -2]} title="Risks" text="思考の丸投げは批判的思考力を低下させる。「認知オフロード」の罠。" color="#f43f5e" />
        <ArchiveCard position={[0, 2.5, -4]} title="Speed & Quality" text="適切な利用は生産性を劇的に向上させる。速度と質の両立が可能。" color="#6366f1" />
      </group>

      {/* Partition 2: Lab Entrance */}
      <Partition position={[0, -4, -35]} label="SECTOR B" subLabel="LABORATORY" />

      {/* 3. Lab Area */}
      <LabSection />

      {/* Partition 3: Map Entrance */}
      <Partition position={[0, -4, -55]} label="SECTOR C" subLabel="BRIDGE" />

      {/* 4. Map Area */}
      <HologramMap />

      {/* 5. Destination & Ending */}
      <Destination />
      
      {/* Stars (Only visible in dark areas) */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
    </>
  );
};

export default function ThreeScene() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <SceneContent scrollY={scrollY} />
      </Canvas>
    </div>
  );
}