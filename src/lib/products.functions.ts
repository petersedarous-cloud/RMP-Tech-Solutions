import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toSpecs, type Product } from "./catalog";

const COLUMNS =
  "id,slug,name,model,sku,category,system,short_description,description,specs,price,compare_at_price,image_url,gallery,stock,featured,is_active";

function normalize(row: Record<string, unknown>): Product {
  return {
    ...(row as unknown as Product),
    price: Number(row.price ?? 0),
    compare_at_price: row.compare_at_price == null ? null : Number(row.compare_at_price),
    specs: toSpecs(row.specs),
    gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : [],
  };
}

const listInput = z.object({
  category: z.string().max(40).optional(),
  system: z.string().max(40).optional(),
  q: z.string().max(100).optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "newest"]).optional(),
  featured: z.boolean().optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d: z.input<typeof listInput>) => listInput.parse(d))
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./public-client.server");
    const sb = createPublicClient();
    let q = sb.from("products").select(COLUMNS).eq("is_active", true);
    if (data.category) q = q.eq("category", data.category);
    if (data.system) q = q.eq("system", data.system);
    if (data.featured) q = q.eq("featured", true);
    if (data.q) {
      const term = data.q.replace(/[%,()]/g, " ").trim();
      if (term) q = q.or(`name.ilike.%${term}%,model.ilike.%${term}%,sku.ilike.%${term}%`);
    }
    switch (data.sort) {
      case "price-asc":
        q = q.order("price", { ascending: true });
        break;
      case "price-desc":
        q = q.order("price", { ascending: false });
        break;
      case "newest":
        q = q.order("created_at", { ascending: false });
        break;
      default:
        q = q.order("featured", { ascending: false }).order("created_at", { ascending: true });
    }
    const { data: rows, error } = await q.limit(data.limit ?? 500);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => normalize(r as Record<string, unknown>));
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./public-client.server");
    const sb = createPublicClient();
    const { data: row, error } = await sb
      .from("products")
      .select(COLUMNS)
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const product = normalize(row as Record<string, unknown>);
    const { data: related } = await sb
      .from("products")
      .select(COLUMNS)
      .eq("is_active", true)
      .eq("category", product.category)
      .neq("id", product.id)
      .order("featured", { ascending: false })
      .limit(4);
    return { product, related: (related ?? []).map((r) => normalize(r as Record<string, unknown>)) };
  });
