import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Eye,
  Globe2,
  Images,
  Menu,
  Move,
  RotateCcw,
  Search,
  ShieldCheck,
  Target,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

/** Saudi editorial portfolio — Arabic-first reading, documented evidence, and direct project storytelling without unverified claims. */

type Frame = { src: string; alt: string; label: string; tone?: "wide" | "tall" | "document" };
type Point = { x: number; y: number };
type CaseStudy = {
  id: string;
  title: string;
  type: string;
  url: string;
  cover: string;
  accent: string;
  excerpt: string;
  thesis: string;
  detail: string;
  proofNote?: string;
  frames: Frame[];
};

const assets = {
  logo: "/portfolio/brand/nasharhub-logo.png",
  mark: "/portfolio/brand/nasharhub-mark.png",
  hero: "/portfolio/brand/nasharhub-hero.png",
  orbit: "/portfolio/brand/nasharhub-growth-orbit.png",
  arkan: {
    home: "/portfolio/actual_home_browser.jpg",
    services: "/portfolio/actual_services_browser.jpg",
    gallery: "/portfolio/actual_gallery_browser.jpg",
    screens: "/portfolio/actual_screens_board.jpg",
    desktop: "/portfolio/mockup_desktop.jpg",
    mobile: "/portfolio/mockup_mobile.jpg",
    features: "/portfolio/feature_board.jpg",
    tents: [
      "/portfolio/tent_interior.jpg",
      "/portfolio/tent_luxury.jpg",
      "/portfolio/tent_night.jpg",
      "/portfolio/tents_palms.jpg",
    ],
  },
  case2: {
    home: "/portfolio/case2/home_browser.jpg",
    services: "/portfolio/case2/services_browser.jpg",
    gallery: "/portfolio/case2/gallery_browser.jpg",
    board: "/portfolio/case2/actual_screens_board.jpg",
    cards: ["/portfolio/case2/screen_card_1.jpg", "/portfolio/case2/screen_card_2.jpg", "/portfolio/case2/screen_card_3.jpg"],
    evidence: "/portfolio/case2/evidence_board.jpg",
    documents: ["/portfolio/case2/evidence_registry.jpg", "/portfolio/case2/evidence_vat.jpg", "/portfolio/case2/evidence_invoice.jpg"],
  },
  case3: {
    home: "/portfolio/case3/home_browser.jpg",
    services: "/portfolio/case3/services_browser.jpg",
    gallery: "/portfolio/case3/services_gallery_browser.jpg",
    board: "/portfolio/case3/actual_screens_board.jpg",
    cards: ["/portfolio/case3/screen_card_1.jpg", "/portfolio/case3/screen_card_2.jpg", "/portfolio/case3/screen_card_3.jpg"],
    evidence: "/portfolio/case3/evidence_board.jpg",
    documents: ["/portfolio/case3/evidence_registry.jpg", "/portfolio/case3/evidence_vat.jpg", "/portfolio/case3/evidence_qiwa.jpg", "/portfolio/case3/evidence_address.jpg"],
  },
  case4: {
    home: "/portfolio/case4/home_browser.jpg",
    secondary: "/portfolio/case4/secondary_browser.jpg",
    board: "/portfolio/case4/actual_screens_board.jpg",
    cards: ["/portfolio/case4/case4_screen_card_1.jpg", "/portfolio/case4/case4_screen_card_2.jpg"],
    evidence: "/portfolio/case4/evidence_board.jpg",
    documents: ["/portfolio/case4/evidence_cert_01.jpg", "/portfolio/case4/evidence_cert_02.jpg", "/portfolio/case4/evidence_cert_03.jpg", "/portfolio/case4/evidence_cert_04.jpg"],
  },
  case5: {
    home: "/portfolio/case5/home_browser.jpg",
    secondary: "/portfolio/case5/secondary_browser.jpg",
    board: "/portfolio/case5/actual_screens_board.jpg",
    cards: ["/portfolio/case5/case5_screen_card_1.jpg", "/portfolio/case5/case5_screen_card_2.jpg"],
  },
  case6: {
    home: "/portfolio/case6/home_browser.jpg",
    secondary: "/portfolio/case6/secondary_browser.jpg",
    board: "/portfolio/case6/actual_screens_board.jpg",
    cards: ["/portfolio/case6/case6_screen_card_1.jpg", "/portfolio/case6/case6_screen_card_2.jpg"],
  },
  seo: {
    growth: "/portfolio/seo/rosette_clean/search_console_growth.png",
    compare: "/portfolio/seo/rosette_clean/search_console_compare.png",
    sixMonths: "/portfolio/seo/rosette_clean/search_console_six_months.png",
    structure: "/portfolio/seo/rosette_clean/search_result_structure.png",
    boards: ["/portfolio/seo/search_visibility_board_01.jpg", "/portfolio/seo/search_visibility_board_02.jpg", "/portfolio/seo/search_visibility_board_03.jpg"],
    panels: [
      "/portfolio/seo/search_visibility_01.jpg", "/portfolio/seo/search_visibility_02.jpg", "/portfolio/seo/search_visibility_03.jpg", "/portfolio/seo/search_visibility_04.jpg", "/portfolio/seo/search_visibility_05.jpg", "/portfolio/seo/search_visibility_06.jpg", "/portfolio/seo/search_visibility_07.jpg", "/portfolio/seo/search_visibility_08.jpg", "/portfolio/seo/search_visibility_09.jpg", "/portfolio/seo/search_visibility_10.jpg", "/portfolio/seo/search_visibility_11.jpg", "/portfolio/seo/search_visibility_12.jpg", "/portfolio/seo/search_visibility_13.jpg",
    ],
  },
  ads: {
    boards: ["/portfolio/seo/ads_performance_board_01.jpg", "/portfolio/seo/ads_performance_board_02.jpg", "/portfolio/seo/ads_performance_board_03.jpg"],
    panels: [
      "/portfolio/seo/ads_dashboard_01.jpg", "/portfolio/seo/ads_dashboard_02.jpg", "/portfolio/seo/ads_dashboard_03.jpg", "/portfolio/seo/ads_dashboard_04.jpg", "/portfolio/seo/ads_dashboard_05.jpg", "/portfolio/seo/ads_dashboard_06.jpg", "/portfolio/seo/ads_dashboard_07.jpg", "/portfolio/seo/ads_dashboard_08.jpg", "/portfolio/seo/ads_dashboard_09.jpg", "/portfolio/seo/ads_dashboard_10.jpg",
    ],
  },
};

