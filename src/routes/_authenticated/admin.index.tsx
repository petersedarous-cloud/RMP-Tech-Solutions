import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, ImageUp, Loader2, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductForm, draftFromProduct, emptyDraft } from "@/components/admin/ProductForm";
import { CATEGORIES, SYSTEMS, categoryLabel, formatPrice, systemLabel, toSpecs, type Product } from "@/lib/catalog";
import { slugify, uploadProductImage } from "@/lib/admin-images";
import { toProductRow } from "@/lib/admin-products";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminProducts,
});

const ADMIN_KEY = ["admin-products"] as const;

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ADMIN_KEY });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["product"] });
  };
}

function AdminProducts() {
  const invalidate = useInvalidate();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [system, setSystem] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [imageFor, setImageFor] = useState<Product | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const products = useQuery({
    queryKey: ADMIN_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(
        (r): Product => ({
          ...r,
          price: Number(r.price),
          compare_at_price: r.compare_at_price == null ? null : Number(r.compare_at_price),
          specs: toSpecs(r.specs),
          gallery: r.gallery ?? [],
        }),
      );
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (products.data ?? []).filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (system !== "all" && p.system !== system) return false;
      if (status === "active" && !p.is_active) return false;
      if (status === "hidden" && p.is_active) return false;
      if (status === "out" && p.stock > 0) return false;
      if (!term) return true;
      return [p.name, p.model, p.sku].some((v) => v?.toLowerCase().includes(term));
    });
  }, [products.data, q, category, system, status]);

  const save = useMutation({
    mutationFn: async ({ values, id }: { values: Parameters<typeof toProductRow>[0]; id?: string }) => {
      const row = toProductRow(values);
      if (id) {
        const { error } = await supabase.from("products").update(row).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({ ...row, slug: slugify(row.model || row.name) });
        if (error) throw error;
      }
    },
    onSuccess: (_d, v) => {
      toast.success(v.id ? "تم حفظ التعديلات" : "تمت إضافة المنتج");
      setEditing(null);
      invalidate();
    },
    onError: (e) => toast.error("تعذر الحفظ", { description: (e as Error).message }),
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Pick<Product, "is_active" | "featured" | "image_url">> }) => {
      const { error } = await supabase.from("products").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(),
    onError: (e) => toast.error("تعذر التحديث", { description: (e as Error).message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حذف المنتج");
      setDeleting(null);
      invalidate();
    },
    onError: (e) => toast.error("تعذر الحذف", { description: (e as Error).message }),
  });

  const pickImage = (p: Product) => {
    setImageFor(p);
    fileRef.current?.click();
  };

  const replaceImage = async (files: FileList | null) => {
    const p = imageFor;
    if (fileRef.current) fileRef.current.value = "";
    if (!p || !files?.[0]) return;
    setUploadingId(p.id);
    try {
      const url = await uploadProductImage(files[0]);
      await patch.mutateAsync({ id: p.id, values: { image_url: url } });
      toast.success("تم تغيير صورة المنتج");
    } catch (e) {
      toast.error("تعذر رفع الصورة", { description: (e as Error).message });
    } finally {
      setUploadingId(null);
      setImageFor(null);
    }
  };

  const total = products.data?.length ?? 0;
  const active = products.data?.filter((p) => p.is_active).length ?? 0;
  const out = products.data?.filter((p) => p.stock <= 0).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black md:text-3xl">المنتجات</h1>
          <p className="text-sm text-muted-foreground">أضف منتجات جديدة، غيّر الصور والأسعار، أو احذف ما لا تحتاجه.</p>
        </div>
        <Button size="lg" onClick={() => setEditing("new")}>
          <Plus /> إضافة منتج
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="إجمالي المنتجات" value={total} />
        <Stat label="ظاهر في المتجر" value={active} />
        <Stat label="نفد من المخزون" value={out} />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم أو الموديل أو الكود…" className="ps-9" aria-label="بحث" />
        </div>
        <FilterSelect value={category} onChange={setCategory} label="كل الأقسام" options={CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))} />
        <FilterSelect value={system} onChange={setSystem} label="كل الأنظمة" options={SYSTEMS.map((s) => ({ value: s.slug, label: s.label }))} />
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="كل الحالات"
          options={[
            { value: "active", label: "ظاهر" },
            { value: "hidden", label: "مخفي" },
            { value: "out", label: "نفد المخزون" },
          ]}
        />
      </div>

      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => replaceImage(e.target.files)} />

      {products.isLoading ? (
        <div className="grid place-items-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>
      ) : products.isError ? (
        <p className="rounded-2xl border bg-card p-8 text-center text-destructive">تعذر تحميل المنتجات: {(products.error as Error).message}</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-12 text-center">
          <Package className="size-10 text-muted-foreground" />
          <p className="font-bold">لا توجد منتجات مطابقة</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">عرض {filtered.length} من {total} منتج</p>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <ul className="divide-y">
              {filtered.map((p) => (
                <li key={p.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => pickImage(p)}
                    className="group relative size-20 shrink-0 overflow-hidden rounded-xl border bg-surface"
                    aria-label={`تغيير صورة ${p.name}`}
                    title="تغيير الصورة"
                  >
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-contain p-1" loading="lazy" />
                    ) : (
                      <Package className="m-auto size-8 text-muted-foreground" />
                    )}
                    <span className="absolute inset-0 grid place-items-center bg-primary/70 text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      <ImageUp className="size-6" />
                    </span>
                    {uploadingId === p.id && (
                      <span className="absolute inset-0 grid place-items-center bg-card/80"><Loader2 className="animate-spin" /></span>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground" dir="ltr">
                      {[p.model, p.sku].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{categoryLabel(p.category)}</Badge>
                      <Badge variant="outline">{systemLabel(p.system)}</Badge>
                      {p.featured && <Badge className="bg-brand-green text-primary-foreground">مميز</Badge>}
                      {p.stock <= 0 && <Badge variant="destructive">نفد</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:w-44 sm:flex-col sm:items-end sm:gap-0.5">
                    <span className="font-black text-primary">{formatPrice(p.price)}</span>
                    <span className="text-xs text-muted-foreground">المخزون: {p.stock}</span>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold sm:w-24 sm:flex-col">
                    <Switch
                      checked={p.is_active}
                      onCheckedChange={(v) => patch.mutate({ id: p.id, values: { is_active: v } })}
                      aria-label="ظاهر في المتجر"
                    />
                    {p.is_active ? "ظاهر" : "مخفي"}
                  </label>

                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" onClick={() => pickImage(p)} aria-label="تغيير الصورة" title="تغيير الصورة"><ImageUp /></Button>
                    <Button variant="outline" size="icon" onClick={() => setEditing(p)} aria-label="تعديل" title="تعديل"><Pencil /></Button>
                    {p.is_active && (
                      <Button asChild variant="ghost" size="icon" title="عرض في المتجر">
                        <Link to="/products/$slug" params={{ slug: p.slug }} target="_blank" aria-label="عرض في المتجر"><Eye /></Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleting(p)} aria-label="حذف" title="حذف"><Trash2 /></Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "إضافة منتج جديد" : "تعديل المنتج"}</DialogTitle>
            <DialogDescription>الحقول المعلّمة بـ * مطلوبة. اضغط على مربع الصورة لرفع صورة من جهازك.</DialogDescription>
          </DialogHeader>
          {editing !== null && (
            <ProductForm
              key={editing === "new" ? "new" : editing.id}
              initial={editing === "new" ? emptyDraft() : draftFromProduct(editing)}
              submitting={save.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={(values) => save.mutate({ values, id: editing === "new" ? undefined : editing.id })}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المنتج نهائياً؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف «{deleting?.name}» من المتجر ولا يمكن التراجع. لإخفائه مؤقتاً فقط استخدم زر «ظاهر/مخفي».
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                if (deleting) remove.mutate(deleting.id);
              }}
              disabled={remove.isPending}
            >
              {remove.isPending && <Loader2 className="animate-spin" />} حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full lg:w-44" aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}</SelectItem>
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
