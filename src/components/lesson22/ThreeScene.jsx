// src/components/lesson22/ThreeScene.jsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Float, Grid, Stars, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// --- 距離に応じて出現・消失するラッパー ---
const Section = ({ z, children, fadeRange = 15 }) => {
  const group = useRef();
  
  useFrame(({ camera }) => {
    if (!group.current) return;
    
    // カメラとこのセクションの距離
    const dist = Math.abs(camera.position.z - z);
    
    // 距離が fadeRange より近ければ表示、遠ければ消す
    // 完全に近づいたら opacity: 1, scale: 1
    const progress = 1 - THREE.MathUtils.clamp(dist / fadeRange, 0, 1);
    const ease = progress * progress * (3 - 2 * progress); // smoothstep

    group.current.scale.setScalar(ease);
    
    // 子要素のマテリアル透明度を制御（簡易実装）
    group.current.traverse((obj) => {
      if (obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = ease;
        obj.visible = ease > 0.01; // 見えない時は描画しない
      }
    });
  });

  return <group ref={group} position={[0, 0, z]}>{children}</group>;
};

// --- 共通パーツ: 隔壁 (Partition) ---
const Partition = ({ label, subLabel }) => (
  <group>
    <mesh position={[-6, 0, 0]}>
      <boxGeometry args={[1, 15, 1]} />
      <meshStandardMaterial color="#222" metalness={0.8} />
    </mesh>
    <mesh position={[6, 0, 0]}>
      <boxGeometry args={[1, 15, 1]} />
      <meshStandardMaterial color="#222" metalness={0.8} />
    </mesh>
    <mesh position={[0, 6, 0]}>
      <boxGeometry args={[13, 1, 1]} />
      <meshStandardMaterial color="#222" metalness={0.8} />
    </mesh>
    <Text position={[0, 5.5, 0.6]} fontSize={0.4} color="white" anchorX="center" anchorY="middle" letterSpacing={0.2}>
      {label}
    </Text>
    <Text position={[0, 4.8, 0.6]} fontSize={0.2} color="#0ea5e9" anchorX="center" anchorY="middle" letterSpacing={0.1}>
      {subLabel}
    </Text>
  </group>
);

// --- 1. Gate (z: -20) ---
const Gate = ({ scrollZ }) => {
  // ゲート位置に合わせてトリガー調整
  const gateZ = -20;
  const triggerZ = gateZ + 5; // -15くらいまで来たら開く
  const isOpen = scrollZ < triggerZ;

  return (
    <group position={[0, 0, gateZ]}>
      {/* Left Door */}
      <mesh position={[-2.5 - (isOpen ? 4 : 0), 0, 0]} transition>
        <boxGeometry args={[5, 12, 0.5]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Right Door */}
      <mesh position={[2.5 + (isOpen ? 4 : 0), 0, 0]}>
        <boxGeometry args={[5, 12, 0.5]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.2} metalness={0.5} />
      </mesh>
      
      {/* Opening Text */}
      <Html position={[0, 1, 2]} center transform style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.5s' }}>
        <div className="pointer-events-none text-center select-none">
          <p className="text-xs tracking-[0.5em] uppercase text-gray-500 mb-4">Security Check</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-black whitespace-nowrap">LESSON 22</h1>
          <p className="mt-8 text-[10px] uppercase tracking-widest text-emerald-600 animate-pulse">Scroll to Authorize</p>
        </div>
      </Html>
    </group>
  );
};

// --- 2. Archives (z: -40) ---
const ArchiveCard = ({ position, title, text, color }) => (
  <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
    <group position={position}>
      <mesh>
        <planeGeometry args={[3.5, 5]} />
        <meshBasicMaterial color="#000" side={THREE.DoubleSide} transparent opacity={0.8} />
        {/* 枠線 */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(3.5, 5)]} />
          <lineBasicMaterial color={color} />
        </lineSegments>
      </mesh>
      <Html transform position={[0, 0, 0.1]} scale={0.4} zIndexRange={[50, 0]}>
        <div className="w-64 text-left p-6 font-sans bg-black/50 backdrop-blur-sm border border-white/10 h-full">
          <div className="border-b border-gray-700 pb-2 mb-2" style={{ borderColor: color }}>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
        </div>
      </Html>
    </group>
  </Float>
);

