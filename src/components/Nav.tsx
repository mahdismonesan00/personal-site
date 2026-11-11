import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n, type Lang } from "../lib/i18n";
import { useStore } from "../lib/store";
import { Icon } from "./ui";
import { cn } from "../utils/cn";
import { onSoundChange, play, setSound, soundEnabled } from "../lib/sound";

const SECTIONS = ["home", "story", "awards", "skills", "lab", "services", "work", "quiz", "favorites", "contact"];

export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-10 w-10", className)} aria-hidden="true">
      <defs>
        <linearGradient id="mmg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="60%" stopColor="#8ab4ff" />
          <stop offset="100%" stopColor="var(--color-magenta)" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="rgba(10,16,32,.85)" stroke="url(#mmg)" strokeWidth="1.6" />
      <path d="M11 34V15l13 11 13-11v19" fill="none" stroke="url(#mmg)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="38" r="2.4" fill="var(--color-magenta)" />
    </svg>
  );
}

export default function Nav() {
  const { t, lang, setLang } = useI18n();
  const { favorites, route, setRoute, user, setDashTab, setPaletteOpen } = useStore();
  const [sound, setSoundState] = useState(soundEnabled());

  useEffect(() => {
    const off = onSoundChange(setSoundState);
    return () => {
      off();
    };
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
        let current = "home";
        for (const id of SECTIONS) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 140) current = id;
        }
        setActive(current);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [route]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const go = (id: string) => {
    setMenu(false);
    if (route !== "site") {
      setRoute("site");
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 90);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openDash = () => {
    setMenu(false);
    setDashTab("overview");
    setRoute("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = ["home", "story", "awards", "lab", "services", "work", "quiz", "contact"];

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-500",
          scrolled ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => go("home")}
            className="group flex shrink-0 items-center gap-3"
            aria-label="Mahdis Mounesan"
          >
            <span className="transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105">
              <Monogram />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[15px] font-bold tracking-tight text-txt">
                {lang === "fa" ? "مهدیس مونسان" : lang === "ar" ? "مهديس مونسان" : lang === "zh" ? "马赫迪斯·蒙桑" : "Mahdis Mounesan"}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                web · ai · robotics
              </span>
            </span>
          </button>

          <nav className="mx-auto hidden items-center gap-0.5 xl:flex">
            {links.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                data-active={route === "site" && active === id}
                className={cn(
                  "underline-sweep rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                  route === "site" && active === id ? "text-txt" : "text-muted hover:text-txt",
                )}
              >
                {t(`nav.${id}`)}
              </button>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 xl:ms-0">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden h-10 items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 text-muted transition hover:border-[var(--color-accent)] hover:text-txt 2xl:inline-flex"
              aria-label={t("cmd.open")}
              title={t("cmd.open")}
            >
              <Icon name="search" className="h-[18px] w-[18px]" />
              <span className="font-mono text-[11px]">⌘K</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSound(!sound);
                if (!sound) play("on");
              }}
              aria-pressed={sound}
              aria-label={sound ? t("nav.soundOn") : t("nav.soundOff")}
              title={sound ? t("nav.soundOn") : t("nav.soundOff")}
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-full border transition",
                sound
                  ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
                  : "border-white/12 bg-white/[0.03] text-muted hover:text-txt",
              )}
            >
              <Icon name={sound ? "sound" : "mute"} className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => go("favorites")}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-muted transition hover:border-magenta/60 hover:text-magenta"
              aria-label={t("nav.favorites")}
              title={t("nav.favorites")}
            >
              <Icon name="heart" className="h-[18px] w-[18px]" fill={favorites.length ? "currentColor" : "none"} />
              {favorites.length > 0 && (
                <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-magenta px-1 font-mono text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </button>

            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className="flex h-10 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3 text-muted transition hover:border-[var(--color-accent)] hover:text-txt"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t("nav.lang")}
              >
                <Icon name="globe" className="h-[18px] w-[18px]" />
                <span className="font-mono text-xs font-semibold">{LANGS.find((l) => l.code === lang)?.short}</span>
                <Icon name="chevron" className={cn("h-3.5 w-3.5 transition-transform", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div
                  role="listbox"
                  className="absolute end-0 top-12 w-44 overflow-hidden rounded-2xl border border-white/12 bg-surface2/95 p-1.5 shadow-2xl backdrop-blur-xl"
                  style={{ animation: "riseIn .25s ease" }}
                >
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      role="option"
                      aria-selected={lang === l.code}
                      onClick={() => {
                        setLang(l.code as Lang);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition",
                        lang === l.code ? "bg-[var(--color-accent)]/15 text-txt" : "text-muted hover:bg-white/5 hover:text-txt",
                      )}
                    >
                      <span>{l.label}</span>
                      <span className="font-mono text-[10px] opacity-70">{l.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={openDash}
              className={cn(
                "hidden h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition sm:inline-flex",
                route === "dashboard"
                  ? "border border-[var(--color-accent)] text-txt"
                  : "btn-glow text-ink",
              )}
              style={
                route === "dashboard"
                  ? undefined
                  : { backgroundImage: "linear-gradient(105deg, var(--color-accent), var(--color-magenta))" }
              }
            >
              <Icon name={user ? "user" : "bolt"} className="h-4 w-4" />
              {user ? user.name.split(" ")[0] : t("nav.dashboard")}
            </button>

            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-txt xl:hidden"
              aria-label={t("nav.menu")}
              aria-expanded={menu}
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
        </div>
        <div className="h-[2px] w-full bg-transparent">
          <div
            className="h-full origin-left transition-[width] duration-150"
            style={{
              width: `${progress * 100}%`,
              backgroundImage: "linear-gradient(90deg, var(--color-accent), var(--color-magenta), var(--color-amber))",
            }}
          />
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-[79] xl:hidden">
          <div className="absolute inset-0 bg-ink/95 backdrop-blur-xl" onClick={() => setMenu(false)} />
          <div
            className="relative mx-auto mt-[72px] max-h-[calc(100vh-72px)] overflow-y-auto px-5 py-6"
            style={{ animation: "riseIn .35s cubic-bezier(.22,1,.36,1)" }}
          >
            <div className="grid gap-2">
              {SECTIONS.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => go(id)}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-start text-base font-semibold text-txt transition hover:border-[var(--color-accent)]/60 hover:bg-white/[0.06]"
                  style={{ animation: `riseIn .4s cubic-bezier(.22,1,.36,1) ${i * 40}ms both` }}
                >
                  <span>{t(`nav.${id}`)}</span>
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={openDash}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-bold text-ink"
                style={{ backgroundImage: "linear-gradient(105deg, var(--color-accent), var(--color-magenta))" }}
              >
                <Icon name="bolt" className="h-5 w-5" />
                {t("nav.dashboard")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}