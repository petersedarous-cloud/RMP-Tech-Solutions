// Shared, browser-safe catalog vocabulary used by the store and the admin.

export const CATEGORIES = [
  { slug: "smart-locks", label: "الأقفال الذكية", icon: "lock" },
  { slug: "switches", label: "المفاتيح الذكية", icon: "switch" },
  { slug: "knx", label: "أجهزة KNX", icon: "knx" },
  { slug: "sensors", label: "الحساسات", icon: "sensor" },
  { slug: "modules", label: "الموديولات المخفية", icon: "module" },
  { slug: "panels", label: "شاشات التحكم", icon: "panel" },
  { slug: "gateways", label: "البوابات", icon: "gateway" },
  { slug: "hotel", label: "أنظمة الفنادق", icon: "hotel" },
  { slug: "curtains", label: "الستائر الذكية", icon: "curtain" },
  { slug: "breakers", label: "القواطع الذكية", icon: "breaker" },
  { slug: "access", label: "التحكم بالدخول", icon: "access" },
  { slug: "accessories", label: "إكسسوارات", icon: "accessory" },
] as const;

export const SYSTEMS = [
  { slug: "knx", label: "KNX" },
  { slug: "zigbee", label: "Zigbee" },
  { slug: "wifi", label: "Wi-Fi" },
  { slug: "standalone", label: "مستقل / RFID" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type SystemSlug = (typeof SYSTEMS)[number]["slug"];

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
export function systemLabel(slug: string) {
  return SYSTEMS.find((s) => s.slug === slug)?.label ?? slug;
}

export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  model: string | null;
  sku: string | null;
  category: string;
  system: string;
  short_description: string | null;
  description: string | null;
  specs: Spec[];
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  gallery: string[];
  stock: number;
  featured: boolean;
  is_active: boolean;
};

export function toSpecs(value: unknown): Spec[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => !!v && typeof v === "object")
    .map((v) => ({ label: String(v.label ?? ""), value: String(v.value ?? "") }))
    .filter((s) => s.label || s.value);
}

const egp = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 });
export function formatPrice(value: number) {
  return `${egp.format(value)} ج.م`;
}

export function discountPercent(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const COMPANY = {
  name: "RMP Tech Solutions",
  phones: ["01277277076", "01033774440"],
  whatsapp: "201033774440",
  whatsappDisplay: "01033774440",
  email: "info@rmp-eg.com",
  website: "www.rmp-eg.com",
  address: "جمهورية مصر العربية - القاهرة",
  social: "@rmptechsolutions",
} as const;