const cases: CaseStudy[] = [
  {
    id: "01", title: "أركان إليت", type: "فعاليات وخيام أوروبية", url: "arkaneliteevents.com", cover: assets.arkan.desktop, accent: "blue",
    excerpt: "واجهة فاخرة تُترجم مشهد المناسبات إلى تجربة رقمية واضحة قابلة للاستكشاف.",
    thesis: "حين تكون الصورة جزءاً من قرار العميل، يجب أن تفتح الواجهة مساحة للمشهد قبل التفاصيل.",
    detail: "بدأ المسار بواجهة رئيسية قوية، ثم امتد إلى الخدمات والمعرض ولقطات موقع فعلية تمنح الزائر تصوراً ملموساً عن التجربة.",
    frames: [
      { src: assets.arkan.desktop, alt: "موكاب سطح المكتب لموقع أركان إليت", label: "موكاب الواجهة الرئيسية", tone: "wide" },
      { src: assets.arkan.mobile, alt: "موكاب الجوال لموقع أركان إليت", label: "تجربة الجوال", tone: "tall" },
      { src: assets.arkan.screens, alt: "لوحة لقطات موقع أركان إليت", label: "لقطات الموقع الفعلية", tone: "wide" },
      { src: assets.arkan.home, alt: "الصفحة الرئيسية لموقع أركان إليت", label: "الواجهة المنشورة" },
      { src: assets.arkan.services, alt: "صفحة خدمات أركان إليت", label: "طبقة الخدمات" },
      { src: assets.arkan.gallery, alt: "معرض أركان إليت", label: "معرض الخيام" },
      { src: assets.arkan.features, alt: "لوحة مميزات تجربة أركان إليت", label: "ملامح التجربة", tone: "wide" },
      ...assets.arkan.tents.map((src, index) => ({ src, alt: `صورة مشروع أركان إليت ${index + 1}`, label: `مشهد الفعالية ${index + 1}` })),
    ],
  },
  {
    id: "02", title: "مؤسسة عالم الفن والهندسة", type: "زجاج سيكوريت بالمدينة المنورة", url: "moalemzujajmadina.com", cover: assets.case2.home, accent: "teal",
    excerpt: "بناء حضور موثوق لخدمة محلية عبر موكابات فعلية، خدمات مرتبة، وإثباتات تجارية منضبطة.",
    thesis: "الخدمة المحلية تحتاج إلى إجابة سريعة: ماذا تقدم المؤسسة، ولماذا يمكن الوثوق بها؟",
    detail: "يوثق المعرض واجهة الموقع، بنية الخدمات، معرض الأعمال، وبطاقات الإثبات المموهة المخصصة للعرض العام.",
    proofNote: "تعرض المستندات بصيغة مموهة لحماية المعلومات غير الضرورية للعرض العام.",
    frames: [
      { src: assets.case2.home, alt: "الصفحة الرئيسية لمؤسسة عالم الفن والهندسة", label: "الواجهة المنشورة", tone: "wide" },
      { src: assets.case2.board, alt: "لوحة لقطات موقع عالم الفن والهندسة", label: "لقطات الموقع الفعلية", tone: "wide" },
      { src: assets.case2.services, alt: "خدمات مؤسسة عالم الفن والهندسة", label: "طبقة الخدمات" },
      { src: assets.case2.gallery, alt: "معرض أعمال مؤسسة عالم الفن والهندسة", label: "معرض الأعمال" },
      ...assets.case2.cards.map((src, index) => ({ src, alt: `بطاقة واجهة عالم الفن والهندسة ${index + 1}`, label: `مقطع واجهة ${index + 1}` })),
      { src: assets.case2.evidence, alt: "لوحة أدلة مؤسسة عالم الفن والهندسة", label: "لوحة أدلة مموهة", tone: "wide" },
      ...assets.case2.documents.map((src, index) => ({ src, alt: `دليل مموه لمؤسسة عالم الفن والهندسة ${index + 1}`, label: `إثبات منشور ${index + 1}`, tone: "document" as const })),
    ],
  },
  {
    id: "03", title: "خدمات الياسمين", type: "حلول وخدمات متكاملة", url: "alyasmineservices.com", cover: assets.case3.home, accent: "gold",
    excerpt: "تنظيم رحلة المستخدم من التعريف بالخدمة إلى نقطة التواصل دون ازدحام أو تكرار.",
    thesis: "في الخدمات المتنوعة، التنظيم البصري هو ما يجعل العرض مفهوماً وقابلاً للتصرف.",
    detail: "يعرض الملف لقطات مستقرة للصفحة الرئيسية والخدمات وطبقة إثبات مستقلة، مع موكاب نتيجة خاص بخدمات الياسمين.",
    proofNote: "تحمل بطاقات الإثبات تمويهاً مقصوداً لحماية البيانات المرجعية والأرقام الحساسة.",
    frames: [
      { src: assets.case3.home, alt: "الصفحة الرئيسية لخدمات الياسمين", label: "الواجهة المنشورة", tone: "wide" },
      { src: assets.case3.board, alt: "لوحة لقطات خدمات الياسمين", label: "لقطات الموقع الفعلية", tone: "wide" },
      { src: assets.case3.services, alt: "صفحة خدمات الياسمين", label: "تصنيف الخدمات" },
      { src: assets.case3.gallery, alt: "معرض خدمات الياسمين", label: "موكاب الخدمات والنتيجة" },
      ...assets.case3.cards.map((src, index) => ({ src, alt: `بطاقة خدمات الياسمين ${index + 1}`, label: `مقطع واجهة ${index + 1}` })),
      { src: assets.case3.evidence, alt: "لوحة أدلة خدمات الياسمين", label: "لوحة أدلة مموهة", tone: "wide" },
      ...assets.case3.documents.map((src, index) => ({ src, alt: `دليل مموه لخدمات الياسمين ${index + 1}`, label: `إثبات منشور ${index + 1}`, tone: "document" as const })),
    ],
  },
  {
    id: "04", title: "الصفا للمعادن", type: "تشكيل معادن — مصر", url: "safa-steels.com", cover: assets.case4.home, accent: "rust",
    excerpt: "لغة صناعية موثوقة تُظهر الشهادات والاعتمادات كجزء من قرار الشراء.",
    thesis: "في المشاريع الصناعية، الوضوح وطبقة الإثبات يختصران الطريق قبل أي تواصل تجاري.",
    detail: "يوثق المسار الموقع الفعلي، فئات القدرات الصناعية، وصفحة الشهادات والاعتمادات المنشورة بصيغة آمنة للعرض.",
    proofNote: "تم إخفاء أرقام المراجع والتوقيعات وبيانات الاتصال من صور الشهادات المعروضة.",
    frames: [
      { src: assets.case4.home, alt: "الواجهة الرئيسية للصفا للمعادن", label: "الواجهة المنشورة", tone: "wide" },
      { src: assets.case4.board, alt: "لوحة لقطات الصفا للمعادن", label: "الموقع كما يراه الزائر", tone: "wide" },
      { src: assets.case4.secondary, alt: "صفحة من موقع الصفا للمعادن", label: "واجهة النتيجة" },
      ...assets.case4.cards.map((src, index) => ({ src, alt: `مقطع موقع الصفا للمعادن ${index + 1}`, label: `قدرة صناعية ${index + 1}` })),
      { src: assets.case4.evidence, alt: "لوحة شهادات واعتمادات الصفا للمعادن", label: "لوحة أدلة مموهة", tone: "wide" },
      ...assets.case4.documents.map((src, index) => ({ src, alt: `شهادة مموهة للصفا للمعادن ${index + 1}`, label: `شهادة منشورة ${index + 1}`, tone: "document" as const })),
    ],
  },
  {
    id: "05", title: "مندوب زين 5G", type: "موزع معتمد", url: "mandoubzain5g.com", cover: assets.case5.home, accent: "violet",
    excerpt: "تجربة مباشرة تبرز صفة الموزع المعتمد وتدفع المستخدم إلى الإجراء المناسب.",
    thesis: "صفة الاعتماد ليست تفصيلاً؛ إنها طبقة الثقة التي تسبق قرار اختيار الباقة.",
    detail: "تظهر اللقطات المنشورة رحلة من عرض الاعتماد والخدمة إلى الباقات والتفعيل، مع فصل واضح لكل نقطة قرار.",
    frames: [
      { src: assets.case5.home, alt: "الواجهة الرئيسية لمندوب زين 5G", label: "الواجهة المنشورة", tone: "wide" },
      { src: assets.case5.board, alt: "لوحة لقطات مندوب زين 5G", label: "لقطات الموقع الفعلية", tone: "wide" },
      { src: assets.case5.secondary, alt: "باقات مندوب زين 5G", label: "مسار الباقات" },
      ...assets.case5.cards.map((src, index) => ({ src, alt: `مقطع موقع مندوب زين ${index + 1}`, label: `نقطة قرار ${index + 1}` })),
    ],
  },
  {
    id: "06", title: "أفران نابولي", type: "أفران ومشبات — السعودية", url: "napoliovensksa.com", cover: assets.case6.home, accent: "orange",
    excerpt: "هوية دافئة ومحتوى بصري يُقرّب المنتج من الخيال قبل طلب الاستشارة.",
    thesis: "المنتج الذي يُتخيل جيداً يصبح أسهل في المقارنة والطلب.",
    detail: "تجمع اللقطات بين الصفحة الرئيسية وشبكة المنتجات وعناصر دعوة واضحة للاستشارة، دون خلط مع مشاريع الخدمات الأخرى.",
    frames: [
      { src: assets.case6.home, alt: "الواجهة الرئيسية لأفران نابولي", label: "الواجهة المنشورة", tone: "wide" },
      { src: assets.case6.board, alt: "لوحة لقطات أفران نابولي", label: "لقطات الموقع الفعلية", tone: "wide" },
      { src: assets.case6.secondary, alt: "صفحة منتجات أفران نابولي", label: "شبكة المنتجات" },
      ...assets.case6.cards.map((src, index) => ({ src, alt: `مقطع موقع أفران نابولي ${index + 1}`, label: `نقطة عرض ${index + 1}` })),
    ],
  },
];

