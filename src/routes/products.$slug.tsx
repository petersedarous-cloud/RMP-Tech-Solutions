import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingCart, Truck, Wrench, MessageCircle, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtocolBadge } from "@/components/site/ProtocolBadge";
import { ProductCard } from "@/components/site/ProductCard";
import { COMPANY, categoryLabel, discountPercent, formatPrice } from "@/lib/catalog";
import { productQuery } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { clampQty, whatsappUrl } from "@/lib/cart-math";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return { name: data.product.name, short: data.product.short_description ?? "", price: data.product.price };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} | RMP Tech` : "منتج غير متاح | RMP Tech";
    const description = loaderData
      ? `${loaderData.name} — ${loaderData.short}. السعر ${formatPrice(loaderData.price)}.`
      : "هذا المنتج غير متاح حالياً.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-black">المنتج غير متاح</h1>
      <p className="text-muted-foreground">ربما تم حذف هذا المنتج أو تغيير رابطه.</p>
      <Button asChild><Link to="/products">تصفح المنتجات</Link></Button>
    </div>
  ),
  component: ProductPage,
});

const INTEGRATION: Record<string, { title: string; text: string; link?: "/systems/knx" | "/systems/zigbee" }> = {
  knx: {
    title: "جزء من منظومة KNX المتكاملة",
    text: "يتصل هذا الجهاز بخط KNX الموحد مع باقي الأجهزة: مفاتيح، مشغلات إضاءة وستائر، حساسات حضور، تكييف وأنظمة الفنادق. تتم برمجته بواسطة مهندسي RMP على برنامج ETS لتشغيل مشاهد متكاملة.",
    link: "/systems/knx",
  },
  zigbee: {
    title: "يعمل ضمن شبكة Zigbee 3.0",
    text: "يرتبط بالبوابة الذكية ليصبح جزءاً من شبكة Mesh لاسلكية مع الأقفال والمفاتيح والحساسات، ويمكنك إنشاء أتمتة مثل: عند فتح القفل الذكي تعمل إضاءة المدخل ويُفتح التكييف.",
    link: "/systems/zigbee",
  },
  wifi: {
    title: "اتصال Wi-Fi مباشر",
    text: "يتصل مباشرة بالراوتر بدون بوابة ويعمل من تطبيق Tuya / Smart Life، ويتكامل مع أجهزة Zigbee في نفس التطبيق ومع المساعدات الصوتية Alexa و Google Assistant.",
    link: "/systems/zigbee",
  },
  standalone: {
    title: "يعمل بشكل مستقل",
    text: "جهاز مستقل بتقنية RFID ويمكن ربطه بأنظمة إدارة الفنادق ومفاتيح توفير الطاقة لتجربة متكاملة للنزيل.",
    link: "/systems/knx",
  },
};

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  if (!data) return null;
  const { product, related } = data;
  const images = [product.image_url, ...product.gallery].filter((x): x is string => !!x);
  const off = discountPercent(product.price, product.compare_at_price);
  const integration = INTEGRATION[product.system] ?? INTEGRATION.standalone;
  const inStock = product.stock > 0;

  const addToCart = () => {
    add(
      { productId: product.id, slug: product.slug, name: product.name, model: product.model, price: product.price, image: product.image_url },
      qty,
    );
    toast.success("تمت الإضافة إلى السلة", {
      description: `${product.name} × ${qty}`,
      action: { label: "عرض السلة", onClick: () => navigate({ to: "/cart" }) },
    });
  };

  const waText = `مرحباً RMP Tech، أريد طلب:\n${product.name}${product.model ? ` (${product.model})` : ""}\nالكمية: ${qty}\nالسعر: ${formatPrice(product.price)}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">الرئيسية</Link> /
        <Link to="/products" className="hover:text-primary">المنتجات</Link> /
        <Link to="/products" search={{ category: product.category }} className="hover:text-primary">{categoryLabel(product.category)}</Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-3xl border bg-card shadow-card">
            {images[active] ? (
              <img src={images[active]} alt={product.name} width={600} height={600} className="h-full w-full object-contain p-8" />
            ) : (
              <div className="h-full w-full circuit-grid-light" />
            )}
            {off > 0 && (
              <span className="absolute end-4 top-4 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">خصم {off}%</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActive(i)}
                  className={`size-20 overflow-hidden rounded-xl border-2 bg-card ${i === active ? "border-accent" : "border-transparent"}`}
                  aria-label={`صورة ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <ProtocolBadge system={product.system} />
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-secondary-foreground">{categoryLabel(product.category)}</span>
          </div>
          <h1 className="text-3xl font-black leading-tight md:text-4xl">{product.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {product.model && <span>الموديل: <b className="font-mono text-foreground" dir="ltr">{product.model}</b></span>}
            {product.sku && <span>الكود: <b className="font-mono text-foreground" dir="ltr">{product.sku}</b></span>}
          </div>
          {product.short_description && <p className="text-lg leading-relaxed text-muted-foreground">{product.short_description}</p>}

          <div className="flex items-end gap-3 rounded-2xl bg-surface p-5">
            <span className="text-4xl font-black text-primary">{formatPrice(product.price)}</span>
            {off > 0 && product.compare_at_price && (
              <span className="pb-1 text-lg text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
            )}
            <span className={`ms-auto inline-flex items-center gap-1 pb-1 text-sm font-bold ${inStock ? "text-brand-green" : "text-destructive"}`}>
              {inStock ? <><Check className="size-4" /> متوفر</> : "غير متوفر حالياً"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border bg-card">
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => clampQty(q + 1))} aria-label="زيادة"><Plus /></Button>
              <span className="w-10 text-center text-lg font-bold">{qty}</span>
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => clampQty(q - 1))} aria-label="تقليل"><Minus /></Button>
            </div>
            <Button variant="brand" size="xl" className="flex-1" onClick={addToCart} disabled={!inStock}>
              <ShoppingCart /> أضف إلى السلة
            </Button>
          </div>
          <Button asChild variant="whatsapp" size="xl">
            <a href={whatsappUrl(COMPANY.whatsapp, waText)} target="_blank" rel="noreferrer">
              <MessageCircle /> اطلب مباشرة عبر واتساب
            </a>
          </Button>

          <div className="grid grid-cols-3 gap-3 border-t pt-5 text-center text-xs font-bold">
            <div className="flex flex-col items-center gap-1.5"><ShieldCheck className="size-6 text-brand-green" />ضمان سنتين</div>
            <div className="flex flex-col items-center gap-1.5"><Wrench className="size-6 text-brand-green" />تركيب احترافي</div>
            <div className="flex flex-col items-center gap-1.5"><Truck className="size-6 text-brand-green" />توصيل لكل المحافظات</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="specs" className="mt-14" dir="rtl">
        <TabsList className="h-auto w-full justify-start gap-1 rounded-2xl bg-surface p-1.5 sm:w-auto">
          <TabsTrigger value="specs" className="rounded-xl px-5 py-2 font-bold">المواصفات الفنية</TabsTrigger>
          <TabsTrigger value="desc" className="rounded-xl px-5 py-2 font-bold">الوصف التقني</TabsTrigger>
          <TabsTrigger value="integration" className="rounded-xl px-5 py-2 font-bold">التكامل</TabsTrigger>
        </TabsList>
        <TabsContent value="specs" className="mt-6">
          <dl className="overflow-hidden rounded-2xl border bg-card">
            {product.specs.map((s, i) => (
              <div key={s.label + i} className="grid grid-cols-[minmax(120px,220px)_1fr] border-b last:border-b-0 even:bg-surface/60">
                <dt className="border-e px-5 py-3 text-sm font-bold text-muted-foreground">{s.label}</dt>
                <dd className="px-5 py-3 text-sm font-medium">{s.value}</dd>
              </div>
            ))}
            {product.specs.length === 0 && <p className="p-6 text-muted-foreground">لا توجد مواصفات مضافة بعد.</p>}
          </dl>
        </TabsContent>
        <TabsContent value="desc" className="mt-6">
          <div className="max-w-3xl whitespace-pre-line rounded-2xl border bg-card p-6 leading-loose text-foreground/85">
            {product.description || "لا يوجد وصف بعد."}
          </div>
        </TabsContent>
        <TabsContent value="integration" className="mt-6">
          <div className="flex max-w-3xl flex-col gap-4 rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-green-soft text-brand-green"><Network className="size-5" /></span>
              <h3 className="text-xl font-extrabold">{integration.title}</h3>
            </div>
            <p className="leading-loose text-foreground/85">{integration.text}</p>
            {integration.link && (
              <Button asChild variant="outline" className="w-fit">
                <Link to={integration.link}>اعرف كيف يعمل النظام <ArrowLeft /></Link>
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
