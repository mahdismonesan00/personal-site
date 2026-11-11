import { useEffect, useRef, useState } from "react";
import { useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { play } from "../lib/sound";
import { Btn, Chip, Counter, Icon, Reveal } from "./ui";
import { cn } from "../utils/cn";

export function MedalArt({ kind = "gold", className }: { kind?: "gold" | "silver"; className?: string }) {
  const top = kind === "gold" ? "#FFE9A8" : "#F2F7FF";
  const mid = kind === "gold" ? "#FFC53D" : "#C6D6EE";
  const deep = kind === "gold" ? "#B87503" : "#7E93B5";
  const id = `med-${kind}`;
  return (
    <svg viewBox="0 0 120 150" className={cn("h-32 w-auto", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-magenta)" />
          <stop offset="100%" stopColor="var(--color-azure)" />
        </linearGradient>
        <radialGradient id={`${id}-g`} cx="35%" cy="28%">
          <stop offset="0%" stopColor={top} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
      </defs>
      <path d="M38 6h18l16 52H54Z" fill={`url(#${id}-r)`} opacity=".95" />
      <path d="M82 6H64L48 58h18Z" fill={`url(#${id}-r)`} opacity=".7" />
      <circle cx="60" cy="98" r="42" fill={`url(#${id}-g)`} />
      <circle cx="60" cy="98" r="42" fill="none" stroke={top} strokeWidth="2" opacity=".8" />
      <circle cx="60" cy="98" r="33" fill="none" stroke={deep} strokeWidth="1.4" opacity=".55" />
      <path d="m60 76 6.6 13.6 15 2.1-10.9 10.4 2.6 14.9L60 110l-13.3 7 2.6-14.9L38.4 91.7l15-2.1Z" fill={top} opacity=".92" />
      <ellipse cx="45" cy="80" rx="14" ry="8" fill="#fff" opacity=".22" transform="rotate(-28 45 80)" />
    </svg>
  );
}

function Typewriter() {
  const { t } = useI18n();
  const roles = [t("hero.role1"), t("hero.role2"), t("hero.role3"), t("hero.role4")];
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const key = roles.join("|");

  useEffect(() => {
    setIdx(0);
    setText("");
    setDel(false);
  }, [key]);

  useEffect(() => {
    const full = roles[idx % roles.length];
    let delay = del ? 32 : 60;
    if (!del && text === full) delay = 1700;
    else if (del && text === "") delay = 220;
    const id = window.setTimeout(() => {
      if (!del && text === full) setDel(true);
      else if (del && text === "") {
        setDel(false);
        setIdx((i) => (i + 1) % roles.length);
      } else setText(del ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
    }, delay);
    return () => window.clearTimeout(id);
  });

  return (
    <span className="inline-flex items-center gap-1 font-mono text-[clamp(0.95rem,2.4vw,1.35rem)] font-semibold accent-text">
      <span className="text-muted">&lt;</span>
      {text}
      <span className="inline-block h-[1.05em] w-[2px] animate-pulse bg-[var(--color-magenta)]" />
      <span className="text-muted">/&gt;</span>
    </span>
  );
}

const TICKER = ["HTML5", "CSS3", "JavaScript", "Python", "PHP", "C++", "C#", "Arduino", "Machine Learning", "Deep Learning", "Frontend", "Backend", "OpenCV", "Robotics"];

export function Ticker() {
  return (
    <div className="marquee relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
      <div className="marquee-track gap-10">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-10 pe-10">
            {TICKER.map((item) => (
              <span key={item} className="flex items-center gap-10 font-mono text-sm uppercase tracking-[0.18em] text-muted">
                <span className="transition-colors hover:text-txt">{item}</span>
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--color-accent)]/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 start-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

/* ---------------- holographic inventor ID (drag to orbit) ---------------- */
function HoloCard() {
  const { t, pick, fmt } = useI18n();
  const [rot, setRot] = useState({ x: -7, y: 16 });
  const [drag, setDrag] = useState(false);
  const start = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y };
    setDrag(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    }
    if (!drag) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setRot({
      x: Math.max(-26, Math.min(26, start.current.rx - dy * 0.28)),
      y: Math.max(-38, Math.min(38, start.current.ry + dx * 0.32)),
    });
  };
  const release = () => {
    if (!drag) return;
    setDrag(false);
    play("tick");
    setRot({ x: -7, y: 16 });
  };

  const bars = [3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2];

  return (
    <div className="relative mx-auto w-full max-w-[26rem]" style={{ perspective: "1200px" }}>
      <div
        className="pointer-events-none absolute -inset-10 opacity-60 blur-3xl"
        style={{ background: "conic-gradient(from 0deg, var(--color-accent), var(--color-magenta), var(--color-amber), var(--color-accent))", animation: "spin 26s linear infinite" }}
      />
      <div className="animate-float">
        <div
          ref={ref}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={release}
          onPointerCancel={release}
          onPointerLeave={release}
          className="relative cursor-grab select-none active:cursor-grabbing"
          style={{
            touchAction: "pan-y",
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transformStyle: "preserve-3d",
            transition: drag ? "none" : "transform .9s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div className="glass relative overflow-hidden rounded-[28px] p-6 shadow-[0_50px_120px_-50px_rgba(0,0,0,.95)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{ background: "radial-gradient(420px circle at var(--mx,70%) var(--my,15%), color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 60%)" }}
            />
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,.5) 0 2px, transparent 2px 9px)" }} />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">{t("hero.id")}</div>
                <div className="mt-2 font-display text-xl font-bold leading-tight text-txt">
                  {pick({ fa: "مهدیس مونسان", en: "Mahdis Mounesan", ar: "مهديس مونسان", zh: "马赫迪斯·蒙桑" })}
                </div>
                <div className="mt-1 font-mono text-[11px] accent-text">IFIA · WIIPA · HARVARD</div>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-ink/50">
                <svg viewBox="0 0 48 48" className="h-8 w-8">
                  <path d="M11 34V15l13 11 13-11v19" fill="none" stroke="var(--color-accent)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="24" cy="38" r="2.4" fill="var(--color-magenta)" />
                </svg>
              </div>
            </div>

            <div className="relative mt-5 flex items-center gap-4" style={{ transform: "translateZ(38px)" }}>
              <MedalArt kind="gold" className="h-28 drop-shadow-[0_18px_30px_rgba(255,182,39,.35)]" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="rounded-xl border border-amber/40 bg-amber/10 px-3 py-2">
                  <div className="font-display text-[13px] font-bold text-amber">{t("hero.cardTitle")}</div>
                  <div className="text-[11px] text-muted">{t("hero.cardSub")}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: t("hero.age"), c: "#ff2e88" },
                    { l: "iOLearn", c: "#3be8ff" },
                  ].map((x) => (
                    <div key={x.l} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-center text-[11px] font-semibold" style={{ color: x.c }}>
                      {x.l}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-5 rounded-2xl border border-white/10 bg-ink/40 p-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
                <span>{t("hero.signal")}</span>
                <span className="flex items-center gap-1.5 text-success">
                  <span className="led inline-block h-1.5 w-1.5 rounded-full bg-success text-success" />
                  live
                </span>
              </div>
              <svg viewBox="0 0 260 40" className="mt-1.5 h-9 w-full">
                <polyline
                  points="0,26 18,26 26,10 34,34 44,20 60,20 72,26 92,26 100,6 110,36 120,22 140,22 152,26 176,26 184,12 194,32 204,20 226,20 238,26 260,26"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="300"
                  style={{ animation: "dashMove 4.5s linear infinite" }}
                />
              </svg>
            </div>

            <div className="relative mt-4 flex items-end justify-between gap-3">
              <div className="flex h-8 items-end gap-[2px]">
                {bars.map((b, i) => (
                  <span key={i} className="w-[2px] bg-txt/70" style={{ height: `${b * 22}%` }} />
                ))}
              </div>
              <div className="text-end">
                <div className="font-mono text-[9.5px] uppercase tracking-wider text-muted">{t("hero.clearance")}</div>
                <div className="font-mono text-[12px] text-txt">MM-{fmt(2025)}-AU</div>
              </div>
            </div>
          </div>

          {/* floating orbit chips */}
          <div className="pointer-events-none absolute -end-6 top-10 hidden rounded-xl border border-magenta/40 bg-magenta/15 px-3 py-1.5 font-mono text-[10.5px] text-txt backdrop-blur-xl sm:block" style={{ transform: "translateZ(70px) rotate(6deg)" }}>
            4 × medals
          </div>
          <div className="pointer-events-none absolute -start-5 bottom-16 hidden rounded-xl border border-lime/40 bg-lime/12 px-3 py-1.5 font-mono text-[10.5px] text-lime backdrop-blur-xl sm:block" style={{ transform: "translateZ(60px) rotate(-5deg)" }}>
            status: shipping
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.25em] text-muted">
        <Icon name="refresh" className="h-3.5 w-3.5" />
        {t("hero.drag")}
      </div>
    </div>
  );
}

export default function Hero() {
  const { t, lang, pick } = useI18n();
  const { setRoute, setDashTab, setPaletteOpen } = useStore();
  const name = pick({ fa: "مهدیس مونسان", en: "Mahdis Mounesan", ar: "مهديس مونسان", zh: "马赫迪斯·蒙桑" });
  const words = name.split(" ");

  const stats = [
    { v: 4, suffix: "", label: t("hero.statMedals"), color: "var(--color-amber)" },
    { v: 3, suffix: "", label: t("hero.statCountries"), color: "var(--color-accent)" },
    { v: 13, suffix: "", label: t("hero.statTech"), color: "var(--color-magenta)" },
    { v: 24, suffix: "+", label: t("hero.statProjects"), color: "var(--color-lime)" },
  ];

  const jump = (id: string) => {
    play("tap");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative overflow-hidden pb-12 pt-28 sm:pt-32 lg:pt-36">
      {/* aurora sweep + ghost type */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/3 start-1/4 h-[70rem] w-[70rem] opacity-[0.16] blur-[110px]"
          style={{ background: "conic-gradient(from 90deg, var(--color-accent), transparent 35%, var(--color-magenta) 60%, transparent 85%)", animation: "spin 44s linear infinite" }}
        />
        <div className="absolute inset-x-0 top-[38%] select-none text-center font-display text-[22vw] font-bold leading-none text-transparent opacity-[0.045]" style={{ WebkitTextStroke: "1px rgba(180,205,255,.6)" }}>
          INVENTOR
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 px-3.5 py-1.5 text-[12px] font-medium text-txt">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                {t("hero.live")}
              </span>
              <Chip color="#ffb627">{t("hero.badge")}</Chip>
              <Chip color="#ff2e88">{t("hero.age")}</Chip>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="mt-6 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.32em] text-muted">
              <span className="h-px w-8 bg-[var(--color-accent)]" />
              {pick({ fa: "تهران → ژنو · آمریکا · ترکیه", en: "Tehran → Geneva · USA · Türkiye", ar: "طهران → جنيف · أمريكا · تركيا", zh: "德黑兰 → 日内瓦 · 美国 · 土耳其" })}
            </div>
          </Reveal>

          <h1 className="mt-4 font-display text-[clamp(2.7rem,8.4vw,5.8rem)] font-bold leading-[0.96]">
            {words.map((w, i) => (
              <span key={`${w}-${i}`} className="me-[0.22em] inline-block grad-text" style={{ animation: `riseIn .9s cubic-bezier(.22,1,.36,1) ${i * 130 + 120}ms both` }}>
                {w}
              </span>
            ))}
          </h1>

          <Reveal delay={200}>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Typewriter />
              <span className="hidden h-4 w-px bg-white/20 sm:block" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                {lang === "fa" ? "تک‌نفره، جهانی" : lang === "ar" ? "فردياً، عالمياً" : lang === "zh" ? "个人参赛 · 走向世界" : "Solo. Worldwide."}
              </span>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.95] text-muted sm:text-[17px]">{t("hero.lead")}</p>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
              <span className="led inline-block h-2 w-2 shrink-0 rounded-full bg-lime text-lime" />
              <span className="text-[12.5px] text-muted">
                <span className="font-semibold text-txt">{t("hero.now")}:</span> {t("hero.nowVal")}
              </span>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Btn size="lg" onClick={() => { play("whoosh"); setDashTab("wizard"); setRoute("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <Icon name="rocket" className="h-[18px] w-[18px]" />
                {t("hero.ctaBuild")}
              </Btn>
              <Btn size="lg" variant="outline" onClick={() => jump("work")}>
                <Icon name="layers" className="h-[18px] w-[18px]" />
                {t("hero.ctaWork")}
              </Btn>
              <Btn size="lg" variant="ghost" onClick={() => jump("quiz")}>
                <Icon name="bolt" className="h-[18px] w-[18px]" />
                {t("hero.ctaQuiz")}
              </Btn>
              <button
                type="button"
                onClick={() => { setPaletteOpen(true); play("whoosh"); }}
                className="hidden items-center gap-2 rounded-full border border-white/12 px-3.5 py-2 font-mono text-[11px] text-muted transition hover:border-[var(--color-accent)] hover:text-txt lg:inline-flex"
              >
                <Icon name="search" className="h-3.5 w-3.5" />
                ⌘K
              </button>
            </div>
          </Reveal>

          <Reveal delay={460}>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-3.5 py-2 text-[12.5px] text-muted">
                <Icon name="shield" className="h-4 w-4 text-[var(--color-accent)]" />
                {t("hero.harvard")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-3.5 py-2 text-[12.5px] text-muted">
                <Icon name="globe" className="h-4 w-4 text-amber" />
                {pick({ fa: "عضو فدراسیون جهانی مخترعان", en: "World Inventors Federation member", ar: "عضوة في الاتحاد العالمي للمخترعين", zh: "世界发明家联合会会员" })}
              </span>
              <button
                type="button"
                onClick={() => jump("lab")}
                className="inline-flex items-center gap-2 rounded-xl border border-lime/35 bg-lime/10 px-3.5 py-2 text-[12.5px] text-lime transition hover:-translate-y-0.5 hover:bg-lime/15"
              >
                <Icon name="chip" className="h-4 w-4" />
                {t("hero.labTeaser")}
              </button>
            </div>
          </Reveal>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={520 + i * 80}>
                <div className="lift group rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <div className="font-display text-3xl font-bold" style={{ color: s.color }}>
                    <Counter to={s.v} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-[12px] leading-snug text-muted">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={240}>
            <HoloCard />
          </Reveal>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button type="button" onClick={() => jump("story")} className="group flex flex-col items-center gap-2 text-muted transition hover:text-txt">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
          <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
            <span className="h-2 w-1 rounded-full bg-[var(--color-accent)] transition-transform duration-700 group-hover:translate-y-3" />
          </span>
        </button>
      </div>
    </section>
  );
}