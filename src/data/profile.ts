import type { Loc } from "../lib/i18n";
import type { Cat } from "./services";
import { IMG } from "./images";

const d = (fa: string, en: string, ar: string, zh: string): Loc => ({ fa, en, ar, zh });

/* ---------------- Awards ---------------- */
export type Medal = "gold" | "silver" | "diploma" | "member" | "cert";

export interface Award {
  id: string;
  medal: Medal;
  year: number;
  title: Loc;
  org: Loc;
  place: Loc;
  desc: Loc;
}

export const AWARDS: Award[] = [
  {
    id: "ifia-gold",
    medal: "gold",
    year: 2025,
    title: d("مدال طلای IFIA ژنو", "IFIA Geneva Gold Medal", "الميدالية الذهبية لإيفيا جنيف", "日内瓦 IFIA 金奖"),
    org: d("فدراسیون بین‌المللی انجمن‌های مخترعان", "International Federation of Inventors' Associations", "الاتحاد الدولي لجمعيات المخترعين", "国际发明家协会联合会"),
    place: d("ژنو، سوئیس", "Geneva, Switzerland", "جنيف، سويسرا", "瑞士 · 日内瓦"),
    desc: d(
      "شرکت تک‌نفره در مسابقات بین‌المللی سوئیس؛ پس از طراحی و ارائه ایده‌ای در حوزه هوش مصنوعی، مدال طلا را به دست آوردم.",
      "Entered Switzerland's international invention competition solo; after designing and defending an artificial-intelligence concept, I took the gold medal.",
      "شاركت بمفردي في المسابقة الدولية بسويسرا، وبعد تصميم وتقديم فكرة في الذكاء الاصطناعي نلت الميدالية الذهبية.",
      "以个人身份参加瑞士国际发明竞赛，凭借人工智能领域的原创设计获得金奖。",
    ),
  },
  {
    id: "innovers-silver",
    medal: "silver",
    year: 2024,
    title: d("مدال نقره Innovers آمریکا", "Innovers USA Silver Medal", "الميدالية الفضية لمسابقة Innovers", "美国 Innovers 银奖"),
    org: d("مسابقات بین‌المللی Innovers", "Innovers International Competition", "مسابقة Innovers الدولية", "Innovers 国际竞赛"),
    place: d("ایالات متحده آمریکا", "United States", "الولايات المتحدة", "美国"),
    desc: d(
      "به‌صورت تک‌نفره در مسابقات بین‌المللی آمریکا شرکت کردم و پس از پشت سر گذاشتن تمام چالش‌های داوری، مقام نقره را کسب کردم.",
      "Competed individually in the US international competition and cleared every judging challenge to secure the silver place.",
      "شاركت فردياً في المسابقة الدولية بأمريكا، وتجاوزت جميع تحديات التحكيم لأحرز المركز الفضي.",
      "以个人身份参加美国国际赛事，完成全部评审挑战后获得银奖。",
    ),
  },
  {
    id: "i1w-silver",
    medal: "silver",
    year: 2024,
    title: d("مدال نقره 1i1w ترکیه", "1i1w Turkey Silver Medal", "الميدالية الفضية لمسابقة 1i1w", "土耳其 1i1w 银奖"),
    org: d("مسابقات بین‌المللی 1i1w", "1i1w International Competition", "مسابقة 1i1w الدولية", "1i1w 国际竞赛"),
    place: d("ترکیه · حضوری", "Türkiye · On-site", "تركيا · حضورياً", "土耳其 · 现场赛"),
    desc: d(
      "حضور حضوری و تک‌نفره در ترکیه؛ با انجام چهار چالش پی‌درپی در حوزه برنامه‌نویسی وب، مدال نقره را گرفتم.",
      "Attended Türkiye in person, alone, and completed four consecutive web-programming challenges to win silver.",
      "حضرت شخصياً وبمفردي في تركيا، وأنجزت أربعة تحديات متتالية في برمجة الويب فنلت الفضية.",
      "亲赴土耳其以个人身份参赛，连续完成四项网页编程挑战，赢得银奖。",
    ),
  },
  {
    id: "ifia-diploma",
    medal: "diploma",
    year: 2025,
    title: d("دیپلم افتخار IFIA ژنو", "IFIA Geneva Honorary Diploma", "الدبلوم الفخري لإيفيا جنيف", "日内瓦 IFIA 荣誉文凭"),
    org: d("فدراسیون بین‌المللی مخترعان", "International Federation of Inventors", "الاتحاد الدولي للمخترعين", "国际发明家联合会"),
    place: d("ژنو، سوئیس", "Geneva, Switzerland", "جنيف، سويسرا", "瑞士 · 日内瓦"),
    desc: d(
      "در رقابت تک‌نفره سوییس، در حوزه هوش مصنوعی نفر چهارم جهان شدم و دیپلم افتخار دریافت کردم.",
      "Ranked fourth in the world in the artificial-intelligence category as a solo competitor and received the honorary diploma.",
      "احتللت المركز الرابع عالمياً في فئة الذكاء الاصطناعي كمشاركة فردية ونلت الدبلوم الفخري.",
      "以个人身份在人工智能类别中获得全球第四名，并获颁荣誉文凭。",
    ),
  },
  {
    id: "wiipa-member",
    medal: "member",
    year: 2025,
    title: d("عضو رسمی فدراسیون جهانی مخترعان", "Official member, World Inventors Federation", "عضوة رسمية في الاتحاد العالمي للمخترعين", "世界发明家联合会正式会员"),
    org: d("فدراسیون رسمی مخترعین جهان", "World Federation of Inventors", "الاتحاد العالمي للمخترعين", "世界发明家联合会"),
    place: d("ژنو، سوئیس", "Geneva, Switzerland", "جنيف، سويسرا", "瑞士 · 日内瓦"),
    desc: d(
      "پس از کسب مدال طلای تک‌نفره در ژنو، عضویت رسمی فدراسیون جهانی مخترعان به من اعطا شد.",
      "After winning solo gold in Geneva, I was granted official membership of the World Inventors Federation.",
      "بعد فوزي الفردي بالذهبية في جنيف، مُنحت العضوية الرسمية في الاتحاد العالمي للمخترعين.",
      "在日内瓦以个人身份夺得金奖后，获授世界发明家联合会正式会员资格。",
    ),
  },
  {
    id: "harvard",
    medal: "cert",
    year: 2025,
    title: d("مدرک رسمی دانشگاه هاروارد", "Harvard University Certificate", "شهادة رسمية من جامعة هارفارد", "哈佛大学官方证书"),
    org: d("دانشگاه هاروارد · برنامه‌نویسی هوش مصنوعی", "Harvard University · AI Programming", "جامعة هارفارد · برمجة الذكاء الاصطناعي", "哈佛大学 · AI 编程"),
    place: d("کمبریج، ماساچوست", "Cambridge, Massachusetts", "كامبريدج، ماساتشوستس", "美国 · 剑桥"),
    desc: d(
      "در آزمون رسمی دانشگاه هاروارد ثبت‌نام کردم و مدرک رسمی این دانشگاه را در حوزه برنامه‌نویسی هوش مصنوعی گرفتم.",
      "Registered for Harvard University's official examination and earned the university's certificate in AI programming.",
      "سجلت في الاختبار الرسمي لجامعة هارفارد ونلت شهادتها الرسمية في برمجة الذكاء الاصطناعي.",
      "报名并通过哈佛大学官方考试，获得该校人工智能编程证书。",
    ),
  },
];

