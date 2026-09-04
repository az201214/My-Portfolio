import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text, Billboard } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();

type TechItem = {
  name: string;
  description: string;
  geometry: "box" | "sphere" | "icosahedron" | "dodecahedron";
  color: string;
  textureUrl?: string;
  scale: number;
};

const techData: TechItem[] = [
  { name: "TypeScript", description: "Used for strongly typed application development across full-stack projects.", geometry: "box", color: "#3178c6", textureUrl: `${import.meta.env.BASE_URL}images/typescript.webp`, scale: 0.9 },
  { name: "React", description: "Used to build interactive web interfaces and component-based applications.", geometry: "icosahedron", color: "#61dafb", textureUrl: `${import.meta.env.BASE_URL}images/react2.webp`, scale: 1.1 },
  { name: "Next.js", description: "Used for server-rendered and statically generated web applications.", geometry: "sphere", color: "#000000", textureUrl: `${import.meta.env.BASE_URL}images/next2.webp`, scale: 1.1 },
  { name: "Node.js", description: "Used for scalable backend services and API development.", geometry: "dodecahedron", color: "#339933", textureUrl: `${import.meta.env.BASE_URL}images/node2.webp`, scale: 0.9 },
  { name: "Supabase", description: "Used for open-source Firebase alternative with PostgreSQL.", geometry: "box", color: "#3ecf8e", scale: 0.9 },
  { name: "Flutter", description: "Used to build cross-platform mobile applications.", geometry: "sphere", color: "#02569b", scale: 1.0 },
  { name: "Dart", description: "Used as the core language for Flutter app development.", geometry: "icosahedron", color: "#00b4ab", scale: 0.9 },
  { name: "Firebase", description: "Used for backend services, authentication, database functionality, and real-time application features.", geometry: "dodecahedron", color: "#ffca28", scale: 1.0 },
  { name: "Rust", description: "Used for high-performance system programming and tooling.", geometry: "box", color: "#dea584", scale: 0.9 },
  { name: "AI / LLM", description: "Used for integrating advanced language models and AI tooling.", geometry: "icosahedron", color: "#ab47bc", scale: 1.0 },
  { name: "Git / GitHub", description: "Used for version control and collaborative software development.", geometry: "sphere", color: "#f05032", scale: 0.9 },
  { name: "Three.js", description: "Used for rendering 3D graphics and interactive experiences in the browser.", geometry: "dodecahedron", color: "#ffffff", scale: 1.0 },
  { name: "GSAP", description: "Used for complex, high-performance web animations.", geometry: "box", color: "#88ce02", scale: 0.9 },
];

const geometries = {
  box: new THREE.BoxGeometry(1.5, 1.5, 1.5),
  sphere: new THREE.SphereGeometry(1, 28, 28),
  icosahedron: new THREE.IcosahedronGeometry(1, 0),
  dodecahedron: new THREE.DodecahedronGeometry(1, 0),
};

type TechShapeProps = {
  data: TechItem;
  vec?: THREE.Vector3;
  r?: typeof THREE.MathUtils.randFloatSpread;
  isActive: boolean;
  onClick: (data: TechItem) => void;
};

function TechShape({
  data,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
  isActive,
  onClick,
}: TechShapeProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const material = useMemo(() => {
    let texture = null;
    if (data.textureUrl) {
      texture = textureLoader.load(data.textureUrl);
    }
    return new THREE.MeshPhysicalMaterial({
      map: texture,
      color: texture ? "#ffffff" : data.color,
      emissive: data.color,
      emissiveIntensity: 0.05,
      metalness: 0.5,
      roughness: 0.8,
      clearcoat: 0.1,
    });
  }, [data]);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    
    // Position text billboard above the physics body
    if (textRef.current && api.current) {
      const pos = api.current.translation();
      textRef.current.position.set(pos.x, pos.y + 1.8 * data.scale, pos.z);
    }

    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * data.scale,
          -150 * delta * data.scale,
          -50 * delta * data.scale
        )
      );

    if (hovered) {
      impulse.multiplyScalar(0.2); // stabilize when hovered
    }
    api.current?.applyImpulse(impulse, true);

    if (meshRef.current) {
      const targetScale = hovered ? 1.15 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      const targetEmissive = hovered ? 0.4 : 0.05;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
    }
  });

  return (
    <>
      <RigidBody
        linearDamping={0.75}
        angularDamping={0.15}
        friction={0.2}
        position={[r(20), r(20) - 25, r(20) - 10]}
        ref={api}
        colliders={false}
      >
        <BallCollider args={[data.scale * 1.2]} />
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          scale={data.scale}
          geometry={geometries[data.geometry]}
          material={material}
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(data);
          }}
        />
      </RigidBody>
      <Billboard ref={textRef}>
        <Text
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {data.name}
        </Text>
      </Billboard>
    </>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeTech, setActiveTech] = useState<TechItem | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="techstack" onClick={() => setActiveTech(null)}>
      <h2> My Techstack</h2>

      {activeTech && (
        <div className="tech-tooltip-overlay">
          <div className="tech-tooltip">
            <h3>{activeTech.name}</h3>
            <p>{activeTech.description}</p>
          </div>
        </div>
      )}

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {techData.map((data, i) => (
            <TechShape
              key={i}
              data={data}
              isActive={isActive}
              onClick={setActiveTech}
            />
          ))}
        </Physics>
        <Environment
          files={`${import.meta.env.BASE_URL}models/char_enviorment.hdr`}
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
