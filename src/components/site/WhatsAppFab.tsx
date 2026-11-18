import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/catalog";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("مرحباً RMP Tech، أريد الاستفسار عن منتجاتكم")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-5 start-5 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift transition-transform hover:scale-110"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
