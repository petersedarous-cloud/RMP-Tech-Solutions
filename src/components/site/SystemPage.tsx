import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/catalog";

export type Feature = { icon: LucideIcon; title: string; text: string };
export type UseCase = { icon: LucideIcon; title: string; text: string; points: string[] };
export type Integration = { icon: LucideIcon; title: string; text: string; category: string };
export type Step = { title: string; text: string };

export function SystemPage(props: {
  tag: string;
  title: ReactNode;
  intro: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  features: Feature[];
  diagram: ReactNode;
  diagramTitle: string;
  diagramText: string;
  steps: Step[];
  useCases: UseCase[];
  integrations: Integration[];
  productsTitle: string;
  products: Product[];
  productsSearch: { system?: string; category?: string };
  other: { to: "/systems/knx" | "/systems/zigbee"; label: string };
}) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img src={props.image} alt={props.imageAlt} width={1600} height={1008} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink via-ink/90 to-ink/40" />
        <div className="absolute inset-0 -z-10 circuit-grid opacity-40" />
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <nav className="text-sm text-ink-muted">
            <Link to="/" className="hover:text-ink-foreground">الرئيسية</Link> / <span>الأنظمة</span>
          </nav>
          <span className="mt-6 inline-block rounded-full bg-brand-green px-4 py-1 font-mono text-sm font-bold text-accent-foreground" dir="ltr">{props.tag}</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl text-balance">{props.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{props.intro}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {props.highlights.map((h) => (
              <li key={h} className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-foreground/5 px-4 py-2 text-sm font-bold">
                <Check className="size-4 text-brand-green" /> {h}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="xl">
              <Link to="/products" search={props.productsSearch}>تسوق منتجات النظام <ArrowLeft /></Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/contact">اطلب تصميم لمشروعك</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading eyebrow="الفوائد والمميزات" title="لماذا تختار هذا النظام؟" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {props.features.map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-card">
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><f.icon className="size-6" /></span>
              <h3 className="mt-4 text-lg font-extrabold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface py-20">
        <div className="absolute inset-0 circuit-grid-light" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="آلية العمل" title={props.diagramTitle} description={props.diagramText} />
            <ol className="mt-8 grid gap-4">
              {props.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">{i + 1}</span>
                  <div>
                    <h3 className="font-extrabold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border bg-card p-4 shadow-lift md:p-8 lg:col-span-3">{props.diagram}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading eyebrow="حالات الاستخدام" title="أين يُستخدم؟" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {props.useCases.map((u) => (
            <div key={u.title} className="flex flex-col gap-4 rounded-3xl border bg-card p-7 shadow-card">
              <u.icon className="size-9 text-brand-green" />
              <h3 className="text-xl font-extrabold">{u.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{u.text}</p>
              <ul className="mt-auto grid gap-2 border-t pt-4">
                {u.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm font-bold"><Check className="mt-0.5 size-4 shrink-0 text-brand-green" />{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-gradient py-20 text-ink-foreground">
        <div className="absolute inset-0 circuit-grid opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading tone="dark" eyebrow="التكامل" title="يعمل مع كل أجهزتك الذكية" description="اربط النظام بالأقفال الذكية والمفاتيح والحساسات لتشغيل مشاهد تلقائية كاملة." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {props.integrations.map((it) => (
              <Link
                key={it.title}
                to="/products"
                search={{ category: it.category }}
                className="group flex flex-col gap-3 rounded-2xl border border-ink-line bg-ink-foreground/5 p-6 transition-colors hover:border-brand-green/60 hover:bg-ink-foreground/10"
              >
                <it.icon className="size-8 text-brand-green" />
                <h3 className="text-lg font-extrabold">{it.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{it.text}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand-green">
                  شاهد المنتجات <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="منتجات ذات صلة" title={props.productsTitle} />
          <Button asChild variant="link" className="font-bold">
            <Link to="/products" search={props.productsSearch}>عرض الكل <ArrowLeft /></Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {props.products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-3xl border bg-surface p-8 md:flex-row">
          <p className="text-lg font-bold">تعرف أيضاً على النظام الآخر الذي نقدمه</p>
          <Button asChild variant="default" size="lg">
            <Link to={props.other.to}>{props.other.label} <ArrowLeft /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
