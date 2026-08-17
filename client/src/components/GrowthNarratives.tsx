/** Saudi editorial portfolio — detailed, evidence-bounded narratives are inserted beside the existing SEO and Ads evidence shelves. */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Narrative = { label: string; title: string; body: string };

const seoNarrative: Narrative[] = [
  { label: "المشكلة التي نعالجها", title: "الظهور لا يبدأ بكلمة مفتاحية منفصلة", body: "العمل يبدأ من فهم الخدمة ومن يسأل عنها ومن الصفحة التي ستجيب عنه. لهذا تُقرأ نية البحث قبل كتابة العنوان أو تنظيم المقطع، حتى لا يتحول الموقع إلى صفحات متشابهة لا تساعد الباحث على اتخاذ خطوة." },
  { label: "طبقة التنفيذ", title: "صفحة قابلة للفهم من الإنسان ومحرك البحث", body: "نرتب العنوان والعرض والخدمة والعناصر الداعمة بحيث يعرف الزائر ما الذي يقدمه النشاط ولماذا يمكن الوثوق به. ثم يُراجع البناء التقني والمحتوى ومسارات الوصول بوصفها أجزاء من تجربة واحدة." },
  { label: "طريقة القراءة", title: "نقارن الاتجاه ولا ننتزع رقماً من سياقه", body: "تعرض لوحات Search Console فترات مقارنة وقراءة ممتدة للظهور والنقرات وبنية نتيجة البحث. لا نختزلها في ترتيب واحد، ولا ننسب لها طلبات أو إيرادات ما لم تظهر تلك البيانات صراحة في المصدر." },
];

const adsNarrative: Narrative[] = [
  { label: "دور الإعلانات", title: "الرسالة أمام نية موجودة الآن", body: "الإعلان لا يحل محل الموقع، بل يختبر وضوح العرض أمام بحث نشط. لذلك يبدأ العمل بربط الكلمات والرسالة والصفحة المقصودة، بحيث لا ينفصل الوعد الإعلاني عن الخطوة التي يجدها المستخدم بعد النقر." },
  { label: "دورة التحسين", title: "نقرأ الإشارة قبل تغيير القرار", body: "تُستخدم الظهورات والنقرات ومتوسط تكلفة النقرة كمؤشرات لقراءة العلاقة بين الاستهداف والرسالة. بعد ذلك تُراجع الحملة في سياقها: ما الذي وصل، وما الذي جذب النقر، وأين يلزم تعديل العرض أو الصفحة." },
  { label: "حدود الإثبات", title: "الأرقام المعروضة هي أرقام المصدر", body: "تعرض هذه الصفحة 7,820 نقرة و157,112 ظهوراً ومتوسط CPC بقيمة 9.37 كما وردت في اللوحات. لا تحول هذه المؤشرات إلى ROAS أو إيرادات أو تحويلات غير موجودة في الدليل المعروض." },
];

function NarrativePanel({ id, title, intro, items, tone }: { id: string; title: string; intro: string; items: Narrative[]; tone: "light" | "dark" }) {
  return <section className={`growth-narrative growth-narrative-${tone}`} aria-labelledby={id}><div className="growth-narrative-heading"><span>قراءة منهجية</span><h3 id={id}>{title}</h3><p>{intro}</p></div><div className="growth-narrative-grid">{items.map((item) => <article key={item.title} className="growth-narrative-card"><span>{item.label}</span><h4>{item.title}</h4><p>{item.body}</p></article>)}</div></section>;
}

export function GrowthNarratives() {
  const [seoTarget, setSeoTarget] = useState<HTMLElement | null>(null);
  const [adsTarget, setAdsTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSeoTarget(document.querySelector<HTMLElement>("#seo .container"));
    setAdsTarget(document.querySelector<HTMLElement>("#ads .container"));
  }, []);

  return <>{seoTarget && createPortal(<NarrativePanel id="seo-method" title="كيف تُقرأ أدلة الظهور؟" intro="اللوحات المعروضة ليست زينة رقمية؛ هي نقطة مراجعة بين نية الباحث وبناء الصفحة والأثر الظاهر عبر الزمن." items={seoNarrative} tone="light" />, seoTarget)}{adsTarget && createPortal(<NarrativePanel id="ads-method" title="كيف نضع حملة الإعلانات في سياقها؟" intro="المؤشرات وحدها لا تحكي القصة. لذلك نقرأها مع الرسالة والصفحة المقصودة وحدود ما يمكن أن تثبته البيانات المعروضة." items={adsNarrative} tone="dark" />, adsTarget)}</>;
}
