import { useEffect, useRef } from "react";
import { useStore } from "../lib/store";

/** Neural constellation field + layered mesh atmosphere. One rAF loop, capped DPR. */
export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { accent } = useStore();
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let pts: P[] = [];
    const pointer = { x: -9999, y: -9999 };

    const seed = () => {
      const count = Math.max(28, Math.min(84, Math.round((w * h) / 26000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.7 + 0.7,
        hue: Math.random(),
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const hexToRgb = (hex: string) => {
      const m = hex.replace("#", "");
      const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
      const int = parseInt(n, 16);
      return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const [ar, ag, ab] = hexToRgb(accentRef.current || "#3be8ff");

      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000 && d2 > 1) {
            const f = (26000 - d2) / 26000;
            p.x += (dx / Math.sqrt(d2)) * f * 1.1;
            p.y += (dy / Math.sqrt(d2)) * f * 1.1;
          }
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      ctx.lineWidth = 0.7;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 21000) continue;
          const alpha = (1 - d2 / 21000) * 0.3;
          ctx.strokeStyle =
            a.hue > 0.72
              ? `rgba(255,46,136,${alpha * 0.85})`
              : `rgba(${ar},${ag},${ab},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of pts) {
        const glow = p.hue > 0.8 ? "255,182,39" : p.hue > 0.62 ? "255,46,136" : `${ar},${ag},${ab}`;
        ctx.fillStyle = `rgba(${glow},0.85)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      const glow = glowRef.current;
      if (glow) glow.style.transform = `translate3d(${e.clientX - 220}px, ${e.clientY - 220}px, 0)`;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0 mesh-bg opacity-70" />
      <div
        className="absolute -top-40 start-[-10%] h-[46rem] w-[46rem] rounded-full blur-[120px] opacity-40 animate-pulse-glow"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent 65%)" }}
      />
      <div
        className="absolute bottom-[-18rem] end-[-12rem] h-[42rem] w-[42rem] rounded-full blur-[130px] opacity-35 animate-pulse-glow"
        style={{ background: "radial-gradient(circle, #ff2e88, transparent 66%)", animationDelay: "1.6s" }}
      />
      <div className="absolute inset-0 grid-lines opacity-70" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
      <div
        ref={glowRef}
        className="absolute left-0 top-0 hidden h-[440px] w-[440px] rounded-full opacity-[0.13] blur-[90px] lg:block"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 65%)", willChange: "transform" }}
      />
      <div className="grain absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}