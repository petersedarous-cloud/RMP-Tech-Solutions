import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { CategoryIcon } from "@/components/site/CategoryIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, SYSTEMS, categoryLabel, systemLabel } from "@/lib/catalog";
import { productsQuery, type ProductFilters } from "@/lib/queries";
import { cn } from "@/lib/utils";

const SORTS = ["featured", "price-asc", "price-desc", "newest"] as const;

export const Route = createFileRoute("/products/")({
  validateSearch: (s: Record<string, unknown>): ProductFilters => ({
    category: typeof s.category === "string" && s.category ? s.category : undefined,
    system: typeof s.system === "string" && s.system ? s.system : undefined,
    q: typeof s.q === "string" && s.q ? s.q.slice(0, 100) : undefined,
    sort: SORTS.includes(s.sort as (typeof SORTS)[number]) ? (s.sort as ProductFilters["sort"]) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(productsQuery(deps));
  },
  head: () => ({
    meta: [
      { title: "منتجات المنزل الذكي | أقفال ذكية ومفاتيح وحساسات - RMP Tech" },
      {
        name: "description",
        content: "تصفح أكثر من 130 منتج: أقفال ذكية، مفاتيح لمس، حساسات Zigbee، أجهزة KNX، شاشات تحكم وقواطع ذكية بأسعار بالجنيه المصري.",
      },
      { property: "og:title", content: "منتجات RMP Tech للمنزل الذكي" },
      { property: "og:description", content: "أقفال ذكية، مفاتيح، حساسات، KNX و Zigbee — اطلب أونلاين." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/products/" });
  const { data: products } = useSuspenseQuery(productsQuery(search));
  const [q, setQ] = useState(search.q ?? "");

  useEffect(() => setQ(search.q ?? ""), [search.q]);
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? "") !== q.trim()) {
        navigate({ search: (prev) => ({ ...prev, q: q.trim() || undefined }), replace: true });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [q, search.q, navigate]);

  const title = search.category ? categoryLabel(search.category) : search.system ? `منتجات ${systemLabel(search.system)}` : "كل المنتجات";
  const hasFilters = !!(search.category || search.system || search.q);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-gradient text-ink-foreground">
        <div className="absolute inset-0 circuit-grid opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
          <nav className="text-sm text-ink-muted">
            <Link to="/" className="hover:text-ink-foreground">الرئيسية</Link> / <span>المنتجات</span>
          </nav>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">{title}</h1>
          <p className="mt-2 text-ink-muted">{products.length} منتج متاح</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-8">
            <FilterGroup title="الأقسام">
              <FilterLink active={!search.category} search={{ ...search, category: undefined }} label="الكل" />
              {CATEGORIES.map((c) => (
                <FilterLink
                  key={c.slug}
                  active={search.category === c.slug}
                  search={{ ...search, category: c.slug }}
                  label={c.label}
                  icon={<CategoryIcon slug={c.slug} className="size-4" />}
                />
              ))}
            </FilterGroup>
            <FilterGroup title="النظام">
              <FilterLink active={!search.system} search={{ ...search, system: undefined }} label="كل الأنظمة" />
              {SYSTEMS.map((s) => (
                <FilterLink key={s.slug} active={search.system === s.slug} search={{ ...search, system: s.slug }} label={s.label} />
              ))}
            </FilterGroup>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث بالاسم أو الموديل أو الكود..."
                className="h-11 rounded-xl bg-card ps-10"
                aria-label="بحث"
              />
            </div>
            <Select
              value={search.sort ?? "featured"}
              onValueChange={(v) => navigate({ search: (prev) => ({ ...prev, sort: v === "featured" ? undefined : (v as ProductFilters["sort"]) }) })}
            >
              <SelectTrigger className="h-11 w-full rounded-xl bg-card sm:w-52" aria-label="ترتيب">
                <SlidersHorizontal className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">المميز أولاً</SelectItem>
                <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
                <SelectItem value="price-desc">السعر: من الأعلى</SelectItem>
                <SelectItem value="newest">الأحدث</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* mobile chips */}
          <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-2 lg:hidden">
            <Chip active={!search.category} search={{ ...search, category: undefined }} label="الكل" />
            {CATEGORIES.map((c) => (
              <Chip key={c.slug} active={search.category === c.slug} search={{ ...search, category: c.slug }} label={c.label} />
            ))}
          </div>
          <div className="-mx-6 mt-2 flex gap-2 overflow-x-auto px-6 pb-2 lg:hidden">
            {SYSTEMS.map((s) => (
              <Chip key={s.slug} active={search.system === s.slug} search={{ ...search, system: search.system === s.slug ? undefined : s.slug }} label={s.label} />
            ))}
          </div>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              {search.category && <Pill label={categoryLabel(search.category)} search={{ ...search, category: undefined }} />}
              {search.system && <Pill label={systemLabel(search.system)} search={{ ...search, system: undefined }} />}
              {search.q && <Pill label={`"${search.q}"`} search={{ ...search, q: undefined }} />}
              <Button asChild variant="link" size="sm">
                <Link to="/products" search={{}}>مسح الكل</Link>
              </Button>
            </div>
          )}

          {products.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
              <Search className="size-10 text-muted-foreground" />
              <p className="text-lg font-bold">لا توجد منتجات مطابقة</p>
              <p className="text-sm text-muted-foreground">جرّب كلمة بحث أخرى أو امسح الفلاتر.</p>
              <Button asChild variant="outline">
                <Link to="/products" search={{}}>عرض كل المنتجات</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-extrabold text-muted-foreground">{title}</h3>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function FilterLink({ active, search, label, icon }: { active: boolean; search: ProductFilters; label: string; icon?: React.ReactNode }) {
  return (
    <Link
      to="/products"
      search={search}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-secondary",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

function Chip({ active, search, label }: { active: boolean; search: ProductFilters; label: string }) {
  return (
    <Link
      to="/products"
      search={search}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground/75",
      )}
    >
      {label}
    </Link>
  );
}

function Pill({ label, search }: { label: string; search: ProductFilters }) {
  return (
    <Link to="/products" search={search} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-bold text-secondary-foreground">
      {label} <X className="size-3.5" />
    </Link>
  );
}
