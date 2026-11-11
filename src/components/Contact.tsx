import { useEffect, useState } from "react";
import { CATEGORIES, SERVICES, serviceById } from "../data/services";
import { useI18n } from "../lib/i18n";
import { uid, useStore } from "../lib/store";
import { Btn, Icon, Reveal, SectionHead } from "./ui";
import { cn } from "../utils/cn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const { t, pick, fmt } = useI18n();
  const { addMessage, toast, draft, setDraft, user } = useStore();
  const [form, setForm] = useState({ name: "", email: "", topic: "web-shop", budget: "b2", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ ref: string; name: string } | null>(null);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  useEffect(() => {
    if (!draft) return;
    setForm((f) => ({
      ...f,
      topic: serviceById(draft.topic) ? draft.topic : f.topic,
      message: draft.body,
    }));
    setDone(null);
    setDraft(null);
  }, [draft, setDraft]);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = t("contact.errName");
    if (!EMAIL_RE.test(form.email.trim())) errs.email = t("contact.errEmail");
    if (form.message.trim().length < 10) errs.message = t("contact.errMsg");
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast(Object.values(errs)[0], "warn");
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      const ref = `MM-${Math.floor(1000 + Math.random() * 8999)}`;
      addMessage({
        id: uid(),
        ref,
        createdAt: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic,
        budget: form.budget,
        body: form.message.trim(),
      });
      setSending(false);
      setDone({ ref, name: form.name.trim() });
      toast(t("contact.successTitle"), "ok");
    }, 900);
  };

  const channels = [
    { icon: "mail", label: "Email", value: "hello@mahdismounesan.dev", href: "mailto:hello@mahdismounesan.dev", color: "#3be8ff" },
    { icon: "chat", label: "Bale", value: "@mahdis_mounesan", href: "https://ble.ir/mahdis_mounesan", color: "#ff2e88" },
    { icon: "code", label: "GitHub", value: "github.com/mahdismounesan", href: "https://github.com/", color: "#a6f04a" },
  ];

  const field = "w-full rounded-2xl border bg-ink/50 px-4 py-3 text-[14px] text-txt outline-none transition placeholder:text-muted/60 focus:bg-ink/70";

  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHead kicker={t("contact.kicker")} title={t("contact.title")} sub={t("contact.sub")} />

            <Reveal delay={160}>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <Icon name="clock" className="h-5 w-5 text-[var(--color-accent)]" />
                  <div className="mt-3 text-[11.5px] uppercase tracking-wider text-muted">{t("contact.reply")}</div>
                  <div className="mt-1 font-display text-[15px] font-bold text-txt">{t("contact.replyVal")}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <Icon name="globe" className="h-5 w-5 text-amber" />
                  <div className="mt-3 text-[11.5px] uppercase tracking-wider text-muted">{t("nav.contact")}</div>
                  <div className="mt-1 font-display text-[15px] font-bold text-txt">{t("contact.worldwide")}</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{t("contact.channels")}</div>
                <div className="mt-4 space-y-2.5">
                  {channels.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl transition group-hover:scale-110" style={{ background: `${c.color}1c`, color: c.color }}>
                        <Icon name={c.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10.5px] uppercase tracking-wider text-muted">{c.label}</span>
                        <span className="block truncate font-mono text-[12.5px] text-txt">{c.value}</span>
                      </span>
                      <Icon name="external" className="ms-auto h-4 w-4 text-muted transition group-hover:text-txt" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
                <div className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-accent)]/12 blur-3xl" />

                {done ? (
                  <div className="relative grid place-items-center py-10 text-center" style={{ animation: "riseIn .5s cubic-bezier(.22,1,.36,1)" }}>
                    <span className="relative grid h-24 w-24 place-items-center rounded-full border border-success/40 bg-success/10 text-success">
                      <span className="absolute inset-0 animate-ping rounded-full bg-success/10" />
                      <Icon name="check" className="h-11 w-11" strokeWidth={2.2} />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-bold text-txt">{t("contact.successTitle")}</h3>
                    <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
                      {t("contact.successBody", { name: done.name })}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 font-mono text-[12.5px] text-txt">
                      <Icon name="shield" className="h-4 w-4 text-[var(--color-accent)]" />
                      {t("contact.ref")}: {done.ref}
                    </div>
                    <Btn
                      variant="outline"
                      className="mt-7"
                      onClick={() => {
                        setDone(null);
                        setForm((f) => ({ ...f, message: "" }));
                      }}
                    >
                      <Icon name="refresh" className="h-4 w-4" />
                      {t("contact.again")}
                    </Btn>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate className="relative grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[12.5px] font-medium text-muted">{t("contact.name")}</span>
                        <input
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          placeholder={t("contact.namePh")}
                          className={cn(field, errors.name ? "border-danger" : "border-white/12 focus:border-[var(--color-accent)]")}
                        />
                        {errors.name && <span className="mt-1.5 block text-[11.5px] text-danger">{errors.name}</span>}
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[12.5px] font-medium text-muted">{t("contact.email")}</span>
                        <input
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder={t("contact.emailPh")}
                          dir="ltr"
                          className={cn(field, "font-mono", errors.email ? "border-danger" : "border-white/12 focus:border-[var(--color-accent)]")}
                        />
                        {errors.email && <span className="mt-1.5 block text-[11.5px] text-danger">{errors.email}</span>}
                      </label>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[12.5px] font-medium text-muted">{t("contact.topic")}</span>
                        <select
                          value={form.topic}
                          onChange={(e) => set("topic", e.target.value)}
                          className={cn(field, "border-white/12 focus:border-[var(--color-accent)]")}
                        >
                          {CATEGORIES.map((c) => (
                            <optgroup key={c.id} label={pick(c.label)}>
                              {SERVICES.filter((s) => s.cat === c.id).map((s) => (
                                <option key={s.id} value={s.id}>
                                  {pick(s.title)}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[12.5px] font-medium text-muted">{t("contact.budget")}</span>
                        <select
                          value={form.budget}
                          onChange={(e) => set("budget", e.target.value)}
                          className={cn(field, "border-white/12 focus:border-[var(--color-accent)]")}
                        >
                          {["b1", "b2", "b3", "b4", "b5"].map((b) => (
                            <option key={b} value={b}>
                              {t(`contact.${b}`)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-2 flex items-center justify-between text-[12.5px] font-medium text-muted">
                        {t("contact.message")}
                        <span className="font-mono text-[11px] opacity-70">{fmt(form.message.length)}</span>
                      </span>
                      <textarea
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        rows={5}
                        placeholder={t("contact.messagePh")}
                        className={cn(field, "resize-y leading-relaxed", errors.message ? "border-danger" : "border-white/12 focus:border-[var(--color-accent)]")}
                      />
                      {errors.message && <span className="mt-1.5 block text-[11.5px] text-danger">{errors.message}</span>}
                    </label>

                    <div className="flex flex-wrap items-center gap-4">
                      <Btn type="submit" size="lg" disabled={sending}>
                        {sending ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/40 border-t-ink" />
                            {t("contact.sending")}
                          </>
                        ) : (
                          <>
                            <Icon name="send" className="h-[18px] w-[18px]" />
                            {t("contact.submit")}
                          </>
                        )}
                      </Btn>
                      <span className="inline-flex items-center gap-2 text-[12px] text-muted">
                        <Icon name="shield" className="h-4 w-4 text-success" />
                        {pick({
                          fa: "اطلاعات شما فقط برای همین پروژه استفاده می‌شود.",
                          en: "Your details are used only for this project.",
                          ar: "تُستخدم بياناتك لهذا المشروع فقط.",
                          zh: "您的信息仅用于本项目。",
                        })}
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}