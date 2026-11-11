import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "../data/profile";
import { SERVICES } from "../data/services";
import { LANGS, useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { play, setSound, soundEnabled } from "../lib/sound";
import { Icon } from "./ui";
import { cn } from "../utils/cn";

interface Item {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: string;
  run: () => void;
}

export default function CommandPalette() {
  const { t, pick, setLang } = useI18n();
  const { paletteOpen, setPaletteOpen, setRoute, setDashTab, openDetail, setChatOpen } = useStore();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
        play("whoosh");
      }
      if (e.key === "Escape" && paletteOpen) setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setActive(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [paletteOpen]);

  const go = (id: string) => {
    setPaletteOpen(false);
    setRoute("site");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 110);
  };

  const items = useMemo<Item[]>(() => {
    const sections = ["home", "story", "awards", "skills", "lab", "quiz", "services", "work", "favorites", "contact"].map((id) => ({
      id: `s-${id}`,
      group: t("cmd.sections"),
      label: t(`nav.${id}`),
      icon: id === "lab" ? "chip" : id === "quiz" ? "bolt" : id === "awards" ? "medal" : "grid",
      run: () => go(id),
    }));

    const actions: Item[] = [
      {
        id: "a-dash",
        group: t("cmd.actions"),
        label: t("nav.dashboard"),
        icon: "user",
        run: () => {
          setPaletteOpen(false);
          setDashTab("overview");
          setRoute("dashboard");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        id: "a-brief",
        group: t("cmd.actions"),
        label: t("dash.startQuiz"),
        icon: "spark",
        run: () => {
          setPaletteOpen(false);
          setDashTab("wizard");
          setRoute("dashboard");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        id: "a-chat",
        group: t("cmd.actions"),
        label: t("chat.open"),
        icon: "chat",
        run: () => {
          setPaletteOpen(false);
          setChatOpen(true);
        },
      },
      {
        id: "a-sound",
        group: t("cmd.actions"),
        label: soundEnabled() ? t("nav.soundOff") : t("nav.soundOn"),
        icon: "bolt",
        run: () => {
          setSound(!soundEnabled());
          setPaletteOpen(false);
        },
      },
      ...LANGS.map((l) => ({
        id: `a-lang-${l.code}`,
        group: t("cmd.actions"),
        label: l.label,
        hint: l.short,
        icon: "globe",
        run: () => {
          setLang(l.code);
          setPaletteOpen(false);
        },
      })),
    ];

    const services: Item[] = SERVICES.map((s) => ({
      id: `sv-${s.id}`,
      group: t("cmd.items"),
      label: pick(s.title),
      hint: pick(s.tagline),
      icon: "layers",
      run: () => {
        setPaletteOpen(false);
        openDetail("service", s.id);
      },
    }));

    const projects: Item[] = PROJECTS.map((p) => ({
      id: `pj-${p.id}`,
      group: t("cmd.items"),
      label: pick(p.name),
      hint: p.stack.slice(0, 3).join(" · "),
      icon: "eye",
      run: () => {
        setPaletteOpen(false);
        openDetail("project", p.id);
      },
    }));

    return [...sections, ...actions, ...services, ...projects];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, pick, setLang, openDetail, setPaletteOpen, setRoute, setDashTab, setChatOpen]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items.slice(0, 12);
    return items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(query)).slice(0, 24);
  }, [items, q]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!paletteOpen) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label={t("cmd.open")}>
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={() => setPaletteOpen(false)} />
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-surface2/95 shadow-[0_40px_120px_-40px_rgba(0,0,0,.95)]"
        style={{ animation: "riseIn .3s cubic-bezier(.22,1,.36,1)" }}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <Icon name="search" className="h-5 w-5 text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(filtered.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                filtered[active]?.run();
                play("tap");
              }
            }}
            placeholder={t("cmd.placeholder")}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-txt outline-none placeholder:text-muted/70"
          />
          <kbd className="hidden rounded-md border border-white/15 px-2 py-1 font-mono text-[10px] text-muted sm:block">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && <p className="px-4 py-10 text-center text-[13px] text-muted">{t("cmd.empty")}</p>}
          {filtered.map((i, index) => {
            const header = i.group !== lastGroup ? i.group : null;
            lastGroup = i.group;
            return (
              <div key={i.id}>
                {header && <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{header}</div>}
                <button
                  type="button"
                  data-i={index}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => {
                    i.run();
                    play("tap");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start transition",
                    active === index ? "bg-white/[0.08] text-txt" : "text-muted hover:bg-white/[0.04]",
                  )}
                  style={active === index ? { boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 40%, transparent)" } : undefined}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-[var(--color-accent)]">
                    <Icon name={i.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium">{i.label}</span>
                    {i.hint && <span className="block truncate text-[11.5px] text-muted">{i.hint}</span>}
                  </span>
                  {active === index && <Icon name="arrow" className="h-4 w-4 shrink-0 rtl:rotate-180" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 px-4 py-2.5 font-mono text-[10.5px] text-muted">{t("cmd.hint")}</div>
      </div>
    </div>
  );
}