// --- 3. Lab (z: -60) ---
const Crystal = ({ position, color, label, description, type, activeId, setActiveId }) => {
  const mesh = useRef();
  const isActive = activeId === type;

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.3;
    if (isActive) mesh.current.rotation.x += delta * 0.5;
  });

  return (
    <group position={position}>
      <Float speed={isActive ? 0 : 2} rotationIntensity={0.5} floatIntensity={1}>
        <group 
          ref={mesh}
          onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : type); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
          scale={isActive ? 1.5 : 1}
        >
          {/* 本体 */}
          <mesh>
            <octahedronGeometry args={[1.5, 0]} />
            <meshPhysicalMaterial 
              color={isActive ? '#fff' : color} 
              emissive={isActive ? color : '#000'}
              emissiveIntensity={isActive ? 1 : 0}
              roughness={0} 
              transmission={0.8}
              thickness={3}
            />
          </mesh>
          
          {/* ワイヤーフレーム（黒線） */}
          <lineSegments>
            <edgesGeometry args={[new THREE.OctahedronGeometry(1.5, 0)]} />
            <lineBasicMaterial color="black" linewidth={2} transparent opacity={0.5} />
          </lineSegments>
        </group>

        {/* ラベル */}
        {!isActive && (
          <Html position={[0, -2.2, 0]} center zIndexRange={[100, 0]}>
            <div className="px-3 py-1 bg-black/80 border border-white/20 text-white text-xs uppercase tracking-widest rounded-full pointer-events-none whitespace-nowrap">
              {label}
            </div>
          </Html>
        )}

        {/* 詳細パネル */}
        {isActive && (
          <Html position={[0, 3.2, 0]} center zIndexRange={[110, 0]}>
            <div className="w-72 bg-black/95 border border-white/30 p-6 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-fade-in-up">
              <h3 className="text-xl font-serif mb-3" style={{ color: color }}>{label}</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">{description}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                className="text-[10px] uppercase border border-white/20 px-4 py-2 rounded hover:bg-white hover:text-black transition-colors w-full"
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
    <>
      <Crystal 
        position={[-3, 0, 0]} color="#f43f5e" label="Offload (丸投げ)" type="offload"
        description="思考の丸投げ。楽だが検証コストが増大し、思考力が衰えるリスクがある。「2000行のコード生成」の落とし穴。"
        activeId={activeId} setActiveId={setActiveId}
      />
      <Crystal 
        position={[3, 0, 0]} color="#10b981" label="Augment (拡張)" type="augment"
        description="思考の加速。自分の脳をエンジンとし、AIをターボチャージャーとして使う。「壁打ち」「対話学習」が鍵。"
        activeId={activeId} setActiveId={setActiveId}
      />
      <Html position={[0, 4, 0]} center transform scale={2} zIndexRange={[0, 0]}>
         <div className="pointer-events-none opacity-40">
            <h2 className="text-white font-serif text-center text-sm tracking-[0.5em]">TOUCH CRYSTALS</h2>
         </div>
      </Html>
    </>
  );
};

// --- 4. Map (z: -80) ---
const HologramMap = () => (
  <group position={[0, -1, 0]}>
    <Grid args={[20, 20]} cellSize={0.5} cellThickness={1} cellColor="#0ea5e9" sectionSize={5} sectionThickness={1.5} sectionColor="#0284c7" fadeDistance={15} />
    <Html position={[0, 2, 0]} center transform>
       <div className="text-center p-8 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-xl">
         <h2 className="text-4xl font-serif text-cyan-400 mb-2" style={{ textShadow: '0 0 20px cyan' }}>Mindset</h2>
         <p className="text-xs text-cyan-200 tracking-widest uppercase">Engine: You / Booster: AI</p>
       </div>
    </Html>
  </group>
);

