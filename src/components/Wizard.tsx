import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, SERVICES, serviceById, type Cat } from "../data/services";
import { PROJECTS } from "../data/profile";
import { useI18n, type Loc } from "../lib/i18n";
import { readableAccent, uid, useStore, type Brief } from "../lib/store";
import { Btn, Chip, Icon, Reveal } from "./ui";
import { catColor } from "./Services";
import { cn } from "../utils/cn";

const L = (fa: string, en: string, ar: string, zh: string): Loc => ({ fa, en, ar, zh });

const SWATCHES = ["#3be8ff", "#ff2e88", "#ffb627", "#a6f04a", "#3d6bff", "#a06bff", "#ff6b4a", "#2fe0a8"];

const OPTIONS: Record<string, { id: string; label: Loc }[]> = {
  webFeatures: [
    { id: "auth", label: L("ورود و عضویت", "Login & signup", "تسجيل الدخول", "登录注册") },
    { id: "pay", label: L("پرداخت آنلاین", "Online payment", "دفع إلكتروني", "在线支付") },
    { id: "blog", label: L("وبلاگ و اخبار", "Blog & news", "مدونة وأخبار", "博客与资讯") },
    { id: "i18n", label: L("چندزبانه", "Multilingual", "متعدد اللغات", "多语言") },
    { id: "admin", label: L("پنل مدیریت", "Admin panel", "لوحة تحكم", "管理后台") },
    { id: "seo", label: L("سئوی حرفه‌ای", "Advanced SEO", "سيو متقدم", "高级 SEO") },
  ],
  aiPlatform: [
    { id: "bale", label: L("پیام‌رسان بله", "Bale messenger", "منصة بله", "Bale") },
    { id: "telegram", label: L("تلگرام", "Telegram", "تلغرام", "Telegram") },
    { id: "whatsapp", label: L("واتس‌اپ", "WhatsApp", "واتساب", "WhatsApp") },
    { id: "web", label: L("وب‌سایت", "Website widget", "موقع الويب", "网站组件") },
  ],
  aiCaps: [
    { id: "memory", label: L("حافظه گفتگو", "Conversation memory", "ذاكرة الحوار", "对话记忆") },
    { id: "voice", label: L("پیام صوتی", "Voice messages", "رسائل صوتية", "语音消息") },
    { id: "docs", label: L("خواندن اسناد", "Reads your documents", "قراءة المستندات", "读取文档") },
    { id: "vision", label: L("تحلیل تصویر", "Image understanding", "فهم الصور", "图像理解") },
  ],
  langs: [
    { id: "fa", label: L("فارسی", "Persian", "الفارسية", "波斯语") },
    { id: "en", label: L("انگلیسی", "English", "الإنجليزية", "英语") },
    { id: "ar", label: L("عربی", "Arabic", "العربية", "阿拉伯语") },
    { id: "zh", label: L("چینی", "Chinese", "الصينية", "中文") },
  ],
  dimension: [
    { id: "2d", label: L("دوبعدی", "2D", "ثنائي الأبعاد", "2D") },
    { id: "3d", label: L("سه‌بعدی", "3D", "ثلاثي الأبعاد", "3D") },
  ],
  gamePlatform: [
    { id: "pc", label: L("کامپیوتر", "PC", "الحاسوب", "PC") },
    { id: "android", label: L("اندروید", "Android", "أندرويد", "安卓") },
    { id: "ios", label: L("iOS", "iOS", "iOS", "iOS") },
    { id: "web", label: L("مرورگر", "Browser", "المتصفح", "浏览器") },
  ],
  players: [
    { id: "single", label: L("تک‌نفره", "Single player", "لاعب واحد", "单人") },
    { id: "coop", label: L("چندنفره محلی", "Local co-op", "تعاوني محلي", "本地多人") },
    { id: "online", label: L("آنلاین جهانی", "Online multiplayer", "جماعي عبر الإنترنت", "在线多人") },
  ],
  board: [
    { id: "uno", label: L("آردوینو UNO", "Arduino UNO", "أردوينو UNO", "Arduino UNO") },
    { id: "mega", label: L("آردوینو Mega", "Arduino Mega", "أردوينو Mega", "Arduino Mega") },
    { id: "esp32", label: L("ESP32", "ESP32", "ESP32", "ESP32") },
    { id: "rpi", label: L("رازبری پای", "Raspberry Pi", "راسبيري باي", "树莓派") },
  ],
  sensors: [
    { id: "ir", label: L("مادون قرمز", "Infrared", "تحت الحمراء", "红外") },
    { id: "ultra", label: L("التراسونیک", "Ultrasonic", "فوق صوتي", "超声波") },
    { id: "servo", label: L("سروو موتور", "Servo motor", "محرك سيرفو", "舵机") },
    { id: "bt", label: L("بلوتوث", "Bluetooth", "بلوتوث", "蓝牙") },
    { id: "cam", label: L("دوربین", "Camera", "كاميرا", "摄像头") },
    { id: "gyro", label: L("ژیروسکوپ", "Gyroscope", "جيروسكوب", "陀螺仪") },
  ],
  power: [
    { id: "battery", label: L("باتری لیتیومی", "Li-ion battery", "بطارية ليثيوم", "锂电池") },
    { id: "adapter", label: L("آداپتور", "Power adapter", "محول كهربائي", "电源适配器") },
    { id: "solar", label: L("پنل خورشیدی", "Solar panel", "لوح شمسي", "太阳能板") },
  ],
};

