import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { cn } from "../utils/cn";

/* ------------------------------ icons ------------------------------ */
const PATHS: Record<string, ReactNode> = {
  code: <path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" />,
  brain: (
    <>
      <path d="M12 5a3 3 0 0 0-6 0 3 3 0 0 0-2 5.2A3 3 0 0 0 6 16a3 3 0 0 0 6 1z" />
      <path d="M12 5a3 3 0 0 1 6 0 3 3 0 0 1 2 5.2A3 3 0 0 1 18 16a3 3 0 0 1-6 1z" />
      <path d="M12 5v14" />
    </>
  ),
  game: (
    <>
      <path d="M6 11h4M8 9v4M15.5 12h.01M18 10h.01" />
      <path d="M17.3 5H6.7A4.7 4.7 0 0 0 2 9.7c0 2 .6 4.4 1.4 6.2A3 3 0 0 0 8.6 17l.7-1h5.4l.7 1a3 3 0 0 0 5.2-1.1c.8-1.8 1.4-4.2 1.4-6.2A4.7 4.7 0 0 0 17.3 5Z" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3" />
    </>
  ),
  heart: <path d="M20.8 6.6a5 5 0 0 0-8.8-1.6A5 5 0 0 0 3.2 6.6c-1 2.6.4 5 2.3 6.9l6.5 6.2 6.5-6.2c1.9-1.9 3.3-4.3 2.3-6.9Z" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="15" r="6" />
      <path d="M12 12.5 13 15h2.2l-1.8 1.4.7 2.3-2.1-1.4-2.1 1.4.7-2.3L8.8 15H11z" />
      <path d="M8.5 9 6 2h12l-2.5 7" />
    </>
  ),
  check: <path d="m4 12 5 5L20 6" />,
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  spark: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />,
  star: <path d="m12 3 2.6 5.6 6.4.8-4.7 4.3 1.3 6.3L12 17l-5.6 3 1.3-6.3L3 9.4l6.4-.8Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  layers: <path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
  eye: (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  refresh: <path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5M4 5v3.5h3.5M4 13a8 8 0 0 0 13.7 4.7L20 15.5M20 19v-3.5h-3.5" />,
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-1.8 0-1.4-1.2-1.6-1.2-2.7 0-.8.7-1.5 1.6-1.5H16a5 5 0 0 0 5-5c0-3.9-4-7-9-7Z" />
      <circle cx="7.5" cy="11.5" r="1.1" />
      <circle cx="11" cy="7.5" r="1.1" />
      <circle cx="15.5" cy="8.5" r="1.1" />
    </>
  ),
  rocket: (
    <>
      <path d="M5 15c-1.5 1.5-2 6-2 6s4.5-.5 6-2c.9-.9.9-2.3 0-3.2a2.3 2.3 0 0 0-4 0Z" />
      <path d="M14.5 13.5 18 10a6.4 6.4 0 0 0 2-6 6.4 6.4 0 0 0-6 2l-3.5 3.5-3 .5-2 2 4 1.5 1.5 4 2-2 .5-3Z" />
    </>
  ),
  shield: <path d="M12 3 5 6v6c0 4.2 2.9 7.8 7 9 4.1-1.2 7-4.8 7-9V6l-7-3Z" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z" />,
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </>
  ),
  logout: <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h12" />,
  sound: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="m17 9 5 6M22 9l-5 6" />
    </>
  ),
};

export function Icon({
  name,
  className,
  fill = "none",
  strokeWidth = 1.7,
  style,
}: {
  name: keyof typeof PATHS | string;
  className?: string;
  fill?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={style}
      className={cn("h-5 w-5", className)}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.spark}
    </svg>
  );
}

/* ------------------------------ reveal ------------------------------ */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // @ts-expect-error dynamic tag ref
    <Tag ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/* ------------------------------ tilt ------------------------------ */
export function Tilt({
  children,
  className,
  max = 7,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };
  return (
    <div ref={ref} className={cn("tilt-card", className)} style={style} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </div>
  );
}

/* ------------------------------ buttons ------------------------------ */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Btn({ variant = "primary", size = "md", className, children, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={cn(
        "sheen group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all disabled:cursor-not-allowed disabled:opacity-45",
        size === "sm" && "px-4 py-2 text-[13px]",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-7 py-3.5 text-[15px]",
        variant === "primary" && "btn-glow text-ink",
        variant === "outline" &&
          "border border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] bg-white/[0.03] text-txt hover:bg-white/[0.08] hover:border-[var(--color-accent)]",
        variant === "ghost" && "text-muted hover:text-txt hover:bg-white/[0.06]",
        variant === "danger" && "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
        className,
      )}
      style={
        variant === "primary"
          ? {
              backgroundImage: "linear-gradient(105deg, var(--color-accent), #8be9ff 40%, var(--color-magenta))",
              ...rest.style,
            }
          : rest.style
      }
    >
      {children}
    </button>
  );
}