const caseNarratives: Record<string, Array<{ label: string; title: string; body: string }>> = {
  "01": [
    { label: "السياق", title: "القرار يبدأ بالمشهد", body: "في الفعاليات والخيام الأوروبية، لا تكفي قائمة خدمات منفصلة عن الصورة. يبدأ المسار من مشاهد الفعالية، ثم يربطها بالخدمات والمعرض حتى يفهم الزائر طبيعة التجربة قبل الدخول في التفاصيل." },
    { label: "التنفيذ", title: "طبقات واضحة بدلاً من صفحة مزدحمة", body: "توزعت المادة بين واجهة رئيسية ذات أثر بصري، وصفحة خدمات، ومعرض، ونسخة جوال. هذا التقسيم يجعل الانتقال من الانطباع إلى الاستكشاف منطقياً بدلاً من وضع كل الرسائل في شاشة واحدة." },
    { label: "ما يثبته الملف", title: "لقطات منشورة وموكابات للقراءة", body: "تظهر لقطات الموقع الفعلي بجانب الموكابات وبطاقات المزايا وصور الخيام. المواد تشرح كيف صيغت التجربة بصرياً ولا تتضمن أرقام أداء أو مبيعات غير متاحة في المصدر." },
  ],
  "02": [
    { label: "السياق", title: "خدمة محلية تحتاج جواباً سريعاً", body: "عند البحث عن زجاج سيكوريت في المدينة المنورة، يحتاج العميل إلى فهم نطاق الخدمة ومدى تخصص المؤسسة قبل أن يقرر التواصل. لذلك وضعت الخدمة والسياق المحلي في مقدمة القراءة." },
    { label: "التنفيذ", title: "الخدمة ثم الأعمال ثم التواصل", body: "نظمت التجربة على طبقات: تعريف مباشر، صفحة خدمات قابلة للمسح، ثم معرض للأعمال. هذه البنية تقلل الحاجة إلى التخمين وتمنح الزائر نقاطاً واضحة قبل الانتقال إلى التواصل." },
    { label: "طبقة الثقة", title: "الإثبات حاضر مع حماية البيانات", body: "يتضمن الملف لوحات وإثباتات تجارية مموهة. الغرض منها توضيح وجود طبقة مرجعية للمؤسسة، مع حجب البيانات غير اللازمة للعرض العام." },
  ],
  "03": [
    { label: "السياق", title: "تعدد الخدمات يحتاج هيكلاً لا ضجيجاً", body: "عندما تتنوع الخدمات، يصبح ترتيبها جزءاً من قيمة الموقع. عالجت التجربة ذلك بتوجيه الزائر من التعريف العام إلى تصنيف الخدمات، بدلاً من تركه أمام قائمة طويلة متجاورة." },
    { label: "التنفيذ", title: "تحويل التعقيد إلى مسار قابل للتصرف", body: "توضح الصفحة الرئيسية هوية العرض، بينما تمنح صفحة الخدمات كل فئة مساحة مستقلة. تظهر كذلك موكابات ولقطات للمقاطع الأساسية كي تكون بنية الرحلة قابلة للمراجعة وليست وصفاً نظرياً." },
    { label: "طبقة الثقة", title: "أدلة مموهة بحماية مقصودة", body: "تظهر لوحة الإثباتات والمستندات المرافقة بشكل مموه لحماية بيانات السجل والضريبة وقوى والعنوان. لا يُستعمل التمويه لتضخيم الادعاء بل للفصل بين التحقق المرجعي والبيانات الخاصة." },
  ],
  "04": [
    { label: "السياق", title: "القرار الصناعي يسبقه تحقق", body: "في قطاع تشكيل المعادن، لا تكفي اللغة التسويقية وحدها. يحتاج الزائر إلى فهم القدرات المعروضة ورؤية الشهادات والاعتمادات بوصفها جزءاً من سياق اتخاذ القرار." },
    { label: "التنفيذ", title: "لغة صناعية مرتبة وقابلة للفحص", body: "يجمع الموقع بين واجهة رئيسية وطبقات للقدرات الصناعية ومقاطع من التجربة المنشورة. التركيز على الوضوح: ماذا تقدّم الشركة، وأين يجد الزائر دليل الاعتماد دون أن يبحث عنه خارج المسار." },
    { label: "طبقة الثقة", title: "الشهادات تُعرض بأمان", body: "يعرض الملف لوحة شهادات واعتمادات مع نسخ مموهة. أُخفيت أرقام المراجع والتوقيعات وبيانات الاتصال في النسخة العامة، بينما بقيت طبيعة الإثبات ودوره في القصة واضحين." },
  ],
  "05": [
    { label: "السياق", title: "الاعتماد هو أول رسالة", body: "بالنسبة لموزع زين 5G، تأتي صفة الموزع المعتمد قبل مقارنة الباقات. لذلك تعرّف الواجهة بصفة الاعتماد والخدمة أولاً، ثم تنقل المستخدم إلى الخيارات ذات الصلة." },
    { label: "التنفيذ", title: "من الثقة إلى الباقة ثم التفعيل", body: "تعرض اللقطات مساراً واضحاً بين الواجهة الرئيسية والباقات ونقاط القرار. الهدف من التنظيم هو جعل الخطوة المناسبة قابلة للعثور عليها من دون تشتت." },
    { label: "حدود القراءة", title: "الملف يشرح المسار ولا يخمّن أثره", body: "تثبت المواد شكل الترتيب البصري ومسار العرض كما ظهر في الموقع. لا تنسب هذه الحالة نسب تحويل أو نتائج مبيعات أو تأكيدات خارج ما هو معروض في اللقطات." },
  ],
  "06": [
    { label: "السياق", title: "منتج يحتاج أن يُتخيّل قبل طلبه", body: "الأفران والمشبات منتجات ترتبط بالمكان والدفء والاستخدام. لذلك بُني العرض ليدخل الزائر إلى عالم المنتج بصرياً قبل أن يطلب استشارة أو يقارن بين الخيارات." },
    { label: "التنفيذ", title: "واجهة دافئة وشبكة منتجات منظمة", body: "توضح الصفحة الرئيسية النبرة البصرية للعلامة، بينما تقدم شبكة المنتجات ومسارات العرض نقاطاً أكثر تحديداً للاستكشاف. تتجنب التجربة خلط هذا المسار مع نمط مواقع الخدمات." },
    { label: "ما يثبته الملف", title: "رحلة عرض لا وعد تجاري", body: "تُظهر اللقطات الصفحة الرئيسية وشبكة المنتجات والمقاطع ذات الصلة بطلب الاستشارة. وهي توثق بناء التجربة المنشورة من دون إضافة ادعاءات عن مبيعات أو طلبات غير مثبتة." },
  ],
};

