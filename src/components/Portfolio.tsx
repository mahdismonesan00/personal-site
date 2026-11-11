import { useMemo, useState } from "react";
import { PROJECTS } from "../data/profile";
import { CATEGORIES, type Cat } from "../data/services";
import { useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { Chip, HeartButton, Icon, Reveal, SectionHead } from "./ui";
import { catColor, catIcon } from "./Services";
import { cn } from "../utils/cn";

export default function Portfolio() {
  const { t, pick, fmt } = useI18n();
  const { openDetail } = useStore();
  const [cat, setCat] = useState<Cat | "all">("all");

  const list = useMemo(() => (cat === "all" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat)), [cat]);

  return (
    <section id="work" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead kicker={t("work.kicker")} title={t("work.title")} sub={t("work.sub")} />
          <Reveal delay={140}>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {[{ id: "all" as const, label: t("services.all"), color: "#8ab4ff" }, ...CATEGORIES.map((c) => ({ id: c.id, label: pick(c.label), color: c.color }))].map((tb) => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setCat(tb.id as Cat | "all")}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-all duration-300",
                    cat === tb.id
                      ? "border-transparent text-ink"
                      : "border-white/12 bg-white/[0.03] text-muted hover:-translate-y-0.5 hover:text-txt",
                  )}
                  style={cat === tb.id ? { background: `linear-gradient(105deg, ${tb.color}, color-mix(in srgb, ${tb.color} 50%, #ff2e88))` } : undefined}
                >
                  {tb.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => {
            const color = catColor(p.cat);
            const featured = i === 0 && cat === "all";
            return (
              <Reveal key={p.id} delay={(i % 3) * 90} className={cn(featured && "lg:col-span-2")}>
                <article
                  className={cn(
                    "lift group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.028]",
                    featured && "lg:flex-row",
                  )}
                >
                  <div className={cn("img-wrap relative overflow-hidden", featured ? "aspect-[16/11] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]")}>
                    <button
                      type="button"
                      onClick={() => openDetail("project", p.id)}
                      className="absolute inset-0 h-full w-full"
                      aria-label={`${pick(p.name)} — ${t("work.viewCase")}`}
                    >
                      <img
                        src={p.img}
                        alt={pick(p.name)}
                        loading="lazy"
                        className="img-grade h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.1]"
                      />
                    </button>
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold backdrop-blur-md"
                        style={{ borderColor: `${color}66`, background: `${color}22`, color }}
                      >
                        <Icon name={catIcon(p.cat)} className="h-3.5 w-3.5" />
                        {pick(CATEGORIES.find((c) => c.id === p.cat)!.label)}
                      </span>
                      <span className="pointer-events-auto">
                        <HeartButton id={p.id} label={pick(p.name)} compact />
                      </span>
                    </div>
                    <span className="absolute bottom-3 start-3 z-10 rounded-full border border-white/20 bg-ink/70 px-2.5 py-1 font-mono text-[10.5px] text-txt backdrop-blur">
                      {fmt(p.year)}
                    </span>
                  </div>

                  <div className={cn("flex flex-1 flex-col p-5", featured && "lg:w-1/2 lg:p-7")}>
                    <h3
                      className={cn(
                        "font-display font-bold leading-snug text-txt transition-colors group-hover:text-[var(--color-accent)]",
                        featured ? "text-xl" : "text-[16.5px]",
                      )}
                    >
                      {pick(p.name)}
                    </h3>
                    <p className={cn("mt-2.5 text-[13px] leading-[1.85] text-muted", featured ? "line-clamp-4" : "line-clamp-3")}>{pick(p.blurb)}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {p.metrics.map((m) => (
                        <div key={m.label.en} className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                          <div className="font-display text-lg font-bold" style={{ color }}>
                            {fmt(m.v)}
                            <span className="text-[12px]">{m.suffix}</span>
                          </div>
                          <div className="text-[10.5px] leading-tight text-muted">{pick(m.label)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.stack.slice(0, featured ? 4 : 3).map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => openDetail("project", p.id)}
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-semibold text-txt transition-all hover:gap-3 hover:text-[var(--color-accent)]"
                    >
                      {t("work.viewCase")}
                      <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}