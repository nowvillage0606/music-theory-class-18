// src/components/lesson22/ThreeScene.jsx
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Text, Float, Tetrahedron, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- 各セクションの定義 ---
// 1. Gate (z: 0)
const Gate = ({ scrollZ }) => {
  // スクロール(scrollZ)が -5 を超えたら開き始める
  const isOpen = scrollZ < -5;
  const offset = isOpen ? 4 : 0; // 開く幅
  
  return (
    <group position={[0, 0, 0]}>
      {/* Left Door */}
      <mesh position={[-2 - (isOpen ? 4 : 0), 0, 0]} transition>
        <boxGeometry args={[4, 10, 0.5]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Right Door */}
      <mesh position={[2 + (isOpen ? 4 : 0), 0, 0]}>
        <boxGeometry args={[4, 10, 0.5]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Title Text in 3D */}
      <Html position={[0, 0.5, 1]} center transform>
        <div className="pointer-events-none text-center opacity-80" style={{ color: isOpen ? 'transparent' : '#333', transition: 'color 1s' }}>
          <p className="text-xs tracking-[0.5em] uppercase mb-4">Lesson 22</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold whitespace-nowrap">Thinking in AI</h1>
          <p className="mt-4 text-xs tracking-widest animate-bounce">Scroll to Enter</p>
        </div>
      </Html>
    </group>
  );
};

// 2. Archives (z: -20)
const ArchiveCard = ({ position, title, text, color = "white" }) => (
  <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
    <group position={position}>
      <mesh>
        <planeGeometry args={[3, 4]} />
        <meshBasicMaterial color="black" transparent opacity={0.6} side={THREE.DoubleSide} />
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(3, 4)]} />
          <lineBasicMaterial color={color} opacity={0.3} transparent />
        </lineSegments>
      </mesh>
      <Html transform position={[0, 0, 0.1]} scale={0.5}>
        <div className="w-48 text-left select-none p-4">
          <h3 className="text-lg font-serif text-white mb-2 border-b border-gray-700 pb-1">{title}</h3>
          <p className="text-xs text-gray-300 leading-relaxed">{text}</p>
        </div>
      </Html>
    </group>
  </Float>
);

// 3. Lab (z: -40) - Crystals
const Crystal = ({ position, color, label }) => {
  const mesh = useRef();
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.3;
  });
  
  return (
    <group position={position}>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={mesh}>
          <tetrahedronGeometry args={[1.5, 0]} />
          <meshPhysicalMaterial 
            color={color} 
            thickness={2} 
            roughness={0} 
            transmission={0.6} // Glass like
            metalness={0.2}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.TetrahedronGeometry(1.5, 0)]} />
            <lineBasicMaterial color="white" opacity={0.5} transparent />
          </lineSegments>
        </mesh>
        <Html position={[0, -2.5, 0]} center>
          <div className="px-3 py-1 border border-white/20 bg-black/50 text-white text-xs uppercase tracking-widest backdrop-blur-md rounded-full">
            {label}
          </div>
        </Html>
      </Float>
    </group>
  );
};

// 4. Map (z: -60)
const HologramMap = () => (
  <group position={[0, -2, -60]}>
    <Grid args={[20, 20]} cellSize={1} cellThickness={1} cellColor="#0ea5e9" sectionSize={5} sectionThickness={1.5} sectionColor="#0284c7" fadeDistance={20} />
    <Html position={[0, 3, 0]} center transform>
       <div className="text-center">
         <h2 className="text-4xl font-serif text-cyan-400 mb-2" style={{ textShadow: '0 0 10px cyan' }}>Mindset Map</h2>
         <p className="text-xs text-cyan-200">You are the Engine. AI is the Booster.</p>
       </div>
    </Html>
  </group>
);

// 5. Destination (z: -80) & 6. Spaceship (Context)
const Destination = () => (
  <group position={[0, 0, -85]}>
     <Float speed={1} rotationIntensity={0.1}>
        <Html center transform>
          <div className="bg-black/80 border border-emerald-500/30 p-8 rounded-lg text-center w-[500px] backdrop-blur-xl">
             <h2 className="text-3xl font-serif text-white mb-4">Mission Report</h2>
             <p className="text-sm text-gray-300 mb-6">
                AIは思考を奪わない。<br/>
                「使い方の設計」が、あなたの思考を加速させる。
             </p>
             <div className="text-[10px] text-emerald-500 uppercase tracking-[0.3em]">End of Lesson</div>
          </div>
        </Html>
     </Float>
  </group>
);


// --- Main Scene Controller ---
const SceneContent = ({ scrollY }) => {
  const { camera, scene } = useThree();
  
  // スクロール量(px) を 3D座標(z) に変換
  // 1000pxスクロールするごとに zが -10 進む感覚
  const targetZ = -(scrollY * 0.02); 

  useFrame(() => {
    // カメラ移動（スムーズに追従）
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);

    // 背景色の制御: Gate(0)付近は白、Archives(-20)以降は黒
    // zが 0 -> -15 の間で 白 -> 黒 に変化
    const z = camera.position.z;
    const progress = THREE.MathUtils.clamp(-z / 15, 0, 1);
    
    const colorWhite = new THREE.Color('#f8fafc'); // Slate-50
    const colorBlack = new THREE.Color('#050505');
    
    // 背景色を線形補間
    const currentColor = colorWhite.clone().lerp(colorBlack, progress);
    scene.background = currentColor;
    scene.fog = new THREE.FogExp2(currentColor, 0.03); // 霧の色も同期
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="blue" intensity={0.5} />

      {/* 1. Gate */}
      <Gate scrollZ={targetZ} />

      {/* 2. Archives (z: -15 ~ -25) */}
      <group position={[0, 0, -20]}>
        <ArchiveCard position={[-3, 1, 0]} title="Deep Think" text="2025年、AIは推論能力を獲得し、答えを導き出すための思考プロセスを持つようになった。" color="#34d399" />
        <ArchiveCard position={[3, -1, -2]} title="Cognitive Offload" text="思考の丸投げはリスクを伴う。検証なき依存は批判的思考力を低下させる。" color="#f43f5e" />
        <ArchiveCard position={[0, 2, -4]} title="Productivity" text="適切な利用は生産性を劇的に向上させる。速度と質の両立が可能になる。" color="#6366f1" />
      </group>

      {/* 3. Lab (z: -40) */}
      <group position={[0, 0, -40]}>
        <Crystal position={[-3, 0, 0]} color="#f43f5e" label="Offload" />
        <Crystal position={[3, 0, 0]} color="#10b981" label="Augment" />
        <Html position={[0, 2, 0]} center transform scale={2}>
           <h2 className="text-white font-serif opacity-50">Two Paths</h2>
        </Html>
      </group>

      {/* 4. Map (z: -60) */}
      <HologramMap />

      {/* 5, 6, 7. Destination & Space */}
      <Destination />
      
      {/* Stars for the ending (visible when bg is dark) */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

export default function ThreeScene() {
  const [scrollY, setScrollY] = useState(0);

  // スクロールイベントの監視
  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <SceneContent scrollY={scrollY} />
      </Canvas>
    </div>
  );
}