function OptCard({
  active,
  onClick,
  color,
  icon,
  title,
  sub,
  img,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  icon?: string;
  title: string;
  sub?: string;
  img?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border p-4 text-start transition-all duration-300",
        active
          ? "border-transparent bg-white/[0.07] shadow-[0_16px_40px_-24px_rgba(0,0,0,.9)]"
          : "border-white/10 bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05]",
      )}
      style={active ? { boxShadow: `0 0 0 1.5px ${color}, 0 18px 44px -26px ${color}` } : undefined}
    >
      {img ? (
        <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
          <img src={img} alt="" loading="lazy" className="img-grade h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </span>
      ) : (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition group-hover:scale-110" style={{ background: `${color}1c`, color }}>
          <Icon name={icon ?? "spark"} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[14.5px] font-bold text-txt">{title}</span>
        {sub && <span className="mt-0.5 block truncate text-[12px] text-muted">{sub}</span>}
      </span>
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition",
          active ? "border-transparent text-ink" : "border-white/25 text-transparent",
        )}
        style={active ? { background: color } : undefined}
      >
        <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

function MultiChips({
  options,
  value,
  onChange,
  color,
  pick,
}: {
  options: { id: string; label: Loc }[];
  value: string[];
  onChange: (v: string[]) => void;
  color: string;
  pick: (l: Loc) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((v) => v !== o.id) : [...value, o.id])}
            className={cn(
              "rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all duration-300",
              on ? "text-ink" : "border-white/12 bg-white/[0.03] text-muted hover:-translate-y-0.5 hover:text-txt",
            )}
            style={on ? { background: color, borderColor: color } : undefined}
          >
            {pick(o.label)}
          </button>
        );
      })}
    </div>
  );
}

