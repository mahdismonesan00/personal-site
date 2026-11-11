import type { Loc } from "../lib/i18n";
import { IMG } from "./images";

export type Cat = "web" | "ai" | "game" | "robot";

export interface Service {
  id: string;
  cat: Cat;
  img: string;
  title: Loc;
  tagline: Loc;
  body: Loc;
  features: Loc[];
  stack: string[];
  weeks: [number, number];
}

export const CATEGORIES: { id: Cat; label: Loc; color: string; icon: string }[] = [
  {
    id: "web",
    color: "#3be8ff",
    icon: "code",
    label: { fa: "طراحی سایت", en: "Web design", ar: "تصميم المواقع", zh: "网站设计" },
  },
  {
    id: "ai",
    color: "#ff2e88",
    icon: "brain",
    label: { fa: "هوش مصنوعی", en: "Artificial intelligence", ar: "الذكاء الاصطناعي", zh: "人工智能" },
  },
  {
    id: "game",
    color: "#a6f04a",
    icon: "game",
    label: { fa: "بازی‌سازی", en: "Game development", ar: "تطوير الألعاب", zh: "游戏开发" },
  },
  {
    id: "robot",
    color: "#ffb627",
    icon: "chip",
    label: { fa: "رباتیک", en: "Robotics", ar: "الروبوتات", zh: "机器人" },
  },
];

const d = (fa: string, en: string, ar: string, zh: string): Loc => ({ fa, en, ar, zh });

