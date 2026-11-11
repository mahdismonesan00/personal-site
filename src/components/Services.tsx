import { useMemo, useState } from "react";
import { CATEGORIES, SERVICES, type Cat } from "../data/services";
import { useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { Btn, Chip, HeartButton, Icon, Reveal, SectionHead, Tilt } from "./ui";
import { cn } from "../utils/cn";

export const catColor = (c: Cat) => CATEGORIES.find((x) => x.id === c)?.color ?? "#3be8ff";
export const catIcon = (c: Cat) => CATEGORIES.find((x) => x.id === c)?.icon ?? "code";

export default function Services() {
  const { t, pick, lang, fmt } = useI18n();
  const { openDetail, setWizardSeed, setDashTab, setRoute } = useStore();
  const [cat, setCat] = useState<Cat | "all">("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return SERVICES.filter((s) => {
      const okCat = cat === "all" || s.cat === cat;
      if (!okCat) return false;
      if (!query) return true;
      const hay = `${s.title[lang]} ${s.tagline[lang]} ${s.body[lang]} ${s.title.en} ${s.stack.join(" ")}`.toLowerCase();
      return hay.includes(query);
    });
  }, [cat, q, lang]);

  const start = (id: string) => {
    setWizardSeed(id);
    setDashTab("wizard");
    setRoute("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs: { id: Cat | "all"; label: string; color: string; count: number }[] = [
    { id: "all", label: t("services.all"), color: "#8ab4ff", count: SERVICES.length },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      label: pick(c.label),
      color: c.color,
      count: SERVICES.filter((s) => s.cat === c.id).length,
    })),
  ];

  return (
    <section id="services" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHead kicker={t("services.kicker")} title={t("services.title")} sub={t("services.sub")} />

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-4 lg:flex-row lg:items-center">
            <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
              {tabs.map((tb) => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setCat(tb.id)}
                  className={cn(
                    "group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all duration-300",
                    cat === tb.id
                      ? "text-ink"
                      : "border-white/12 bg-white/[0.03] text-muted hover:-translate-y-0.5 hover:text-txt",
                  )}
                  style={
                    cat === tb.id
                      ? { background: `linear-gradient(105deg, ${tb.color}, color-mix(in srgb, ${tb.color} 55%, #ff2e88))`, borderColor: tb.color }
                      : undefined
                  }
                >
                  {tb.id !== "all" && <Icon name={catIcon(tb.id)} className="h-4 w-4" />}
                  {tb.label}
                  <span className={cn("font-mono text-[10.5px]", cat === tb.id ? "opacity-70" : "opacity-60")}>{fmt(tb.count)}</span>
                </button>
              ))}
            </div>

            <div className="relative lg:w-72">
              <Icon name="search" className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("services.searchPh")}
                className="w-full rounded-full border border-white/12 bg-ink/50 py-2.5 pe-4 ps-10 text-[13px] text-txt outline-none transition placeholder:text-muted/70 focus:border-[var(--color-accent)] focus:bg-ink/70"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-magenta"
                  aria-label={t("services.reset")}
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <div className="mt-4 flex items-center gap-3 px-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {t("services.results", { n: fmt(list.length) })}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent" />
        </div>

        {list.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <Icon name="search" className="h-10 w-10 text-muted" />
            <p className="mt-4 text-[15px] text-muted">{t("services.none")}</p>
            <Btn
              variant="outline"
              className="mt-5"
              onClick={() => {
                setQ("");
                setCat("all");
              }}
            >
              <Icon name="refresh" className="h-4 w-4" />
              {t("services.reset")}
            </Btn>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((s, i) => {
              const color = catColor(s.cat);
              return (
                <Reveal key={s.id} delay={(i % 4) * 80}>
                  <Tilt max={5} className="h-full">
                  <article className="lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.028]">
                    <div
                      className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(340px circle at var(--mx,50%) var(--my,0%), color-mix(in srgb, ${color} 16%, transparent), transparent 62%)`,
                      }}
                    />
                    <div className="img-wrap relative aspect-[16/11] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => openDetail("service", s.id)}
                        className="absolute inset-0 h-full w-full cursor-pointer"
                        aria-label={`${pick(s.title)} — ${t("services.details")}`}
                      >
                        <img
                          src={s.img}
                          alt={pick(s.title)}
                          loading="lazy"
                          className="img-grade h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.12]"
                        />
                      </button>
                      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
                        <span
                          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold backdrop-blur-md"
                          style={{ borderColor: `${color}66`, background: `${color}22`, color }}
                        >
                          <Icon name={catIcon(s.cat)} className="h-3.5 w-3.5" />
                          {pick(CATEGORIES.find((c) => c.id === s.cat)!.label)}
                        </span>
                        <span className="pointer-events-auto">
                          <HeartButton id={s.id} label={pick(s.title)} compact />
                        </span>
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-3 items-center justify-center p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-ink/75 px-4 py-2 text-[12px] font-semibold text-txt backdrop-blur-md">
                          <Icon name="eye" className="h-4 w-4" />
                          {t("services.details")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <button
                        type="button"
                        onClick={() => openDetail("service", s.id)}
                        className="text-start font-display text-[16px] font-bold leading-snug text-txt transition-colors hover:text-[var(--color-accent)]"
                      >
                        {pick(s.title)}
                      </button>
                      <p className="mt-1 text-[12.5px] font-medium" style={{ color }}>
                        {pick(s.tagline)}
                      </p>
                      <p className="mt-3 line-clamp-3 text-[13px] leading-[1.85] text-muted">{pick(s.body)}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {s.stack.slice(0, 3).map((st) => (
                          <Chip key={st}>{st}</Chip>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted">
                          <Icon name="clock" className="h-3.5 w-3.5" />
                          {fmt(s.weeks[0])}–{fmt(s.weeks[1])} {t("unit.weeks")}
                        </span>
                        <button
                          type="button"
                          onClick={() => start(s.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[12px] font-semibold text-txt transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                        >
                          {t("services.order")}
                          <Icon name="arrow" className="h-3.5 w-3.5 rtl:rotate-180" />
                        </button>
                      </div>
                    </div>
                  </article>
                  </Tilt>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}