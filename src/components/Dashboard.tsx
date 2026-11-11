import { useMemo, useState } from "react";
import { PROJECTS } from "../data/profile";
import { CATEGORIES, serviceById } from "../data/services";
import { useI18n, type Lang } from "../lib/i18n";
import { useStore, type Brief } from "../lib/store";
import { Btn, Chip, HeartButton, Icon, Reveal } from "./ui";
import { catColor, catIcon } from "./Services";
import Wizard from "./Wizard";
import { cn } from "../utils/cn";

const LOCALE: Record<Lang, string> = { fa: "fa-IR", en: "en-US", ar: "ar-EG", zh: "zh-CN" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  ltr,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  ltr?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12.5px] font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        dir={ltr ? "ltr" : undefined}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border bg-ink/50 px-4 py-3 text-[14px] text-txt outline-none transition placeholder:text-muted/60 focus:bg-ink/70",
          error ? "border-danger" : "border-white/12 focus:border-[var(--color-accent)]",
          ltr && "font-mono",
        )}
      />
      {error && <span className="mt-1.5 block text-[11.5px] text-danger">{error}</span>}
    </label>
  );
}

export default function Dashboard() {
  const { t, pick, fmt, lang } = useI18n();
  const {
    user,
    register,
    updateUser,
    logout,
    favorites,
    briefs,
    messages,
    removeBrief,
    removeMessage,
    addMessage,
    undoLast,
    toast,
    dashTab,
    setDashTab,
    setRoute,
    openDetail,
    accent,
    setAccent,
    setDraft,
  } = useStore();

  const [reg, setReg] = useState({ name: "", email: "", country: "" });
  const [regErr, setRegErr] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState({ name: user?.name ?? "", email: user?.email ?? "", country: user?.country ?? "" });
  const [openBrief, setOpenBrief] = useState<string | null>(null);

  const dateFmt = useMemo(() => new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: "medium" }), [lang]);

  const activity = useMemo(
    () =>
      [
        ...briefs.map((b) => ({ id: b.id, at: b.createdAt, kind: "brief" as const, label: serviceById(b.serviceId)?.title })),
        ...messages.map((m) => ({ id: m.id, at: m.createdAt, kind: "msg" as const, ref: m.ref })),
      ]
        .sort((a, b) => b.at - a.at)
        .slice(0, 6),
    [briefs, messages],
  );

  const submitReg = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (reg.name.trim().length < 2) errs.name = t("contact.errName");
    if (!EMAIL_RE.test(reg.email.trim())) errs.email = t("contact.errEmail");
    setRegErr(errs);
    if (Object.keys(errs).length) return;
    register({ name: reg.name.trim(), email: reg.email.trim(), country: reg.country.trim() || "—" });
    setProfile({ name: reg.name.trim(), email: reg.email.trim(), country: reg.country.trim() });
    toast(`${t("dash.welcome")} · ${reg.name.trim()}`, "ok");
    setDashTab("wizard");
  };

  const sendBrief = (b: Brief) => {
    const s = serviceById(b.serviceId);
    const body = [
      `${s ? pick(s.title) : b.serviceId}`,
      `${t("wiz.estimate")}: ${b.weeks} ${t("unit.weeks")}`,
      `${t("wiz.complexity")}: ${b.complexity}/100`,
      `${t("wiz.budget")}: ${t(`contact.${b.budget}`)}`,
      `${t("wiz.recommended")}: ${b.stack.join(", ")}`,
    ].join("\n");
    addMessage({
      id: Math.random().toString(36).slice(2, 9),
      ref: `MM-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: Date.now(),
      name: user?.name ?? "Guest",
      email: user?.email ?? "guest@local",
      topic: b.serviceId,
      budget: b.budget,
      body,
    });
    setDraft({ topic: b.serviceId, body });
    toast(t("wiz.sentToast"), "ok");
    setRoute("site");
    window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 140);
  };

  const tabs = [
    { id: "overview", icon: "grid", label: t("dash.tabOverview") },
    { id: "wizard", icon: "spark", label: t("dash.tabWizard") },
    { id: "briefs", icon: "layers", label: t("dash.tabBriefs"), count: briefs.length },
    { id: "fav", icon: "heart", label: t("dash.tabFav"), count: favorites.length },
    { id: "msgs", icon: "send", label: t("dash.tabMsgs"), count: messages.length },
    { id: "profile", icon: "user", label: t("dash.tabProfile") },
  ];

  const favItems = favorites
    .map((id) => {
      const s = serviceById(id);
      if (s) return { id, title: pick(s.title), img: s.img, cat: s.cat, kind: "service" as const };
      const p = PROJECTS.find((x) => x.id === id);
      if (p) return { id, title: pick(p.name), img: p.img, cat: p.cat, kind: "project" as const };
      return null;
    })
    .filter(Boolean) as { id: string; title: string; img: string; cat: (typeof CATEGORIES)[number]["id"]; kind: "service" | "project" }[];

  return (
    <div className="relative min-h-screen pt-28 pb-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/12 bg-white/[0.04] text-[var(--color-accent)]">
                <Icon name="bolt" className="h-6 w-6" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold text-txt sm:text-3xl">{t("dash.title")}</h1>
                <p className="mt-1 text-[13.5px] text-muted">{t("dash.sub")}</p>
              </div>
            </div>
            <Btn variant="outline" onClick={() => setRoute("site")}>
              <Icon name="arrow" className="h-4 w-4 rotate-180 rtl:rotate-0" />
              {t("dash.close")}
            </Btn>
          </div>
        </Reveal>

        {!user ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <Reveal delay={100} className="lg:col-span-7">
              <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
                <div className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
                <h2 className="relative font-display text-xl font-bold text-txt">{t("dash.regTitle")}</h2>
                <p className="relative mt-2 text-[13.5px] text-muted">{t("dash.regSub")}</p>
                <form onSubmit={submitReg} noValidate className="relative mt-6 grid gap-5">
                  <Field label={t("dash.name")} value={reg.name} onChange={(v) => setReg((r) => ({ ...r, name: v }))} placeholder={t("contact.namePh")} error={regErr.name} />
                  <Field label={t("dash.email")} value={reg.email} onChange={(v) => setReg((r) => ({ ...r, email: v }))} placeholder={t("contact.emailPh")} error={regErr.email} ltr />
                  <Field label={`${t("dash.country")} (${t("common.optional")})`} value={reg.country} onChange={(v) => setReg((r) => ({ ...r, country: v }))} placeholder="Iran" />
                  <Btn type="submit" size="lg" className="justify-self-start">
                    <Icon name="rocket" className="h-[18px] w-[18px]" />
                    {t("dash.register")}
                  </Btn>
                </form>
              </div>
            </Reveal>

            <Reveal delay={180} className="lg:col-span-5">
              <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-magenta)_16%,transparent)] via-transparent to-[color-mix(in_srgb,var(--color-accent)_16%,transparent)] p-6 sm:p-8">
                <h3 className="font-display text-lg font-bold text-txt">{t("dash.startQuiz")}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{t("dash.quizHint")}</p>
                <div className="mt-6 space-y-3">
                  {[
                    { icon: "spark", text: t("wiz.s1") },
                    { icon: "palette", text: t("wiz.s3") },
                    { icon: "layers", text: t("wiz.phases") },
                    { icon: "heart", text: t("dash.tabFav") },
                  ].map((r) => (
                    <div key={r.text} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
                        <Icon name={r.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="text-[13px] text-txt/90">{r.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-ink/40 p-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold text-txt">
                    <Icon name="user" className="h-4 w-4 text-muted" />
                    {t("dash.guestTitle")}
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{t("dash.guestBody")}</p>
                </div>
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl font-display text-lg font-bold text-ink"
                      style={{ background: `linear-gradient(135deg, ${accent}, var(--color-magenta))` }}
                    >
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-display text-[15px] font-bold text-txt">{user.name}</div>
                      <div className="truncate font-mono text-[11px] text-muted">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Chip color="#3be8ff">{user.country}</Chip>
                    <Chip color="#a6f04a">
                      {t("dash.statSince")} {dateFmt.format(user.since)}
                    </Chip>
                  </div>
                </div>

                <nav className="no-scrollbar mt-4 flex gap-2 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] p-2 lg:flex-col lg:overflow-visible">
                  {tabs.map((tb) => (
                    <button
                      key={tb.id}
                      type="button"
                      onClick={() => setDashTab(tb.id)}
                      className={cn(
                        "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-[13.5px] font-medium transition-all lg:w-full",
                        dashTab === tb.id ? "bg-white/[0.08] text-txt" : "text-muted hover:bg-white/[0.04] hover:text-txt",
                      )}
                      style={dashTab === tb.id ? { boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accent} 45%, transparent)` } : undefined}
                    >
                      <Icon name={tb.icon} className="h-[18px] w-[18px]" style={dashTab === tb.id ? { color: accent } : undefined} />
                      {tb.label}
                      {typeof tb.count === "number" && tb.count > 0 && (
                        <span className="ms-auto rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10.5px]">{fmt(tb.count)}</span>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setDashTab("overview");
                      toast(t("dash.logout"), "info");
                    }}
                    className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-[13.5px] font-medium text-danger/80 transition hover:bg-danger/10 hover:text-danger lg:w-full"
                  >
                    <Icon name="logout" className="h-[18px] w-[18px]" />
                    {t("dash.logout")}
                  </button>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-9">
              {dashTab === "overview" && (
                <div className="grid gap-5" style={{ animation: "riseIn .4s ease" }}>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: t("dash.statFav"), value: favorites.length, icon: "heart", color: "#ff2e88" },
                      { label: t("dash.statBrief"), value: briefs.length, icon: "layers", color: accent },
                      { label: t("dash.statMsg"), value: messages.length, icon: "send", color: "#a6f04a" },
                    ].map((s) => (
                      <div key={s.label} className="lift rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${s.color}1c`, color: s.color }}>
                          <Icon name={s.icon} className="h-[18px] w-[18px]" />
                        </span>
                        <div className="mt-4 font-display text-3xl font-bold text-txt">{fmt(s.value)}</div>
                        <div className="mt-1 text-[12px] text-muted">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] via-transparent to-[color-mix(in_srgb,var(--color-magenta)_18%,transparent)] p-6 sm:p-8">
                    <div className="relative flex flex-wrap items-center justify-between gap-5">
                      <div className="max-w-md">
                        <h3 className="font-display text-xl font-bold text-txt">{t("dash.startQuiz")}</h3>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{t("dash.quizHint")}</p>
                      </div>
                      <Btn size="lg" onClick={() => setDashTab("wizard")}>
                        <Icon name="spark" className="h-[18px] w-[18px]" />
                        {t("dash.tabWizard")}
                      </Btn>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                    <h3 className="font-display text-[15px] font-bold text-txt">{t("dash.activity")}</h3>
                    {activity.length === 0 ? (
                      <p className="mt-4 text-[13px] text-muted">{t("dash.noActivity")}</p>
                    ) : (
                      <ul className="mt-4 space-y-2.5">
                        {activity.map((a) => (
                          <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-muted">
                              <Icon name={a.kind === "brief" ? "layers" : "send"} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[13px] text-txt/90">
                              {a.kind === "brief" ? (a.label ? pick(a.label) : t("wiz.untitled")) : a.ref}
                            </span>
                            <span className="font-mono text-[11px] text-muted">{dateFmt.format(a.at)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {dashTab === "wizard" && <Wizard />}

              {dashTab === "briefs" && (
                <div className="grid gap-4" style={{ animation: "riseIn .4s ease" }}>
                  {briefs.length === 0 ? (
                    <EmptyState icon="layers" text={t("dash.emptyBriefs")} action={() => setDashTab("wizard")} actionLabel={t("dash.startQuiz")} />
                  ) : (
                    briefs.map((b) => {
                      const s = serviceById(b.serviceId);
                      const isOpen = openBrief === b.id;
                      return (
                        <div key={b.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                          <div className="flex flex-wrap items-center gap-4 p-5">
                            <span className="h-12 w-12 shrink-0 rounded-2xl" style={{ background: b.color, boxShadow: `0 10px 26px -12px ${b.color}` }} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <Icon name={catIcon(b.cat as never)} className="h-4 w-4" style={{ color: catColor(b.cat as never) }} />
                                <h3 className="truncate font-display text-[15px] font-bold text-txt">{s ? pick(s.title) : t("wiz.untitled")}</h3>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px] text-muted">
                                <span>{dateFmt.format(b.createdAt)}</span>
                                <span>· {fmt(b.weeks)} {t("unit.weeks")}</span>
                                <span>· {t("wiz.complexity")} {fmt(b.complexity)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Btn size="sm" variant="ghost" onClick={() => setOpenBrief(isOpen ? null : b.id)}>
                                <Icon name="eye" className="h-4 w-4" />
                                {t("dash.view")}
                              </Btn>
                              <Btn size="sm" variant="outline" onClick={() => sendBrief(b)}>
                                <Icon name="send" className="h-4 w-4" />
                                {t("wiz.send")}
                              </Btn>
                              <Btn
                                size="sm"
                                variant="danger"
                                onClick={() => {
                                  removeBrief(b.id);
                                  toast(t("dash.deleted"), "warn", { label: t("dash.undo"), run: undoLast });
                                }}
                              >
                                <Icon name="trash" className="h-4 w-4" />
                              </Btn>
                            </div>
                          </div>
                          {isOpen && (
                            <div className="border-t border-white/10 bg-ink/30 p-5" style={{ animation: "riseIn .3s ease" }}>
                              <div className="flex flex-wrap gap-2">
                                {b.stack.map((st) => (
                                  <Chip key={st} color={b.color}>
                                    {st}
                                  </Chip>
                                ))}
                              </div>
                              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                {Object.entries(b.answers).map(([k, v]) => (
                                  <div key={k} className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                                    <span className="font-mono text-[11px] uppercase text-muted">{k}</span>
                                    <span className="truncate text-[12.5px] text-txt/90">{Array.isArray(v) ? v.join(", ") || "—" : String(v)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {dashTab === "fav" && (
                <div style={{ animation: "riseIn .4s ease" }}>
                  {favItems.length === 0 ? (
                    <EmptyState icon="heart" text={t("dash.emptyFav")} action={() => { setRoute("site"); window.setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }), 120); }} actionLabel={t("fav.browse")} />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {favItems.map((it) => (
                        <div key={it.id} className="lift flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                          <button type="button" onClick={() => openDetail(it.kind, it.id)} className="h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                            <img src={it.img} alt={it.title} loading="lazy" className="img-grade h-full w-full object-cover" />
                          </button>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10.5px] font-semibold" style={{ color: catColor(it.cat) }}>
                              {pick(CATEGORIES.find((c) => c.id === it.cat)!.label)}
                            </span>
                            <button type="button" onClick={() => openDetail(it.kind, it.id)} className="mt-1 block truncate text-start font-display text-[14px] font-bold text-txt hover:text-[var(--color-accent)]">
                              {it.title}
                            </button>
                          </div>
                          <HeartButton id={it.id} label={it.title} compact />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {dashTab === "msgs" && (
                <div className="grid gap-4" style={{ animation: "riseIn .4s ease" }}>
                  {messages.length === 0 ? (
                    <EmptyState icon="send" text={t("dash.emptyMsgs")} action={() => { setRoute("site"); window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 120); }} actionLabel={t("dash.goContact")} />
                  ) : (
                    messages.map((m) => {
                      const s = serviceById(m.topic);
                      return (
                        <div key={m.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[11px] text-success">{m.ref}</span>
                            <span className="font-display text-[14.5px] font-bold text-txt">{s ? pick(s.title) : m.topic}</span>
                            <span className="font-mono text-[11px] text-muted">{dateFmt.format(m.createdAt)}</span>
                            <Btn
                              size="sm"
                              variant="danger"
                              className="ms-auto"
                              onClick={() => {
                                removeMessage(m.id);
                                toast(t("dash.deleted"), "warn", { label: t("dash.undo"), run: undoLast });
                              }}
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </Btn>
                          </div>
                          <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-muted">{m.body}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Chip>{m.name}</Chip>
                            <Chip>{m.email}</Chip>
                            <Chip color="#ffb627">{t(`contact.${m.budget}`)}</Chip>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {dashTab === "profile" && (
                <div className="grid gap-5" style={{ animation: "riseIn .4s ease" }}>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <h3 className="font-display text-[15px] font-bold text-txt">{t("dash.edit")}</h3>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <Field label={t("dash.name")} value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
                      <Field label={t("dash.email")} value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} ltr />
                      <Field label={t("dash.country")} value={profile.country} onChange={(v) => setProfile((p) => ({ ...p, country: v }))} />
                    </div>
                    <Btn
                      className="mt-6"
                      onClick={() => {
                        if (profile.name.trim().length < 2 || !EMAIL_RE.test(profile.email)) {
                          toast(t("contact.errEmail"), "warn");
                          return;
                        }
                        updateUser({ name: profile.name.trim(), email: profile.email.trim(), country: profile.country.trim() || "—" });
                        toast(t("dash.saved"), "ok");
                      }}
                    >
                      <Icon name="check" className="h-4 w-4" />
                      {t("dash.save")}
                    </Btn>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <h3 className="font-display text-[15px] font-bold text-txt">{t("wiz.s3")}</h3>
                    <p className="mt-1.5 text-[13px] text-muted">{t("wiz.s3sub")}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {["#3be8ff", "#ff2e88", "#ffb627", "#a6f04a", "#3d6bff", "#a06bff"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setAccent(c)}
                          aria-label={c}
                          className={cn("h-11 w-11 rounded-2xl border-2 transition hover:-translate-y-1", accent === c ? "scale-110 border-white" : "border-white/15")}
                          style={{ background: c }}
                        />
                      ))}
                      <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-11 w-16 cursor-pointer rounded-xl border border-white/15 bg-transparent" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, text, action, actionLabel }: { icon: string; text: string; action: () => void; actionLabel: string }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-muted">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-muted">{text}</p>
      <Btn variant="outline" className="mt-6" onClick={action}>
        <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
        {actionLabel}
      </Btn>
    </div>
  );
}