import { supabase } from "@/integrations/supabase/client";

const BUCKET = "product-images";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

// The bucket is private (public buckets are blocked for this workspace), so uploads get a
// long-lived signed URL that is stored on the product row and served to visitors.
export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("الملف يجب أن يكون صورة");
  if (file.size > 10 * 1024 * 1024) throw new Error("أقصى حجم للصورة 10 ميجا");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const { data, error: signError } = await supabase.storage.from(BUCKET).createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw new Error(signError?.message ?? "تعذر إنشاء رابط الصورة");
  return data.signedUrl;
}

export function slugify(input: string) {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : `product-${suffix}`;
}
