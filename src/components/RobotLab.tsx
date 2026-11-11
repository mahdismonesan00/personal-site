import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { play } from "../lib/sound";
import { Btn, Chip, Icon, Reveal, SectionHead } from "./ui";
import { cn } from "../utils/cn";

interface Params {
  speed: number;
  kp: number;
  ki: number;
  kd: number;
  sensors: number;
  width: number;
  trail: number;
  glow: number;
  grid: boolean;
  rays: boolean;
  color: string;
  running: boolean;
}

const DEFAULTS: Params = {
  speed: 150,
  kp: 2.6,
  ki: 0.15,
  kd: 0.9,
  sensors: 5,
  width: 14,
  trail: 90,
  glow: 18,
  grid: true,
  rays: true,
  color: "#3be8ff",
  running: true,
};

const PRESETS: { id: string; label: string; p: Partial<Params> }[] = [
  { id: "preset1", label: "lab.preset1", p: { speed: 210, kp: 3.4, ki: 0.1, kd: 1.5, sensors: 7, width: 12 } },
  { id: "preset2", label: "lab.preset2", p: { speed: 110, kp: 1.9, ki: 0.25, kd: 1.1, sensors: 5, width: 18 } },
  { id: "preset3", label: "lab.preset3", p: { speed: 240, kp: 6.2, ki: 0.5, kd: 0.05, sensors: 3, width: 10 } },
];

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  fmt,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  fmt: (n: number) => string;
  color: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[12px] font-medium text-muted">{label}</span>
        <span className="font-mono text-[11.5px]" style={{ color }}>
          {step < 1 ? value.toFixed(2) : fmt(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 35%, #ff2e88))` }}
      />
    </label>
  );
}

function Toggle({ label, on, onClick, color }: { label: string; on: boolean; onClick: () => void; color: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-[12px] font-medium transition",
        on ? "text-txt" : "border-white/12 bg-white/[0.02] text-muted hover:text-txt",
      )}
      style={on ? { borderColor: `${color}88`, background: `${color}18` } : undefined}
    >
      {label}
      <span className={cn("relative h-4 w-8 rounded-full transition", on ? "" : "bg-white/15")} style={on ? { background: color } : undefined}>
        <span
          className="absolute top-0.5 h-3 w-3 rounded-full bg-ink transition-all"
          style={{ insetInlineStart: on ? "1.125rem" : "0.125rem" }}
        />
      </span>
    </button>
  );
}

