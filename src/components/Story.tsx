import { useI18n } from "../lib/i18n";
import { Chip, Icon, Reveal, SectionHead } from "./ui";
import { Monogram } from "./Nav";

export default function Story() {
  const { t, pick } = useI18n();

  const focus = [
    { icon: "medal", color: "#ffb627", t: t("story.f1t"), b: t("story.f1b") },
    { icon: "layers", color: "#3be8ff", t: t("story.f2t"), b: t("story.f2b") },
    { icon: "rocket", color: "#ff2e88", t: t("story.f3t"), b: t("story.f3b") },
  ];

  return (
    <section id="story" className="relative py-24 sm:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <div className="glass relative overflow-hidden rounded-3xl p-6">
                <div className="pointer-events-none absolute -end-16 -top-16 h-52 w-52 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
                <div className="relative flex items-center gap-4">
                  <Monogram className="h-14 w-14" />
                  <div>
                    <div className="font-display text-lg font-bold text-txt">
                      {pick({ fa: "مهدیس مونسان", en: "Mahdis Mounesan", ar: "مهديس مونسان", zh: "马赫迪斯·蒙桑" })}
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                      inventor · engineer · 14
                    </div>
                  </div>
                </div>

                <div className="relative mt-6 space-y-2.5">
                  {[
                    { icon: "chip", label: pick({ fa: "حوزه فعالیت", en: "Fields", ar: "المجالات", zh: "领域" }), value: pick({ fa: "وب · هوش مصنوعی · رباتیک", en: "Web · AI · Robotics", ar: "ويب · ذكاء · روبوتات", zh: "网页 · AI · 机器人" }) },
                    { icon: "star", label: pick({ fa: "آکادمی", en: "Academy", ar: "الأكاديمية", zh: "学院" }), value: "iOLearn Academy" },
                    { icon: "globe", label: pick({ fa: "میدان رقابت", en: "Competed in", ar: "ميدان المنافسة", zh: "参赛地" }), value: pick({ fa: "آمریکا · سوئیس · ترکیه", en: "USA · Switzerland · Türkiye", ar: "أمريكا · سويسرا · تركيا", zh: "美国 · 瑞士 · 土耳其" }) },
                    { icon: "shield", label: pick({ fa: "گواهی", en: "Certificate", ar: "الشهادة", zh: "证书" }), value: pick({ fa: "هاروارد · برنامه‌نویسی AI", en: "Harvard · AI Programming", ar: "هارفارد · برمجة الذكاء", zh: "哈佛 · AI 编程" }) },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 transition hover:border-[var(--color-accent)]/40 hover:bg-white/[0.05]"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--color-accent)]/12 text-[var(--color-accent)] transition group-hover:scale-110">
                        <Icon name={row.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10.5px] uppercase tracking-wider text-muted">{row.label}</div>
                        <div className="truncate text-[13.5px] font-medium text-txt">{row.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <blockquote className="relative mt-6 rounded-2xl border-s-2 border-[var(--color-magenta)] bg-magenta/[0.07] px-4 py-3.5">
                  <p className="text-[14px] leading-relaxed text-txt/90">“{t("story.quote")}”</p>
                </blockquote>

                <svg viewBox="0 0 300 60" className="relative mt-6 h-12 w-full opacity-60" aria-hidden="true">
                  <path
                    d="M0 30h60l12-18 14 36 12-18h40l10-14 12 28 10-14h130"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1.6"
                    strokeDasharray="6 6"
                    style={{ animation: "dashMove 9s linear infinite" }}
                  />
                  <circle cx="60" cy="30" r="3" fill="var(--color-magenta)" />
                  <circle cx="240" cy="30" r="3" fill="var(--color-amber)" />
                </svg>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionHead kicker={t("story.kicker")} title={t("story.title")} />
          <Reveal delay={120}>
            <p className="mt-6 text-[15.5px] leading-[2] text-muted">{t("story.p1")}</p>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-4 text-[15.5px] leading-[2] text-muted">{t("story.p2")}</p>
          </Reveal>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {focus.map((f, i) => (
              <Reveal key={f.t} delay={220 + i * 90}>
                <div className="lift h-full rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl"
                    style={{ background: `${f.color}1c`, color: f.color }}
                  >
                    <Icon name={f.icon} />
                  </span>
                  <h3 className="mt-4 font-display text-[15px] font-bold text-txt">{f.t}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{f.b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={420}>
            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-azure)_22%,transparent)] via-transparent to-[color-mix(in_srgb,var(--color-magenta)_18%,transparent)] p-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-ink/60 font-display text-lg font-bold text-txt">
                  iO
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-bold text-txt">{t("story.academyTitle")}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{t("story.academyBody")}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Chip color="#3be8ff">Web Engineering</Chip>
                <Chip color="#ff2e88">Artificial Intelligence</Chip>
                <Chip color="#ffb627">Robotics</Chip>
                <Chip color="#a6f04a">Competition Lab</Chip>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}