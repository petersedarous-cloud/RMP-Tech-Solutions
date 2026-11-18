import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  Sparkles,
  Home,
  Building2,
  Hotel,
  Stethoscope,
  ShoppingBag,
  Factory,
  Building,
  UtensilsCrossed,
  Fingerprint,
  ScanFace,
  CreditCard,
  Smartphone,
} from "lucide-react";
import heroImg from "@/assets/hero-smart-home.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CategoryIcon } from "@/components/site/CategoryIcon";
import { CATEGORIES } from "@/lib/catalog";
import { productsQuery } from "@/lib/queries";

const featuredQ = productsQuery({ featured: true, limit: 8 });
const locksQ = productsQuery({ category: "smart-locks", sort: "price-desc", limit: 4 });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RMP Tech | متجر المنزل الذكي والأقفال الذكية وأنظمة KNX" },
      {
        name: "description",
        content:
          "تسوق أونلاين أقفال ذكية، مفاتيح لمس، حساسات، شاشات تحكم وأنظمة KNX و Zigbee من RMP Tech Solutions مع التركيب والضمان في مصر.",
      },
      { property: "og:title", content: "RMP Tech | متجر المنزل الذكي والأوتوميشن" },
      { property: "og:description", content: "أقفال ذكية، مفاتيح، حساسات وأنظمة KNX و Zigbee للمنازل والفنادق." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(featuredQ);
    context.queryClient.ensureQueryData(locksQ);
  },
  component: Index,
});

const STATS = [
  { value: "+100", label: "مشروع منفذ" },
  { value: "+50", label: "عميل سعيد" },
  { value: "24/7", label: "دعم فني" },
  { value: "100%", label: "ضمان جودة" },
];

const SECTORS = [
  { icon: Home, label: "الفلل والمنازل الخاصة" },
  { icon: Hotel, label: "الفنادق والمنتجعات" },
  { icon: Building2, label: "المكاتب الإدارية" },
  { icon: Stethoscope, label: "العيادات والمستشفيات" },
  { icon: UtensilsCrossed, label: "المطاعم والكافيهات" },
  { icon: ShoppingBag, label: "المولات والمحلات" },
  { icon: Factory, label: "المصانع والمنشآت" },
  { icon: Building, label: "المباني والكمباوندات" },
];

const STEPS = [
  { n: "01", title: "الاستشارة", text: "زيارة الموقع وفهم احتياجاتك" },
  { n: "02", title: "التصميم", text: "تصميم منظومة مخصصة لمشروعك" },
  { n: "03", title: "العرض الفني", text: "عرض تفصيلي بالأسعار والمواصفات" },
  { n: "04", title: "التركيب", text: "تنفيذ احترافي على يد فنيين مدربين" },
  { n: "05", title: "الدعم", text: "صيانة دورية ودعم فني متواصل" },
];

