import { useEffect, useRef, useState } from "react";
import { SKILL_GROUPS, TOOLS } from "../data/profile";
import { useI18n } from "../lib/i18n";
import { Chip, Icon, Reveal, SectionHead } from "./ui";

function Bar({ level, color, delay }: { level: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const { fmt } = useI18n();

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setW(level);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.setTimeout(() => setW(level), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [level, delay]);

  return (
    <div ref={ref} className="relative h-2 overflow-hidden rounded-full bg-white/8">
      <div
        className="absolute inset-y-0 start-0 rounded-full transition-[width] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]"
        style={{
          width: `${w}%`,
          background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 40%, #ff2e88))`,
          boxShadow: `0 0 16px -2px ${color}`,
        }}
      />
      <span className="sr-only">{fmt(level)}%</span>
    </div>
  );
}

export default function Skills() {
  const { t, fmt } = useI18n();

  return (
    <section id="skills" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker={t("skills.kicker")} title={t("skills.title")} sub={t("skills.sub")} />
          <Reveal delay={200}>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                <Icon name="bolt" />
              </span>
              <div>
                <div className="font-display text-2xl font-bold text-txt">{fmt(13)}</div>
                <div className="text-[11.5px] text-muted">{t("hero.statTech")}</div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {SKILL_GROUPS.map((g, gi) => (
            <Reveal key={g.id} delay={gi * 110}>
              <div className="lift group h-full rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: `${g.color}1c`, color: g.color }}
                  >
                    <Icon name={g.id === "web" ? "code" : g.id === "ai" ? "brain" : "chip"} />
                  </span>
                  <h3 className="font-display text-[16px] font-bold text-txt">{t(g.labelKey)}</h3>
                  <span className="ms-auto font-mono text-[11px] text-muted">{fmt(g.items.length)}</span>
                </div>

                <div className="mt-6 space-y-4">
                  {g.items.map((s, i) => (
                    <div key={s.name}>
                      <div className="mb-1.5 flex items-baseline justify-between">
                        <span className="font-mono text-[12.5px] text-txt/90">{s.name}</span>
                        <span className="font-mono text-[11px]" style={{ color: g.color }}>
                          {fmt(s.level)}%
                        </span>
                      </div>
                      <Bar level={s.level} color={g.color} delay={i * 110} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
            <span className="me-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{t("skills.tools")}</span>
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="cursor-default rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[12px] text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/60 hover:text-txt"
              >
                {tool}
              </span>
            ))}
            <Chip className="ms-auto" color="#a6f04a">
              <Icon name="check" className="h-3.5 w-3.5" />
              iOLearn Academy
            </Chip>
          </div>
        </Reveal>
      </div>
    </section>
  );
}