export const SERVICES: Service[] = [
  {
    id: "web-shop",
    cat: "web",
    img: IMG.webEcommerce,
    title: d("سایت فروشگاهی", "E-commerce store", "متجر إلكتروني", "电商商城"),
    tagline: d("فروشی که هرگز نمی‌خوابد", "A shop that never sleeps", "متجر لا ينام أبداً", "永不打烊的商店"),
    body: d(
      "فروشگاهی که فقط ویترین نیست؛ موتور فروش است. سبد خرید روان، درگاه پرداخت امن، مدیریت موجودی و پنل فروشنده‌ای که هر عدد را نشانت می‌دهد. سرعت بارگذاری زیر دو ثانیه و ساختاری که گوگل عاشقش می‌شود.",
      "Not a showcase — a selling engine. Frictionless cart, secure payment gateway, live inventory and a seller panel that shows you every number. Sub-two-second loads and a structure search engines love.",
      "ليس مجرد واجهة بل محرك مبيعات. سلة شراء سلسة، بوابة دفع آمنة، مخزون محدّث ولوحة بائع تعرض كل رقم. تحميل أقل من ثانيتين وبنية تعشقها محركات البحث.",
      "不只是展示，而是销售引擎。流畅购物车、安全支付网关、实时库存与一目了然的卖家面板。两秒内加载，结构对搜索引擎极其友好。",
    ),
    features: [
      d("درگاه پرداخت و کیف پول", "Payment gateway & wallet", "بوابة دفع ومحفظة", "支付网关与钱包"),
      d("پنل مدیریت محصولات و سفارش‌ها", "Product & order dashboard", "لوحة المنتجات والطلبات", "商品与订单面板"),
      d("سئوی فنی و اسکیما محصول", "Technical SEO & product schema", "سيو تقني وبيانات منظمة", "技术 SEO 与商品结构化数据"),
    ],
    stack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    weeks: [2, 3],
  },
  {
    id: "web-corp",
    cat: "web",
    img: IMG.webCorporate,
    title: d("سایت شرکتی", "Corporate website", "موقع شركة", "企业官网"),
    tagline: d("اعتبار برند در یک آدرس", "Your credibility, one URL", "هيبة علامتك في رابط واحد", "一个网址，承载品牌信誉"),
    body: d(
      "روایت برندت را به یک تجربه بصری تبدیل می‌کنم: معرفی خدمات، تیم، دستاوردها و فرم جذب مشتری. چندزبانه، ریسپانسیو و آماده جلسه هیئت‌مدیره — سایتی که وقتی آدرسش را می‌دهی، مکالمه عوض می‌شود.",
      "Your brand story turned into a visual experience: services, team, achievements and lead capture. Multilingual, responsive and boardroom-ready — the kind of site that changes the conversation when you share the link.",
      "أحوّل قصة علامتك إلى تجربة بصرية: الخدمات، الفريق، الإنجازات ونماذج جذب العملاء. متعدد اللغات ومتجاوب وجاهز لاجتماع مجلس الإدارة.",
      "把品牌故事变成视觉体验：服务、团队、成果与获客表单。多语言、响应式、可直接用于董事会演示——分享链接的那一刻，对话就变了。",
    ),
    features: [
      d("چندزبانه با RTL کامل", "Multilingual with full RTL", "متعدد اللغات بدعم RTL", "多语言与完整 RTL"),
      d("انیمیشن اسکرول سینمایی", "Cinematic scroll animation", "حركات تمرير سينمائية", "电影感滚动动画"),
      d("پنل مدیریت محتوا", "Content management panel", "لوحة إدارة المحتوى", "内容管理后台"),
    ],
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
    weeks: [2, 3],
  },
  {
    id: "web-resume",
    cat: "web",
    img: IMG.webResume,
    title: d("سایت رزومه شخصی", "Personal résumé site", "موقع سيرة ذاتية", "个人简历网站"),
    tagline: d("رزومه‌ای که فراموش نمی‌شود", "A résumé nobody forgets", "سيرة لا تُنسى", "让人过目不忘的简历"),
    body: d(
      "یک صفحه، هزار برابر قوی‌تر از PDF. تایم‌لاین افتخارات، نمونه‌کار زنده، توصیه‌نامه‌ها و دکمه تماس مستقیم؛ با میکروانیمیشن‌هایی که استخدام‌کننده را تا انتها نگه می‌دارد.",
      "One page, a thousand times stronger than a PDF. Achievement timeline, living portfolio, testimonials and a direct contact button — with micro-interactions that keep a recruiter reading to the end.",
      "صفحة واحدة أقوى بألف مرة من ملف PDF. خط زمني للإنجازات، أعمال حية، توصيات وزر تواصل مباشر مع تفاعلات دقيقة تُبقي القارئ حتى النهاية.",
      "一个页面，胜过千份 PDF。成就时间线、动态作品集、推荐信与直接联系按钮，配合微交互让招聘者读到最后。",
    ),
    features: [
      d("تایم‌لاین افتخارات و مدارک", "Honors & certificates timeline", "خط زمني للشهادات", "荣誉与证书时间线"),
      d("حالت روشن/تاریک اختصاصی", "Custom light / dark modes", "وضع ليلي ونهاري مخصص", "定制明暗模式"),
      d("دانلود رزومه با یک کلیک", "One-click résumé download", "تحميل السيرة بنقرة", "一键下载简历"),
    ],
    stack: ["HTML", "CSS", "JavaScript", "React"],
    weeks: [1, 2],
  },
  {
    id: "web-custom",
    cat: "web",
    img: IMG.webCustom,
    title: d("سایت اختصاصی، صفر تا صد", "Bespoke platform, 0 → 100", "منصة مخصصة من الصفر", "定制平台，从零到百"),
    tagline: d("وقتی قالب‌ها تمام می‌شوند، کد شروع می‌شود", "Where templates end, code begins", "حيث تنتهي القوالب يبدأ الكود", "模板止步之处，代码开始"),
    body: d(
      "وقتی هیچ قالبی جواب نمی‌دهد، از خط اول کد شروع می‌کنیم. معماری دیتابیس، API اختصاصی، احراز هویت، داشبورد نقش‌محور و تست بار — محصولی که مالک صد درصد کدش هستی.",
      "When no template fits, we start at line one. Database architecture, custom API, authentication, role-based dashboards and load testing — a product whose source code you fully own.",
      "حين لا يناسبك أي قالب، نبدأ من السطر الأول. بنية قاعدة بيانات، واجهة برمجية خاصة، مصادقة، لوحات حسب الصلاحيات واختبار أداء — منتج تملك شفرته بالكامل.",
      "当模板无法满足，就从第一行代码开始。数据库架构、专属 API、身份认证、角色化仪表盘与压力测试——源码 100% 归你所有。",
    ),
    features: [
      d("بک‌اند و API اختصاصی", "Custom backend & API", "خلفية وواجهة برمجية خاصة", "定制后端与 API"),
      d("احراز هویت و سطح دسترسی", "Auth & role permissions", "مصادقة وصلاحيات", "认证与角色权限"),
      d("مستندات و آموزش تحویل", "Docs & handover training", "توثيق وتدريب عند التسليم", "文档与交付培训"),
    ],
    stack: ["JavaScript", "PHP", "Python", "MySQL", "REST"],
    weeks: [3, 6],
  },
  {
    id: "ai-bale",
    cat: "ai",
    img: IMG.aiBale,
    title: d("چت‌بات شخصی پیام‌رسان بله", "Personal chatbot for Bale", "روبوت محادثة لمنصة بله", "Bale 专属聊天机器人"),
    tagline: d("دستیار فارسی‌زبان، داخل بله", "A Persian-native assistant inside Bale", "مساعد فارسي داخل بله", "Bale 内的波斯语助手"),
    body: d(
      "بات اختصاصی روی پیام‌رسان بله با درک کامل فارسی محاوره‌ای: پاسخ به مشتریان، ثبت سفارش، پرداخت درون‌چت و اتصال به دیتابیس کسب‌وکارت. حافظه گفتگو دارد و لحن برندت را یاد می‌گیرد.",
      "A dedicated bot on the Bale messenger that truly understands conversational Persian: customer support, order capture, in-chat payment and a live link to your business database. It keeps memory and learns your brand voice.",
      "روبوت مخصص على منصة بله يفهم الفارسية العامية: دعم العملاء، تسجيل الطلبات، الدفع داخل المحادثة والربط بقاعدة بيانات نشاطك، مع ذاكرة حوار ونبرة علامتك.",
      "Bale 平台专属机器人，真正理解口语波斯语：客户支持、下单、聊天内支付并连接你的业务数据库。具备对话记忆，学习你的品牌语气。",
    ),
    features: [
      d("پرداخت درون‌چت بله", "In-chat Bale payments", "دفع داخل محادثة بله", "Bale 聊天内支付"),
      d("حافظه گفتگو برای هر کاربر", "Per-user conversation memory", "ذاكرة حوار لكل مستخدم", "按用户保存对话记忆"),
      d("پنل آمار و لاگ پیام‌ها", "Analytics & message logs", "لوحة إحصاءات وسجلات", "统计与消息日志面板"),
    ],
    stack: ["Python", "Bale API", "NLP", "SQLite"],
    weeks: [2, 3],
  },
  {
    id: "ai-global",
    cat: "ai",
    img: IMG.aiGlobal,
    title: d("چت‌بات شخصی بین‌المللی", "International personal chatbot", "روبوت محادثة دولي", "国际版个人聊天机器人"),
    tagline: d("یک مغز، چهار زبان، همه پلتفرم‌ها", "One brain, four languages, every platform", "عقل واحد وأربع لغات", "一个大脑，四种语言"),
    body: d(
      "همان دستیار، این‌بار جهانی: تلگرام، واتس‌اپ، دیسکورد و وب. تشخیص زبان خودکار، پاسخ چندزبانه، منطقه زمانی کاربر و شخصیت قابل تنظیم — آماده فروش و پشتیبانی در هر قاره.",
      "The same assistant, now global: Telegram, WhatsApp, Discord and web. Automatic language detection, multilingual replies, user time zones and a tunable personality — ready to sell and support on any continent.",
      "المساعد نفسه لكن عالمياً: تلغرام وواتساب وديسكورد والويب. كشف تلقائي للغة، وردود متعددة اللغات، ومراعاة المناطق الزمنية وشخصية قابلة للضبط.",
      "同一个助手，走向全球：Telegram、WhatsApp、Discord 与网页。自动语言识别、多语回复、时区适配与可调人格，随时在任何大洲销售与支持。",
    ),
    features: [
      d("تشخیص و پاسخ چندزبانه", "Auto language detection", "كشف اللغة والرد بها", "自动语言识别"),
      d("استقرار روی چند پیام‌رسان", "Deploy across messengers", "نشر على عدة منصات", "多平台部署"),
      d("وب‌هوک و اتصال به CRM", "Webhooks & CRM sync", "ويب هوك وربط CRM", "Webhook 与 CRM 对接"),
    ],
    stack: ["Python", "FastAPI", "LLM", "Docker"],
    weeks: [2, 4],
  },
  {
    id: "ai-gpt",
    cat: "ai",
    img: IMG.aiGpt,
    title: d("چت جی‌پی‌تی اختصاصی", "Your own ChatGPT", "ChatGPT الخاص بك", "专属 ChatGPT"),
    tagline: d("مدلی که اسناد تو را می‌خواند", "A model that reads your documents", "نموذج يقرأ مستنداتك", "会读你文档的模型"),
    body: d(
      "یک ChatGPT خصوصی با دانش کسب‌وکار خودت: اسناد، کاتالوگ و سوالات پرتکرار را می‌بلعد و با ذکر منبع جواب می‌دهد. تاریخچه امن، محدودیت دسترسی و رابط کاربری با برند تو.",
      "A private ChatGPT trained on your business knowledge: it ingests documents, catalogs and FAQs, then answers with citations. Secure history, access limits and an interface wearing your brand.",
      "ChatGPT خاص يعرف نشاطك: يستوعب المستندات والكتالوجات والأسئلة الشائعة ويجيب مع ذكر المصدر، مع سجل آمن وصلاحيات وواجهة بهوية علامتك.",
      "属于你自己的私有 ChatGPT：吸收文档、产品目录与常见问题，并附带出处作答。安全历史记录、访问权限与品牌化界面。",
    ),
    features: [
      d("پایگاه دانش با جست‌وجوی برداری", "Vector-search knowledge base", "قاعدة معرفة بحث متجهي", "向量检索知识库"),
      d("پاسخ همراه با منبع", "Answers with citations", "إجابات مع المصادر", "带出处的回答"),
      d("کنترل هزینه توکن", "Token cost controls", "ضبط تكلفة الرموز", "Token 成本控制"),
    ],
    stack: ["Python", "OpenAI API", "Embeddings", "React"],
    weeks: [2, 3],
  },
  {
    id: "ai-face",
    cat: "ai",
    img: IMG.aiFace,
    title: d("تشخیص چهره", "Face recognition", "التعرف على الوجوه", "人脸识别"),
    tagline: d("بینایی ماشین، در زمان واقعی", "Machine vision, in real time", "رؤية حاسوبية فورية", "实时机器视觉"),
    body: d(
      "سیستم تشخیص و شناسایی چهره برای حضور و غیاب، کنترل تردد یا امنیت فروشگاه. پردازش زنده ویدیو، ثبت ورود و خروج، هشدار چهره ناشناس و گزارش‌گیری — با ذخیره‌سازی محرم و رمزنگاری‌شده.",
      "Face detection and recognition for attendance, access control or retail security. Live video processing, entry logs, unknown-face alerts and reporting — with private, encrypted storage.",
      "نظام كشف والتعرف على الوجوه للحضور أو التحكم بالدخول أو أمن المتاجر، مع معالجة فيديو حية وسجلات وتنبيهات للوجوه الغريبة وتخزين مشفّر.",
      "用于考勤、门禁或零售安防的人脸检测与识别系统。实时视频处理、出入记录、陌生人告警与报表，数据本地加密存储。",
    ),
    features: [
      d("تشخیص زنده با وب‌کم", "Live webcam detection", "كشف حي عبر الكاميرا", "摄像头实时检测"),
      d("گزارش حضور و غیاب", "Attendance reporting", "تقارير الحضور", "考勤报表"),
      d("هشدار چهره ناشناس", "Unknown-face alerts", "تنبيه الوجوه الغريبة", "陌生人脸告警"),
    ],
    stack: ["Python", "OpenCV", "Deep Learning", "C++"],
    weeks: [2, 4],
  },
  {
    id: "game-custom",
    cat: "game",
    img: IMG.gameCustom,
    title: d("بازی اختصاصی، صفر تا صد", "Custom game, 0 → 100", "لعبة مخصصة بالكامل", "定制游戏，从零到百"),
    tagline: d("ایده‌ات را بازی می‌کنیم", "Your idea, made playable", "نحوّل فكرتك إلى لعبة", "把想法变成可玩的游戏"),
    body: d(
      "از یک جمله ایده تا فایل نصبی. طراحی مکانیک، لوپ بازی، اقتصاد درون‌برنامه، مراحل، صدا و رابط کاربری؛ همه با تعادل تست‌شده تا بازیکن بار دوم هم برگردد.",
      "From one sentence of an idea to an installable build. Mechanics design, core loop, in-game economy, levels, sound and UI — all play-tested for balance so players come back for round two.",
      "من جملة واحدة إلى ملف تثبيت. تصميم الآليات وحلقة اللعب والاقتصاد الداخلي والمراحل والصوت والواجهة، مع اختبار توازن يعيد اللاعب مرة أخرى.",
      "从一句想法到可安装成品。机制设计、核心循环、内购经济、关卡、音效与界面，全部经过平衡测试，让玩家愿意再来一局。",
    ),
    features: [
      d("سند طراحی بازی (GDD)", "Game design document", "وثيقة تصميم اللعبة", "游戏设计文档"),
      d("سیستم امتیاز و پیشرفت", "Score & progression system", "نظام نقاط وتقدم", "计分与成长系统"),
      d("خروجی موبایل و دسکتاپ", "Mobile & desktop builds", "نسخ للجوال والحاسوب", "移动端与桌面端构建"),
    ],
    stack: ["C#", "Unity", "Blender", "FMOD"],
    weeks: [4, 8],
  },
  {
    id: "game-voxel",
    cat: "game",
    img: IMG.gameVoxel,
    title: d("بازی سبک ماینکرفت", "Minecraft-style voxel game", "لعبة بأسلوب ماينكرافت", "我的世界风格体素游戏"),
    tagline: d("دنیا را مکعب‌مکعب بساز", "Build the world, cube by cube", "ابن العالم مكعباً مكعباً", "一格一格，搭建世界"),
    body: d(
      "دنیای مکعبی بی‌پایان با تولید رویه‌ای زمین، ساخت‌وساز، کرفتینگ و چرخه شب و روز. چانک‌ها بهینه بارگذاری می‌شوند تا حتی روی سیستم ضعیف هم روان بماند.",
      "An endless cube world with procedural terrain, building, crafting and a day-night cycle. Chunks stream in efficiently so it stays smooth even on modest hardware.",
      "عالم مكعبات لا نهائي بتضاريس توليدية، وبناء وحِرفة ودورة ليل ونهار، مع تحميل ذكي للمقاطع ليبقى سلساً على الأجهزة المتواضعة.",
      "无限方块世界：程序化地形、建造、合成与昼夜循环。区块高效流式加载，低配设备也依然流畅。",
    ),
    features: [
      d("تولید رویه‌ای نقشه", "Procedural world generation", "توليد عوالم إجرائي", "程序化世界生成"),
      d("سیستم ساخت و کرفتینگ", "Building & crafting system", "نظام بناء وصناعة", "建造与合成系统"),
      d("ذخیره و بارگذاری دنیا", "World save & load", "حفظ وتحميل العالم", "世界存档与读取"),
    ],
    stack: ["C#", "Unity", "Shader", "Noise"],
    weeks: [5, 9],
  },
  {
    id: "game-granny",
    cat: "game",
    img: IMG.gameGranny,
    title: d("بازی سبک گرنی (ترسناک)", "Granny-style horror game", "لعبة رعب بأسلوب Granny", "恐怖逃脱游戏（Granny 风格）"),
    tagline: d("فرار کن، اگر جراتش را داری", "Escape — if you dare", "اهرب إن تجرأت", "有胆量就逃出去"),
    body: d(
      "خانه‌ای که نفس می‌کشد و دشمنی که صدا را دنبال می‌کند. هوش مصنوعی تعقیب، معماهای قفل و کلید، جامپ‌اسکیرهای زمان‌بندی‌شده و صدای سه‌بعدی — ترسی که با طراحی ساخته می‌شود، نه با شانس.",
      "A house that breathes and an enemy that follows sound. Pursuit AI, lock-and-key puzzles, timed jump scares and 3D audio — fear built by design, not by luck.",
      "منزل يتنفس وعدو يتتبع الصوت. ذكاء مطاردة، ألغاز أقفال ومفاتيح، ومفاجآت مرعبة بتوقيت دقيق وصوت ثلاثي الأبعاد — خوف مصمّم لا صدفة.",
      "会呼吸的房子，循声而来的敌人。追踪 AI、锁与钥匙谜题、精准定时的惊吓与 3D 音效——恐惧来自设计，而非运气。",
    ),
    features: [
      d("هوش مصنوعی تعقیب و شنوایی", "Pursuit & hearing AI", "ذكاء مطاردة وسمع", "追踪与听觉 AI"),
      d("معما و سیستم آیتم", "Puzzles & inventory", "ألغاز ونظام أغراض", "谜题与道具系统"),
      d("صدای سه‌بعدی و اتمسفر", "3D audio atmosphere", "صوت ثلاثي الأبعاد", "3D 音效氛围"),
    ],
    stack: ["C#", "Unity", "NavMesh", "Audio"],
    weeks: [4, 7],
  },
  {
    id: "game-3d",
    cat: "game",
    img: IMG.game3d,
    title: d("بازی‌های سه‌بعدی", "3D games", "ألعاب ثلاثية الأبعاد", "3D 游戏"),
    tagline: d("عمق، نور، حرکت", "Depth, light, motion", "عمق وضوء وحركة", "纵深、光影与运动"),
    body: d(
      "مدل‌سازی، نورپردازی و بهینه‌سازی برای دنیایی که عمق دارد. کنترلر شخصیت نرم، دوربین سینمایی، فیزیک واقعی و رندر روان با پروفایلینگ روی سخت‌افزار هدف.",
      "Modeling, lighting and optimization for a world with depth. Smooth character controller, cinematic camera, believable physics and a stable frame rate profiled on target hardware.",
      "نمذجة وإضاءة وتحسين لعالم ذي عمق. تحكم سلس بالشخصية وكاميرا سينمائية وفيزياء واقعية وأداء ثابت مقاس على الجهاز المستهدف.",
      "建模、灯光与优化，构建有纵深感的世界。顺滑角色控制、电影级镜头、真实物理，并在目标硬件上做性能分析确保帧率稳定。",
    ),
    features: [
      d("مدل و متریال اختصاصی", "Custom models & materials", "نماذج وخامات خاصة", "定制模型与材质"),
      d("نورپردازی و پست‌پروسس", "Lighting & post-processing", "إضاءة ومعالجة لاحقة", "灯光与后期处理"),
      d("بهینه‌سازی FPS", "FPS optimization", "تحسين معدل الإطارات", "帧率优化"),
    ],
    stack: ["C#", "Unity", "Blender", "URP"],
    weeks: [5, 10],
  },
  {
    id: "game-online",
    cat: "game",
    img: IMG.gameOnline,
    title: d("بازی‌های آنلاین", "Online multiplayer games", "ألعاب جماعية عبر الإنترنت", "在线多人游戏"),
    tagline: d("رقیب واقعی، آن‌سوی دنیا", "Real rivals, one world away", "خصوم حقيقيون حول العالم", "真实对手，跨越世界"),
    body: d(
      "چندنفره واقعی با سرور اختصاصی: همگام‌سازی وضعیت، پیش‌بینی سمت کلاینت، لابی، رتبه‌بندی و ضدتقلب. تاخیر پایین، حتی وقتی بازیکن‌ها در سه قاره‌اند.",
      "Real multiplayer with a dedicated server: state sync, client-side prediction, lobbies, ranking and anti-cheat. Low latency even when your players sit on three continents.",
      "لعب جماعي حقيقي بخادم مخصص: مزامنة الحالة، وتنبؤ من جهة العميل، وردهات وتصنيف ومكافحة غش، مع زمن استجابة منخفض عبر القارات.",
      "真正的多人对战与专用服务器：状态同步、客户端预测、大厅、排行榜与反作弊。哪怕玩家分布在三大洲，延迟依然很低。",
    ),
    features: [
      d("سرور و همگام‌سازی بلادرنگ", "Realtime server & sync", "خادم ومزامنة فورية", "实时服务器与同步"),
      d("لابی، مچ‌میکینگ و رنک", "Lobby, matchmaking, ranks", "ردهات ومطابقة وتصنيف", "大厅、匹配与排位"),
      d("ضدتقلب و اعتبارسنجی سرور", "Anti-cheat & server validation", "مكافحة الغش والتحقق", "反作弊与服务端校验"),
    ],
    stack: ["C#", "Node.js", "WebSocket", "Redis"],
    weeks: [6, 12],
  },
  {
    id: "robot-flip",
    cat: "robot",
    img: IMG.robotFlip,
    title: d("ربات معلق‌زن", "Acrobatic flip robot", "روبوت الشقلبة البهلواني", "翻腾特技机器人"),
    tagline: d("فیزیک را به چالش بکش", "Challenge physics, land clean", "تحد الفيزياء واهبط بثبات", "挑战物理，稳稳落地"),
    body: d(
      "ربات نمایشی با مرکز ثقل مهندسی‌شده که پشتک می‌زند و روی دو چرخ تعادلش را حفظ می‌کند. کنترل PID با ژیروسکوپ، شاسی سبک و موتورهایی که ضربه فرود را تحمل می‌کنند.",
      "A stunt robot with an engineered center of gravity that flips and balances on two wheels. Gyroscope-driven PID control, a lightweight chassis and motors built to survive the landing.",
      "روبوت استعراضي بمركز ثقل مدروس يشقلب ويتوازن على عجلتين، بتحكم PID وجيروسكوب وهيكل خفيف ومحركات تتحمل صدمة الهبوط.",
      "重心经过工程设计的特技机器人，可翻腾并用双轮保持平衡。陀螺仪 PID 控制、轻量底盘与能承受落地冲击的电机。",
    ),
    features: [
      d("کنترل تعادل با ژیروسکوپ", "Gyro-stabilized balance", "توازن بالجيروسكوب", "陀螺仪平衡控制"),
      d("شاسی مقاوم به ضربه", "Impact-resistant chassis", "هيكل مقاوم للصدمات", "抗冲击底盘"),
      d("کنترل بی‌سیم با اپ", "Wireless app control", "تحكم لاسلكي بالتطبيق", "无线 App 控制"),
    ],
    stack: ["Arduino", "C++", "MPU6050", "PID"],
    weeks: [3, 5],
  },
  {
    id: "robot-line",
    cat: "robot",
    img: IMG.robotLine,
    title: d("ربات لاین‌فالوئر (مسیریاب)", "Line-following robot", "روبوت تتبع الخط", "循线机器人"),
    tagline: d("خط را گم نمی‌کند", "It never loses the line", "لا يفقد الخط أبداً", "永不丢线"),
    body: d(
      "ربات مسابقه‌ای که خط را گم نمی‌کند. آرایه سنسور مادون قرمز، کالیبراسیون خودکار سطح و الگوریتم PID برای پیچ‌های تند — ساخته‌شده برای پادیوم، نه فقط برای دمو.",
      "A competition robot that never loses the line. Infrared sensor array, automatic surface calibration and a PID algorithm tuned for sharp corners — built for the podium, not just the demo.",
      "روبوت مسابقات لا يفقد الخط أبداً. مصفوفة حساسات تحت الحمراء، ومعايرة تلقائية للسطح وخوارزمية PID للمنعطفات الحادة — صُنع للمنصة لا للعرض.",
      "从不丢线的竞赛机器人。红外传感器阵列、自动地面标定与针对急弯调校的 PID 算法——为领奖台而生，而不只是演示。",
    ),
    features: [
      d("کالیبراسیون خودکار سنسور", "Auto sensor calibration", "معايرة تلقائية", "传感器自动标定"),
      d("PID برای پیچ‌های تند", "PID tuned for sharp turns", "PID للمنعطفات الحادة", "急弯 PID 调校"),
      d("لاگ تله‌متری سرعت", "Speed telemetry logging", "ثبت تله‌متری سرعت", "速度遥测记录"),
    ],
    stack: ["Arduino", "C++", "IR Array", "L298N"],
    weeks: [2, 4],
  },
  {
    id: "robot-blink",
    cat: "robot",
    img: IMG.robotBlink,
    title: d("ربات چشمک‌زن (نورپردازی)", "Blinking light-show robot", "روبوت العروض الضوئية", "闪灯灯光秀机器人"),
    tagline: d("نوری که با ریتم فکر می‌کند", "Light that thinks in rhythm", "ضوء يفكر بالإيقاع", "随节奏思考的光"),
    body: d(
      "اولین ربات هر مخترع، اما این‌بار حرفه‌ای: آرایه LED آدرس‌پذیر، الگوهای ریتمیک هماهنگ با موسیقی و کنترل از راه دور. یک قطعه نمایشی که مفاهیم تایمر، PWM و مدار را واقعاً جا می‌اندازد.",
      "Every inventor's first robot — done properly. Addressable LED arrays, music-reactive rhythmic patterns and remote control. A showpiece that truly teaches timers, PWM and circuit design.",
      "أول روبوت لكل مخترع لكن بإتقان: مصفوفة LED قابلة للعنونة وأنماط إيقاعية تتفاعل مع الموسيقى وتحكم عن بعد، يجسّد مفاهيم المؤقتات وPWM والدوائر.",
      "每位发明者的第一台机器人，但做到专业级：可寻址 LED 阵列、随音乐律动的节奏灯效与远程控制，真正讲透定时器、PWM 与电路。",
    ),
    features: [
      d("LED آدرس‌پذیر و افکت رنگی", "Addressable RGB effects", "مؤثرات LED ملونة", "可寻址 RGB 灯效"),
      d("هماهنگی نور با صدا", "Sound-reactive patterns", "أنماط تتفاعل مع الصوت", "声音联动灯效"),
      d("کیت آموزشی و مستندات", "Learning kit & docs", "طقم تعليمي وتوثيق", "教学套件与文档"),
    ],
    stack: ["Arduino", "C++", "WS2812", "PWM"],
    weeks: [1, 2],
  },
];

export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);