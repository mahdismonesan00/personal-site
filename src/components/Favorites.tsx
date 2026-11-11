import { PROJECTS } from "../data/profile";
import { CATEGORIES, serviceById } from "../data/services";
import { useI18n } from "../lib/i18n";
import { uid, useStore } from "../lib/store";
import { Btn, HeartButton, Icon, Reveal, SectionHead } from "./ui";
import { catColor, catIcon } from "./Services";

export default function Favorites() {
  const { favorites, clearFavs, restoreFavs, openDetail, addMessage, toast, user } = useStore();
  const { t, pick, fmt } = useI18n();

  const items = favorites
    .map((id) => {
      const s = serviceById(id);
      if (s) return { id, title: pick(s.title), img: s.img, cat: s.cat, kind: "service" as const };
      const p = PROJECTS.find((x) => x.id === id);
      if (p) return { id, title: pick(p.name), img: p.img, cat: p.cat, kind: "project" as const };
      return null;
    })
    .filter(Boolean) as { id: string; title: string; img: string; cat: (typeof CATEGORIES)[number]["id"]; kind: "service" | "project" }[];

  const sendList = () => {
    if (!items.length) return;
    const body = items.map((i) => `• ${i.title}`).join("\n");
    addMessage({
      id: uid(),
      ref: `MM-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: Date.now(),
      name: user?.name ?? "Guest",
      email: user?.email ?? "guest@local",
      topic: items[0].id,
      budget: "b5",
      body: `${t("fav.title")}:\n${body}`,
    });
    toast(t("fav.sent"), "ok");
  };

  return (
    <section id="favorites" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker={t("fav.kicker")} title={t("fav.title")} sub={t("fav.sub")} />
          {items.length > 0 && (
            <Reveal delay={120}>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-magenta/40 bg-magenta/10 px-4 py-2 text-[12.5px] font-semibold text-magenta">
                  <Icon name="heart" className="h-4 w-4" fill="currentColor" />
                  {t("fav.count", { n: fmt(items.length) })}
                </span>
                <Btn size="sm" variant="outline" onClick={sendList}>
                  <Icon name="send" className="h-4 w-4" />
                  {t("fav.send")}
                </Btn>
                <Btn
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    const backup = [...favorites];
                    clearFavs();
                    toast(t("fav.cleared"), "warn", { label: t("dash.undo"), run: () => restoreFavs(backup) });
                  }}
                >
                  <Icon name="trash" className="h-4 w-4" />
                  {t("fav.clear")}
                </Btn>
              </div>
            </Reveal>
          )}
        </div>

        {items.length === 0 ? (
          <Reveal delay={120}>
            <div className="mt-12 grid place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-magenta/30 bg-magenta/10 text-magenta">
                <Icon name="heart" className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-txt">{t("fav.empty")}</h3>
              <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted">{t("fav.emptyHint")}</p>
              <Btn className="mt-6" variant="outline" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
                <Icon name="grid" className="h-4 w-4" />
                {t("fav.browse")}
              </Btn>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((it, i) => {
              const color = catColor(it.cat);
              return (
                <Reveal key={it.id} delay={(i % 4) * 70}>
                  <div className="lift group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <button
                      type="button"
                      onClick={() => openDetail(it.kind, it.id)}
                      className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl"
                      aria-label={it.title}
                    >
                      <img src={it.img} alt={it.title} loading="lazy" className="img-grade h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold" style={{ color }}>
                        <Icon name={catIcon(it.cat)} className="h-3.5 w-3.5" />
                        {pick(CATEGORIES.find((c) => c.id === it.cat)!.label)}
                      </span>
                      <button
                        type="button"
                        onClick={() => openDetail(it.kind, it.id)}
                        className="mt-1 block truncate text-start font-display text-[14px] font-bold text-txt transition hover:text-[var(--color-accent)]"
                      >
                        {it.title}
                      </button>
                    </div>
                    <HeartButton id={it.id} label={it.title} compact />
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}