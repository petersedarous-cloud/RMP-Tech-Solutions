// Pure cart math shared by the browser cart, the WhatsApp message and the server order check.

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  model: string | null;
  price: number;
  image: string | null;
  qty: number;
};

export const MAX_QTY_PER_LINE = 99;

export function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY_PER_LINE, Math.max(1, Math.floor(qty)));
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

export function cartTotal(lines: { price: number; qty: number }[]) {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const existing = lines.find((l) => l.productId === line.productId);
  if (existing) {
    return lines.map((l) =>
      l.productId === line.productId ? { ...l, qty: clampQty(l.qty + line.qty) } : l,
    );
  }
  return [...lines, { ...line, qty: clampQty(line.qty) }];
}

export type WhatsAppCustomer = { name: string; phone: string; city?: string; address?: string; notes?: string };

export function buildWhatsAppOrderText(
  lines: CartLine[],
  customer: WhatsAppCustomer,
  formatPrice: (n: number) => string,
  orderNumber?: number | null,
) {
  const rows = lines.map(
    (l, i) =>
      `${i + 1}. ${l.name}${l.model ? ` (${l.model})` : ""}\n   الكمية: ${l.qty} × ${formatPrice(l.price)} = ${formatPrice(l.price * l.qty)}`,
  );
  const parts = [
    orderNumber ? `طلب جديد رقم #${orderNumber} من موقع RMP Tech` : "طلب جديد من موقع RMP Tech",
    "",
    ...rows,
    "",
    `الإجمالي: ${formatPrice(cartTotal(lines))}`,
    "",
    `الاسم: ${customer.name}`,
    `الموبايل: ${customer.phone}`,
  ];
  if (customer.city) parts.push(`المدينة: ${customer.city}`);
  if (customer.address) parts.push(`العنوان: ${customer.address}`);
  if (customer.notes) parts.push(`ملاحظات: ${customer.notes}`);
  return parts.join("\n");
}

export function whatsappUrl(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
