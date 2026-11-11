import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, type Cat } from "../data/services";
import { useI18n, type Loc } from "../lib/i18n";
import { useStore } from "../lib/store";
import { play } from "../lib/sound";
import { Btn, Chip, Icon, Reveal, SectionHead } from "./ui";
import { cn } from "../utils/cn";

const L = (fa: string, en: string, ar: string, zh: string): Loc => ({ fa, en, ar, zh });

interface Q {
  cat: Cat;
  q: Loc;
  o: Loc[];
  a: number;
  why: Loc;
}

const BANK: Q[] = [
  {
    cat: "web",
    q: L("کدام تگ برای منوی اصلی سایت معنایی است؟", "Which tag is semantic for the main menu?", "أي وسم دلالي للقائمة الرئيسية؟", "主菜单应使用哪个语义标签？"),
    o: [L("<nav>", "<nav>", "<nav>", "<nav>"), L("<div>", "<div>", "<div>", "<div>"), L("<span>", "<span>", "<span>", "<span>"), L("<menu-bar>", "<menu-bar>", "<menu-bar>", "<menu-bar>")],
    a: 0,
    why: L("nav به مرورگر و صفحه‌خوان می‌فهماند اینجا ناوبری است.", "nav tells browsers and screen readers this is navigation.", "nav يخبر المتصفح وقارئ الشاشة أن هذا تنقّل.", "nav 告诉浏览器与读屏软件这里是导航。"),
  },
  {
    cat: "web",
    q: L("کدام ویژگی CSS گوشه‌ها را گرد می‌کند؟", "Which CSS property rounds corners?", "أي خاصية CSS تدوّر الزوايا؟", "哪个 CSS 属性可让圆角生效？"),
    o: [L("corner-style", "corner-style", "corner-style", "corner-style"), L("border-radius", "border-radius", "border-radius", "border-radius"), L("box-round", "box-round", "box-round", "box-round"), L("radius-box", "radius-box", "radius-box", "radius-box")],
    a: 1,
    why: L("border-radius شعاع گوشه را تعیین می‌کند.", "border-radius sets the corner radius.", "border-radius تحدد نصف قطر الزاوية.", "border-radius 设置圆角半径。"),
  },
  {
    cat: "web",
    q: L("کدام متد جاوااسکریپت به انتهای آرایه اضافه می‌کند؟", "Which JS method appends to an array?", "أي دالة تضيف إلى نهاية المصفوفة؟", "哪个 JS 方法向数组末尾追加元素？"),
    o: [L("shift()", "shift()", "shift()", "shift()"), L("pop()", "pop()", "pop()", "pop()"), L("push()", "push()", "push()", "push()"), L("slice()", "slice()", "slice()", "slice()")],
    a: 2,
    why: L("push اضافه می‌کند، pop حذف می‌کند.", "push adds, pop removes.", "push تضيف وpop تحذف.", "push 添加，pop 删除。"),
  },
  {
    cat: "web",
    q: L("کد وضعیت 404 یعنی چه؟", "What does HTTP 404 mean?", "ماذا يعني الرمز 404؟", "HTTP 404 表示什么？"),
    o: [L("سرور خراب است", "Server crashed", "تعطل الخادم", "服务器崩溃"), L("دسترسی غیرمجاز", "Forbidden", "ممنوع", "禁止访问"), L("یافت نشد", "Not found", "غير موجود", "未找到"), L("درخواست موفق", "OK", "نجاح", "请求成功")],
    a: 2,
    why: L("منبع درخواستی روی سرور وجود ندارد.", "The requested resource does not exist.", "المصدر المطلوب غير موجود.", "请求的资源不存在。"),
  },
  {
    cat: "ai",
    q: L("شبکه عصبی هنگام آموزش چه چیزی را تنظیم می‌کند؟", "What does a neural network adjust while training?", "ماذا يضبط الشبكة العصبية أثناء التدريب؟", "神经网络训练时调整的是什么？"),
    o: [L("وزن‌ها", "Weights", "الأوزان", "权重"), L("پیکسل‌ها", "Pixels", "البكسلات", "像素"), L("فایل‌ها", "Files", "الملفات", "文件"), L("رنگ‌ها", "Colors", "الألوان", "颜色")],
    a: 0,
    why: L("گرادیان کاهشی وزن‌ها را به‌روزرسانی می‌کند.", "Gradient descent updates the weights.", "الانحدار التدريجي يحدّث الأوزان.", "梯度下降更新权重。"),
  },
  {
    cat: "ai",
    q: L("کتابخانه استاندارد بینایی ماشین در پایتون؟", "Standard computer-vision library in Python?", "مكتبة الرؤية الحاسوبية القياسية في بايثون؟", "Python 中标准的计算机视觉库是？"),
    o: [L("NumPy", "NumPy", "NumPy", "NumPy"), L("OpenCV", "OpenCV", "OpenCV", "OpenCV"), L("Flask", "Flask", "Flask", "Flask"), L("Pandas", "Pandas", "Pandas", "Pandas")],
    a: 1,
    why: L("OpenCV پردازش تصویر و تشخیص چهره را ممکن می‌کند.", "OpenCV powers image processing and face detection.", "OpenCV تعالج الصور وتكشف الوجوه.", "OpenCV 负责图像处理与人脸检测。"),
  },
  {
    cat: "ai",
    q: L("بیش‌برازش (overfitting) یعنی چه؟", "What is overfitting?", "ما هو فرط التخصيص؟", "什么是过拟合？"),
    o: [
      L("مدل داده آموزشی را حفظ می‌کند", "The model memorizes training data", "النموذج يحفظ بيانات التدريب", "模型死记训练数据"),
      L("مدل خیلی سریع است", "The model is too fast", "النموذج سريع جداً", "模型太快"),
      L("داده کم است", "There is no data", "لا توجد بيانات", "没有数据"),
      L("مدل سبک است", "The model is small", "النموذج صغير", "模型很小"),
    ],
    a: 0,
    why: L("روی داده جدید خوب کار نمی‌کند.", "It then fails on unseen data.", "ثم يفشل على بيانات جديدة.", "因此在未见数据上表现差。"),
  },
  {
    cat: "robot",
    q: L("در کنترل PID کدام جمله نوسان را کم می‌کند؟", "In PID, which term damps oscillation?", "في PID أي حد يخمد التذبذب؟", "PID 中哪一项抑制振荡？"),
    o: [L("P", "P", "P", "P"), L("I", "I", "I", "I"), L("D", "D", "D", "D"), L("هیچ‌کدام", "None", "لا شيء", "都不是")],
    a: 2,
    why: L("جمله مشتق مثل ترمز روی تغییرات عمل می‌کند.", "The derivative term brakes rapid change.", "حد المشتق يكبح التغير السريع.", "微分项对快速变化起刹车作用。"),
  },
  {
    cat: "robot",
    q: L("ولتاژ کاری آردوینو UNO چقدر است؟", "Arduino UNO logic voltage?", "جهد عمل أردوينو UNO؟", "Arduino UNO 的工作电压是？"),
    o: [L("1.2V", "1.2V", "1.2V", "1.2V"), L("3.3V", "3.3V", "3.3V", "3.3V"), L("5V", "5V", "5V", "5V"), L("12V", "12V", "12V", "12V")],
    a: 2,
    why: L("پین‌های دیجیتال UNO با پنج ولت کار می‌کنند.", "UNO digital pins run at five volts.", "أطراف UNO الرقمية تعمل بخمسة فولت.", "UNO 数字引脚为 5V。"),
  },
  {
    cat: "robot",
    q: L("کدام سنسور فاصله را با صدا می‌سنجد؟", "Which sensor measures distance with sound?", "أي حساس يقيس المسافة بالصوت؟", "哪种传感器用声音测距？"),
    o: [L("مادون قرمز", "Infrared", "تحت الحمراء", "红外"), L("التراسونیک", "Ultrasonic", "فوق الصوتي", "超声波"), L("ژیروسکوپ", "Gyroscope", "الجيروسكوب", "陀螺仪"), L("دماسنج", "Thermistor", "الحراري", "热敏电阻")],
    a: 1,
    why: L("زمان رفت‌وبرگشت پژواک، فاصله می‌دهد.", "Echo round-trip time gives distance.", "زمن صدى الصوت يعطي المسافة.", "回波往返时间换算出距离。"),
  },
  {
    cat: "game",
    q: L("FPS در بازی یعنی چه؟", "What does FPS measure in games?", "ماذا يقيس FPS في الألعاب؟", "游戏中的 FPS 指什么？"),
    o: [
      L("فریم بر ثانیه", "Frames per second", "إطاراً في الثانية", "每秒帧数"),
      L("بازیکن در سرور", "Players per server", "لاعبين لكل خادم", "每服玩家数"),
      L("فایل ذخیره", "File save rate", "معدل الحفظ", "存档速率"),
      L("قدرت شلیک", "Fire power score", "قوة الإطلاق", "火力值"),
    ],
    a: 0,
    why: L("شصت فریم بر ثانیه یعنی حرکت روان.", "Sixty frames per second feels smooth.", "ستون إطاراً في الثانية تعطي سلاسة.", "60 帧每秒意味着流畅。"),
  },
  {
    cat: "game",
    q: L("کدام موتور بازی‌سازی با سی‌شارپ کار می‌کند؟", "Which engine scripts in C#?", "أي محرك يستخدم C#؟", "哪个引擎使用 C#  scripting？"),
    o: [L("Unity", "Unity", "Unity", "Unity"), L("Godot GDScript", "Godot GDScript", "Godot GDScript", "Godot GDScript"), L("GameMaker GML", "GameMaker GML", "GameMaker GML", "GameMaker GML"), L("Construct", "Construct", "Construct", "Construct")],
    a: 0,
    why: L("یونیتی اسکریپت‌ها را با سی‌شارپ می‌نویسد.", "Unity scripts are written in C#.", "سكربتات يونیتی بلغة C#.", "Unity 脚本使用 C#。"),
  },
];

