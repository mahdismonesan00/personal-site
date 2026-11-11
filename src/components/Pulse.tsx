import { useMemo, useState } from "react";
import { useI18n } from "../lib/i18n";
import { Counter, Icon, Reveal } from "./ui";

const WEEKS = 52;
const LEVELS = ["rgba(255,255,255,.05)", "color-mix(in srgb, var(--color-accent) 26%, transparent)", "color-mix(in srgb, var(--color-accent) 52%, transparent)", "color-mix(in srgb, var(--color-accent) 78%, transparent)", "var(--color-magenta)"];

export default function Pulse() {
  const { t, fmt, pick } = useI18n();
  const [hover, setHover] = useState<{ w: number; d: number; v: number } | null>(null);

  const cells = useMemo(() => {
    const out: number[][] = [];
    let total = 0;
    for (let w = 0; w < WEEKS; w++) {
      const col: number[] = [];
      for (let d = 0; d < 7; d++) {
        const n = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453;
        const r = n - Math.floor(n);
        const season = 0.55 + 0.45 * Math.sin((w / WEEKS) * Math.PI * 2 - 1);
        const weekend = d === 5 ? 0.55 : 1;
        const raw = r * season * weekend;
        const v = raw < 0.18 ? 0 : raw < 0.36 ? 1 : raw < 0.55 ? 2 : raw < 0.74 ? 3 : 4;
        col.push(v);
        total += v * 3 + (v ? 1 : 0);
      }
      out.push(col);
    }
    return { grid: out, total };
  }, []);

  const stats = [
    { v: cells.total, label: t("pulse.commits"), icon: "code", color: "var(--color-accent)" },
    { v: 41, label: t("pulse.streak"), icon: "bolt", color: "#ffb627" },
    { v: 24, label: t("pulse.releases"), icon: "rocket", color: "#a6f04a" },
    { v: 96, label: t("pulse.nights"), icon: "star", color: "#ff2e88" },
  ];

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-xl">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--color-accent)]" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.32em] accent-text">{t("pulse.kicker")}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-txt sm:text-2xl">{t("pulse.title")}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{t("pulse.sub")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-ink/40 px-4 py-3">
                    <Icon name={s.icon} className="h-4 w-4" style={{ color: s.color }} />
                    <div className="mt-2 font-display text-xl font-bold text-txt">
                      <Counter to={s.v} />
                    </div>
                    <div className="text-[10.5px] leading-tight text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex min-w-[720px] gap-[3px]">
                {cells.grid.map((col, w) => (
                  <div key={w} className="flex flex-1 flex-col gap-[3px]">
                    {col.map((v, d) => (
                      <button
                        key={d}
                        type="button"
                        tabIndex={-1}
                        onMouseEnter={() => setHover({ w, d, v })}
                        onMouseLeave={() => setHover(null)}
                        className="aspect-square w-full rounded-[3px] transition-transform duration-200 hover:scale-125"
                        style={{
                          background: LEVELS[v],
                          boxShadow: v >= 3 ? "0 0 10px -2px color-mix(in srgb, var(--color-accent) 70%, transparent)" : undefined,
                        }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-muted">
                {hover
                  ? `${fmt(hover.v * 3 + (hover.v ? 1 : 0))} ${t("pulse.commits")} · ${pick({ fa: "هفته", en: "week", ar: "أسبوع", zh: "第" })} ${fmt(WEEKS - hover.w)}`
                  : t("pulse.hover")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-muted">{t("pulse.less")}</span>
                {LEVELS.map((l, i) => (
                  <span key={i} className="h-3 w-3 rounded-[3px]" style={{ background: l }} />
                ))}
                <span className="font-mono text-[10px] text-muted">{t("pulse.more")}</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}