import { useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, SYSTEMS, type Product, type Spec } from "@/lib/catalog";
import { uploadProductImage } from "@/lib/admin-images";

export type ProductDraft = {
  name: string;
  model: string;
  sku: string;
  category: string;
  system: string;
  short_description: string;
  description: string;
  specs: Spec[];
  price: string;
  compare_at_price: string;
  stock: string;
  image_url: string;
  gallery: string[];
  featured: boolean;
  is_active: boolean;
};

export const productSchema = z.object({
  name: z.string().trim().min(2, "اسم المنتج مطلوب").max(200),
  model: z.string().trim().max(80),
  sku: z.string().trim().max(80),
  category: z.string().min(1),
  system: z.string().min(1),
  short_description: z.string().trim().max(300),
  description: z.string().trim().max(5000),
  specs: z.array(z.object({ label: z.string().trim().max(80), value: z.string().trim().max(300) })).max(40),
  price: z.coerce.number({ message: "السعر مطلوب" }).min(0, "السعر غير صحيح").max(10_000_000),
  compare_at_price: z.union([z.literal(""), z.coerce.number().min(0).max(10_000_000)]),
  stock: z.coerce.number().int("الكمية رقم صحيح").min(0).max(100000),
  image_url: z.string().trim().max(2000),
  gallery: z.array(z.string().max(2000)).max(8),
  featured: z.boolean(),
  is_active: z.boolean(),
});

export function emptyDraft(): ProductDraft {
  return {
    name: "",
    model: "",
    sku: "",
    category: "smart-locks",
    system: "wifi",
    short_description: "",
    description: "",
    specs: [
      { label: "الموديل", value: "" },
      { label: "البروتوكول", value: "" },
      { label: "الضمان", value: "سنتان من RMP Tech" },
    ],
    price: "",
    compare_at_price: "",
    stock: "10",
    image_url: "",
    gallery: [],
    featured: false,
    is_active: true,
  };
}

export function draftFromProduct(p: Product): ProductDraft {
  return {
    name: p.name,
    model: p.model ?? "",
    sku: p.sku ?? "",
    category: p.category,
    system: p.system,
    short_description: p.short_description ?? "",
    description: p.description ?? "",
    specs: p.specs.length ? p.specs : emptyDraft().specs,
    price: String(p.price),
    compare_at_price: p.compare_at_price == null ? "" : String(p.compare_at_price),
    stock: String(p.stock),
    image_url: p.image_url ?? "",
    gallery: p.gallery,
    featured: p.featured,
    is_active: p.is_active,
  };
}

