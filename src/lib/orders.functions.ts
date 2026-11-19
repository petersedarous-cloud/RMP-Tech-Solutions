import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const orderInput = z.object({
  customer_name: z.string().trim().min(2, "الاسم قصير").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{8,20}$/, "رقم الموبايل غير صحيح"),
  email: z.string().trim().email("بريد غير صحيح").max(255).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  payment_method: z.enum(["whatsapp", "request", "card"]),
  items: z
    .array(z.object({ productId: z.string().uuid(), qty: z.number().int().min(1).max(99) }))
    .min(1, "السلة فارغة")
    .max(100),
});

// Public: any visitor can place an order request. Prices and names are re-read from the
// catalog on the server so a tampered cart cannot change what the admin sees.
export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: z.input<typeof orderInput>) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./public-client.server");
    const sb = createPublicClient();
    const ids = [...new Set(data.items.map((i) => i.productId))];
    const { data: products, error } = await sb
      .from("products")
      .select("id,name,model,sku,price,slug")
      .in("id", ids)
      .eq("is_active", true);
    if (error) throw new Error(error.message);
    const byId = new Map((products ?? []).map((p) => [p.id, p]));
    const items = data.items
      .filter((i) => byId.has(i.productId))
      .map((i) => {
        const p = byId.get(i.productId)!;
        const price = Number(p.price);
        return { product_id: p.id, slug: p.slug, name: p.name, model: p.model, sku: p.sku, price, qty: i.qty, line_total: price * i.qty };
      });
    if (items.length === 0) throw new Error("المنتجات غير متاحة حالياً");
    const total = items.reduce((s, i) => s + i.line_total, 0);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error: insertError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        phone: data.phone,
        email: data.email || null,
        city: data.city || null,
        address: data.address || null,
        notes: data.notes || null,
        payment_method: data.payment_method,
        payment_status: data.payment_method === "card" ? "pending" : "unpaid",
        items,
        total,
      })
      .select("id,order_number,total")
      .single();
    if (insertError) throw new Error(insertError.message);
    return { id: order.id, orderNumber: Number(order.order_number), total: Number(order.total), items };
  });

// Public: lets the customer see their own order's payment result after returning from the
// gateway. The order id is an unguessable UUID; only non-personal fields are returned.
export const getOrderPaymentStatus = createServerFn({ method: "GET" })
  .inputValidator((d: { orderId: string }) => z.object({ orderId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("order_number,total,payment_status,payment_method")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) return null;
    return {
      orderNumber: Number(order.order_number),
      total: Number(order.total),
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
    };
  });