/* ---------------- Skills ---------------- */
export interface SkillGroup {
  id: string;
  labelKey: string;
  color: string;
  items: { name: string; level: number }[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "web",
    labelKey: "skills.gWeb",
    color: "#3be8ff",
    items: [
      { name: "HTML5", level: 96 },
      { name: "CSS3", level: 93 },
      { name: "JavaScript", level: 90 },
      { name: "PHP", level: 84 },
      { name: "Frontend", level: 92 },
      { name: "Backend", level: 86 },
    ],
  },
  {
    id: "ai",
    labelKey: "skills.gAI",
    color: "#ff2e88",
    items: [
      { name: "Python", level: 91 },
      { name: "Machine Learning", level: 85 },
      { name: "Deep Learning", level: 79 },
      { name: "Computer Vision", level: 82 },
    ],
  },
  {
    id: "robot",
    labelKey: "skills.gRobot",
    color: "#ffb627",
    items: [
      { name: "Arduino", level: 89 },
      { name: "C++", level: 86 },
      { name: "C#", level: 81 },
      { name: "Circuits & Sensors", level: 88 },
    ],
  },
];

export const TOOLS = ["Git", "VS Code", "OpenCV", "TensorFlow", "Unity", "Blender", "MySQL", "Figma", "ESP32", "Linux"];

