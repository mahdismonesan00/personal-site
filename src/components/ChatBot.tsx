import { useEffect, useMemo, useRef, useState } from "react";
import { AWARDS, PROJECTS } from "../data/profile";
import { CATEGORIES, SERVICES, type Cat } from "../data/services";
import { useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { play } from "../lib/sound";
import { Icon } from "./ui";
import { cn } from "../utils/cn";

type Act = { kind: "section" | "wizard" | "service" | "project"; id: string; label: string };
interface Msg {
  id: string;
  from: "bot" | "user";
  text: string;
  acts?: Act[];
  at: number;
}

const KEY = "mm.chat.v1";
const uid = () => Math.random().toString(36).slice(2, 9);

const KEYS: Record<string, string[]> = {
  greet: ["hi", "hello", "hey", "سلام", "درود", "مرحبا", "اهلا", "أهلا", "你好", "嗨"],
  who: ["who", "mahdis", "about you", "مهدیس", "کیست", "معرفی", "من هي", "مهديس", "是谁", "关于"],
  awards: ["medal", "award", "gold", "silver", "ifia", "harvard", "prize", "مدال", "جایزه", "طلا", "نقره", "هاروارد", "میدالية", "ميدالية", "ذهب", "جائزة", "奖", "哈佛"],
  price: ["price", "cost", "how much", "quote", "budget", "قیمت", "هزینه", "تعرفه", "چند", "سعر", "تكلفة", "كم", "价格", "多少钱", "报价", "费用"],
  order: ["order", "hire", "start", "buy", "book", "سفارش", "استخدام", "شروع پروژه", "اطلب", "توظيف", "下单", "雇佣", "怎么开始"],
  quiz: ["quiz", "play", "test", "challenge", "کوییز", "آزمون", "بازی", "چالش", "اختبار", "لعبة", "问答", "测试", "挑战"],
  lab: ["robot", "lab", "pid", "arduino", "ربات", "آزمایشگاه", "اردوینو", "آردوینو", "روبوت", "مختبر", "机器人", "实验"],
  fav: ["favorite", "favourite", "heart", "saved", "علاقه", "قلب", "ذخیره", "مفضلة", "收藏"],
  contact: ["contact", "email", "reach", "talk", "تماس", "ایمیل", "ارتباط", "تواصل", "بريد", "联系", "邮箱"],
  lang: ["language", "english", "arabic", "chinese", "زبان", "انگلیسی", "عربی", "چینی", "لغة", "语言", "中文"],
  web: ["website", "site", "shop", "store", "landing", "وب", "سایت", "فروشگاه", "موقع", "متجر", "网站", "商城"],
  ai: ["ai", "intelligence", "chatbot", "gpt", "bot", "هوش", "چت بات", "چت‌بات", "ذكاء", "محادثة", "人工智能", "聊天"],
  games: ["game", "unity", "minecraft", "granny", "بازی", "یونیتی", "ماینکرفت", "لعبة", "ألعاب", "游戏"],
  services: ["service", "services", "what do you", "build", "خدمات", "سرویس", "چه کار", "خدمة", "خدمات", "服务"],
  thanks: ["thanks", "thank", "merci", "ممنون", "مرسی", "شكرا", "谢谢"],
};

const has = (text: string, group: string) => KEYS[group].some((k) => text.includes(k));

export default function ChatBot() {
  const { t, pick, fmt, lang } = useI18n();
  const { chatOpen, setChatOpen, chatSeed, setRoute, setDashTab, openDetail, favorites } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw) as Msg[];
    } catch {
      /* ignore */
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const greeted = useRef(msgs.length > 0);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(msgs.slice(-40)));
    } catch {
      /* ignore */
    }
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!greeted.current) setTeaser(true);
    }, 14000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);

  const goSection = (id: string) => {
    setChatOpen(false);
    setRoute("site");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  const act = (kind: Act["kind"], id: string, label: string): Act => ({ kind, id, label });

  const menu = useMemo(
    () => [
      { q: t("chat.q.who"), icon: "user" },
      { q: t("chat.q.awards"), icon: "medal" },
      { q: t("chat.q.services"), icon: "grid" },
      { q: t("chat.q.price"), icon: "bolt" },
      { q: t("chat.q.quiz"), icon: "spark" },
      { q: t("chat.q.lab"), icon: "chip" },
      { q: t("chat.q.order"), icon: "rocket" },
      { q: t("chat.q.fav"), icon: "heart" },
    ],
    [t],
  );

  const respond = (raw: string): { text: string; acts?: Act[] } => {
    const text = raw.toLowerCase().trim();

    if (has(text, "quiz"))
      return { text: t("chat.a.quiz"), acts: [act("section", "quiz", t("chat.act.quiz")), act("section", "lab", t("nav.lab"))] };
    if (has(text, "lab"))
      return { text: t("chat.a.lab"), acts: [act("section", "lab", t("chat.act.open")), act("section", "services", t("nav.services"))] };
    if (has(text, "awards"))
      return {
        text: `${t("chat.a.awards")}\n${AWARDS.map((a) => `• ${pick(a.title)} — ${pick(a.place)}`).join("\n")}`,
        acts: [act("section", "awards", t("chat.act.open"))],
      };
    if (has(text, "fav"))
      return { text: t("chat.a.fav", { n: fmt(favorites.length) }), acts: [act("section", "favorites", t("chat.act.open"))] };
    if (has(text, "order"))
      return {
        text: t("chat.a.order"),
        acts: [act("wizard", "wizard", t("chat.act.brief")), act("section", "contact", t("chat.act.contact"))],
      };
    if (has(text, "price")) {
      const found =
        SERVICES.find((s) => text.includes(pick(s.title).toLowerCase())) ??
        SERVICES.find((s) => pick(s.title).toLowerCase().split(/\s+/).some((wd) => wd.length > 3 && text.includes(wd))) ??
        SERVICES.find((s) => text.includes(s.title.en.toLowerCase()));
      if (found) {
        return {
          text: t("chat.a.price", {
            service: pick(found.title),
            weeks: `${fmt(found.weeks[0])}–${fmt(found.weeks[1])}`,
            budget: t("contact.b2"),
          }),
          acts: [act("service", found.id, t("chat.act.open")), act("wizard", found.id, t("chat.act.brief"))],
        };
      }
      return {
        text: `${t("chat.a.services")}\n${CATEGORIES.map((c) => `• ${pick(c.label)}: ${SERVICES.filter((s) => s.cat === c.id).map((s) => pick(s.title)).slice(0, 2).join(" · ")}`).join("\n")}`,
        acts: CATEGORIES.slice(0, 3).map((c) => act("section", "services", pick(c.label))),
      };
    }
    if (has(text, "contact"))
      return { text: t("chat.a.contact"), acts: [act("section", "contact", t("chat.act.contact"))] };
    if (has(text, "lang")) return { text: t("chat.a.lang") };
    if (has(text, "thanks"))
      return { text: t("chat.a.thanks"), acts: [act("section", "contact", t("chat.act.contact"))] };

    const catGuess: Cat | null = has(text, "web") ? "web" : has(text, "games") ? "game" : has(text, "ai") ? "ai" : has(text, "lab") ? "robot" : null;
    if (catGuess || has(text, "services")) {
      const list = catGuess ? SERVICES.filter((s) => s.cat === catGuess) : SERVICES;
      return {
        text: `${t("chat.a.services")}\n${list.slice(0, 5).map((s) => `• ${pick(s.title)} — ${pick(s.tagline)}`).join("\n")}`,
        acts: list.slice(0, 3).map((s) => act("service", s.id, pick(s.title))),
      };
    }
    if (has(text, "who"))
      return {
        text: t("chat.a.who"),
        acts: [act("section", "story", t("nav.story")), act("project", PROJECTS[0].id, pick(PROJECTS[0].name))],
      };
    if (has(text, "greet")) return { text: t("chat.a.hello") };
    return {
      text: t("chat.fallback"),
      acts: [act("section", "services", t("nav.services")), act("section", "quiz", t("nav.quiz")), act("section", "contact", t("nav.contact"))],
    };
  };

  const push = (m: Omit<Msg, "id" | "at">) => setMsgs((prev) => [...prev, { ...m, id: uid(), at: Date.now() }]);

  const send = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    push({ from: "user", text: value });
    setInput("");
    setTyping(true);
    play("tap");
    const delay = 480 + Math.min(900, value.length * 18);
    const id = window.setTimeout(() => {
      const r = respond(value);
      setTyping(false);
      push({ from: "bot", text: r.text, acts: r.acts });
      play("message");
    }, delay);
    timers.current.push(id);
  };

  // greeting on first open
  useEffect(() => {
    if (!chatOpen || greeted.current) return;
    greeted.current = true;
    setTyping(true);
    const id = window.setTimeout(() => {
      setTyping(false);
      setMsgs((prev) => [...prev, { id: uid(), from: "bot", text: t("chat.greet"), at: Date.now() }]);
      play("message");
    }, 650);
    timers.current.push(id);
  }, [chatOpen, t]);

  // external "ask" trigger
  useEffect(() => {
    if (!chatSeed) return;
    const q = chatSeed;
    const id = window.setTimeout(() => send(q), 320);
    timers.current.push(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSeed]);

  const runAct = (a: Act) => {
    play("tap");
    if (a.kind === "section") goSection(a.id);
    else if (a.kind === "wizard") {
      setChatOpen(false);
      setDashTab("wizard");
      setRoute("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (a.kind === "service" || a.kind === "project") {
      openDetail(a.kind, a.id);
    }
  };

  return (
    <>
      {/* teaser */}
      {teaser && !chatOpen && (
        <div
          className="fixed bottom-24 start-4 z-[89] max-w-[16rem] rounded-2xl border border-white/15 bg-surface2/95 p-3.5 shadow-2xl backdrop-blur-xl sm:bottom-28"
          style={{ animation: "riseIn .5s cubic-bezier(.22,1,.36,1)" }}
        >
          <button type="button" onClick={() => setTeaser(false)} className="absolute end-2 top-2 text-muted transition hover:text-txt" aria-label={t("common.close")}>
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
          <p className="pe-4 text-[12.5px] leading-relaxed text-txt/90">{t("chat.greet").slice(0, 96)}…</p>
          <button
            type="button"
            onClick={() => {
              setTeaser(false);
              setChatOpen(true);
            }}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/50 px-3 py-1 text-[11.5px] font-semibold accent-text"
          >
            {t("chat.open")}
            <Icon name="arrow" className="h-3.5 w-3.5 rtl:rotate-180" />
          </button>
        </div>
      )}

      {/* launcher */}
      <button
        type="button"
        onClick={() => {
          setChatOpen(!chatOpen);
          setTeaser(false);
          play(chatOpen ? "tap" : "whoosh");
        }}
        aria-label={t("chat.open")}
        aria-expanded={chatOpen}
        className={cn(
          "group fixed bottom-5 start-4 z-[92] grid h-14 w-14 place-items-center rounded-full border border-white/20 text-ink shadow-[0_18px_44px_-16px_var(--color-accent)] transition-all duration-500 hover:scale-105 sm:bottom-6 sm:start-6",
          chatOpen && "rotate-90",
        )}
        style={{ backgroundImage: "linear-gradient(135deg, var(--color-accent), var(--color-magenta))" }}
      >
        {!chatOpen && <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-accent)]/25" />}
        <Icon name={chatOpen ? "close" : "chat"} className="relative h-6 w-6" strokeWidth={2} />
        {!chatOpen && msgs.length === 0 && (
          <span className="absolute -end-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-lime" />
        )}
      </button>

      {/* panel */}
      {chatOpen && (
        <div
          className="fixed bottom-24 start-3 z-[93] flex h-[min(72vh,560px)] w-[min(94vw,392px)] flex-col overflow-hidden rounded-3xl border border-white/15 bg-surface/95 shadow-[0_30px_90px_-30px_rgba(0,0,0,.95)] backdrop-blur-2xl sm:bottom-24 sm:start-6"
          style={{ animation: "riseIn .4s cubic-bezier(.22,1,.36,1)" }}
          role="dialog"
          aria-label={t("chat.title")}
        >
          <div className="relative flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-2xl" style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-magenta))" }}>
              <Icon name="brain" className="h-5 w-5 text-ink" />
              <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-surface bg-success" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-display text-[14px] font-bold text-txt">{t("chat.title")}</div>
              <div className="font-mono text-[10px] text-muted">{t("chat.status")}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMsgs([]);
                greeted.current = false;
                play("tap");
                const id = window.setTimeout(() => {
                  greeted.current = true;
                  setMsgs([{ id: uid(), from: "bot", text: t("chat.greet"), at: Date.now() }]);
                }, 300);
                timers.current.push(id);
              }}
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-white/5 hover:text-danger"
              aria-label={t("chat.clear")}
              title={t("chat.clear")}
            >
              <Icon name="trash" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-white/5 hover:text-txt"
              aria-label={t("common.close")}
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m) => (
              <div key={m.id} className={cn("flex flex-col", m.from === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[86%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                    m.from === "user"
                      ? "rounded-ee-sm bg-[var(--color-accent)]/18 text-txt"
                      : "rounded-es-sm border border-white/10 bg-white/[0.04] text-txt/90",
                  )}
                  style={{ animation: "riseIn .3s ease" }}
                >
                  {m.text}
                </div>
                {m.acts && m.acts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.acts.map((a, i) => (
                      <button
                        key={`${a.id}-${i}`}
                        type="button"
                        onClick={() => runAct(a)}
                        className="rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-3 py-1 text-[11.5px] font-semibold text-txt transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]/20"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-1.5 rounded-2xl rounded-es-sm border border-white/10 bg-white/[0.04] px-4 py-3" style={{ width: "fit-content" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" style={{ animation: `dotPulse 1s ${i * 0.15}s infinite ease-in-out` }} />
                ))}
                <span className="ms-1 font-mono text-[10px] text-muted">{t("chat.typing")}</span>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 bg-white/[0.02] px-3 py-2.5">
            <div className="no-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
              {menu.map((m) => (
                <button
                  key={m.q}
                  type="button"
                  onClick={() => send(m.q)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[11.5px] text-muted transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]/60 hover:text-txt"
                >
                  <Icon name={m.icon} className="h-3.5 w-3.5" />
                  {m.q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                className="min-w-0 flex-1 rounded-full border border-white/12 bg-ink/60 px-4 py-2.5 text-[13px] text-txt outline-none transition placeholder:text-muted/70 focus:border-[var(--color-accent)]"
                dir={lang === "fa" || lang === "ar" ? "rtl" : "ltr"}
              />
              <button
                type="submit"
                aria-label={t("chat.send")}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink transition hover:scale-105"
                style={{ backgroundImage: "linear-gradient(135deg, var(--color-accent), var(--color-magenta))" }}
              >
                <Icon name="send" className="h-4 w-4 rtl:-scale-x-100" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}