// --- 5. Destination (z: -100) ---
const Destination = () => (
  <Float speed={1} rotationIntensity={0.1}>
    <Html center transform>
      <div className="bg-black/80 border-l-4 border-emerald-500 p-8 rounded-r-lg text-center w-[500px] backdrop-blur-xl">
          <h2 className="text-3xl font-serif text-white mb-4">Mission Report</h2>
          <p className="text-sm text-gray-300 mb-6 leading-loose text-left">
            AIは思考を奪わない。<br/>
            我々は<span className="text-emerald-400 font-bold">「検証」と「判断」</span>の領域へ進む。<br/>
            良き航海を。
          </p>
          <div className="text-[10px] text-gray-600 uppercase tracking-[0.3em] text-right">End of Lesson 22</div>
      </div>
    </Html>
  </Float>
);


// --- Main Scene ---
const SceneContent = ({ scrollY }) => {
  const { camera, scene } = useThree();
  const targetZ = -(scrollY * 0.02); 

  useFrame(() => {
    // カメラ移動
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    
    // 背景色遷移 (0 to -30)
    const bgProgress = THREE.MathUtils.clamp(-camera.position.z / 30, 0, 1);
    const colorWhite = new THREE.Color('#f8fafc');
    const colorBlack = new THREE.Color('#050505');
    const currentColor = colorWhite.clone().lerp(colorBlack, bgProgress);
    
    scene.background = currentColor;
    scene.fog = new THREE.FogExp2(currentColor, 0.035); // 霧を少し濃くして奥を隠す
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -5, -10]} color="#0ea5e9" intensity={2} />

      {/* 床: Infinite Grid (常にカメラの下に追従させるためGridコンポーネント自体の機能を利用) */}
      <group position={[0, -4, 0]}>
        <Grid 
            args={[10, 10]} 
            cellSize={1} cellThickness={1} cellColor="#333" 
            sectionSize={10} sectionThickness={1.5} sectionColor="#555" 
            fadeDistance={40} followCamera={true} infiniteGrid={true}
        />
      </group>

      {/* --- SCENES (Sectionラッパーで囲む) --- */}

      {/* 1. Gate (-20) */}
      <Gate scrollZ={targetZ} />

      {/* 2. Archives (-40) */}
      <Section z={-40}>
        <Partition label="SECTOR A" subLabel="ARCHIVES" />
        <group position={[0, 0, -5]}>
           <ArchiveCard position={[-3.5, 1, 0]} title="Deep Think" text="推論能力の獲得。答えを即答せず、思考プロセスを持つようになった。" color="#34d399" />
           <ArchiveCard position={[3.5, -1, -2]} title="Risks" text="思考の丸投げは批判的思考力を低下させる。「認知オフロード」の罠。" color="#f43f5e" />
           <ArchiveCard position={[0, 2.5, -4]} title="Speed & Quality" text="適切な利用は生産性を向上させる。速度と質の両立が可能。" color="#6366f1" />
        </group>
      </Section>

      {/* 3. Lab (-60) */}
      <Section z={-60}>
        <Partition label="SECTOR B" subLabel="LABORATORY" />
        <group position={[0, 0, -5]}>
          <LabSection />
        </group>
      </Section>

      {/* 4. Map (-80) */}
      <Section z={-80}>
         <Partition label="SECTOR C" subLabel="BRIDGE" />
         <group position={[0, 0, -5]}>
            <HologramMap />
         </group>
      </Section>

      {/* 5. Destination (-100) */}
      <Section z={-100}>
         <Destination />
      </Section>

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