/* ---------------- Portfolio ---------------- */
export interface Project {
  id: string;
  cat: Cat;
  serviceId: string;
  img: string;
  year: number;
  name: Loc;
  blurb: Loc;
  role: Loc;
  stack: string[];
  highlights: Loc[];
  metrics: { v: number; suffix: string; label: Loc }[];
}

export const PROJECTS: Project[] = [
  {
    id: "p-aurora",
    cat: "web",
    serviceId: "web-shop",
    img: IMG.webEcommerce,
    year: 2025,
    name: d("فروشگاه آرورا", "Aurora Market", "متجر أورورا", "Aurora 商城"),
    blurb: d(
      "فروشگاه اینترنتی چندفروشنده با پرداخت امن، پنل فروشندگان و صفحه محصولی که روی موبایل زیر دو ثانیه باز می‌شود.",
      "A multi-vendor storefront with secure checkout, a seller panel and a product page that opens on mobile in under two seconds.",
      "متجر متعدد البائعين بدفع آمن ولوحة بائعين وصفحة منتج تفتح على الجوال خلال ثانيتين.",
      "多商户电商：安全结算、卖家面板，移动端商品页两秒内打开。",
    ),
    role: d("طراحی، فرانت‌اند و بک‌اند", "Design, frontend & backend", "التصميم والواجهة والخلفية", "设计、前端与后端"),
    stack: ["JavaScript", "PHP", "MySQL", "CSS"],
    highlights: [
      d("سبد خرید بدون رفرش صفحه", "Cart with zero page reloads", "سلة بلا إعادة تحميل", "无刷新购物车"),
      d("پنل تحلیل فروش لحظه‌ای", "Live sales analytics panel", "لوحة مبيعات فورية", "实时销售分析"),
      d("سئوی فنی و اسکیما محصول", "Technical SEO & schema", "سيو تقني وبيانات منظمة", "技术 SEO 与结构化数据"),
    ],
    metrics: [
      { v: 38, suffix: "%", label: d("رشد نرخ تبدیل", "conversion lift", "نمو التحويل", "转化率提升") },
      { v: 98, suffix: "/100", label: d("امتیاز سرعت", "speed score", "درجة السرعة", "性能评分") },
    ],
  },
  {
    id: "p-nova",
    cat: "web",
    serviceId: "web-corp",
    img: IMG.webCorporate,
    year: 2025,
    name: d("هلدینگ نوا", "Nova Group", "مجموعة نوفا", "Nova 集团"),
    blurb: d(
      "وب‌سایت شرکتی دوزبانه با روایت اسکرول‌محور از خدمات، تیم و پروژه‌های بین‌المللی گروه.",
      "A bilingual corporate site whose scroll-driven narrative walks through services, people and international projects.",
      "موقع شركة ثنائي اللغة يروي خدماته وفريقه ومشاريعه الدولية عبر التمرير.",
      "双语企业官网，以滚动叙事呈现服务、团队与国际项目。",
    ),
    role: d("طراحی تجربه و توسعه", "Experience design & build", "تصميم التجربة والتطوير", "体验设计与开发"),
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
    highlights: [
      d("سوئیچ زبان بدون رفرش", "Instant language switching", "تبديل لغة فوري", "即时语言切换"),
      d("انیمیشن‌های اسکرول سبک", "Lightweight scroll motion", "حركات تمرير خفيفة", "轻量滚动动效"),
      d("فرم جذب مشتری هدفمند", "Qualified lead capture", "نماذج عملاء محتملين", "精准获客表单"),
    ],
    metrics: [
      { v: 3, suffix: "×", label: d("زمان ماندگاری", "time on site", "مدة البقاء", "停留时长") },
      { v: 12, suffix: "+", label: d("صفحه اختصاصی", "custom pages", "صفحة مخصصة", "定制页面") },
    ],
  },
  {
    id: "p-signature",
    cat: "web",
    serviceId: "web-resume",
    img: IMG.webResume,
    year: 2025,
    name: d("پلتفرم رزومه سیگنچر", "Signature Résumés", "منصة سيغنتشر", "Signature 简历"),
    blurb: d(
      "قالب رزومه شخصی با تایم‌لاین افتخارات، حالت تاریک اختصاصی و خروجی PDF یک‌کلیکی.",
      "A personal résumé platform with an honors timeline, bespoke dark mode and one-click PDF export.",
      "منصة سيرة ذاتية بخط زمني للإنجازات ووضع ليلي وتصدير PDF بنقرة.",
      "个人简历平台：荣誉时间线、定制暗色模式与一键导出 PDF。",
    ),
    role: d("طراحی و کدنویسی کامل", "Full design & code", "تصميم وبرمجة كاملة", "全案设计与开发"),
    stack: ["React", "CSS", "JavaScript"],
    highlights: [
      d("چاپ و PDF تمیز", "Clean print & PDF", "طباعة وPDF أنيق", "整洁的打印与 PDF"),
      d("میکرواینتراکشن‌های دقیق", "Precise micro-interactions", "تفاعلات دقيقة", "精细微交互"),
      d("دسترس‌پذیری کامل کیبورد", "Full keyboard access", "وصول كامل بلوحة المفاتيح", "完整键盘可达性"),
    ],
    metrics: [
      { v: 100, suffix: "%", label: d("ریسپانسیو", "responsive", "متجاوب", "响应式") },
      { v: 7, suffix: "", label: d("روز تا انتشار", "days to launch", "أيام للإطلاق", "天上线") },
    ],
  },
  {
    id: "p-atlas",
    cat: "web",
    serviceId: "web-custom",
    img: IMG.webCustom,
    year: 2024,
    name: d("سامانه رزرو اطلس", "Atlas Booking Engine", "محرك حجز أطلس", "Atlas 预约引擎"),
    blurb: d(
      "پلتفرم اختصاصی رزرو با API اختصاصی، سطح دسترسی نقش‌محور و گزارش‌های مالی خودکار.",
      "A bespoke booking platform with a custom API, role-based access and automated financial reporting.",
      "منصة حجز مخصصة بواجهة برمجية خاصة وصلاحيات وتقارير مالية آلية.",
      "定制预约平台：专属 API、角色权限与自动财务报表。",
    ),
    role: d("معماری و توسعه فول‌استک", "Architecture & full-stack", "البنية والتطوير المتكامل", "架构与全栈开发"),
    stack: ["PHP", "MySQL", "JavaScript", "REST"],
    highlights: [
      d("معماری ماژولار قابل توسعه", "Modular, extensible architecture", "بنية معيارية قابلة للتوسع", "可扩展模块化架构"),
      d("لاگ حسابرسی کامل", "Complete audit log", "سجل تدقيق كامل", "完整审计日志"),
      d("تست بار تا هزار کاربر", "Load-tested to 1k users", "اختبار حتى ألف مستخدم", "千用户压力测试"),
    ],
    metrics: [
      { v: 1000, suffix: "+", label: d("کاربر همزمان", "concurrent users", "مستخدم متزامن", "并发用户") },
      { v: 40, suffix: "%", label: d("کاهش کار دستی", "less manual work", "عمل يدوي أقل", "人工减少") },
    ],
  },
  {
    id: "p-bale",
    cat: "ai",
    serviceId: "ai-bale",
    img: IMG.aiBale,
    year: 2025,
    name: d("دستیار هوشمند بله", "Bale Smart Assistant", "مساعد بله الذكي", "Bale 智能助手"),
    blurb: d(
      "چت‌بات فارسی‌زبان روی پیام‌رسان بله که سفارش می‌گیرد، پرداخت را انجام می‌دهد و به سوالات پرتکرار پاسخ می‌دهد.",
      "A Persian-speaking bot on Bale that takes orders, handles payment and answers the questions your team repeats all day.",
      "روبوت على بله يستقبل الطلبات ويتم الدفع ويجيب عن الأسئلة المتكررة.",
      "Bale 上的波斯语机器人：接单、支付并回答重复性问题。",
    ),
    role: d("طراحی مکالمه و توسعه", "Conversation design & build", "تصميم الحوار والتطوير", "对话设计与开发"),
    stack: ["Python", "NLP", "Bale API", "SQLite"],
    highlights: [
      d("درک فارسی محاوره‌ای", "Understands colloquial Persian", "يفهم العامية الفارسية", "理解口语波斯语"),
      d("حافظه شخصی هر کاربر", "Per-user memory", "ذاكرة لكل مستخدم", "按用户记忆"),
      d("اتصال به موجودی انبار", "Live inventory link", "ربط بالمخزون", "库存实时对接"),
    ],
    metrics: [
      { v: 76, suffix: "%", label: d("پاسخ خودکار", "auto-resolved", "رد آلي", "自动解决率") },
      { v: 24, suffix: "/7", label: d("در دسترس", "availability", "توفر", "全天候") },
    ],
  },
  {
    id: "p-sentinel",
    cat: "ai",
    serviceId: "ai-face",
    img: IMG.aiFace,
    year: 2025,
    name: d("سامانه سنتینل", "Sentinel Vision", "نظام سنتينل", "Sentinel 视觉系统"),
    blurb: d(
      "تشخیص چهره بلادرنگ برای حضور و غیاب و کنترل تردد، با گزارش‌گیری و هشدار چهره ناشناس.",
      "Real-time face recognition for attendance and access control, with reporting and unknown-face alerts.",
      "تعرف فوري على الوجوه للحضور والتحكم بالدخول مع تقارير وتنبيهات.",
      "实时人脸识别，用于考勤与门禁，含报表与陌生人告警。",
    ),
    role: d("بینایی ماشین و بک‌اند", "Vision model & backend", "الرؤية الحاسوبية والخلفية", "视觉模型与后端"),
    stack: ["Python", "OpenCV", "Deep Learning", "C++"],
    highlights: [
      d("پردازش زنده روی سخت‌افزار معمولی", "Live on modest hardware", "معالجة حية بأجهزة متواضعة", "普通硬件实时处理"),
      d("ذخیره‌سازی رمزنگاری‌شده", "Encrypted storage", "تخزين مشفّر", "加密存储"),
      d("خروجی گزارش اکسل", "Excel report export", "تصدير تقارير Excel", "Excel 报表导出"),
    ],
    metrics: [
      { v: 97, suffix: "%", label: d("دقت شناسایی", "recognition accuracy", "دقة التعرف", "识别准确率") },
      { v: 30, suffix: "fps", label: d("پردازش زنده", "live processing", "معالجة حية", "实时帧率") },
    ],
  },
  {
    id: "p-cube",
    cat: "game",
    serviceId: "game-voxel",
    img: IMG.gameVoxel,
    year: 2024,
    name: d("دنیای مکعبی کیوب", "Cube Frontier", "عالم كيوب", "Cube Frontier 方块世界"),
    blurb: d(
      "بازی سبک ماینکرفت با زمین رویه‌ای، سیستم ساخت‌وساز و چرخه شب و روز، بهینه برای سیستم‌های ضعیف.",
      "A Minecraft-style voxel game with procedural terrain, building and a day-night cycle, tuned for low-end machines.",
      "لعبة مكعبات بتضاريس توليدية وبناء ودورة ليل ونهار، محسّنة للأجهزة الضعيفة.",
      "我的世界风格体素游戏：程序化地形、建造与昼夜循环，为低配设备优化。",
    ),
    role: d("طراحی بازی و برنامه‌نویسی", "Game design & programming", "تصميم اللعبة وبرمجتها", "游戏设计与编程"),
    stack: ["C#", "Unity", "Shader"],
    highlights: [
      d("چانک‌بندی و استریم نقشه", "Chunked world streaming", "تحميل المقاطع تدريجياً", "区块流式加载"),
      d("کرفتینگ و اینونتوری", "Crafting & inventory", "صناعة ومخزون", "合成与背包"),
      d("ذخیره دنیای بازیکن", "Player world saves", "حفظ عالم اللاعب", "玩家世界存档"),
    ],
    metrics: [
      { v: 60, suffix: "fps", label: d("روی سخت‌افزار متوسط", "on mid hardware", "على أجهزة متوسطة", "中端设备帧率") },
      { v: 9, suffix: "", label: d("زیست‌بوم متفاوت", "distinct biomes", "بيئات مختلفة", "种生态群系") },
    ],
  },
  {
    id: "p-velocity",
    cat: "robot",
    serviceId: "robot-line",
    img: IMG.robotLine,
    year: 2024,
    name: d("ربات مسیریاب ولوسیتی", "Velocity Line Racer", "روبوت فيلوسيتي", "Velocity 循线赛车"),
    blurb: d(
      "ربات مسابقه‌ای مسیریاب با کالیبراسیون خودکار و کنترل PID؛ طراحی‌شده برای پیچ‌های نود درجه.",
      "A competition line-follower with auto calibration and PID control, engineered for ninety-degree corners.",
      "روبوت مسابقات بمعايرة تلقائية وتحكم PID، مصمم للمنعطفات القائمة.",
      "竞赛循线机器人：自动标定与 PID 控制，专为直角弯设计。",
    ),
    role: d("مکانیک، مدار و فرم‌ور", "Mechanics, circuit & firmware", "الميكانيك والدائرة والبرمجيات", "机械、电路与固件"),
    stack: ["Arduino", "C++", "IR Array", "PID"],
    highlights: [
      d("کالیبراسیون خودکار سطح", "Auto surface calibration", "معايرة تلقائية للسطح", "自动地面标定"),
      d("تله‌متری بلوتوثی", "Bluetooth telemetry", "قياس عن بعد بالبلوتوث", "蓝牙遥测"),
      d("شاسی سبک پرینت سه‌بعدی", "Lightweight 3D-printed chassis", "هيكل مطبوع ثلاثي الأبعاد", "轻量 3D 打印底盘"),
    ],
    metrics: [
      { v: 2, suffix: "×", label: d("سریع‌تر از نسخه اول", "faster than v1", "أسرع من النسخة الأولى", "较初版提速") },
      { v: 90, suffix: "°", label: d("پیچ بدون خطا", "corners, no misses", "منعطفات بلا أخطاء", "直角零失误") },
    ],
  },
  {
    id: "p-lexi",
    cat: "ai",
    serviceId: "ai-gpt",
    img: IMG.aiGpt,
    year: 2025,
    name: d("دستیار دانشی لکسی", "Lexi Knowledge GPT", "ليكسي المعرفي", "Lexi 知识助手"),
    blurb: d(
      "چت‌جی‌پی‌تی خصوصی یک شرکت که کاتالوگ‌ها و قراردادها را می‌خواند و با ذکر منبع پاسخ می‌دهد.",
      "A company-private ChatGPT that ingests catalogs and contracts, then answers every question with a citation.",
      "ChatGPT خاص بشركة يقرأ الكتالوجات والعقود ويجيب مع ذكر المصدر.",
      "企业私有 ChatGPT，读取产品目录与合同，回答附带出处。",
    ),
    role: d("معماری RAG و رابط کاربری", "RAG architecture & UI", "بنية RAG والواجهة", "RAG 架构与界面"),
    stack: ["Python", "OpenAI API", "Embeddings", "React"],
    highlights: [
      d("جست‌وجوی برداری روی اسناد", "Vector search over documents", "بحث متجهي في المستندات", "文档向量检索"),
      d("پاسخ با ارجاع به منبع", "Answers with source links", "إجابات مع المصادر", "带来源的回答"),
      d("کنترل هزینه و کش پاسخ", "Cost control & response cache", "ضبط التكلفة والتخزين المؤقت", "成本控制与缓存"),
    ],
    metrics: [
      { v: 92, suffix: "%", label: d("پاسخ درست", "answer accuracy", "دقة الإجابة", "回答准确率") },
      { v: 60, suffix: "%", label: d("کاهش هزینه توکن", "lower token cost", "تكلفة رموز أقل", "Token 成本下降") },
    ],
  },
  {
    id: "p-nebula",
    cat: "game",
    serviceId: "game-3d",
    img: IMG.game3d,
    year: 2025,
    name: d("نبولا دریفت سه‌بعدی", "Nebula Drift 3D", "نيبولا دريفت", "Nebula Drift 3D"),
    blurb: d(
      "بازی مسابقه‌ای سه‌بعدی در جزیره‌ای شناور، با کنترلر نرم، دوربین سینمایی و نورپردازی حجمی.",
      "A 3D racing game across a floating island, with a smooth controller, cinematic camera and volumetric lighting.",
      "لعبة سباق ثلاثية الأبعاد على جزيرة عائمة، بتحكم سلس وكاميرا سينمائية وإضاءة حجمية.",
      "浮空岛上的 3D 竞速游戏：顺滑操控、电影镜头与体积光照。",
    ),
    role: d("گیم‌پلی، شیدر و بهینه‌سازی", "Gameplay, shaders & optimization", "اللعب والظلال والتحسين", "玩法、着色与优化"),
    stack: ["C#", "Unity", "Blender", "URP"],
    highlights: [
      d("فیزیک دریفت اختصاصی", "Custom drift physics", "فيزياء انجراف مخصصة", "自定义漂移物理"),
      d("نورپردازی و پست‌پروسس", "Lighting & post-processing", "إضاءة ومعالجة لاحقة", "灯光与后期"),
      d("قفل فریم روی موبایل", "Frame-locked on mobile", "ثبات الإطارات على الجوال", "移动端锁帧"),
    ],
    metrics: [
      { v: 60, suffix: "fps", label: d("روی موبایل", "on mobile", "على الجوال", "移动端帧率") },
      { v: 5, suffix: "", label: d("پیست متفاوت", "distinct tracks", "مضامير مختلفة", "条不同赛道") },
    ],
  },
  {
    id: "p-acrobat",
    cat: "robot",
    serviceId: "robot-flip",
    img: IMG.robotFlip,
    year: 2024,
    name: d("ربات آکروبات", "Acrobat Flip Bot", "روبوت أكروبات", "Acrobat 翻腾机器人"),
    blurb: d(
      "ربات نمایشی دوچرخ که پشتک می‌زند و با ژیروسکوپ تعادلش را حفظ می‌کند؛ شاسی سبک و مقاوم به ضربه.",
      "A two-wheeled stunt robot that flips and holds balance with a gyroscope, on a light impact-resistant chassis.",
      "روبوت بعجلتين يشقلب ويحفظ توازنه بالجيروسكوب، بهيكل خفيف مقاوم للصدمات.",
      "双轮特技机器人，依靠陀螺仪翻腾并保持平衡，底盘轻盈抗冲击。",
    ),
    role: d("مکانیک، کنترل و فرم‌ور", "Mechanics, control & firmware", "الميكانيك والتحكم والبرمجيات", "机械、控制与固件"),
    stack: ["Arduino", "C++", "MPU6050", "PID"],
    highlights: [
      d("حلقه کنترل تعادل PID", "PID balance loop", "حلقة توازن PID", "PID 平衡控制环"),
      d("مرکز ثقل مهندسی‌شده", "Engineered center of gravity", "مركز ثقل مدروس", "精算重心"),
      d("کنترل بلوتوثی از موبایل", "Bluetooth phone control", "تحكم بالبلوتوث", "手机蓝牙控制"),
    ],
    metrics: [
      { v: 360, suffix: "°", label: d("چرخش کامل", "full flip", "دوران كامل", "完整翻转") },
      { v: 12, suffix: "", label: d("فرود موفق پشت‌سرهم", "clean landings in a row", "هبوطات متتالية ناجحة", "次连续稳定落地") },
    ],
  },
  {
    id: "p-lumen",
    cat: "robot",
    serviceId: "robot-blink",
    img: IMG.robotBlink,
    year: 2024,
    name: d("ربات نورانی لومن", "Lumen Light Bot", "روبوت لومن الضوئي", "Lumen 灯光机器人"),
    blurb: d(
      "ربات آموزشی چشمک‌زن با LED آدرس‌پذیر که نور را با ریتم موسیقی هماهنگ می‌کند؛ کیت کامل با مستندات.",
      "A teaching blink-bot with addressable LEDs that sync light to music, shipped as a documented kit.",
      "روبوت تعليمي بمصابيح قابلة للعنونة يزامن الضوء مع الموسيقى، ضمن طقم موثق.",
      "教学闪灯机器人，可寻址 LED 随音乐同步，附完整文档套件。",
    ),
    role: d("مدار، فرم‌ور و آموزش", "Circuit, firmware & teaching", "الدائرة والبرمجيات والتعليم", "电路、固件与教学"),
    stack: ["Arduino", "C++", "WS2812", "PWM"],
    highlights: [
      d("الگوهای ریتمیک صوتی", "Sound-reactive patterns", "أنماط تتفاعل مع الصوت", "声音联动灯效"),
      d("کنترل با اپ موبایل", "Mobile app control", "تحكم عبر التطبيق", "手机 App 控制"),
      d("مستندات آموزشی گام‌به‌گام", "Step-by-step lessons", "دروس خطوة بخطوة", "分步教学文档"),
    ],
    metrics: [
      { v: 24, suffix: "", label: d("الگوی نوری", "light patterns", "نمط ضوئي", "种灯效") },
      { v: 8, suffix: "", label: d("درس کارگاهی", "workshop lessons", "دروس ورشة", "节工作坊课程") },
    ],
  },
];