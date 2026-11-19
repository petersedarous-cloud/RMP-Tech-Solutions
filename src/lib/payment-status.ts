// Pure rules for turning a payment-gateway confirmation into order changes.
// Shared by the gateway webhook (server) and covered by unit tests.

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "غير مدفوع",
  pending: "في انتظار الدفع",
  paid: "مدفوع",
  failed: "فشل الدفع",
  refunded: "مسترد",
};

export const ORDER_CURRENCY = "EGP";

export type GatewayEvent = {
  kind: "paid" | "failed" | "refunded";
  /** Amount in the smallest currency unit (piasters for EGP). */
  amountCents: number;
  currency: string;
  reference: string;
};

export type OrderPaymentState = { total: number; payment_status: string; status: string };

export type PaymentUpdate =
  | { ok: true; payment_status: PaymentStatus; status: string; markPaidNow: boolean }
  | { ok: false; reason: "amount_mismatch" | "already_paid" | "not_paid" | "duplicate" };

export function toCents(total: number) {
  return Math.round(total * 100);
}

export function applyGatewayEvent(order: OrderPaymentState, ev: GatewayEvent): PaymentUpdate {
  if (ev.kind === "paid") {
    if (order.payment_status === "paid") return { ok: false, reason: "duplicate" };
    if (ev.currency.toUpperCase() !== ORDER_CURRENCY || ev.amountCents !== toCents(order.total)) {
      return { ok: false, reason: "amount_mismatch" };
    }
    return { ok: true, payment_status: "paid", status: order.status === "new" ? "paid" : order.status, markPaidNow: true };
  }
  if (ev.kind === "failed") {
    // A late failure notice must never undo a confirmed payment.
    if (order.payment_status === "paid" || order.payment_status === "refunded") return { ok: false, reason: "already_paid" };
    return { ok: true, payment_status: "failed", status: order.status, markPaidNow: false };
  }
  if (order.payment_status !== "paid") return { ok: false, reason: "not_paid" };
  return { ok: true, payment_status: "refunded", status: order.status, markPaidNow: false };
}
