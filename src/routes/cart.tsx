import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, Minus, Plus, ShoppingCart, Trash2, MessageCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { COMPANY, formatPrice } from "@/lib/catalog";
import { buildWhatsAppOrderText, whatsappUrl } from "@/lib/cart-math";
import { createOrder, orderInput } from "@/lib/orders.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سلة المشتريات | RMP Tech" },
      { name: "description", content: "راجع منتجاتك وأكمل طلبك عبر واتساب أو أرسل طلب شراء لفريق RMP Tech." },
      { property: "og:title", content: "سلة المشتريات | RMP Tech" },
      { property: "og:description", content: "أكمل طلب منتجات المنزل الذكي من RMP Tech." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

type Method = "whatsapp" | "request" | "card";

function CartPage() {
  const { lines, total, setQty, remove, clear } = useCart();
  const [method, setMethod] = useState<Method>("whatsapp");
  const [form, setForm] = useState({ customer_name: "", phone: "", email: "", city: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ orderNumber: number; method: Method } | null>(null);
  const submitOrder = useServerFn(createOrder);

  const mutation = useMutation({
    mutationFn: submitOrder,
    onError: (e: Error) => toast.error("تعذر إرسال الطلب", { description: e.message }),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === "card") return;
    const payload = {
      ...form,
      payment_method: method,
      items: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
    };
    const parsed = orderInput.safeParse(payload);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    // Open the WhatsApp tab synchronously so pop-up blockers allow it, then fill it in.
    const waWindow = method === "whatsapp" ? window.open("about:blank", "_blank") : null;
    try {
      const res = await mutation.mutateAsync({ data: parsed.data });
      if (method === "whatsapp") {
        const text = buildWhatsAppOrderText(lines, { name: form.customer_name, phone: form.phone, city: form.city, address: form.address, notes: form.notes }, formatPrice, res.orderNumber);
        const url = whatsappUrl(COMPANY.whatsapp, text);
        if (waWindow) waWindow.location.href = url;
        else window.location.href = url;
      }
      setDone({ orderNumber: res.orderNumber, method });
      clear();
    } catch {
      waWindow?.close();
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <CheckCircle2 className="size-16 text-brand-green" />
        <h1 className="text-3xl font-black">تم استلام طلبك بنجاح</h1>
        <p className="text-lg text-muted-foreground">
          رقم الطلب <b className="text-foreground">#{done.orderNumber}</b>.{" "}
          {done.method === "whatsapp" ? "أكمل إرسال الرسالة على واتساب وسيتواصل معك فريقنا فوراً." : "سيتواصل معك فريق المبيعات خلال ساعات العمل لتأكيد الطلب."}
        </p>
        <Button asChild variant="brand" size="xl"><Link to="/products">متابعة التسوق</Link></Button>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-secondary text-primary"><ShoppingCart className="size-9" /></span>
        <h1 className="text-3xl font-black">السلة فارغة</h1>
        <p className="text-muted-foreground">تصفح منتجاتنا وأضف ما تحتاجه لمنزلك الذكي.</p>
        <Button asChild variant="brand" size="xl"><Link to="/products">تصفح المنتجات</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black md:text-4xl">سلة المشتريات</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
        <ul className="flex flex-col gap-3">
          {lines.map((l) => (
            <li key={l.productId} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-card">
              <Link to="/products/$slug" params={{ slug: l.slug }} className="size-24 shrink-0 overflow-hidden rounded-xl bg-card">
                {l.image && <img src={l.image} alt={l.name} className="h-full w-full object-contain p-1" />}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link to="/products/$slug" params={{ slug: l.slug }} className="line-clamp-2 font-bold hover:text-primary">{l.name}</Link>
                {l.model && <span className="font-mono text-xs text-muted-foreground" dir="ltr">{l.model}</span>}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => setQty(l.productId, l.qty + 1)} aria-label="زيادة"><Plus /></Button>
                    <span className="w-8 text-center font-bold">{l.qty}</span>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => setQty(l.productId, l.qty - 1)} aria-label="تقليل"><Minus /></Button>
                  </div>
                  <span className="font-extrabold text-primary">{formatPrice(l.price * l.qty)}</span>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(l.productId)} aria-label="حذف"><Trash2 /></Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={onSubmit} className="flex h-fit flex-col gap-5 rounded-3xl border bg-card p-6 shadow-card lg:sticky lg:top-28" noValidate>
          <div className="flex items-center justify-between rounded-2xl bg-surface p-4">
            <span className="font-bold text-muted-foreground">الإجمالي</span>
            <span className="text-2xl font-black text-primary">{formatPrice(total)}</span>
          </div>

          <div className="grid gap-3">
            <Field label="الاسم بالكامل *" error={errors.customer_name}>
              <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} maxLength={100} />
            </Field>
            <Field label="رقم الموبايل *" error={errors.phone}>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" dir="ltr" className="text-right" maxLength={20} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="المدينة" error={errors.city}>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={80} />
              </Field>
              <Field label="البريد (اختياري)" error={errors.email}>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" dir="ltr" maxLength={255} />
              </Field>
            </div>
            <Field label="العنوان" error={errors.address}>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={300} />
            </Field>
            <Field label="ملاحظات" error={errors.notes}>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} maxLength={1000} />
            </Field>
          </div>

          <fieldset className="grid gap-2">
            <legend className="mb-2 text-sm font-bold">طريقة إتمام الطلب</legend>
            <MethodOption active={method === "whatsapp"} onClick={() => setMethod("whatsapp")} icon={<MessageCircle />} title="إرسال الطلب عبر واتساب" text="يُحفظ طلبك ويُفتح واتساب برسالة جاهزة." />
            <MethodOption active={method === "request"} onClick={() => setMethod("request")} icon={<ClipboardList />} title="طلب شراء والتواصل معي" text="يصل طلبك لفريق المبيعات وسيتصلون بك للتأكيد." />
            <MethodOption active={method === "card"} onClick={() => setMethod("card")} icon={<CreditCard />} title="الدفع أونلاين بالكارت" text="قريباً — سيتم التفعيل بعد ربط شركة الدفع." disabled />
          </fieldset>

          {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
          <Button type="submit" variant={method === "whatsapp" ? "whatsapp" : "brand"} size="xl" disabled={mutation.isPending || method === "card"}>
            {mutation.isPending ? "جاري الإرسال..." : method === "whatsapp" ? "إرسال الطلب عبر واتساب" : "تأكيد طلب الشراء"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function MethodOption({ active, onClick, icon, title, text, disabled }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; text: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-start gap-3 rounded-xl border-2 p-3 text-start transition-colors [&_svg]:size-5 [&_svg]:shrink-0",
        active ? "border-accent bg-brand-green-soft" : "border-border hover:bg-secondary",
        disabled && "opacity-60",
      )}
    >
      <span className={active ? "text-brand-green" : "text-muted-foreground"}>{icon}</span>
      <span className="flex flex-col">
        <span className="font-bold">{title}</span>
        <span className="text-xs text-muted-foreground">{text}</span>
      </span>
    </button>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-bold">{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