export default function RobotLab() {
  const { t, fmt } = useI18n();
  const { unlockBadge, accent } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<Params>(() => ({
    ...DEFAULTS,
    color: accent,
    running: !(typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches),
  }));
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const [hud, setHud] = useState({ lap: 0, best: 0, error: 0, lost: false, ml: 0, mr: 0, sensors: [] as boolean[] });
  const trackSeed = useRef(Math.random() * 1000);
  const resetRef = useRef(0);
  const [resetTick, setResetTick] = useState(0);
  resetRef.current = resetTick;

  const set = useCallback(<K extends keyof Params>(k: K, v: Params[K]) => {
    setParams((p) => ({ ...p, [k]: v }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let hudAt = 0;
    let pts: { x: number; y: number }[] = [];
    let currentSeed = trackSeed.current;
    let currentReset = resetRef.current;

    const bot = { x: 0, y: 0, a: 0, integral: 0, prevErr: 0, lostFor: 0, idx: 0, lapStart: performance.now(), laps: 0, best: 0 };
    let trail: { x: number; y: number }[] = [];
    const sensorHits: boolean[] = [];

    const buildTrack = () => {
      const s = currentSeed;
      const rnd = (n: number) => {
        const v = Math.sin(s * 12.9898 + n * 78.233) * 43758.5453;
        return v - Math.floor(v);
      };
      const a1 = 0.1 + rnd(1) * 0.1;
      const a2 = 0.05 + rnd(2) * 0.09;
      const a3 = 0.04 + rnd(3) * 0.07;
      const p1 = rnd(4) * 6.28;
      const p2 = rnd(5) * 6.28;
      const p3 = rnd(6) * 6.28;
      const rx = w * 0.37;
      const ry = h * 0.35;
      const N = 420;
      pts = [];
      for (let i = 0; i < N; i++) {
        const th = (i / N) * Math.PI * 2;
        const m = 1 + a1 * Math.sin(3 * th + p1) + a2 * Math.sin(5 * th + p2) + a3 * Math.sin(2 * th + p3);
        pts.push({ x: w / 2 + Math.cos(th) * rx * m, y: h / 2 + Math.sin(th) * ry * m });
      }
    };

    const placeBot = () => {
      const p0 = pts[0];
      const p1 = pts[4];
      bot.x = p0.x;
      bot.y = p0.y;
      bot.a = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      bot.integral = 0;
      bot.prevErr = 0;
      bot.lostFor = 0;
      bot.idx = 0;
      bot.lapStart = performance.now();
      trail = [];
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      w = Math.max(280, rect.width);
      h = Math.max(260, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTrack();
      placeBot();
    };

    const nearest = (x: number, y: number) => {
      let bi = 0;
      let bd = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const dx = pts[i].x - x;
        const dy = pts[i].y - y;
        const d = dx * dx + dy * dy;
        if (d < bd) {
          bd = d;
          bi = i;
        }
      }
      return { i: bi, d: Math.sqrt(bd) };
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const P = paramsRef.current;

      if (currentSeed !== trackSeed.current) {
        currentSeed = trackSeed.current;
        buildTrack();
        placeBot();
        bot.laps = 0;
        bot.best = 0;
      }
      if (currentReset !== resetRef.current) {
        currentReset = resetRef.current;
        placeBot();
      }

      const spread = Math.max(30, Math.min(64, w * 0.07));
      const look = 20;
      let ml = 0;
      let mr = 0;
      let err = 0;

      if (P.running) {
        const dirX = Math.cos(bot.a);
        const dirY = Math.sin(bot.a);
        const fx = bot.x + dirX * look;
        const fy = bot.y + dirY * look;
        const n = P.sensors;
        let sum = 0;
        let count = 0;
        sensorHits.length = 0;
        for (let i = 0; i < n; i++) {
          const off = ((i - (n - 1) / 2) / Math.max(1, (n - 1) / 2)) * (spread / 2);
          const sx = fx - dirY * off;
          const sy = fy + dirX * off;
          const hit = nearest(sx, sy).d < P.width / 2 + 2.5;
          sensorHits.push(hit);
          if (hit) {
            sum += off / (spread / 2);
            count++;
          }
        }
        if (count > 0) {
          err = sum / count;
          bot.lostFor = 0;
          bot.integral = Math.max(-1.4, Math.min(1.4, bot.integral + err * dt));
        } else {
          err = bot.prevErr;
          bot.lostFor += dt;
        }
        const deriv = (err - bot.prevErr) / Math.max(dt, 0.001);
        const steer = P.kp * err + P.ki * bot.integral + P.kd * deriv * 0.06;
        bot.prevErr = err;
        bot.a += Math.max(-4, Math.min(4, steer)) * dt * 2.4;

        const slow = 1 - 0.35 * Math.min(1, Math.abs(err));
        const lostSlow = bot.lostFor > 0.25 ? Math.max(0.25, 1 - bot.lostFor * 0.5) : 1;
        const v = P.speed * slow * lostSlow;
        ml = Math.max(0, Math.min(1, (v / 260) * (1 + steer * 0.35)));
        mr = Math.max(0, Math.min(1, (v / 260) * (1 - steer * 0.35)));
        bot.x += Math.cos(bot.a) * v * dt;
        bot.y += Math.sin(bot.a) * v * dt;

        trail.push({ x: bot.x, y: bot.y });
        while (trail.length > P.trail) trail.shift();

        const near = nearest(bot.x, bot.y);
        const prevIdx = bot.idx;
        bot.idx = near.i;
        if (prevIdx > pts.length * 0.82 && bot.idx < pts.length * 0.18) {
          const lapTime = (now - bot.lapStart) / 1000;
          bot.lapStart = now;
          if (lapTime > 1.2) {
            bot.laps += 1;
            if (!bot.best || lapTime < bot.best) bot.best = lapTime;
            play("lap");
            unlockBadge("lab");
          }
        }
        if (bot.lostFor > 1.8 || bot.x < -40 || bot.x > w + 40 || bot.y < -40 || bot.y > h + 40) {
          const p = pts[near.i];
          const q = pts[(near.i + 5) % pts.length];
          bot.x = p.x;
          bot.y = p.y;
          bot.a = Math.atan2(q.y - p.y, q.x - p.x);
          bot.integral = 0;
          bot.prevErr = 0;
          bot.lostFor = 0;
          trail = [];
        }
      }

      /* ---------- render ---------- */
      ctx.fillStyle = "#060a16";
      ctx.fillRect(0, 0, w, h);

      if (P.grid) {
        ctx.strokeStyle = "rgba(120,160,235,.07)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < w; x += 34) {
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, h);
        }
        for (let y = 0; y < h; y += 34) {
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(w, y + 0.5);
        }
        ctx.stroke();
      }

      // track
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowBlur = P.glow;
      ctx.shadowColor = P.color;
      ctx.strokeStyle = "rgba(226,238,255,.9)";
      ctx.lineWidth = P.width;
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = "rgba(8,14,28,.85)";
      ctx.lineWidth = Math.max(1, P.width - 8);
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.stroke();

      // start line
      const s0 = pts[0];
      const s1 = pts[3];
      const sa = Math.atan2(s1.y - s0.y, s1.x - s0.x) + Math.PI / 2;
      ctx.save();
      ctx.translate(s0.x, s0.y);
      ctx.rotate(sa);
      for (let i = -3; i < 3; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#0b1122";
        ctx.fillRect(i * 6, -P.width / 2 - 3, 6, 6);
        ctx.fillStyle = i % 2 === 0 ? "#0b1122" : "#ffffff";
        ctx.fillRect(i * 6, -P.width / 2 + 3, 6, 6);
      }
      ctx.restore();

      // trail
      if (trail.length > 2) {
        ctx.save();
        ctx.strokeStyle = P.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = P.color;
        ctx.beginPath();
        trail.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
        ctx.restore();
      }

      // sensors
      const dirX = Math.cos(bot.a);
      const dirY = Math.sin(bot.a);
      if (P.rays) {
        for (let i = 0; i < P.sensors; i++) {
          const off = ((i - (P.sensors - 1) / 2) / Math.max(1, (P.sensors - 1) / 2)) * (spread / 2);
          const sx = bot.x + dirX * look - dirY * off;
          const sy = bot.y + dirY * look + dirX * off;
          const hit = sensorHits[i];
          ctx.strokeStyle = hit ? "#a6f04a" : "rgba(200,220,255,.22)";
          ctx.lineWidth = hit ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(bot.x + dirX * 8, bot.y + dirY * 8);
          ctx.lineTo(sx, sy);
          ctx.stroke();
          ctx.fillStyle = hit ? "#a6f04a" : "rgba(200,220,255,.35)";
          ctx.beginPath();
          ctx.arc(sx, sy, hit ? 3.4 : 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // robot
      ctx.save();
      ctx.translate(bot.x, bot.y);
      ctx.rotate(bot.a);
      if (bot.lostFor > 0.25) {
        ctx.strokeStyle = "rgba(255,92,122,.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 22 + Math.sin(now / 90) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "#0e1730";
      ctx.fillRect(-13, -12, 26, 5);
      ctx.fillRect(-13, 7, 26, 5);
      ctx.shadowBlur = 16;
      ctx.shadowColor = P.color;
      ctx.fillStyle = "#16223f";
      ctx.strokeStyle = P.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") ctx.roundRect(-14, -9, 28, 18, 5);
      else ctx.rect(-14, -9, 28, 18);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = P.color;
      ctx.beginPath();
      ctx.arc(6, 0, 3.2 + (P.running ? Math.sin(now / 160) * 0.6 : 0), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(226,238,255,.75)";
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(8, -4);
      ctx.lineTo(8, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // corner brackets
      ctx.strokeStyle = "rgba(120,160,235,.28)";
      ctx.lineWidth = 1.5;
      const b = 14;
      const pad = 10;
      [
        [pad, pad, 1, 1],
        [w - pad, pad, -1, 1],
        [pad, h - pad, 1, -1],
        [w - pad, h - pad, -1, -1],
      ].forEach(([x, y, sx, sy]) => {
        ctx.beginPath();
        ctx.moveTo(x + sx * b, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + sy * b);
        ctx.stroke();
      });

      if (now - hudAt > 110) {
        hudAt = now;
        setHud({
          lap: bot.laps,
          best: bot.best,
          error: err,
          lost: bot.lostFor > 0.25,
          ml,
          mr,
          sensors: [...sensorHits],
        });
      }
    };

    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(wrap);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [unlockBadge]);

  const exportFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "mahdis-robot-lab.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    play("tap");
  };

  const c = params.color;

  return (
    <section id="lab" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHead kicker={t("lab.kicker")} title={t("lab.title")} sub={t("lab.sub")} />

        <Reveal delay={120}>
          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            {/* stage */}
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#060a16]">
                <div ref={wrapRef} className="relative h-[340px] w-full sm:h-[440px]">
                  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 p-3">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-[10.5px] font-bold tracking-wider backdrop-blur",
                      hud.lost ? "border-danger/60 bg-danger/15 text-danger" : "border-success/50 bg-success/12 text-success",
                    )}
                  >
                    {hud.lost ? `${t("lab.lost")} · ${t("lab.recovering")}` : t("lab.onTrack")}
                  </span>
                  <span className="rounded-full border border-white/15 bg-ink/70 px-3 py-1 font-mono text-[10.5px] text-txt backdrop-blur">
                    {t("lab.lap")} {fmt(hud.lap)}
                  </span>
                  <span className="rounded-full border border-white/15 bg-ink/70 px-3 py-1 font-mono text-[10.5px] text-txt backdrop-blur">
                    {t("lab.best")} {hud.best ? hud.best.toFixed(2) : "—"} {t("lab.seconds")}
                  </span>
                </div>

                <div className="pointer-events-none absolute bottom-3 start-3 flex items-end gap-1.5">
                  {hud.sensors.map((on, i) => (
                    <span
                      key={i}
                      className="w-2.5 rounded-sm transition-all duration-100"
                      style={{ height: on ? 26 : 10, background: on ? "#a6f04a" : "rgba(200,220,255,.22)" }}
                    />
                  ))}
                  <span className="ms-2 font-mono text-[10px] uppercase tracking-wider text-muted">{t("lab.sensorArray")}</span>
                </div>

                <div className="pointer-events-none absolute bottom-3 end-3 hidden w-36 space-y-1.5 sm:block">
                  {[
                    { l: t("lab.motorL"), v: hud.ml },
                    { l: t("lab.motorR"), v: hud.mr },
                  ].map((m) => (
                    <div key={m.l} className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-end font-mono text-[9.5px] text-muted">{m.l}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <span className="block h-full rounded-full transition-[width] duration-100" style={{ width: `${m.v * 100}%`, background: c }} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Btn size="sm" onClick={() => { set("running", !params.running); play("tap"); }}>
                  <Icon name={params.running ? "close" : "bolt"} className="h-4 w-4" />
                  {params.running ? t("lab.pause") : t("lab.play")}
                </Btn>
                <Btn size="sm" variant="outline" onClick={() => { setResetTick((v) => v + 1); play("tap"); }}>
                  <Icon name="refresh" className="h-4 w-4" />
                  {t("lab.reset")}
                </Btn>
                <Btn size="sm" variant="outline" onClick={() => { trackSeed.current = Math.random() * 1000; play("whoosh"); }}>
                  <Icon name="spark" className="h-4 w-4" />
                  {t("lab.random")}
                </Btn>
                <Btn size="sm" variant="ghost" onClick={exportFrame}>
                  <Icon name="external" className="h-4 w-4" />
                  {t("lab.export")}
                </Btn>
                <Chip className="ms-auto" color="#ffb627">
                  <Icon name="bolt" className="h-3.5 w-3.5" />
                  {t("lab.hint")}
                </Chip>
              </div>
            </div>

            {/* control rail — always visible */}
            <div className="lg:col-span-4">
              <div className="h-full rounded-3xl border border-white/12 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${c}1f`, color: c }}>
                    <Icon name="chip" className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-[14px] font-bold text-txt">{t("lab.telemetry")}</h3>
                  <span className="ms-auto font-mono text-[10.5px] text-muted">PID</span>
                </div>

                <div className="mt-4 grid gap-3.5">
                  <Slider label={t("lab.speed")} value={params.speed} min={40} max={260} onChange={(v) => set("speed", v)} fmt={fmt} color={c} />
                  <Slider label={t("lab.kp")} value={params.kp} min={0} max={8} step={0.05} onChange={(v) => set("kp", v)} fmt={fmt} color={c} />
                  <Slider label={t("lab.ki")} value={params.ki} min={0} max={1.5} step={0.01} onChange={(v) => set("ki", v)} fmt={fmt} color={c} />
                  <Slider label={t("lab.kd")} value={params.kd} min={0} max={3} step={0.05} onChange={(v) => set("kd", v)} fmt={fmt} color={c} />

                  <div>
                    <span className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-[12px] font-medium text-muted">{t("lab.sensors")}</span>
                      <span className="font-mono text-[11.5px]" style={{ color: c }}>{fmt(params.sensors)}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { set("sensors", Math.max(3, params.sensors - 2)); play("tick"); }}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 text-muted transition hover:border-white/30 hover:text-txt"
                        aria-label="-"
                      >
                        <Icon name="close" className="h-3.5 w-3.5 rotate-45" />
                      </button>
                      <div className="flex flex-1 items-center justify-center gap-1">
                        {Array.from({ length: params.sensors }).map((_, i) => (
                          <span key={i} className="h-4 w-1.5 rounded-full" style={{ background: c }} />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => { set("sensors", Math.min(9, params.sensors + 2)); play("tick"); }}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 text-muted transition hover:border-white/30 hover:text-txt"
                        aria-label="+"
                      >
                        <Icon name="plus" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <Slider label={t("lab.width")} value={params.width} min={6} max={30} onChange={(v) => set("width", v)} fmt={fmt} color={c} />
                  <Slider label={t("lab.trail")} value={params.trail} min={0} max={240} onChange={(v) => set("trail", v)} fmt={fmt} color={c} />
                  <Slider label={t("lab.glow")} value={params.glow} min={0} max={40} onChange={(v) => set("glow", v)} fmt={fmt} color={c} />

                  <div className="grid grid-cols-2 gap-2">
                    <Toggle label={t("lab.grid")} on={params.grid} onClick={() => { set("grid", !params.grid); play("tick"); }} color={c} />
                    <Toggle label={t("lab.rays")} on={params.rays} onClick={() => { set("rays", !params.rays); play("tick"); }} color={c} />
                  </div>

                  <label className="flex items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/[0.02] px-3 py-2">
                    <span className="text-[12px] font-medium text-muted">{t("lab.color")}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-txt">{params.color.toUpperCase()}</span>
                      <input
                        type="color"
                        value={params.color}
                        onChange={(e) => set("color", e.target.value)}
                        className="h-7 w-10 cursor-pointer rounded border border-white/15 bg-transparent p-0"
                      />
                    </span>
                  </label>

                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-wider text-muted">{t("lab.presets")}</div>
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setParams((prev) => ({ ...prev, ...p.p })); play("whoosh"); }}
                          className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[11.5px] text-muted transition hover:-translate-y-0.5 hover:border-white/30 hover:text-txt"
                        >
                          {t(p.label)}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => { setParams({ ...DEFAULTS, color: accent, running: params.running }); play("tap"); }}
                        className="rounded-full border border-white/12 px-3 py-1.5 text-[11.5px] text-muted transition hover:text-txt"
                      >
                        <Icon name="refresh" className="inline h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-ink/40 px-3 py-2.5">
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span>{t("lab.error")}</span>
                      <span className="font-mono" style={{ color: Math.abs(hud.error) > 0.6 ? "#ff5c7a" : c }}>
                        {hud.error.toFixed(2)}
                      </span>
                    </div>
                    <div className="relative mt-2 h-1.5 rounded-full bg-white/10">
                      <span className="absolute inset-y-0 start-1/2 w-px bg-white/25" />
                      <span
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition-all duration-100"
                        style={{
                          insetInlineStart: `calc(${50 + Math.max(-50, Math.min(50, hud.error * 50))}% - 6px)`,
                          background: Math.abs(hud.error) > 0.6 ? "#ff5c7a" : c,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}