export function ProductForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial: ProductDraft;
  submitting: boolean;
  onSubmit: (values: z.output<typeof productSchema>) => void;
  onCancel: () => void;
}) {
  const [d, setD] = useState<ProductDraft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<"main" | "gallery" | null>(null);
  const mainRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) => setD((prev) => ({ ...prev, [k]: v }));

  const upload = async (files: FileList | null, target: "main" | "gallery") => {
    if (!files?.length) return;
    setUploading(target);
    try {
      if (target === "main") {
        set("image_url", await uploadProductImage(files[0]!));
      } else {
        const urls: string[] = [];
        for (const f of Array.from(files).slice(0, 8 - d.gallery.length)) urls.push(await uploadProductImage(f));
        set("gallery", [...d.gallery, ...urls]);
      }
      toast.success("تم رفع الصورة");
    } catch (e) {
      toast.error("تعذر رفع الصورة", { description: (e as Error).message });
    } finally {
      setUploading(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = productSchema.safeParse({ ...d, specs: d.specs.filter((s) => s.label.trim() || s.value.trim()) });
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      toast.error("راجع الحقول المطلوبة");
      return;
    }
    setErrors({});
    onSubmit(r.data);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {/* Images */}
      <section className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <div className="flex flex-col gap-2">
          <Label className="font-bold">الصورة الرئيسية</Label>
          <button
            type="button"
            onClick={() => mainRef.current?.click()}
            className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-card hover:border-accent"
          >
            {d.image_url ? (
              <img src={d.image_url} alt="" className="h-full w-full object-contain p-2" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><ImagePlus className="size-7" />رفع صورة</span>
            )}
            {uploading === "main" && <span className="absolute inset-0 grid place-items-center bg-card/80"><Loader2 className="animate-spin" /></span>}
          </button>
          <input ref={mainRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files, "main")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-bold">صور إضافية</Label>
          <div className="flex flex-wrap gap-2">
            {d.gallery.map((g, i) => (
              <div key={g + i} className="relative size-20 overflow-hidden rounded-xl border bg-card">
                <img src={g} alt="" className="h-full w-full object-contain p-1" />
                <button type="button" onClick={() => set("gallery", d.gallery.filter((_, j) => j !== i))} className="absolute end-1 top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground" aria-label="حذف الصورة">
                  <X className="size-3" />
                </button>
              </div>
            ))}
            {d.gallery.length < 8 && (
              <button type="button" onClick={() => galleryRef.current?.click()} className="grid size-20 place-items-center rounded-xl border-2 border-dashed text-muted-foreground hover:border-accent">
                {uploading === "gallery" ? <Loader2 className="animate-spin" /> : <Plus />}
              </button>
            )}
          </div>
          <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files, "gallery")} />
          <Label className="mt-2 text-xs text-muted-foreground">أو الصق رابط الصورة الرئيسية</Label>
          <Input value={d.image_url} onChange={(e) => set("image_url", e.target.value)} dir="ltr" placeholder="https://..." />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <F label="اسم المنتج *" error={errors.name} className="sm:col-span-2">
          <Input value={d.name} onChange={(e) => set("name", e.target.value)} maxLength={200} />
        </F>
        <F label="الموديل"><Input value={d.model} onChange={(e) => set("model", e.target.value)} dir="ltr" maxLength={80} /></F>
        <F label="كود المنتج SKU"><Input value={d.sku} onChange={(e) => set("sku", e.target.value)} dir="ltr" maxLength={80} /></F>
        <F label="القسم">
          <Select value={d.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>)}</SelectContent>
          </Select>
        </F>
        <F label="النظام">
          <Select value={d.system} onValueChange={(v) => set("system", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{SYSTEMS.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
        </F>
        <F label="السعر (ج.م) *" error={errors.price}><Input value={d.price} onChange={(e) => set("price", e.target.value)} inputMode="decimal" dir="ltr" /></F>
        <F label="السعر قبل الخصم" error={errors.compare_at_price}><Input value={d.compare_at_price} onChange={(e) => set("compare_at_price", e.target.value)} inputMode="decimal" dir="ltr" placeholder="اختياري" /></F>
        <F label="الكمية المتوفرة" error={errors.stock}><Input value={d.stock} onChange={(e) => set("stock", e.target.value)} inputMode="numeric" dir="ltr" /></F>
        <div className="flex items-end gap-6 pb-2">
          <label className="flex items-center gap-2 text-sm font-bold"><Switch checked={d.is_active} onCheckedChange={(v) => set("is_active", v)} /> ظاهر في المتجر</label>
          <label className="flex items-center gap-2 text-sm font-bold"><Switch checked={d.featured} onCheckedChange={(v) => set("featured", v)} /> مميز</label>
        </div>
        <F label="وصف مختصر" className="sm:col-span-2"><Input value={d.short_description} onChange={(e) => set("short_description", e.target.value)} maxLength={300} /></F>
        <F label="الوصف التقني" className="sm:col-span-2"><Textarea value={d.description} onChange={(e) => set("description", e.target.value)} rows={5} maxLength={5000} /></F>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="font-bold">المواصفات الفنية</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => set("specs", [...d.specs, { label: "", value: "" }])}>
            <Plus /> إضافة مواصفة
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {d.specs.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <Input placeholder="الخاصية" value={s.label} onChange={(e) => set("specs", d.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} maxLength={80} />
              <Input placeholder="القيمة" value={s.value} onChange={(e) => set("specs", d.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} maxLength={300} />
              <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => set("specs", d.specs.filter((_, j) => j !== i))} aria-label="حذف المواصفة"><Trash2 /></Button>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-6 flex justify-end gap-2 border-t bg-background px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
        <Button type="submit" disabled={submitting || uploading !== null}>
          {submitting && <Loader2 className="animate-spin" />} حفظ المنتج
        </Button>
      </div>
    </form>
  );
}

function F({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label className="text-sm font-bold">{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