/* ------------------------------ heart ------------------------------ */
export function HeartButton({
  id,
  className,
  label,
  compact = false,
}: {
  id: string;
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const { favorites, toggleFav, toast } = useStore();
  const { t } = useI18n();
  const [pop, setPop] = useState(false);
  const active = favorites.includes(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      title={active ? t("services.unfav") : t("services.fav")}
      aria-label={active ? t("services.unfav") : t("services.fav")}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const now = toggleFav(id);
        setPop(true);
        window.setTimeout(() => setPop(false), 460);
        toast(label ? `${label} · ${now ? t("services.added") : t("services.removed")}` : now ? t("services.added") : t("services.removed"), now ? "heart" : "info");
      }}
      className={cn(
        "group/heart relative grid place-items-center rounded-full border backdrop-blur-md transition-all duration-300",
        compact ? "h-9 w-9" : "h-11 w-11",
        active
          ? "border-magenta/70 bg-magenta/20 text-magenta shadow-[0_0_22px_-4px_var(--color-magenta)]"
          : "border-white/15 bg-ink/60 text-white/70 hover:border-magenta/60 hover:text-magenta hover:scale-110",
        className,
      )}
    >
      <Icon
        name="heart"
        className={cn(compact ? "h-4 w-4" : "h-5 w-5", pop && "heart-pop")}
        fill={active ? "currentColor" : "none"}
        strokeWidth={1.8}
      />
      {active && <span className="pointer-events-none absolute inset-0 rounded-full animate-ping bg-magenta/10" />}
    </button>
  );
}

/* ------------------------------ modal ------------------------------ */
export function Modal({
  open,
  onClose,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => panelRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(id);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-ink/85 backdrop-blur-md"
        style={{ animation: "riseIn .3s ease" }}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/12 bg-surface/95 shadow-[0_-10px_80px_-20px_rgba(0,0,0,.9)] outline-none sm:rounded-3xl",
          wide ? "sm:max-w-5xl" : "sm:max-w-3xl",
        )}
        style={{ animation: "riseIn .45s cubic-bezier(.22,1,.36,1)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute end-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink/70 text-white/80 backdrop-blur transition hover:rotate-90 hover:border-magenta/60 hover:text-magenta"
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------ headings ------------------------------ */
export function SectionHead({
  kicker,
  title,
  sub,
  center = false,
}: {
  kicker: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      <Reveal>
        <div className={cn("mb-4 flex items-center gap-3", center && "justify-center")}>
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-accent)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] accent-text">{kicker}</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-magenta)]" />
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="font-display text-3xl font-bold leading-[1.15] text-txt sm:text-4xl lg:text-[2.9rem]">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={140}>
          <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------ counter ------------------------------ */
export function Counter({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const { fmt } = useI18n();
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setVal(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return;
          done.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="num tabular-nums">
      {fmt(val)}
      {suffix}
    </span>
  );
}

/* ------------------------------ chips ------------------------------ */
export function Chip({
  children,
  color,
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] tracking-wide",
        className,
      )}
      style={{
        borderColor: color ? `${color}55` : "rgba(140,170,255,.22)",
        color: color ?? "#b9c9ea",
        background: color ? `${color}14` : "rgba(255,255,255,.03)",
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------ toasts ------------------------------ */
export function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[130] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/12 bg-surface2/95 px-4 py-3 shadow-[0_18px_50px_-20px_rgba(0,0,0,.95)] backdrop-blur-xl"
          style={{ animation: "riseIn .4s cubic-bezier(.22,1,.36,1)" }}
          role="status"
        >
          <span
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-full",
              t.tone === "heart" && "bg-magenta/20 text-magenta",
              t.tone === "ok" && "bg-success/20 text-success",
              t.tone === "info" && "bg-info/20 text-info",
              t.tone === "warn" && "bg-amber/20 text-amber",
            )}
          >
            <Icon name={t.tone === "heart" ? "heart" : t.tone === "warn" ? "bolt" : "check"} className="h-4 w-4" fill={t.tone === "heart" ? "currentColor" : "none"} />
          </span>
          <p className="flex-1 text-[13px] leading-snug text-txt">{t.text}</p>
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action?.run();
                dismissToast(t.id);
              }}
              className="rounded-full border border-[var(--color-accent)]/50 px-3 py-1 text-xs font-semibold accent-text transition hover:bg-[var(--color-accent)]/15"
            >
              {t.action.label}
            </button>
          )}
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="text-muted transition hover:text-txt"
            aria-label="close"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}