const navItems = [
  { label: "الرؤية", href: "#vision" },
  { label: "المواقع", href: "#websites" },
  { label: "السيو", href: "#seo" },
  { label: "إعلانات Google", href: "#ads" },
];

const clampZoom = (value: number) => Math.min(4, Math.max(1, value));
const panLimitFor = (zoom: number) => Math.max(0, (zoom - 1) * 260);

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div>;
}

function Metric({ value, label, note, color = "blue" }: { value: string; label: string; note: string; color?: string }) {
  return <div className={`metric metric-${color}`}><div className="metric-value">{value}</div><div className="metric-label">{label}</div><div className="metric-note">{note}</div></div>;
}

function AssetTile({ frame, onOpen, index = 0 }: { frame: Frame; onOpen: (frame: Frame) => void; index?: number }) {
  const layout = frame.tone === "wide" || index === 0 ? "is-wide" : frame.tone === "tall" || frame.tone === "document" ? "is-tall" : "";
  return <button className={`asset-tile ${layout}`} onClick={() => onOpen(frame)} aria-label={`تكبير: ${frame.label}`}><img src={frame.src} alt={frame.alt} loading="lazy" /><span><Eye size={14} />{frame.label}</span></button>;
}

function CaseNarrative({ caseId }: { caseId: string }) {
  const items = caseNarratives[caseId] ?? [];
  return <div className="case-narrative" aria-label="شرح تفصيلي للحالة">{items.map((item) => <section key={item.title} className="case-narrative-item"><span>{item.label}</span><h5>{item.title}</h5><p>{item.body}</p></section>)}</div>;
}

