import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, Phone } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { COMPANY } from "@/lib/catalog";

const NAV = [
  { to: "/", label: "الرئيسية", exact: true },
  { to: "/products", label: "المنتجات" },
  { to: "/systems/knx", label: "نظام KNX" },
  { to: "/systems/zigbee", label: "نظام Zigbee" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="hidden bg-ink text-ink-muted md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
          <span>حلول المنزل الذكي والأوتوميشن • KNX • Zigbee • Wi-Fi • الأقفال الذكية</span>
          <a href={`tel:${COMPANY.phones[0]}`} className="inline-flex items-center gap-1.5 hover:text-ink-foreground" dir="ltr">
            <Phone className="size-3.5" /> {COMPANY.phones[0]}
          </a>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="RMP Tech - الرئيسية">
          <Logo className="h-11 md:h-14" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-lg font-extrabold text-primary">RMP Tech</span>
            <span className="text-[11px] font-medium text-brand-green">Smart Home & Automation</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: "exact" in n }}
              className="rounded-lg px-3 py-2 text-sm font-bold text-foreground/75 transition-colors hover:bg-secondary hover:text-primary data-[status=active]:text-primary data-[status=active]:bg-secondary"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon" className="relative rounded-xl">
            <Link to="/cart" aria-label="السلة">
              <ShoppingCart />
              {count > 0 && (
                <span className="absolute -end-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild variant="default" className="hidden rounded-xl md:inline-flex">
            <Link to="/contact">اطلب استشارة</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="القائمة">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">القائمة</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                <Logo className="mb-6 h-16 self-start" />
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: "exact" in n }}
                    className="rounded-lg px-3 py-3 font-bold text-foreground/80 hover:bg-secondary data-[status=active]:bg-secondary data-[status=active]:text-primary"
                  >
                    {n.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
