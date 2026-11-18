import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, Target, Home, Cpu, ScanFace, Hotel, Mic, Cctv, Award, Wrench, Headphones, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-smart-home.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | RMP Tech Solutions" },
      { name: "description", content: "RMP Tech Solutions شركة متخصصة في الأنظمة الذكية والأوتوميشن للمنازل والفنادق والمكاتب في مصر — رؤيتنا ورسالتنا وخدماتنا." },
      { property: "og:title", content: "من نحن | RMP Tech Solutions" },
      { property: "og:description", content: "شركة رائدة في حلول المنزل الذكي والأوتوميشن وأنظمة KNX." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const SERVICES = [
  { icon: Home, title: "أنظمة المنزل الذكي", text: "تحكم كامل بالإضاءة والستائر والتكييف والصوتيات من تطبيق واحد." },
  { icon: Cpu, title: "أنظمة الأوتوميشن", text: "حلول متكاملة للمكاتب والمنشآت التجارية والصناعية." },
  { icon: ScanFace, title: "التحكم بالدخول", text: "أنظمة Access Control متطورة بالكارت والبصمة والوجه." },
  { icon: Hotel, title: "أنظمة الفنادق", text: "حلول مخصصة للفنادق من التحكم بالغرف حتى تجربة النزيل." },
  { icon: Mic, title: "التحكم الصوتي", text: "تشغيل كامل للمنزل أو الغرفة بالأوامر الصوتية." },
  { icon: Cctv, title: "الأمن والمراقبة", text: "كاميرات ذكية وأنظمة إنذار متصلة بالموبايل على مدار الساعة." },
];

function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img src={heroImg} alt="" width={1920} height={1088} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink via-ink/90 to-ink/50" />
        <div className="absolute inset-0 -z-10 circuit-grid opacity-40" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:py-24 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="text-sm font-bold text-brand-green">من نحن</span>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl text-balance">الحلول الذكية لعالمٍ أكثر تطوراً</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
              شركة RMP Tech Solutions شركة رائدة ومتخصصة في مجال الأنظمة الذكية وحلول الأوتوميشن المتقدمة. نقدم منظومات
              متكاملة تجمع بين التكنولوجيا الحديثة والتصميم العملي لخدمة المنازل، الفنادق، المكاتب، والمنشآت التجارية.
            </p>
          </div>
          <div className="hidden justify-center lg:flex">
            <Logo variant="white" className="h-56 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-8 shadow-card">
          <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground"><Eye className="size-6" /></span>
          <h2 className="mt-5 text-2xl font-extrabold">رؤيتنا</h2>
          <p className="mt-3 leading-loose text-muted-foreground">
            أن نكون الخيار الأول في الشرق الأوسط لحلول الأنظمة الذكية والأوتوميشن، ونصنع بيئات حياة وعمل أكثر راحة وأماناً
            وكفاءة من خلال دمج التكنولوجيا بأسلوب الحياة اليومي.
          </p>
        </div>
        <div className="rounded-3xl border bg-card p-8 shadow-card">
          <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground"><Target className="size-6" /></span>
          <h2 className="mt-5 text-2xl font-extrabold">رسالتنا</h2>
          <p className="mt-3 leading-loose text-muted-foreground">
            تقديم حلول ذكية مبتكرة ومخصصة لكل عميل، بأعلى معايير الجودة والاحترافية، مع دعم فني متواصل يضمن تجربة استخدام
            سلسة وموثوقة طوال عمر المنظومة.
          </p>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading align="center" eyebrow="خدماتنا" title="مجالات تخصصنا الرئيسية" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border bg-card p-6 shadow-card">
                <span className="absolute end-5 top-5 font-mono text-3xl font-black text-secondary">0{i + 1}</span>
                <s.icon className="size-9 text-brand-green" />
                <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading align="center" eyebrow="لماذا تختار RMP" title="خبرة عملية وتقنيات متطورة" />
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
          {[
            { icon: Award, v: "+100", l: "مشروع منفذ" },
            { icon: Wrench, v: "+50", l: "عميل سعيد" },
            { icon: Headphones, v: "24/7", l: "دعم فني" },
            { icon: ShieldCheck, v: "100%", l: "ضمان جودة" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center gap-2 rounded-2xl bg-ink-gradient p-8 text-center text-ink-foreground">
              <s.icon className="size-8 text-brand-green" />
              <span className="text-4xl font-black" dir="ltr">{s.v}</span>
              <span className="text-sm text-ink-muted">{s.l}</span>
            </div>
          ))}
        </div>
        <blockquote className="mx-auto mt-16 max-w-3xl text-center text-2xl font-extrabold leading-relaxed md:text-3xl">
          “نحن لا نبيع أجهزة، بل نُصمّم تجارب استثنائية ونبني بنية تحتية ذكية تخفّض التكاليف على المدى الطويل.”
        </blockquote>
        <div className="mt-10 flex justify-center gap-3">
          <Button asChild variant="brand" size="xl"><Link to="/contact">تواصل معنا <ArrowLeft /></Link></Button>
          <Button asChild variant="outline" size="xl"><Link to="/products">تصفح المنتجات</Link></Button>
        </div>
      </section>
    </>
  );
}
