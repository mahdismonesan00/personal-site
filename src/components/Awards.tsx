import { AWARDS, type Medal } from "../data/profile";
import { useI18n } from "../lib/i18n";
import { Chip, Icon, Reveal, SectionHead, Tilt } from "./ui";
import { MedalArt } from "./Hero";

const MEDAL_STYLE: Record<Medal, { color: string; key: string; icon: string }> = {
  gold: { color: "#ffd166", key: "awards.gold", icon: "medal" },
  silver: { color: "#d7e3f5", key: "awards.silver", icon: "medal" },
  diploma: { color: "#ff2e88", key: "awards.diploma", icon: "star" },
  member: { color: "#3be8ff", key: "awards.member", icon: "shield" },
  cert: { color: "#a6f04a", key: "awards.cert", icon: "check" },
};

export default function Awards() {
  const { t, pick, fmt } = useI18n();

  return (
    <section id="awards" className="relative py-24 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-amber) 60%, transparent), transparent)" }}
      />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHead kicker={t("awards.kicker")} title={t("awards.title")} sub={t("awards.sub")} center />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {AWARDS.map((a, i) => {
            const s = MEDAL_STYLE[a.medal];
            return (
              <Reveal key={a.id} delay={i * 90}>
                <Tilt max={6} className="h-full">
                  <article
                    className="lift sheen group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.028] p-6"
                    style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.05)" }}
                  >
                    <div
                      className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
                      style={{ background: s.color }}
                    />
                    <div className="relative flex items-start justify-between gap-3">
                      <span
                        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold"
                        style={{ borderColor: `${s.color}55`, background: `${s.color}14`, color: s.color }}
                      >
                        <Icon name={s.icon} className="h-4 w-4" />
                        {t(s.key)}
                      </span>
                      <span className="font-mono text-[11px] text-muted">{fmt(a.year)}</span>
                    </div>

                    {a.medal === "gold" || a.medal === "silver" ? (
                      <div className="relative mt-3 flex justify-center">
                        <MedalArt
                          kind={a.medal}
                          className="h-24 opacity-95 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
                        />
                      </div>
                    ) : (
                      <div className="relative mt-4 flex justify-center">
                        <span
                          className="grid h-20 w-20 place-items-center rounded-2xl border transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
                          style={{ borderColor: `${s.color}44`, background: `${s.color}12`, color: s.color }}
                        >
                          <Icon name={s.icon} className="h-9 w-9" strokeWidth={1.4} />
                        </span>
                      </div>
                    )}

                    <h3 className="relative mt-4 font-display text-[17px] font-bold leading-snug text-txt">{pick(a.title)}</h3>
                    <p className="relative mt-1.5 text-[12.5px] font-medium" style={{ color: s.color }}>
                      {pick(a.org)}
                    </p>
                    <p className="relative mt-3 flex-1 text-[13.5px] leading-[1.85] text-muted">{pick(a.desc)}</p>

                    <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4">
                      <Chip>
                        <Icon name="globe" className="h-3.5 w-3.5" />
                        {pick(a.place)}
                      </Chip>
                      <Chip color="#31d99a">
                        <Icon name="user" className="h-3.5 w-3.5" />
                        {t("awards.solo")}
                      </Chip>
                      {a.medal === "diploma" && <Chip color="#ff2e88">{t("awards.rank4")}</Chip>}
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}