function Index() {
  const { data: featured } = useSuspenseQuery(featuredQ);
  const { data: locks } = useSuspenseQuery(locksQ);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img
          src={heroImg}
          alt="منزل ذكي متكامل من RMP Tech"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 -z-10 circuit-grid opacity-40" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7 animate-rise">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-green/40 bg-brand-green/10 px-4 py-1.5 text-sm font-bold text-brand-green">
              <Sparkles className="size-4" /> KNX CERTIFIED • SMART HOME SOLUTIONS
            </span>
            <h1 className="text-4xl font-black leading-[1.15] md:text-6xl text-balance">
              منزل <span className="text-brand-green">يفكر معك</span> ويستجيب لك
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
              أقفال ذكية، مفاتيح لمس، حساسات وشاشات تحكم بأنظمة KNX و Zigbee و Wi-Fi — تحكم كامل في الإضاءة
              والستائر والتكييف والأمان من تطبيق واحد.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="brand" size="xl">
                <Link to="/products">
                  تسوق المنتجات <ArrowLeft />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/systems/knx">اكتشف نظام KNX</Link>
              </Button>
            </div>
            <dl className="mt-6 grid max-w-xl grid-cols-4 gap-4 border-t border-ink-line pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-black text-ink-foreground md:text-3xl" dir="ltr">{s.value}</dt>
                  <dd className="mt-1 text-xs text-ink-muted md:text-sm">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="تسوق حسب القسم" title="كل ما يحتاجه منزلك الذكي" />
          <Button asChild variant="link" className="font-bold">
            <Link to="/products">عرض كل المنتجات <ArrowLeft /></Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/products"
              search={{ category: c.slug }}
              className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-card transition-all hover:-translate-y-1 hover:border-brand-green/50 hover:shadow-lift"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <CategoryIcon slug={c.slug} className="size-7" />
              </span>
              <span className="text-sm font-bold">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SYSTEMS */}
      <section className="relative overflow-hidden bg-surface py-20">
        <div className="absolute inset-0 circuit-grid-light opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            align="center"
            eyebrow="الأنظمة التي نقدمها"
            title="بروتوكول مناسب لكل مشروع"
            description="من الشقق الصغيرة إلى الفنادق والمنشآت الكبيرة، نختار لك النظام الأنسب ونربطه بالأقفال والمفاتيح والحساسات."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Link to="/systems/knx" className={SYSTEM_CARD}>
            <SystemCardBody
              tag="KNX"
              title="نظام KNX السلكي"
              text="المعيار العالمي للمشاريع الاحترافية: استقرار مطلق وعمر افتراضي يمتد لعقود، مثالي للفلل والفنادق والمباني."
              points={["تحكم مركزي سلكي", "برمجة ETS معتمدة", "تكامل مع أنظمة الفنادق"]}
              tone="knx"
            />
            </Link>
            <Link to="/systems/zigbee" className={SYSTEM_CARD}>
            <SystemCardBody
              tag="Zigbee 3.0"
              title="نظام Zigbee اللاسلكي"
              text="شبكة لاسلكية ذكية بدون تكسير أو تمديدات، استهلاك طاقة منخفض جداً ومثالي لتحويل أي منزل قائم لمنزل ذكي."
              points={["بدون أسلاك", "شبكة Mesh ذاتية التوسع", "بطاريات تدوم لسنوات"]}
              tone="zigbee"
            />
            </Link>
            <Link to="/products" search={{ system: "wifi" }} className={SYSTEM_CARD}>
            <SystemCardBody
              tag="Wi-Fi"
              title="أجهزة Wi-Fi المباشرة"
              text="أسهل طريقة للبدء: الأجهزة تتصل مباشرة بالراوتر وتعمل من تطبيق Tuya / Smart Life بدون بوابة."
              points={["تركيب فوري", "بدون بوابة", "تحكم صوتي Alexa / Google"]}
              tone="wifi"
            />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="منتجات مميزة" title="الأكثر طلباً من عملائنا" />
          <Button asChild variant="link" className="font-bold">
            <Link to="/products">كل المنتجات <ArrowLeft /></Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* LOCKS SPOTLIGHT */}
      <section className="relative overflow-hidden bg-ink-gradient py-20 text-ink-foreground">
        <div className="absolute inset-0 circuit-grid opacity-50" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeading
              tone="dark"
              eyebrow="الأقفال الذكية"
              title="أمان متقدم وتحكم كامل في الدخول"
              description="أكثر من 35 موديل أقفال ذكية للأبواب الخشب والحديد والزجاج والألومنيوم والفنادق، تفتح ببصمة الوجه أو الإصبع أو الكارت أو من الموبايل."
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: ScanFace, label: "بصمة الوجه" },
                { icon: Fingerprint, label: "بصمة الإصبع" },
                { icon: CreditCard, label: "كارت RFID" },
                { icon: Smartphone, label: "تطبيق الموبايل" },
              ].map((m) => (
                <div key={m.label} className="flex flex-col items-center gap-2 rounded-xl border border-ink-line bg-ink-foreground/5 p-4 text-center">
                  <m.icon className="size-7 text-brand-green" />
                  <span className="text-sm font-bold">{m.label}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="brand" size="xl" className="w-fit">
              <Link to="/products" search={{ category: "smart-locks" }}>
                تصفح الأقفال الذكية <ArrowLeft />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {locks.map((p) => (
              <Link
                key={p.id}
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="group overflow-hidden rounded-2xl bg-card p-3 text-card-foreground shadow-lift"
              >
                <img src={p.image_url ?? ""} alt={p.name} loading="lazy" width={600} height={600} className="aspect-square w-full object-contain transition-transform group-hover:scale-105" />
                <p className="mt-2 line-clamp-1 text-sm font-bold">{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY + SECTORS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: BadgeCheck, title: "جودة عالمية", text: "شراكات مع كبرى العلامات في عالم الأوتوميشن ومنتجات معتمدة." },
            { icon: ShieldCheck, title: "ضمان شامل", text: "ضمان حقيقي على كل المنتجات مع خدمة ما بعد البيع." },
            { icon: Headphones, title: "دعم 24/7", text: "فريق مهندسين متخصصين ودعم فني متواصل طوال عمر المنظومة." },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 rounded-2xl border bg-card p-6 shadow-card">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-green-soft text-brand-green">
                <f.icon className="size-6" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading align="center" eyebrow="القطاعات التي نخدمها" title="حلول ذكية لكل نوع من المشاريع" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {SECTORS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <s.icon className="size-6 shrink-0 text-primary" />
                <span className="text-sm font-bold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading align="center" eyebrow="كيف نعمل" title="مراحل تنفيذ المشروع" />
          <ol className="relative mt-12 grid gap-6 md:grid-cols-5">
            <div className="absolute inset-x-8 top-7 hidden h-px bg-border md:block" aria-hidden />
            {STEPS.map((s) => (
              <li key={s.n} className="relative flex flex-col items-center text-center">
                <span className="relative grid size-14 place-items-center rounded-full border-4 border-surface bg-primary text-lg font-black text-primary-foreground">
                  {s.n}
                </span>
                <h3 className="mt-4 font-extrabold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-10 text-primary-foreground md:p-14">
          <div className="absolute inset-0 circuit-grid opacity-40" aria-hidden />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">جاهز تحول منزلك لمنزل ذكي؟</h2>
              <p className="mt-2 text-lg opacity-80">احجز زيارة مجانية لمهندسينا واحصل على عرض فني مخصص.</p>
            </div>
            <Button asChild variant="brand" size="xl">
              <Link to="/contact">احجز استشارة مجانية <ArrowLeft /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

const SYSTEM_CARD =
  "group relative flex flex-col gap-4 overflow-hidden rounded-3xl border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift";

function SystemCardBody({
  tag,
  title,
  text,
  points,
  tone,
}: {
  tag: string;
  title: string;
  text: string;
  points: string[];
  tone: "knx" | "zigbee" | "wifi";
}) {
  const toneClass = { knx: "bg-proto-knx", zigbee: "bg-proto-zigbee", wifi: "bg-proto-wifi" }[tone];
  return (
    <>
      <span className={`absolute inset-x-0 top-0 h-1.5 ${toneClass}`} />
      <span className={`w-fit rounded-full ${toneClass} px-3 py-1 font-mono text-xs font-bold text-primary-foreground`} dir="ltr">
        {tag}
      </span>
      <h3 className="text-2xl font-extrabold">{title}</h3>
      <p className="leading-relaxed text-muted-foreground">{text}</p>
      <ul className="mt-auto grid gap-2 border-t pt-4">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm font-bold">
            <span className="size-1.5 rounded-full bg-brand-green" /> {p}
          </li>
        ))}
      </ul>
      <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
        اعرف المزيد <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      </span>
    </>
  );
}