export default function Wizard() {
  const { t, pick, fmt } = useI18n();
  const { accent, setAccent, addBrief, addMessage, toast, user, wizardSeed, setWizardSeed, setDashTab, setDraft, setRoute, openDetail } = useStore();

  const [step, setStep] = useState(0);
  const [cat, setCat] = useState<Cat | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [color, setColor] = useState(accent);
  const [pages, setPages] = useState(6);
  const [weeks, setWeeks] = useState(4);
  const [budget, setBudget] = useState("b2");
  const [multi, setMulti] = useState<Record<string, string[]>>({ webFeatures: ["admin"], aiCaps: ["memory"], langs: ["fa"], sensors: ["ir"] });
  const [single, setSingle] = useState<Record<string, string>>({ aiPlatform: "bale", dimension: "3d", gamePlatform: "pc", players: "single", board: "uno", power: "battery" });
  const [result, setResult] = useState<Brief | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!wizardSeed) return;
    const s = serviceById(wizardSeed);
    if (s) {
      setCat(s.cat);
      setServiceId(s.id);
      setStep(2);
      setResult(null);
      setSaved(false);
    }
    setWizardSeed(null);
  }, [wizardSeed, setWizardSeed]);

  const service = serviceId ? serviceById(serviceId) : undefined;
  const theme = cat ? catColor(cat) : accent;
  const steps = [t("wiz.s1"), t("wiz.s2"), t("wiz.s3"), t("wiz.s4"), t("wiz.s5")];

  const canNext = step === 0 ? Boolean(cat) : step === 1 ? Boolean(serviceId) : true;

  const complexity = useMemo(() => {
    if (!service) return 0;
    let score = service.cat === "game" ? 46 : service.cat === "robot" ? 40 : service.cat === "ai" ? 42 : 32;
    score += (multi.webFeatures?.length ?? 0) * 3;
    score += (multi.aiCaps?.length ?? 0) * 4;
    score += (multi.sensors?.length ?? 0) * 3;
    score += (multi.langs?.length ?? 0) * 2;
    if (service.cat === "web") score += Math.min(18, pages);
    if (single.players === "online") score += 16;
    if (single.dimension === "3d") score += 8;
    if (single.board === "rpi") score += 6;
    return Math.max(18, Math.min(98, Math.round(score)));
  }, [service, multi, pages, single]);

  const estimate = useMemo(() => {
    if (!service) return weeks;
    const base = service.weeks[0] + (complexity - 40) / 14;
    return Math.max(1, Math.round((base + weeks) / 2));
  }, [service, complexity, weeks]);

  const stack = useMemo(() => {
    if (!service) return [];
    const extra: string[] = [];
    if (service.cat === "web") {
      if (multi.webFeatures?.includes("pay")) extra.push("Gateway API");
      if (multi.webFeatures?.includes("i18n")) extra.push("i18n");
      if (multi.webFeatures?.includes("seo")) extra.push("Schema.org");
    }
    if (service.cat === "ai") {
      if (multi.aiCaps?.includes("docs")) extra.push("Vector DB");
      if (multi.aiCaps?.includes("voice")) extra.push("Whisper");
      if (multi.aiCaps?.includes("vision")) extra.push("OpenCV");
    }
    if (service.cat === "game") {
      if (single.players === "online") extra.push("WebSocket");
      if (single.dimension === "3d") extra.push("Blender");
    }
    if (service.cat === "robot") {
      if (multi.sensors?.includes("gyro")) extra.push("MPU6050");
      if (multi.sensors?.includes("bt")) extra.push("HC-05");
      if (single.board === "esp32") extra.push("Wi-Fi");
    }
    return Array.from(new Set([...service.stack, ...extra]));
  }, [service, multi, single]);

  const generate = () => {
    if (!service || !cat) return;
    const brief: Brief = {
      id: uid(),
      createdAt: Date.now(),
      serviceId: service.id,
      cat,
      color,
      weeks: estimate,
      complexity,
      budget,
      stack,
      answers: {
        pages,
        weeks,
        ...single,
        ...multi,
      },
    };
    setResult(brief);
    setSaved(false);
    setStep(4);
  };

  const briefText = (b: Brief) => {
    const s = serviceById(b.serviceId);
    return [
      `${t("wiz.summary")}: ${s ? pick(s.title) : b.serviceId}`,
      `${t("wiz.estimate")}: ${b.weeks} ${t("unit.weeks")}`,
      `${t("wiz.complexity")}: ${b.complexity}/100`,
      `${t("wiz.budget")}: ${t(`contact.${b.budget}`)}`,
      `${t("wiz.recommended")}: ${b.stack.join(", ")}`,
      `${t("wiz.s3")}: ${b.color}`,
    ].join("\n");
  };

  const match = service ? PROJECTS.find((p) => p.serviceId === service.id) ?? PROJECTS.find((p) => p.cat === service.cat) : undefined;

  const reset = () => {
    setStep(0);
    setCat(null);
    setServiceId(null);
    setResult(null);
    setSaved(false);
  };

  return (
    <div className="relative">
      {/* progress */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            {t("wiz.step", { a: fmt(step + 1), b: fmt(5) })}
          </span>
          <span className="font-display text-[14px] font-bold text-txt">{steps[step]}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ width: `${((step + 1) / 5) * 100}%`, background: `linear-gradient(90deg, ${theme}, var(--color-magenta))` }}
          />
        </div>
        <div className="mt-3 flex gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s}
              type="button"
              disabled={i > step}
              onClick={() => i < step && setStep(i)}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                i <= step ? "opacity-100" : "opacity-25",
                i < step ? "cursor-pointer hover:opacity-80" : "cursor-default",
              )}
              style={{ background: i <= step ? theme : "#ffffff" }}
              aria-label={s}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
        {/* STEP 1 */}
        {step === 0 && (
          <div style={{ animation: "riseIn .45s cubic-bezier(.22,1,.36,1)" }}>
            <h3 className="font-display text-xl font-bold text-txt">{t("wiz.s1")}</h3>
            <p className="mt-1.5 text-[13.5px] text-muted">{t("wiz.s1sub")}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <OptCard
                  key={c.id}
                  active={cat === c.id}
                  onClick={() => {
                    setCat(c.id);
                    setServiceId(null);
                  }}
                  color={c.color}
                  icon={c.icon}
                  title={pick(c.label)}
                  sub={t("services.results", { n: fmt(SERVICES.filter((s) => s.cat === c.id).length) })}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && cat && (
          <div style={{ animation: "riseIn .45s cubic-bezier(.22,1,.36,1)" }}>
            <h3 className="font-display text-xl font-bold text-txt">{t("wiz.s2")}</h3>
            <p className="mt-1.5 text-[13.5px] text-muted">{t("wiz.s2sub")}</p>
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {SERVICES.filter((s) => s.cat === cat).map((s) => (
                <OptCard
                  key={s.id}
                  active={serviceId === s.id}
                  onClick={() => setServiceId(s.id)}
                  color={catColor(s.cat)}
                  img={s.img}
                  title={pick(s.title)}
                  sub={pick(s.tagline)}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div style={{ animation: "riseIn .45s cubic-bezier(.22,1,.36,1)" }}>
            <h3 className="font-display text-xl font-bold text-txt">{t("wiz.s3")}</h3>
            <p className="mt-1.5 text-[13.5px] text-muted">{t("wiz.s3sub")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setColor(readableAccent(c));
                    setAccent(c);
                  }}
                  aria-label={c}
                  className={cn(
                    "relative h-14 w-14 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1",
                    color === c ? "scale-110 border-white" : "border-white/15",
                  )}
                  style={{ background: c, boxShadow: color === c ? `0 12px 30px -10px ${c}` : undefined }}
                >
                  {color === c && <Icon name="check" className="absolute inset-0 m-auto h-6 w-6 text-ink" strokeWidth={3} />}
                </button>
              ))}
              <label className="flex h-14 cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed border-white/20 px-4 text-[12.5px] text-muted transition hover:border-white/40 hover:text-txt">
                <Icon name="palette" className="h-5 w-5" />
                {t("wiz.custom")}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(readableAccent(e.target.value));
                    setAccent(e.target.value);
                  }}
                  className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <span className="h-10 w-10 rounded-xl" style={{ background: color, boxShadow: `0 0 24px -4px ${color}` }} />
              <div>
                <div className="font-mono text-[12.5px] text-txt">{color.toUpperCase()}</div>
                <div className="text-[12px] text-muted">{t("wiz.accentApplied")}</div>
              </div>
              <Btn size="sm" variant="ghost" className="ms-auto" onClick={() => { setColor("#3be8ff"); setAccent("#3be8ff"); }}>
                <Icon name="refresh" className="h-4 w-4" />
                {t("services.reset")}
              </Btn>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 3 && service && cat && (
          <div style={{ animation: "riseIn .45s cubic-bezier(.22,1,.36,1)" }}>
            <h3 className="font-display text-xl font-bold text-txt">{t("wiz.s4")}</h3>
            <p className="mt-1.5 text-[13.5px] text-muted">{t("wiz.s4sub")}</p>

            <div className="mt-6 grid gap-6">
              {cat === "web" && (
                <>
                  <div>
                    <div className="mb-3 flex items-center justify-between text-[13px] font-medium text-txt">
                      <span>{t("wiz.pages")}</span>
                      <span className="font-mono accent-text">{fmt(pages)}</span>
                    </div>
                    <input type="range" min={1} max={30} value={pages} onChange={(e) => setPages(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.features")}</div>
                    <MultiChips options={OPTIONS.webFeatures} value={multi.webFeatures ?? []} onChange={(v) => setMulti((m) => ({ ...m, webFeatures: v }))} color={theme} pick={pick} />
                  </div>
                </>
              )}

              {cat === "ai" && (
                <>
                  <div>
                    <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.platform")}</div>
                    <MultiChips options={OPTIONS.aiPlatform} value={[single.aiPlatform]} onChange={(v) => setSingle((s) => ({ ...s, aiPlatform: v[v.length - 1] ?? s.aiPlatform }))} color={theme} pick={pick} />
                  </div>
                  <div>
                    <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.capabilities")}</div>
                    <MultiChips options={OPTIONS.aiCaps} value={multi.aiCaps ?? []} onChange={(v) => setMulti((m) => ({ ...m, aiCaps: v }))} color={theme} pick={pick} />
                  </div>
                  <div>
                    <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.languages")}</div>
                    <MultiChips options={OPTIONS.langs} value={multi.langs ?? []} onChange={(v) => setMulti((m) => ({ ...m, langs: v }))} color={theme} pick={pick} />
                  </div>
                </>
              )}

              {cat === "game" && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.dimension")}</div>
                      <MultiChips options={OPTIONS.dimension} value={[single.dimension]} onChange={(v) => setSingle((s) => ({ ...s, dimension: v[v.length - 1] ?? s.dimension }))} color={theme} pick={pick} />
                    </div>
                    <div>
                      <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.players")}</div>
                      <MultiChips options={OPTIONS.players} value={[single.players]} onChange={(v) => setSingle((s) => ({ ...s, players: v[v.length - 1] ?? s.players }))} color={theme} pick={pick} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.platform")}</div>
                    <MultiChips options={OPTIONS.gamePlatform} value={multi.gamePlatform ?? [single.gamePlatform]} onChange={(v) => setMulti((m) => ({ ...m, gamePlatform: v }))} color={theme} pick={pick} />
                  </div>
                </>
              )}

              {cat === "robot" && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.board")}</div>
                      <MultiChips options={OPTIONS.board} value={[single.board]} onChange={(v) => setSingle((s) => ({ ...s, board: v[v.length - 1] ?? s.board }))} color={theme} pick={pick} />
                    </div>
                    <div>
                      <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.power")}</div>
                      <MultiChips options={OPTIONS.power} value={[single.power]} onChange={(v) => setSingle((s) => ({ ...s, power: v[v.length - 1] ?? s.power }))} color={theme} pick={pick} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.sensors")}</div>
                    <MultiChips options={OPTIONS.sensors} value={multi.sensors ?? []} onChange={(v) => setMulti((m) => ({ ...m, sensors: v }))} color={theme} pick={pick} />
                  </div>
                </>
              )}

              <div className="grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center justify-between text-[13px] font-medium text-txt">
                    <span>{t("wiz.weeks")}</span>
                    <span className="font-mono accent-text">{t("wiz.weeksVal", { n: fmt(weeks) })}</span>
                  </div>
                  <input type="range" min={1} max={16} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="mb-3 text-[13px] font-medium text-txt">{t("wiz.budget")}</div>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-2xl border border-white/12 bg-ink/50 px-4 py-3 text-[13.5px] text-txt outline-none focus:border-[var(--color-accent)]"
                  >
                    {["b1", "b2", "b3", "b4", "b5"].map((b) => (
                      <option key={b} value={b}>
                        {t(`contact.${b}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — result */}
        {step === 4 && result && service && (
          <div style={{ animation: "riseIn .5s cubic-bezier(.22,1,.36,1)" }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-txt">{pick(service.title)}</h3>
                <p className="mt-1.5 text-[13.5px] text-muted">{t("wiz.s5sub")}</p>
              </div>
              <div className="relative grid h-24 w-24 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={result.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.complexity / 100) * 264} 264`}
                    style={{ transition: "stroke-dasharray 1s cubic-bezier(.22,1,.36,1)" }}
                  />
                </svg>
                <div className="text-center">
                  <div className="font-display text-xl font-bold text-txt">{fmt(result.complexity)}</div>
                  <div className="text-[9px] uppercase tracking-wider text-muted">/ {fmt(100)}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted">{t("wiz.estimate")}</div>
                <div className="mt-1 font-display text-lg font-bold text-txt">
                  {fmt(result.weeks)} {t("unit.weeks")}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted">{t("wiz.budget")}</div>
                <div className="mt-1 font-display text-[15px] font-bold text-txt">{t(`contact.${result.budget}`)}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted">{t("wiz.s3")}</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg" style={{ background: result.color }} />
                  <span className="font-mono text-[13px] text-txt">{result.color.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <h4 className="mt-7 font-display text-[15px] font-bold text-txt">{t("wiz.recommended")}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.stack.map((s) => (
                <Chip key={s} color={result.color}>
                  {s}
                </Chip>
              ))}
            </div>

            <h4 className="mt-7 font-display text-[15px] font-bold text-txt">{t("wiz.phases")}</h4>
            <div className="mt-3 space-y-2.5">
              {["wiz.phase1", "wiz.phase2", "wiz.phase3", "wiz.phase4"].map((p, i) => {
                const share = [0.2, 0.25, 0.4, 0.15][i];
                const w = Math.max(1, Math.round(result.weeks * share));
                return (
                  <div key={p} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px]" style={{ background: `${result.color}22`, color: result.color }}>
                      {fmt(i + 1)}
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] text-txt/90">{t(p)}</span>
                    <span className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-white/8 sm:block">
                      <span className="block h-full rounded-full" style={{ width: `${share * 100 * 2.2}%`, background: result.color }} />
                    </span>
                    <span className="font-mono text-[11.5px] text-muted">
                      {fmt(w)} {t("unit.weeks")}
                    </span>
                  </div>
                );
              })}
            </div>

            {match && (
              <button
                type="button"
                onClick={() => openDetail("project", match.id)}
                className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-start transition hover:border-[var(--color-accent)]/50 hover:bg-white/[0.06]"
              >
                <img src={match.img} alt="" className="h-16 w-24 rounded-xl object-cover" loading="lazy" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] uppercase tracking-wider text-muted">{t("wiz.match")}</span>
                  <span className="block truncate font-display text-[14.5px] font-bold text-txt">{pick(match.name)}</span>
                </span>
                <Icon name="arrow" className="h-5 w-5 text-muted rtl:rotate-180" />
              </button>
            )}

            <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-6">
              <Btn
                disabled={saved}
                onClick={() => {
                  addBrief(result);
                  setSaved(true);
                  toast(t("wiz.savedToast"), "ok", { label: t("dash.tabBriefs"), run: () => setDashTab("briefs") });
                }}
              >
                <Icon name={saved ? "check" : "plus"} className="h-4 w-4" />
                {saved ? t("dash.tabBriefs") : t("wiz.save")}
              </Btn>
              <Btn
                variant="outline"
                onClick={() => {
                  addMessage({
                    id: uid(),
                    ref: `MM-${Math.floor(1000 + Math.random() * 8999)}`,
                    createdAt: Date.now(),
                    name: user?.name ?? "Guest",
                    email: user?.email ?? "guest@local",
                    topic: result.serviceId,
                    budget: result.budget,
                    body: briefText(result),
                  });
                  setDraft({ topic: result.serviceId, body: briefText(result) });
                  toast(t("wiz.sentToast"), "ok");
                  setRoute("site");
                  window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 140);
                }}
              >
                <Icon name="send" className="h-4 w-4" />
                {t("wiz.send")}
              </Btn>
              <Btn variant="ghost" onClick={reset}>
                <Icon name="refresh" className="h-4 w-4" />
                {t("wiz.restart")}
              </Btn>
            </div>
          </div>
        )}

        {/* nav */}
        {step < 4 && (
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
            <Btn variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <Icon name="arrow" className="h-4 w-4 rotate-180 rtl:rotate-0" />
              {t("wiz.back")}
            </Btn>
            {!canNext && <span className="text-[12px] text-muted">{t("wiz.pickOne")}</span>}
            {step < 3 ? (
              <Btn onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext}>
                {t("wiz.next")}
                <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
              </Btn>
            ) : (
              <Btn onClick={generate} disabled={!service}>
                <Icon name="spark" className="h-4 w-4" />
                {t("wiz.finish")}
              </Btn>
            )}
          </div>
        )}
      </div>

      {step === 1 && !cat && (
        <Reveal>
          <p className="mt-4 text-[13px] text-muted">{t("wiz.pickOne")}</p>
        </Reveal>
      )}
    </div>
  );
}