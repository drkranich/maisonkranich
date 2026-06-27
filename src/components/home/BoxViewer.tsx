"use client";

import { useEffect, useRef, useState } from "react";
import { Rotate3d } from "lucide-react";

/** Visualizador 3D da caixa — CSS puro, gira sozinho e pode ser arrastado. */
export function BoxViewer({ size = 200 }: { size?: number }) {
  const [rot, setRot] = useState({ x: -18, y: 24 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const auto = useRef(true);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (auto.current && !dragging.current) {
        setRot((r) => ({ ...r, y: r.y + 0.35 }));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onDown(e: React.PointerEvent) {
    dragging.current = true;
    auto.current = false;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setRot((r) => ({ x: Math.max(-80, Math.min(80, r.x - dy * 0.4)), y: r.y + dx * 0.4 }));
  }
  function onUp() {
    dragging.current = false;
  }

  const h = size;
  const t = size / 2;

  const faceBase: React.CSSProperties = {
    position: "absolute",
    width: h,
    height: h,
    background:
      "linear-gradient(135deg, #5a4233 0%, #4a3326 55%, #3a281d 100%)",
    border: "1px solid rgba(201,163,106,0.25)",
    boxShadow: "inset 0 0 60px rgba(0,0,0,0.45)",
  };
  // fitas douradas (cruz) em cada face
  const ribbon: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, transparent calc(50% - 9px), rgba(201,163,106,0.95) calc(50% - 9px), #d8b87a 50%, rgba(201,163,106,0.95) calc(50% + 9px), transparent calc(50% + 9px))," +
      "linear-gradient(0deg, transparent calc(50% - 9px), rgba(201,163,106,0.9) calc(50% - 9px), #d8b87a 50%, rgba(201,163,106,0.9) calc(50% + 9px), transparent calc(50% + 9px))",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        className="cursor-grab select-none active:cursor-grabbing"
        style={{ width: h + 80, height: h + 80, perspective: 900, display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none" }}
      >
        <div style={{ position: "relative", width: h, height: h, transformStyle: "preserve-3d", transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
          {/* 4 laterais */}
          <div style={{ ...faceBase, transform: `translateZ(${t}px)` }}><div style={ribbon} /></div>
          <div style={{ ...faceBase, transform: `rotateY(180deg) translateZ(${t}px)` }}><div style={ribbon} /></div>
          <div style={{ ...faceBase, transform: `rotateY(90deg) translateZ(${t}px)` }}><div style={ribbon} /></div>
          <div style={{ ...faceBase, transform: `rotateY(-90deg) translateZ(${t}px)` }}><div style={ribbon} /></div>
          {/* base */}
          <div style={{ ...faceBase, transform: `rotateX(-90deg) translateZ(${t}px)` }} />
          {/* tampa + laço */}
          <div style={{ ...faceBase, background: "linear-gradient(135deg, #6a4f3c 0%, #54392a 60%, #3f2c20 100%)", transform: `rotateX(90deg) translateZ(${t}px)` }}>
            <div style={ribbon} />
            <div
              style={{
                position: "absolute", top: "50%", left: "50%", width: 46, height: 46,
                transform: "translate(-50%,-50%) rotate(45deg)",
                background: "radial-gradient(circle at 50% 50%, #e3c485, #c9a36a 60%, #a8814f)",
                borderRadius: 10, boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              }}
            />
          </div>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-brand text-marfim/40">
        <Rotate3d size={13} /> Arraste para girar
      </span>
    </div>
  );
}
