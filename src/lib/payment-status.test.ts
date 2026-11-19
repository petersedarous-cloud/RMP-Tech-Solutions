import { describe, expect, it } from "vitest";
import { applyGatewayEvent } from "./payment-status";

const pending = { total: 1250.5, payment_status: "pending", status: "new" };
const paidEvent = { kind: "paid" as const, amountCents: 125050, currency: "EGP", reference: "tx-1" };

describe("applyGatewayEvent", () => {
  it("marks a pending order paid when the confirmed amount matches the order total", () => {
    expect(applyGatewayEvent(pending, paidEvent)).toEqual({ ok: true, payment_status: "paid", status: "paid", markPaidNow: true });
  });

  it("refuses to mark paid when the paid amount differs from the order total", () => {
    expect(applyGatewayEvent(pending, { ...paidEvent, amountCents: 100 })).toEqual({ ok: false, reason: "amount_mismatch" });
  });

  it("refuses to mark paid when the currency is not EGP", () => {
    expect(applyGatewayEvent(pending, { ...paidEvent, currency: "USD" })).toEqual({ ok: false, reason: "amount_mismatch" });
  });

  it("ignores a repeated payment confirmation", () => {
    expect(applyGatewayEvent({ ...pending, payment_status: "paid" }, paidEvent)).toEqual({ ok: false, reason: "duplicate" });
  });

  it("never lets a failure notice undo a confirmed payment", () => {
    expect(applyGatewayEvent({ ...pending, payment_status: "paid" }, { ...paidEvent, kind: "failed" })).toEqual({ ok: false, reason: "already_paid" });
  });

  it("keeps the admin's order status when it was already moved past new", () => {
    const r = applyGatewayEvent({ ...pending, status: "contacted" }, paidEvent);
    expect(r.ok && r.status).toBe("contacted");
  });
});
