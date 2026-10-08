import { ContactShadows, Grid, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { LayerScrubber } from "@/components/slicer-panel";
import { buildSolid, featureGeometry, featureMatrix, layoutParts, measureDoc } from "@/lib/cad/geometry";
import type { LayerPaths } from "@/lib/cad/slicer";
import type { CadDocument, CadFeature } from "@/lib/cad/types";
import { useApp } from "@/lib/store";

function Solid({
  features,
  selectedId,
  dim,
}: {
  features: CadFeature[];
  selectedId: string | null;
  dim?: boolean;
}) {
  const [geo, setGeo] = useState<THREE.BufferGeometry | null>(null);
  const key = useMemo(
    () =>
      JSON.stringify(
        features.map((f) => ({
          id: f.id,
          k: f.kind,
          o: f.op,
          p: f.params,
          pos: f.position,
          r: f.rotation,
          a: f.axis,
          h: f.hidden,
          pr: f.profile,
        })),
      ),
    [features],
  );

  useEffect(() => {
    let alive = true;
    const t = window.setTimeout(() => {
      buildSolid(features).then((built) => {
        if (!alive) return;
        setGeo(built?.geometry ?? null);
      });
    }, 50);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [key, features]);

  const selected = features.find((f) => f.id === selectedId && !f.hidden);
  const selGeo = useMemo(() => {
    if (!selected) return null;
    const g = featureGeometry(selected);
    g.applyMatrix4(featureMatrix(selected));
    return g;
  }, [selected]);

  useEffect(() => {
    return () => {
      selGeo?.dispose();
    };
  }, [selGeo]);

  return (
    <group>
      {geo ? (
        <mesh geometry={geo} castShadow>
          <meshStandardMaterial
            color={dim ? "#8a9098" : "#c2c7ce"}
            metalness={0.58}
            roughness={0.4}
            transparent={dim}
            opacity={dim ? 0.22 : 1}
          />
        </mesh>
      ) : null}
      {geo ? (
        <lineSegments>
          <edgesGeometry args={[geo, 28]} />
          <lineBasicMaterial color="#e6e8eb" transparent opacity={dim ? 0.28 : 0.55} />
        </lineSegments>
      ) : null}
      {selGeo && !dim ? (
        <lineSegments>
          <edgesGeometry args={[selGeo, 18]} />
          <lineBasicMaterial color="#f4f5f6" />
        </lineSegments>
      ) : null}
    </group>
  );
}

function CameraRig({
  view,
  size,
}: {
  view: ViewId;
  size: { x: number; y: number; z: number };
}) {
  const { camera, controls } = useThree();
  const max = Math.max(size.x, size.y, size.z, 24);
  const cy = size.y * 0.45;

  useEffect(() => {
    const dist = max * 1.7;
    const targets: Record<ViewId, [number, number, number]> = {
      iso: [dist * 0.85, dist * 0.7, dist * 0.85],
      top: [0.01, dist * 1.4, 0.01],
      front: [0, cy + dist * 0.15, dist * 1.35],
      right: [dist * 1.35, cy + dist * 0.15, 0],
    };
    camera.position.set(...targets[view]);
    camera.lookAt(0, cy, 0);
    camera.updateProjectionMatrix();
    const c = controls as { target?: THREE.Vector3; update?: () => void } | null;
    if (c?.target) {
      c.target.set(0, cy, 0);
      c.update?.();
    }
  }, [view, camera, controls, max, cy]);
  return null;
}

export type ViewId = "iso" | "top" | "front" | "right";

function pathsToGeo(layers: LayerPaths[], from: number, to: number, kind: "perimeters" | "infill" | "skirt" | "support" | "bridge", close: boolean) {
  const positions: number[] = [];
  for (let i = from; i <= to; i++) {
    const L = layers[i];
    if (!L) continue;
    const z = L.z;
    const group = L[kind] ?? [];
    for (const path of group) {
      for (let k = 1; k < path.length; k++) {
        const a = path[k - 1];
        const b = path[k];
        positions.push(a.x, z, a.y, b.x, z, b.y);
      }
      if (close && path.length > 2) {
        const a = path[path.length - 1];
        const b = path[0];
        positions.push(a.x, z, a.y, b.x, z, b.y);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  if (positions.length) geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

function SliceToolpaths() {
  const result = useApp((s) => s.sliceResult);
  const layer = useApp((s) => s.sliceLayer);
  const open = useApp((s) => s.slicerOpen);
  const past = useMemo(() => {
    if (!result || !open) return null;
    const end = layer - 1;
    if (end < 0) {
      const empty = () => new THREE.BufferGeometry();
      return { wall: empty(), fill: empty(), support: empty() };
    }
    return {
      wall: pathsToGeo(result.layers, 0, end, "perimeters", true),
      fill: pathsToGeo(result.layers, 0, end, "infill", false),
      support: pathsToGeo(result.layers, 0, end, "support", false),
    };
  }, [result, layer, open]);
  const current = useMemo(() => {
    if (!result || !open) return null;
    return {
      wall: pathsToGeo(result.layers, layer, layer, "perimeters", true),
      fill: pathsToGeo(result.layers, layer, layer, "infill", false),
      skirt: pathsToGeo(result.layers, layer, layer, "skirt", true),
      support: pathsToGeo(result.layers, layer, layer, "support", false),
      bridge: pathsToGeo(result.layers, layer, layer, "bridge", false),
    };
  }, [result, layer, open]);

  useEffect(() => {
    return () => {
      past?.wall.dispose();
      past?.fill.dispose();
      past?.support.dispose();
      current?.wall.dispose();
      current?.fill.dispose();
      current?.skirt.dispose();
      current?.support.dispose();
      current?.bridge.dispose();
    };
  }, [past, current]);

  if (!open || !result || !past || !current) return null;
  return (
    <group>
      {past.wall.attributes.position ? (
        <lineSegments geometry={past.wall}>
          <lineBasicMaterial color="#5c6168" transparent opacity={0.45} />
        </lineSegments>
      ) : null}
      {past.fill.attributes.position ? (
        <lineSegments geometry={past.fill}>
          <lineBasicMaterial color="#3d444c" transparent opacity={0.35} />
        </lineSegments>
      ) : null}
      {past.support.attributes.position ? (
        <lineSegments geometry={past.support}>
          <lineBasicMaterial color="#4a5058" transparent opacity={0.3} />
        </lineSegments>
      ) : null}
      {current.skirt.attributes.position ? (
        <lineSegments geometry={current.skirt}>
          <lineBasicMaterial color="#8b8f96" />
        </lineSegments>
      ) : null}
      {current.support.attributes.position ? (
        <lineSegments geometry={current.support}>
          <lineBasicMaterial color="#6a7078" />
        </lineSegments>
      ) : null}
      {current.fill.attributes.position ? (
        <lineSegments geometry={current.fill}>
          <lineBasicMaterial color="#8b8f96" />
        </lineSegments>
      ) : null}
      {current.bridge.attributes.position ? (
        <lineSegments geometry={current.bridge}>
          <lineBasicMaterial color="#c8ccd2" />
        </lineSegments>
      ) : null}
      {current.wall.attributes.position ? (
        <lineSegments geometry={current.wall}>
          <lineBasicMaterial color="#eceef0" />
        </lineSegments>
      ) : null}
    </group>
  );
}

function PartGroup({
  part,
  offset,
  active,
  selectedId,
  dim,
}: {
  part: CadDocument;
  offset: { x: number; y: number; z: number };
  active: boolean;
  selectedId: string | null;
  dim: boolean;
}) {
  const setActive = useApp((s) => s.setActive);
  return (
    <group
      position={[offset.x, offset.y, offset.z]}
      onClick={(e) => {
        e.stopPropagation();
        setActive(part.id);
      }}
    >
      <Solid features={part.features} selectedId={active ? selectedId : null} dim={dim} />
    </group>
  );
}

function Scene({ view }: { view: ViewId }) {
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const activeId = useApp((s) => s.activeId);
  const selectedId = useApp((s) => s.selectedId);
  const kitView = useApp((s) => s.kitView);
  const slicerOpen = useApp((s) => s.slicerOpen);
  const showKit = kitView && parts.length > 1;
  const visible = showKit ? parts : doc ? [doc] : [];
  const layouts = useMemo(
    () => layoutParts(showKit ? parts : doc ? [doc] : []),
    [showKit, parts, doc],
  );
  const kitSize = useMemo(() => {
    if (!visible.length) return { x: 80, y: 20, z: 80 };
    if (!showKit && doc) return measureDoc(doc).size;
    let maxX = 0;
    let maxY = 0;
    let maxZ = 0;
    for (const l of layouts) {
      maxX = Math.max(maxX, Math.abs(l.offset.x) + l.size.x);
      maxY = Math.max(maxY, l.size.y);
      maxZ = Math.max(maxZ, l.size.z);
    }
    return { x: Math.max(maxX * 2, 40), y: maxY, z: Math.max(maxZ, 40) };
  }, [layouts, showKit, doc, visible.length]);
  const cell = doc?.units === "in" ? 0.25 : 5;
  const section = cell * 5;
  const gridExtent = Math.max(80, Math.max(kitSize.x, kitSize.z) * 2.2);

  return (
    <>
      <color attach="background" args={["#0b0c0e"]} />
      <hemisphereLight args={["#e4e7ea", "#1c1e22", 0.7]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[12, 18, 8]} intensity={1.25} />
      <directionalLight position={[-10, 8, -12]} intensity={0.35} />
      <Grid
        infiniteGrid
        fadeDistance={gridExtent * 1.8}
        fadeStrength={1.4}
        cellSize={cell}
        sectionSize={section}
        cellColor="#3d444c"
        sectionColor="#5c646e"
        position={[0, 0.01, 0]}
      />
      <CameraRig view={view} size={kitSize} />
      {visible.map((part) => {
        const layout = layouts.find((l) => l.id === part.id);
        return (
          <PartGroup
            key={part.id}
            part={part}
            offset={layout?.offset ?? { x: 0, y: 0, z: 0 }}
            active={part.id === activeId}
            selectedId={selectedId}
            dim={slicerOpen || part.id !== activeId}
          />
        );
      })}
      <SliceToolpaths />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.38}
        scale={Math.max(60, gridExtent)}
        blur={2.4}
        far={24}
      />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.08}
        maxPolarAngle={Math.PI * 0.49}
        minDistance={8}
        maxDistance={800}
      />
    </>
  );
}

export function Viewport() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ViewId>("iso");
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const kitView = useApp((s) => s.kitView);
  const setKitView = useApp((s) => s.setKitView);
  const sourceThumb = useApp((s) => s.sourceThumb);
  const thumbs = useApp((s) => s.thumbs);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const measure = doc ? measureDoc(doc) : null;
  const unit = doc?.units ?? "mm";
  const kit = parts.length > 1;
  const slicerOpen = useApp((s) => s.slicerOpen);

  return (
    <div ref={wrap} className="relative h-full min-h-[200px] w-full bg-bg">
      {mounted ? (
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [90, 70, 90], fov: 35, near: 0.1, far: 4000 }}
          className="h-full w-full touch-none"
          onPointerMissed={() => useApp.getState().select(null)}
        >
          <Suspense fallback={null}>
            <Scene view={view} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="h-full w-full bg-bg" />
      )}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {sourceThumb ? (
            <img
              src={sourceThumb}
              alt=""
              className="h-14 w-14 rounded-sm object-cover outline outline-1 -outline-offset-1 outline-fg/10"
            />
          ) : null}
          {kit
            ? parts
                .filter((p) => thumbs[p.id] && thumbs[p.id] !== sourceThumb)
                .slice(0, 2)
                .map((p) => (
                  <img
                    key={p.id}
                    src={thumbs[p.id] ?? ""}
                    alt=""
                    className="h-10 w-10 rounded-sm object-cover opacity-70 outline outline-1 -outline-offset-1 outline-fg/10"
                  />
                ))
            : null}
          <div className="pointer-events-auto flex items-center gap-1.5">
            {kit ? (
              <button
                type="button"
                onClick={() => setKitView(!kitView)}
                className={`h-9 rounded-sm px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] shadow-[var(--shadow-border)] ${
                  kitView ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg"
                }`}
              >
                kit
              </button>
            ) : null}
            <div className="flex rounded-sm shadow-[var(--shadow-border)]">
              {(["iso", "top", "front", "right"] as ViewId[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`h-9 px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    view === v ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {measure && doc && !slicerOpen ? (
          <div className="absolute right-3 bottom-3 font-mono text-[11px] tabular-nums text-muted">
            {kit ? `${parts.length} parts · ` : null}
            {measure.size.x.toFixed(1)} × {measure.size.z.toFixed(1)} × {measure.size.y.toFixed(1)} {unit}
            <span className="mx-2 text-faint">·</span>
            {Math.round(doc.confidence * 100)}% confirmed
          </div>
        ) : !slicerOpen ? (
          <div className="absolute right-3 bottom-3 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            Drop a sketch
          </div>
        ) : null}
        <LayerScrubber />
      </div>
    </div>
  );
}