const BADGES = [
  { id: "explore", icon: "eye", color: "#3be8ff" },
  { id: "fav", icon: "heart", color: "#ff2e88" },
  { id: "quiz", icon: "bolt", color: "#a6f04a" },
  { id: "perfect", icon: "star", color: "#ffd166" },
  { id: "lab", icon: "chip", color: "#ffb627" },
  { id: "brief", icon: "layers", color: "#a06bff" },
];

interface Score {
  name: string;
  score: number;
  acc: number;
  at: number;
}
const SCORE_KEY = "mm.quiz.scores";
const ROUND = 8;
const TIME = 20;

export default function QuizArena() {
  const { t, pick, fmt, lang } = useI18n();
  const { user, badges, unlockBadge, quizBest, setQuizBest } = useStore();
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [cat, setCat] = useState<Cat | "all">("all");
  const [deck, setDeck] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [time, setTime] = useState(TIME);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [answers, setAnswers] = useState<{ q: Q; picked: number | null }[]>([]);
  const [burst, setBurst] = useState(0);
  const [scores, setScores] = useState<Score[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SCORE_KEY) || "[]") as Score[];
    } catch {
      return [];
    }
  });
  const lockRef = useRef(false);

  const current = deck[idx];

  const finish = useCallback(
    (finalScore: number, list: { q: Q; picked: number | null }[]) => {
      const correct = list.filter((a) => a.picked === a.q.a).length;
      const acc = Math.round((correct / Math.max(1, list.length)) * 100);
      setPhase("over");
      setQuizBest(finalScore);
      unlockBadge("quiz");
      if (correct === list.length && list.length >= ROUND) unlockBadge("perfect");
      const entry: Score = { name: user?.name ?? t("quiz.guest"), score: finalScore, acc, at: Date.now() };
      setScores((prev) => {
        const next = [...prev, entry].sort((a, b) => b.score - a.score).slice(0, 5);
        try {
          localStorage.setItem(SCORE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      play(correct >= list.length / 2 ? "badge" : "wrong");
    },
    [setQuizBest, unlockBadge, user, t],
  );

  const advance = useCallback(
    (chosen: number | null) => {
      if (lockRef.current || !current) return;
      lockRef.current = true;
      const ok = chosen === current.a;
      const list = [...answers, { q: current, picked: chosen }];
      setAnswers(list);
      setPicked(chosen ?? -1);

      let nextScore = score;
      let nextLives = lives;
      if (ok) {
        const gain = Math.round((100 + time * 5) * (1 + streak * 0.25));
        nextScore = score + gain;
        setScore(nextScore);
        setStreak((s) => s + 1);
        setBurst((b) => b + 1);
        play("correct");
      } else {
        nextLives = lives - 1;
        setLives(nextLives);
        setStreak(0);
        play("wrong");
      }

      window.setTimeout(() => {
        lockRef.current = false;
        setPicked(null);
        if (nextLives <= 0 || idx + 1 >= deck.length) {
          finish(nextScore, list);
        } else {
          setIdx((i) => i + 1);
          setTime(TIME);
        }
      }, 1500);
    },
    [answers, current, deck.length, finish, idx, lives, score, streak, time],
  );

  // countdown
  useEffect(() => {
    if (phase !== "play" || picked !== null) return;
    const id = window.setInterval(() => {
      setTime((v) => {
        const next = v - 1;
        if (next <= 5 && next > 0) play("tick");
        if (next <= 0) {
          advance(null);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, picked, advance]);

  // keyboard
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 4) advance(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, advance]);

  const start = () => {
    const pool = cat === "all" ? BANK : BANK.filter((q) => q.cat === cat);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = (shuffled.length >= ROUND ? shuffled : [...shuffled, ...BANK.filter((q) => !shuffled.includes(q)).sort(() => Math.random() - 0.5)]).slice(0, ROUND);
    setDeck(chosen);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setAnswers([]);
    setPicked(null);
    setTime(TIME);
    lockRef.current = false;
    setPhase("play");
    play("whoosh");
  };

  const correctCount = answers.filter((a) => a.picked === a.q.a).length;
  const accuracy = Math.round((correctCount / Math.max(1, answers.length)) * 100);
  const rank = accuracy >= 90 ? "quiz.rank1" : accuracy >= 70 ? "quiz.rank2" : accuracy >= 45 ? "quiz.rank3" : "quiz.rank4";

  const copyResult = async () => {
    const text = `${t("quiz.title")} — ${t("quiz.score")}: ${score} · ${t("quiz.accuracy")}: ${accuracy}% · mahdismounesan.dev`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard blocked */
    }
    play("tap");
  };

  const ring = useMemo(() => (time / TIME) * 264, [time]);

  return (
    <section id="quiz" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHead kicker={t("quiz.kicker")} title={t("quiz.title")} sub={t("quiz.sub")} />

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <Reveal delay={100} className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-magenta)_12%,transparent)] via-[rgba(9,14,28,.6)] to-[color-mix(in_srgb,var(--color-accent)_12%,transparent)] p-5 sm:p-7">
              {burst > 0 && (
                <div key={burst} className="pointer-events-none absolute inset-0 z-20">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
                      style={{
                        background: ["#a6f04a", "#3be8ff", "#ffd166", "#ff2e88"][i % 4],
                        animation: `confetti${i % 4} 900ms cubic-bezier(.22,1,.36,1) forwards`,
                      }}
                    />
                  ))}
                </div>
              )}

              {phase === "idle" && (
                <div className="relative" style={{ animation: "riseIn .5s cubic-bezier(.22,1,.36,1)" }}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip color="#a6f04a">
                      <Icon name="bolt" className="h-3.5 w-3.5" />
                      {fmt(ROUND)} {t("quiz.question")}
                    </Chip>
                    <Chip color="#3be8ff">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      {fmt(TIME)}s
                    </Chip>
                    <Chip color="#ff2e88">
                      <Icon name="heart" className="h-3.5 w-3.5" />
                      {fmt(3)} {t("quiz.lives")}
                    </Chip>
                    {quizBest > 0 && (
                      <Chip color="#ffd166">
                        <Icon name="star" className="h-3.5 w-3.5" />
                        {t("quiz.best")}: {fmt(quizBest)}
                      </Chip>
                    )}
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-txt">{t("quiz.pickCat")}</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[{ id: "all" as const, label: t("quiz.mixed"), color: "#a06bff", icon: "spark" }, ...CATEGORIES.map((c) => ({ id: c.id, label: pick(c.label), color: c.color, icon: c.icon }))].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setCat(c.id as Cat | "all"); play("tick"); }}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border p-4 text-start transition-all duration-300",
                          cat === c.id ? "bg-white/[0.07]" : "border-white/10 bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/25",
                        )}
                        style={cat === c.id ? { borderColor: c.color, boxShadow: `0 0 0 1px ${c.color}, 0 18px 40px -28px ${c.color}` } : undefined}
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${c.color}1c`, color: c.color }}>
                          <Icon name={c.icon} className="h-[18px] w-[18px]" />
                        </span>
                        <span className="font-display text-[14.5px] font-bold text-txt">{c.label}</span>
                        {cat === c.id && <Icon name="check" className="ms-auto h-4 w-4" style={{ color: c.color }} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                  <Btn size="lg" className="mt-7" onClick={start}>
                    <Icon name="rocket" className="h-[18px] w-[18px]" />
                    {t("quiz.start")}
                  </Btn>
                </div>
              )}

              {phase === "play" && current && (
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative grid h-16 w-16 shrink-0 place-items-center">
                      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="8" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={time <= 5 ? "#ff5c7a" : "var(--color-accent)"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${ring} 264`}
                          style={{ transition: "stroke-dasharray 1s linear" }}
                        />
                      </svg>
                      <span className={cn("font-display text-lg font-bold", time <= 5 ? "text-danger" : "text-txt")}>{fmt(time)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
                        {t("quiz.question")} {fmt(idx + 1)} / {fmt(deck.length)}
                      </div>
                      <div className="mt-1.5 flex gap-1">
                        {deck.map((_, i) => (
                          <span
                            key={i}
                            className="h-1.5 flex-1 rounded-full transition-colors"
                            style={{
                              background:
                                i < answers.length
                                  ? answers[i].picked === answers[i].q.a
                                    ? "#31d99a"
                                    : "#ff5c7a"
                                  : i === idx
                                    ? "var(--color-accent)"
                                    : "rgba(255,255,255,.12)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-end">
                        <div className="font-mono text-[10px] uppercase text-muted">{t("quiz.score")}</div>
                        <div className="font-display text-xl font-bold text-txt">{fmt(score)}</div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Icon key={i} name="heart" className={cn("h-4 w-4", i < lives ? "text-magenta" : "text-white/15")} fill={i < lives ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {streak > 1 && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber/50 bg-amber/12 px-3 py-1 text-[12px] font-bold text-amber" style={{ animation: "riseIn .3s ease" }}>
                      <Icon name="bolt" className="h-3.5 w-3.5" />×{(1 + streak * 0.25).toFixed(2)} {t("quiz.combo")}
                    </div>
                  )}

                  <h3 className="mt-5 font-display text-xl font-bold leading-snug text-txt sm:text-2xl">{pick(current.q)}</h3>

                  <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {current.o.map((o, i) => {
                      const isCorrect = i === current.a;
                      const isPicked = picked === i;
                      const revealed = picked !== null;
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={revealed}
                          onClick={() => advance(i)}
                          className={cn(
                            "group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-start text-[14px] font-medium transition-all duration-300",
                            !revealed && "border-white/12 bg-white/[0.03] text-txt hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-white/[0.07]",
                            revealed && isCorrect && "border-success bg-success/15 text-txt",
                            revealed && isPicked && !isCorrect && "border-danger bg-danger/15 text-txt",
                            revealed && !isCorrect && !isPicked && "border-white/8 bg-white/[0.02] text-muted opacity-60",
                          )}
                          style={revealed && isPicked && !isCorrect ? { animation: "shake .4s ease" } : undefined}
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/15 font-mono text-[11px] text-muted">
                            {revealed && isCorrect ? <Icon name="check" className="h-4 w-4 text-success" strokeWidth={3} /> : revealed && isPicked ? <Icon name="close" className="h-4 w-4 text-danger" strokeWidth={3} /> : fmt(i + 1)}
                          </span>
                          <span className="min-w-0 flex-1">{pick(o)}</span>
                        </button>
                      );
                    })}
                  </div>

                  {picked !== null && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-ink/40 px-4 py-3" style={{ animation: "riseIn .3s ease" }}>
                      <Icon name={picked === current.a ? "check" : "bolt"} className={cn("mt-0.5 h-4 w-4", picked === current.a ? "text-success" : "text-amber")} />
                      <p className="text-[13px] leading-relaxed text-muted">
                        <span className={cn("font-bold", picked === current.a ? "text-success" : "text-amber")}>
                          {picked === current.a ? t("quiz.correct") : picked === -1 ? t("quiz.timeUp") : t("quiz.wrong")}
                        </span>{" "}
                        — {pick(current.why)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {phase === "over" && (
                <div className="relative text-center" style={{ animation: "riseIn .5s cubic-bezier(.22,1,.36,1)" }}>
                  <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-amber/40 bg-amber/10 text-amber">
                    <Icon name="medal" className="h-9 w-9" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-txt">{t(rank)}</h3>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { l: t("quiz.score"), v: fmt(score), c: "var(--color-accent)" },
                      { l: t("quiz.accuracy"), v: `${fmt(accuracy)}%`, c: "#a6f04a" },
                      { l: t("quiz.best"), v: fmt(Math.max(quizBest, score)), c: "#ffd166" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="font-display text-2xl font-bold" style={{ color: s.c }}>{s.v}</div>
                        <div className="mt-1 text-[11px] text-muted">{s.l}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Btn onClick={start}>
                      <Icon name="refresh" className="h-4 w-4" />
                      {t("quiz.restart")}
                    </Btn>
                    <Btn variant="outline" onClick={() => setPhase("idle")}>
                      <Icon name="grid" className="h-4 w-4" />
                      {t("quiz.pickCat")}
                    </Btn>
                    <Btn variant="ghost" onClick={copyResult}>
                      <Icon name="copy" className="h-4 w-4" />
                      {t("quiz.share")}
                    </Btn>
                  </div>

                  <div className="mt-7 text-start">
                    <h4 className="font-display text-[14px] font-bold text-txt">{t("quiz.review")}</h4>
                    <ul className="mt-3 space-y-2">
                      {answers.map((a, i) => (
                        <li key={i} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                          <Icon name={a.picked === a.q.a ? "check" : "close"} className={cn("mt-0.5 h-4 w-4 shrink-0", a.picked === a.q.a ? "text-success" : "text-danger")} strokeWidth={2.6} />
                          <div className="min-w-0">
                            <div className="text-[13px] font-medium text-txt/90">{pick(a.q.q)}</div>
                            <div className="mt-1 text-[12px] text-muted">{pick(a.q.o[a.q.a])} — {pick(a.q.why)}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={180} className="lg:col-span-4">
            <div className="grid gap-5">
              <div className="rounded-3xl border border-white/12 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <Icon name="medal" className="h-5 w-5 text-amber" />
                  <h3 className="font-display text-[14.5px] font-bold text-txt">{t("badge.title")}</h3>
                  <span className="ms-auto font-mono text-[11px] text-muted">
                    {fmt(badges.length)}/{fmt(BADGES.length)}
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] text-muted">{t("badge.sub")}</p>
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {BADGES.map((b) => {
                    const on = badges.includes(b.id);
                    return (
                      <div
                        key={b.id}
                        title={`${t(`badge.${b.id}`)} — ${t(`badge.${b.id}D`)}`}
                        className={cn(
                          "group grid place-items-center rounded-2xl border p-3 text-center transition-all duration-500",
                          on ? "border-white/20 bg-white/[0.06]" : "border-white/8 bg-white/[0.015] opacity-55",
                        )}
                        style={on ? { boxShadow: `0 12px 30px -22px ${b.color}` } : undefined}
                      >
                        <span
                          className={cn("grid h-10 w-10 place-items-center rounded-xl transition-transform duration-500", on && "group-hover:scale-110 group-hover:rotate-6")}
                          style={{ background: on ? `${b.color}22` : "rgba(255,255,255,.05)", color: on ? b.color : "#64769a" }}
                        >
                          <Icon name={on ? b.icon : "shield"} className="h-5 w-5" />
                        </span>
                        <span className="mt-2 text-[10.5px] leading-tight text-muted">{t(`badge.${b.id}`)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/12 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <Icon name="layers" className="h-5 w-5 text-[var(--color-accent)]" />
                  <h3 className="font-display text-[14.5px] font-bold text-txt">{t("quiz.board")}</h3>
                </div>
                {scores.length === 0 ? (
                  <p className="mt-4 text-[12.5px] text-muted">{t("quiz.noScores")}</p>
                ) : (
                  <ol className="mt-4 space-y-2">
                    {scores.map((s, i) => (
                      <li key={`${s.at}-${i}`} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                        <span
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-[11px] font-bold"
                          style={{
                            background: i === 0 ? "#ffd16622" : "rgba(255,255,255,.05)",
                            color: i === 0 ? "#ffd166" : "#93a6ce",
                          }}
                        >
                          {fmt(i + 1)}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13px] text-txt/90">{s.name}</span>
                        <span className="font-mono text-[11px] text-muted">{fmt(s.acc)}%</span>
                        <span className="font-display text-[14px] font-bold text-txt">{fmt(s.score)}</span>
                      </li>
                    ))}
                  </ol>
                )}
                <p className="mt-4 font-mono text-[10.5px] uppercase tracking-wider text-muted">
                  {lang === "fa" ? "۱ تا ۴ روی کیبورد = انتخاب گزینه" : "Keys 1–4 answer instantly"}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}