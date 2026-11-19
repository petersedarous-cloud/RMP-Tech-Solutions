import type { z } from "zod";
import type { productSchema } from "@/components/admin/ProductForm";

type Values = z.output<typeof productSchema>;

// Converts validated form values into a products row; blank optional text becomes null.
export function toProductRow(v: Values) {
  const orNull = (s: string) => (s.trim() ? s.trim() : null);
  return {
    name: v.name.trim(),
    model: orNull(v.model),
    sku: orNull(v.sku),
    category: v.category,
    system: v.system,
    short_description: orNull(v.short_description),
    description: orNull(v.description),
    specs: v.specs,
    price: v.price,
    compare_at_price: v.compare_at_price === "" ? null : v.compare_at_price,
    stock: v.stock,
    image_url: orNull(v.image_url),
    gallery: v.gallery,
    featured: v.featured,
    is_active: v.is_active,
  };
}
