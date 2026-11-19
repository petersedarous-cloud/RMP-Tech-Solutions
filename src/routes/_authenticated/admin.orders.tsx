import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, ClipboardList, Loader2, MessageCircle, Phone, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

const STATUSES = [
  { value: "new", label: "جديد" },
  { value: "contacted", label: "تم التواصل" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
] as const;

type OrderItem = { name: string; model?: string | null; qty: number; price: number; line_total: number };

function AdminOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم تحديث حالة الطلب");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e) => toast.error("تعذر التحديث", { description: (e as Error).message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حذف الطلب");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e) => toast.error("تعذر الحذف", { description: (e as Error).message }),
  });

  const list = (orders.data ?? []).filter((o) => filter === "all" || o.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black md:text-3xl">الطلبات</h1>
          <p className="text-sm text-muted-foreground">طلبات العملاء من السلة (واتساب وطلب شراء).</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44" aria-label="الحالة"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {orders.isLoading ? (
        <div className="grid place-items-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-12 text-center">
          <ClipboardList className="size-10 text-muted-foreground" />
          <p className="font-bold">لا توجد طلبات بعد</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((o) => {
            const items = (Array.isArray(o.items) ? o.items : []) as unknown as OrderItem[];
            const isOpen = open === o.id;
            return (
              <li key={o.id} className="rounded-2xl border bg-card">
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <button type="button" onClick={() => setOpen(isOpen ? null : o.id)} className="flex min-w-0 flex-1 items-center gap-3 text-start">
                    <ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    <div className="min-w-0">
                      <p className="font-extrabold">طلب #{o.order_number} — {o.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString("ar-EG")} · {items.length} منتج ·{" "}
                        {o.payment_method === "whatsapp" ? "واتساب" : "طلب شراء"}
                      </p>
                    </div>
                  </button>
                  <span className="font-black text-primary">{formatPrice(Number(o.total))}</span>
                  <Select value={o.status} onValueChange={(status) => update.mutate({ id: o.id, status })}>
                    <SelectTrigger className="w-36" aria-label="حالة الطلب"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                  {o.status === "new" && <Badge className="bg-brand-green text-primary-foreground">جديد</Badge>}
                </div>
                {isOpen && (
                  <div className="grid gap-4 border-t p-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1 text-sm">
                      <p><b>الموبايل:</b> <span dir="ltr">{o.phone}</span></p>
                      {o.email && <p><b>البريد:</b> <span dir="ltr">{o.email}</span></p>}
                      {o.city && <p><b>المدينة:</b> {o.city}</p>}
                      {o.address && <p><b>العنوان:</b> {o.address}</p>}
                      {o.notes && <p><b>ملاحظات:</b> {o.notes}</p>}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline"><a href={`tel:${o.phone}`}><Phone /> اتصال</a></Button>
                        <Button asChild size="sm" variant="outline">
                          <a href={`https://wa.me/${o.phone.replace(/\D/g, "").replace(/^0/, "20")}`} target="_blank" rel="noreferrer"><MessageCircle /> واتساب</a>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => confirm("حذف هذا الطلب نهائياً؟") && remove.mutate(o.id)}
                        >
                          <Trash2 /> حذف
                        </Button>
                      </div>
                    </div>
                    <ul className="divide-y rounded-xl border text-sm">
                      {items.map((it, i) => (
                        <li key={i} className="flex justify-between gap-3 p-2">
                          <span>{it.name} {it.model && <span className="text-xs text-muted-foreground" dir="ltr">({it.model})</span>} × {it.qty}</span>
                          <span className="font-bold">{formatPrice(Number(it.line_total))}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
