import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, MessageCircle, Phone, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMPANY } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/cart-math";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | RMP Tech Solutions" },
      { name: "description", content: "تواصل مع RMP Tech للاستشارات وعروض الأسعار لأنظمة المنزل الذكي والأقفال الذكية و KNX و Zigbee — هاتف وواتساب وبريد إلكتروني." },
      { property: "og:title", content: "تواصل مع RMP Tech" },
      { property: "og:description", content: "جاهزون لخدمتكم في أي وقت — اطلب استشارة مجانية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "اكتب اسمك").max(100),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,20}$/, "رقم الموبايل غير صحيح"),
  topic: z.string().min(1),
  message: z.string().trim().min(5, "اكتب رسالتك").max(1000),
});

const TOPICS = ["استشارة منزل ذكي", "نظام KNX", "نظام Zigbee", "أقفال ذكية", "أنظمة فنادق", "عرض سعر لمشروع", "دعم فني"];

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    const text = `مرحباً RMP Tech\nالاسم: ${r.data.name}\nالموبايل: ${r.data.phone}\nالموضوع: ${r.data.topic}\n\n${r.data.message}`;
    window.open(whatsappUrl(COMPANY.whatsapp, text), "_blank", "noopener");
  };

  const cards = [
    { icon: Phone, title: "الهاتف", lines: COMPANY.phones.map((p) => ({ text: p, href: `tel:${p}` })) },
    { icon: MessageCircle, title: "واتساب", lines: [{ text: COMPANY.whatsappDisplay, href: `https://wa.me/${COMPANY.whatsapp}` }] },
    { icon: Mail, title: "البريد الإلكتروني", lines: [{ text: COMPANY.email, href: `mailto:${COMPANY.email}` }] },
    { icon: MapPin, title: "العنوان", lines: [{ text: COMPANY.address }] },
    { icon: Globe, title: "الموقع وتابعنا", lines: [{ text: COMPANY.website }, { text: COMPANY.social }] },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-ink-gradient text-ink-foreground">
        <div className="absolute inset-0 circuit-grid opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
          <span className="text-sm font-bold text-brand-green">تواصل معنا</span>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">جاهزون لخدمتكم في أي وقت</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-muted">احكِ لنا عن مشروعك وسيتواصل معك أحد مهندسينا لتحديد زيارة مجانية.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
          {cards.map((c) => (
            <div key={c.title} className="flex gap-4 rounded-2xl border bg-card p-5 shadow-card">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><c.icon className="size-5" /></span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-muted-foreground">{c.title}</span>
                {c.lines.map((l) =>
                  "href" in l && l.href ? (
                    <a key={l.text} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="font-bold hover:text-primary" dir="ltr">{l.text}</a>
                  ) : (
                    <span key={l.text} className="font-bold">{l.text}</span>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5 rounded-3xl border bg-card p-6 shadow-card md:p-8 lg:col-span-3" noValidate>
          <h2 className="text-2xl font-extrabold">أرسل لنا رسالة</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="الاسم" error={errors.name}>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} className="h-11" />
            </Field>
            <Field label="رقم الموبايل" error={errors.phone}>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" dir="ltr" maxLength={20} className="h-11 text-right" />
            </Field>
          </div>
          <Field label="الموضوع">
            <Select value={form.topic} onValueChange={(v) => setForm({ ...form, topic: v })}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>{TOPICS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="رسالتك" error={errors.message}>
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} maxLength={1000} placeholder="مثال: عندي فيلا دورين وعايز أعمل نظام إضاءة وستائر وأقفال ذكية..." />
          </Field>
          <Button type="submit" variant="whatsapp" size="xl"><Send /> إرسال عبر واتساب</Button>
          <p className="text-center text-xs text-muted-foreground">سيتم فتح واتساب برسالتك جاهزة للإرسال إلى فريق RMP Tech.</p>
        </form>
      </section>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-bold">{label}</Label>
      {children}
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