function CaseArchive({ item, isOpen, onToggle, onOpenImage }: { item: CaseStudy; isOpen: boolean; onToggle: () => void; onOpenImage: (frame: Frame) => void }) {
  return <article className={`case-row accent-${item.accent} ${isOpen ? "is-open" : ""}`}>
    <div className="case-number">{item.id}</div>
    <button className="case-image-wrap" onClick={onToggle} aria-label={`فتح ملف ${item.title} البصري`}><img src={item.cover} alt={`موكاب ${item.title}`} loading="lazy" /><span className="image-index">{item.frames.length.toString().padStart(2, "0")} ASSETS</span></button>
    <div className="case-content"><div className="case-type">{item.type}</div><h3>{item.title}</h3><p>{item.excerpt}</p><div className="case-actions"><a href={`https://${item.url}`} target="_blank" rel="noreferrer" className="case-link">زيارة الموقع <ExternalLink size={15} /></a><button className="case-expand" onClick={onToggle} aria-expanded={isOpen}><Images size={15} />{isOpen ? "إخفاء الملف" : "عرض الملف البصري"}<ChevronDown size={15} /></button></div></div>
    <button className="case-arrow" onClick={onToggle} aria-label={`فتح ملف ${item.title}`}><ChevronLeft size={24} /></button>
    {isOpen && <motion.div className="case-details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}><div className="case-detail-intro"><span className="eyebrow light"><span className="eyebrow-dot" /> CASE FILE / {item.id}</span><h4>{item.thesis}</h4><p>{item.detail}</p><CaseNarrative caseId={item.id} />{item.proofNote && <div className="proof-safety"><ShieldCheck size={16} />{item.proofNote}</div>}</div><div className="asset-gallery">{item.frames.map((frame, index) => <AssetTile key={`${item.id}-${frame.src}`} frame={frame} index={index} onOpen={onOpenImage} />)}</div></motion.div>}
  </article>;
}

/** Editorial Growth Atlas — a compact desktop route rail turns the portfolio chapters into a readable growth map. */
function AtlasRail({ active }: { active: string }) {
  return <aside className="atlas-rail" aria-label="مسار أطلس النمو">
    <a href="#top" className="atlas-rail-brand" aria-label="العودة إلى بداية الأطلس"><img src={assets.mark} alt="" /><span>ATLAS</span></a>
    <nav className="atlas-rail-route" aria-label="فصول الملف">
      {navItems.map((item, index) => <a key={item.href} href={item.href} className={active === item.label ? "is-current" : ""}><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" /><strong>{item.label}</strong></a>)}
    </nav>
    <span className="atlas-rail-foot">NASHARHUB / 2026</span>
  </aside>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("الرؤية");
  const [scrolled, setScrolled] = useState(false);
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [showSeoArchive, setShowSeoArchive] = useState(false);
  const [showAdsArchive, setShowAdsArchive] = useState(false);
  const [lightbox, setLightbox] = useState<Frame | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const pointersRef = useRef(new Map<number, Point>());
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  const heroShift = useTransform(scrollYProgress, [0, 0.22], [0, -30]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["vision", "websites", "seo", "ads"];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) { const match = navItems.find((item) => item.href === `#${visible.target.id}`); if (match) setActive(match.label); }
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setLightbox(null); return; }
      if (event.key === "+" || event.key === "=") setZoom((current) => clampZoom(current + 0.25));
      if (event.key === "-") setZoom((current) => clampZoom(current - 0.25));
      if (event.key.toLowerCase() === "r") { setZoom(1); setPan({ x: 0, y: 0 }); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const closeLightbox = () => { setLightbox(null); resetView(); };
  const setZoomLevel = (value: number) => {
    const nextZoom = clampZoom(value);
    const limit = panLimitFor(nextZoom);
    setZoom(nextZoom);
    setPan((current) => ({ x: Math.max(-limit, Math.min(limit, current.x)), y: Math.max(-limit, Math.min(limit, current.y)) }));
  };
  const openImage = (frame: Frame) => { resetView(); setLightbox(frame); };
  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => { event.preventDefault(); setZoomLevel(zoom + (event.deltaY < 0 ? 0.22 : -0.22)); };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = Array.from(pointersRef.current.values());
    if (points.length === 2) {
      pinchRef.current = { distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y), zoom };
      dragRef.current = null;
      setIsDragging(false);
    } else if (zoom > 1) {
      dragRef.current = { startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y };
      setIsDragging(true);
    }
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = Array.from(pointersRef.current.values());
    if (points.length === 2 && pinchRef.current) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      setZoomLevel(pinchRef.current.zoom * (distance / pinchRef.current.distance));
      return;
    }
    if (dragRef.current && zoom > 1) {
      const limit = panLimitFor(zoom);
      setPan({ x: Math.max(-limit, Math.min(limit, dragRef.current.panX + event.clientX - dragRef.current.startX)), y: Math.max(-limit, Math.min(limit, dragRef.current.panY + event.clientY - dragRef.current.startY)) });
    }
  };
  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) { dragRef.current = null; setIsDragging(false); }
  };
  const toggleZoom = () => { if (zoom === 1) setZoomLevel(2); else resetView(); };
  const seoBoardFrames: Frame[] = assets.seo.boards.map((src, index) => ({ src, alt: `لوحة سيو موثقة ${index + 1}`, label: `لوحة الظهور ${index + 1}`, tone: "wide" }));
  const seoPanelFrames: Frame[] = assets.seo.panels.map((src, index) => ({ src, alt: `دليل سيو تفصيلي ${index + 1}`, label: `لوحة المصدر ${String(index + 1).padStart(2, "0")}` }));
  const adsPanelFrames: Frame[] = assets.ads.panels.map((src, index) => ({ src, alt: `لوحة Google Ads تفصيلية ${index + 1}`, label: `لوحة المصدر ${String(index + 1).padStart(2, "0")}` }));

  return <div className="site-shell" dir="rtl">
    <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}><a href="#top" className="brand-lockup" aria-label="الانتقال إلى بداية ملف NasharHub"><img src={assets.mark} alt="" className="brand-symbol" /><img src={assets.logo} alt="NasharHub" className="brand-wordmark" /><span className="brand-caption">حلول رقمية متكاملة</span></a><nav className="desktop-nav" aria-label="التنقل الرئيسي">{navItems.map((item) => <a key={item.href} className={active === item.label ? "active" : ""} href={item.href}>{item.label}</a>)}</nav><a className="header-cta" href="#contact">ابدأ حواراً <ArrowUpLeft size={16} /></a><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="فتح القائمة">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></header>
    {menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}<a href="#contact" onClick={() => setMenuOpen(false)}>ابدأ حواراً <ArrowUpLeft size={16} /></a></motion.div>}

    <AtlasRail active={active} />
    <main id="top">
      <section className="hero-section"><div className="hero-backdrop" style={{ backgroundImage: `url(${assets.hero})` }} /><div className="hero-grain" /><div className="container hero-content"><motion.div className="hero-copy" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}><div className="eyebrow light"><span className="eyebrow-dot" /> NASHARHUB / PORTFOLIO 2026</div><h1>نصنع حضوراً<br /><em>يُقرأ، يُرى،</em><br />ويتحرك إلى الأمام.</h1><p className="hero-lede">من تصميم المواقع إلى الظهور في البحث وإعلانات Google، نجمع الحرفة الرقمية مع قراءة واضحة للنتيجة.</p><div className="hero-actions"><a className="button button-primary" href="#websites">استكشف الأعمال <ArrowDownLeft size={18} /></a><a className="text-link light-link" href="#vision">كيف نعمل؟ <ArrowUpLeft size={16} /></a></div></motion.div><motion.div className="hero-aside" style={{ y: heroShift }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.15 }}><div className="hero-mark-wrap"><img src={assets.mark} alt="رمز NasharHub" /></div><span className="hero-aside-number">06 + 02</span><span className="hero-aside-label">مسارات نمو موثقة<br />داخل قصة واحدة</span></motion.div></div><div className="hero-footer container"><span>SCROLL TO READ</span><span className="route-line" /><span>01 / 04</span></div></section>

      <section id="vision" className="vision-section section-light"><div className="container split-layout"><Reveal className="section-index"><span>01</span><span className="index-line" /><span>الرؤية</span></Reveal><Reveal delay={0.08} className="vision-copy"><div className="eyebrow"><span className="eyebrow-dot blue-dot" /> WHERE CRAFT MEETS GROWTH</div><h2>ليست مجموعة صور.<br /><span>إنها طريقة تفكير.</span></h2><p className="large-copy">كل مشروع في هذا الملف بدأ بسؤال تجاري واضح: ما الذي يجب أن يفهمه الزائر؟ ما الذي يجب أن يثق به؟ وما الخطوة التالية التي نريد أن تصبح أسهل؟</p><p>لذلك لا نعرض واجهة فقط؛ نعرض القرار الذي جعلها تعمل. نرتب القصة، نبني الأدلة، ثم نترك للنتيجة مساحة لتتكلم.</p><a className="text-link" href="#websites">شاهد الحالات بالتفصيل <ArrowUpLeft size={16} /></a></Reveal><Reveal delay={0.16} className="vision-object"><div className="orbit-card"><img src={assets.orbit} alt="مسار نمو رقمي" /><div className="orbit-label"><span>01</span><strong>فهم</strong><small>السياق قبل الشكل</small></div></div></Reveal></div><div className="container metric-strip"><Metric value="06" label="دراسات مواقع" note="من قطاعات مختلفة" color="blue" /><Metric value="03" label="لوحات SEO" note="مع أرشيف أدلة موسّع" color="teal" /><Metric value="13" label="لوحات بحث" note="من ملف المصدر" color="gold" /><Metric value="10" label="لوحات Google Ads" note="مضمّنة في الأرشيف" color="ink" /></div></section>

      <section id="websites" className="websites-section section-ink"><div className="container"><div className="section-heading-row"><Reveal className="section-index light-index"><span>02</span><span className="index-line" /><span>تصميم المواقع</span></Reveal><Reveal className="heading-side"><span className="eyebrow light"><span className="eyebrow-dot" /> SELECTED WORKS</span><p>ستة مشاريع، ستة سياقات، وقاسم واحد: تحويل التعقيد إلى تجربة واضحة.</p></Reveal></div><Reveal className="section-intro light-intro"><h2>واجهة تُرى.<br /><em>منظومة تُفهم.</em></h2><p>هذه ليست صوراً مختارة فقط. افتح ملف كل مشروع لرؤية الموكابات، لقطات الموقع، الأدلة المنشورة، والمواد التي تشكل القصة الكاملة.</p></Reveal><div className="archive-status"><Images size={16} /><span>ملفات بصرية موسعة — اضغط على أي مشروع لفتح كامل الأصول المعتمدة له.</span></div><div className="cases-list">{cases.map((item) => <Reveal key={item.id} className="case-reveal"><CaseArchive item={item} isOpen={openCase === item.id} onToggle={() => setOpenCase(openCase === item.id ? null : item.id)} onOpenImage={openImage} /></Reveal>)}</div></div></section>

      <section id="seo" className="seo-section section-cream"><div className="container"><div className="section-heading-row"><Reveal className="section-index"><span>03</span><span className="index-line" /><span>SEO / الظهور</span></Reveal><Reveal className="heading-side"><span className="eyebrow"><span className="eyebrow-dot teal-dot" /> ORGANIC VISIBILITY</span><p>لا نطارد ترتيباً منعزلاً؛ نبني مساراً يجعل الخدمة قابلة للاكتشاف والفهم.</p></Reveal></div><div className="seo-grid"><Reveal className="seo-copy"><h2>من الحضور<br /><span>إلى الاكتشاف.</span></h2><p className="large-copy">السيو عند NasharHub ليس قائمة كلمات مفتاحية. هو إعادة ترتيب للعلاقة بين نية الباحث، الصفحة، والدليل الذي يطمئنه.</p><div className="process-list"><div><span>01</span><p><strong>فهم النية</strong><br />ما الذي يبحث عنه العميل فعلاً؟</p></div><div><span>02</span><p><strong>بناء الصفحة</strong><br />محتوى واضح، قابل للقراءة والفهرسة.</p></div><div><span>03</span><p><strong>قراءة الأثر</strong><br />نقيس الظهور والنقرات والتحسن عبر الزمن.</p></div></div></Reveal><Reveal delay={0.1} className="seo-evidence"><div className="evidence-label"><Search size={15} /> SEARCH CONSOLE / EVIDENCE</div><button className="evidence-image" onClick={() => openImage({ src: assets.seo.growth, alt: "لوحة نمو Search Console", label: "نمو الظهور" })}><img src={assets.seo.growth} alt="لوحة نمو الظهور في Search Console" /></button><div className="evidence-caption"><span>قراءة الاتجاه</span><p>ارتفاع الظهور لا يعني شيئاً وحده؛ القيمة تظهر عندما يتحول إلى نقرات وزيارات ذات نية.</p></div></Reveal></div><div className="seo-proof-grid"><Reveal><button className="proof-image" onClick={() => openImage({ src: assets.seo.compare, alt: "مقارنة أداء Search Console", label: "مقارنة الأداء" })}><img src={assets.seo.compare} alt="مقارنة أداء Search Console" /></button></Reveal><Reveal delay={0.08}><button className="proof-image" onClick={() => openImage({ src: assets.seo.sixMonths, alt: "بيانات ستة أشهر في Search Console", label: "قراءة ستة أشهر" })}><img src={assets.seo.sixMonths} alt="بيانات ستة أشهر في Search Console" /></button></Reveal><Reveal delay={0.16} className="proof-note"><span className="eyebrow"><span className="eyebrow-dot teal-dot" /> WHAT WE READ</span><h3>نتيجة البحث هي أول صفحة في الموقع.</h3><p>العنوان، الوصف، الرابط، وترتيب الرسالة؛ كلها نقاط صغيرة تصنع قرار النقر.</p><button className="text-link text-button" onClick={() => openImage({ src: assets.seo.structure, alt: "بنية نتيجة البحث", label: "بنية نتيجة البحث" })}>عرض بنية النتيجة <ArrowUpLeft size={16} /></button></Reveal></div><div className="evidence-shelf seo-shelf"><div className="shelf-heading"><div><span className="eyebrow"><span className="eyebrow-dot teal-dot" /> EVIDENCE BOARDS</span><h3>لوحات الظهور من ملف البورتفوليو</h3></div><span>03 لوحات مركّبة</span></div><div className="shelf-tiles">{seoBoardFrames.map((frame, index) => <AssetTile key={frame.src} frame={frame} index={index} onOpen={openImage} />)}</div><button className="archive-toggle" onClick={() => setShowSeoArchive((value) => !value)} aria-expanded={showSeoArchive}><Images size={16} />{showSeoArchive ? "إخفاء أرشيف لوحات البحث" : "عرض جميع لوحات البحث التفصيلية"}<span>13</span><ChevronDown size={16} /></button>{showSeoArchive && <motion.div className="source-archive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{seoPanelFrames.map((frame, index) => <AssetTile key={frame.src} frame={frame} index={index + 1} onOpen={openImage} />)}</motion.div>}</div></div></section>

      <section id="ads" className="ads-section section-ink"><div className="container"><div className="section-heading-row"><Reveal className="section-index light-index"><span>04</span><span className="index-line" /><span>إعلانات Google</span></Reveal><Reveal className="heading-side"><span className="eyebrow light"><span className="eyebrow-dot" /> PAID PERFORMANCE</span><p>حين تكون النية حاضرة الآن، نضع الرسالة أمامها بوضوح ونقرأ ما حدث بعدها.</p></Reveal></div><div className="ads-intro"><Reveal><h2>السرعة لا تلغي<br /><em>المنهج.</em></h2></Reveal><Reveal delay={0.08}><p className="light-copy">إعلانات Google هي مختبر سريع للعرض، الرسالة، والطلب. نستخدم البيانات لتقليل التخمين، لا لتجميل الأرقام.</p><div className="ad-metrics"><Metric value="7,820" label="نقرات مسجلة" note="وفق لوحة المصدر" color="blue" /><Metric value="157,112" label="مرات ظهور" note="وفق لوحة المصدر" color="gold" /><Metric value="9.37" label="متوسط CPC" note="كما ظهر في المصدر" color="teal" /></div></Reveal></div><div className="ads-gallery"><Reveal className="ads-main-image"><button onClick={() => openImage({ src: assets.ads.boards[0], alt: "لوحة أداء Google Ads الأولى", label: "لوحة الأداء 01" })}><img src={assets.ads.boards[0]} alt="لوحة أداء Google Ads" /></button><span>01 / PERFORMANCE SNAPSHOT</span></Reveal><div className="ads-side-images"><Reveal delay={0.08}><button onClick={() => openImage({ src: assets.ads.boards[1], alt: "لوحة أداء Google Ads الثانية", label: "لوحة الأداء 02" })}><img src={assets.ads.boards[1]} alt="مؤشرات حملة Google Ads" /></button></Reveal><Reveal delay={0.16}><button onClick={() => openImage({ src: assets.ads.boards[2], alt: "لوحة أداء Google Ads الثالثة", label: "لوحة الأداء 03" })}><img src={assets.ads.boards[2]} alt="تحليل إعلانات Google" /></button></Reveal></div></div><div className="evidence-shelf ads-shelf"><div className="shelf-heading"><div><span className="eyebrow light"><span className="eyebrow-dot" /> SOURCE PANELS</span><h3>سجل بصري تفصيلي للحملات</h3></div><span>10 لوحات مصدر</span></div><p className="shelf-description">هذه الأصول مدمجة لحفظ السياق البصري للمؤشرات، دون استنتاج تحويلات أو إيرادات أو ROAS غير مثبتة في المصدر.</p><button className="archive-toggle archive-toggle-light" onClick={() => setShowAdsArchive((value) => !value)} aria-expanded={showAdsArchive}><Images size={16} />{showAdsArchive ? "إخفاء سجل لوحات الإعلانات" : "عرض جميع لوحات الإعلانات التفصيلية"}<span>10</span><ChevronDown size={16} /></button>{showAdsArchive && <motion.div className="source-archive source-archive-dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{adsPanelFrames.map((frame, index) => <AssetTile key={frame.src} frame={frame} index={index + 1} onOpen={openImage} />)}</motion.div>}</div><Reveal className="ads-note"><Target size={20} /><p><strong>ملاحظة منهجية:</strong> نعرض المؤشرات كما ظهرت في المصدر، ولا ننسب لها تحويلات أو إيرادات أو ROAS ما لم تكن مثبتة في البيانات.</p></Reveal></div></section>

      <section id="contact" className="contact-section section-light"><div className="container contact-layout"><Reveal className="section-index"><span>05</span><span className="index-line" /><span>الخطوة التالية</span></Reveal><Reveal className="contact-copy"><div className="eyebrow"><span className="eyebrow-dot blue-dot" /> LET'S MAKE THE NEXT SIGNAL CLEAR</div><h2>لديك مشروع<br /><span>يستحق أن يُرى؟</span></h2><p>أرسل لنا السياق، وسنحوّله إلى مسار رقمي يمكن فهمه وقياسه.</p><a className="contact-email" href="mailto:info@nasharhub.com"><span>للتواصل المباشر</span>info@nasharhub.com</a><a className="button button-dark" href="mailto:info@nasharhub.com">تواصل مع NasharHub <ArrowUpLeft size={18} /></a></Reveal><Reveal className="contact-mark" delay={0.12}><img src={assets.mark} alt="رمز NasharHub" /><span>WEBSITE / SEO / ADS</span></Reveal></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-inner"><div><span className="footer-brand-lockup"><img src={assets.mark} alt="" /><img src={assets.logo} alt="NasharHub" /></span><span>تصميم مواقع، سيو، وإعلانات Google</span></div><div className="footer-links"><a href="mailto:info@nasharhub.com">info@nasharhub.com</a><a href="#top">العودة إلى الأعلى <ArrowUpRight size={15} /></a></div><span className="footer-copy">© 2026 NASHARHUB</span></div></footer>
    {lightbox && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox}><div className="lightbox-toolbar" onClick={(event) => event.stopPropagation()}><div className="lightbox-hint"><Move size={14} />حرّك الصورة بعد التكبير</div><div className="lightbox-controls"><button type="button" onClick={() => setZoomLevel(zoom - 0.25)} disabled={zoom <= 1} aria-label="تصغير الصورة"><ZoomOut size={18} /></button><output aria-live="polite">{Math.round(zoom * 100)}%</output><button type="button" onClick={() => setZoomLevel(zoom + 0.25)} disabled={zoom >= 4} aria-label="تكبير الصورة"><ZoomIn size={18} /></button><button type="button" onClick={resetView} disabled={zoom === 1 && pan.x === 0 && pan.y === 0} aria-label="إعادة ضبط الصورة"><RotateCcw size={17} /></button></div><button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="إغلاق العرض"><X size={21} /></button></div><motion.figure initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.24 }} onClick={(event) => event.stopPropagation()}><div className={`zoom-stage ${zoom > 1 ? "is-zoomed" : ""} ${isDragging ? "is-dragging" : ""}`} onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd} onDoubleClick={toggleZoom} style={{ touchAction: zoom > 1 ? "none" : "pan-y" }}><motion.img src={lightbox.src} alt={lightbox.alt} animate={{ scale: zoom, x: pan.x, y: pan.y }} transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 330, damping: 32, mass: 0.55 }} draggable={false} /></div><figcaption><span>{lightbox.label}</span><small>استخدم عجلة الماوس أو الإيماءة للتكبير — نقرتان لتبديل التكبير — زر R لإعادة الضبط</small></figcaption></motion.figure></motion.div>}
  </div>;
}
