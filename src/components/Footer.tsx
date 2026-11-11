import { useEffect, useState } from "react";
import { CATEGORIES } from "../data/services";
import { LANGS, useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { Icon } from "./ui";
import { Monogram } from "./Nav";
import { cn } from "../utils/cn";

export default function Footer() {
  const { t, pick, lang, setLang, fmt } = useI18n();
  const { setRoute, route } = useStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    if (route !== "site") {
      setRoute("site");
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative mt-10 border-t border-white/10 bg-ink/60">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px" style={{ background: "linear-gradient(90deg, transparent, var(--color-accent), var(--color-magenta), transparent)" }} />
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <Monogram className="h-12 w-12" />
            <div>
              <div className="font-display text-[16px] font-bold text-txt">
                {pick({ fa: "مهدیس مونسان", en: "Mahdis Mounesan", ar: "مهديس مونسان", zh: "马赫迪斯·蒙桑" })}
              </div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">{t("footer.tag")}</div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-muted">{t("footer.built")}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12px] transition",
                  lang === l.code ? "border-[var(--color-accent)] text-txt" : "border-white/12 text-muted hover:border-white/30 hover:text-txt",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{t("footer.explore")}</h4>
          <ul className="mt-4 space-y-2.5">
            {["story", "awards", "skills", "work", "favorites"].map((id) => (
              <li key={id}>
                <button type="button" onClick={() => go(id)} className="text-[13.5px] text-txt/80 transition hover:text-[var(--color-accent)]">
                  {t(`nav.${id}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{t("footer.services")}</h4>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => go("services")} className="inline-flex items-center gap-2 text-[13.5px] text-txt/80 transition hover:text-[var(--color-accent)]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                  {pick(c.label)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{t("footer.contact")}</h4>
          <a href="mailto:hello@mahdismounesan.dev" className="mt-4 flex items-center gap-2 font-mono text-[12.5px] text-txt/85 transition hover:text-[var(--color-accent)]">
            <Icon name="mail" className="h-4 w-4" />
            hello@mahdismounesan.dev
          </a>
          <a href="https://ble.ir/mahdis_mounesan" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 font-mono text-[12.5px] text-txt/85 transition hover:text-[var(--color-magenta)]">
            <Icon name="chat" className="h-4 w-4" />
            @mahdis_mounesan
          </a>
          <button
            type="button"
            onClick={() => go("contact")}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/50 px-4 py-2 text-[13px] font-semibold text-txt transition hover:bg-[var(--color-accent)]/10"
          >
            <Icon name="send" className="h-4 w-4" />
            {t("nav.contact")}
          </button>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-10">
          <p className="text-[12px] text-muted">{t("footer.rights", { y: fmt(new Date().getFullYear()).replace(/[٬,]/g, "") })}</p>
          <p className="font-mono text-[11px] text-muted">iOLearn Academy · IFIA Genève · Harvard</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t("footer.top")}
        className={cn(
          "fixed bottom-24 end-5 z-[70] grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-surface2/90 text-txt shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:bottom-6 sm:end-6",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <Icon name="arrow" className="h-5 w-5 -rotate-90" />
      </button>
    </footer>
  );
}