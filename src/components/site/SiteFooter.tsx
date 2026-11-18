import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { CATEGORIES, COMPANY } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink-gradient text-ink-foreground">
      <div className="absolute inset-0 circuit-grid opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo variant="white" className="h-20 self-start" />
          <p className="text-sm leading-relaxed text-ink-muted">
            شركة رائدة في الأنظمة الذكية وحلول الأوتوميشن للمنازل والفنادق والمكاتب والمنشآت التجارية.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold">الأقسام</h3>
          <ul className="grid gap-2 text-sm text-ink-muted">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to="/products" search={{ category: c.slug }} className="hover:text-brand-green">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold">روابط</h3>
          <ul className="grid gap-2 text-sm text-ink-muted">
            <li><Link to="/systems/knx" className="hover:text-brand-green">نظام KNX</Link></li>
            <li><Link to="/systems/zigbee" className="hover:text-brand-green">نظام Zigbee</Link></li>
            <li><Link to="/about" className="hover:text-brand-green">من نحن</Link></li>
            <li><Link to="/contact" className="hover:text-brand-green">تواصل معنا</Link></li>
            <li><Link to="/admin" className="hover:text-brand-green">دخول الإدارة</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold">تواصل معنا</h3>
          <ul className="grid gap-3 text-sm text-ink-muted">
            <li className="flex items-center gap-2"><Phone className="size-4 text-brand-green" /><span dir="ltr">{COMPANY.phones.join(" - ")}</span></li>
            <li className="flex items-center gap-2"><MessageCircle className="size-4 text-brand-green" /><a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" dir="ltr" className="hover:text-brand-green">{COMPANY.whatsappDisplay}</a></li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-brand-green" /><a href={`mailto:${COMPANY.email}`} className="hover:text-brand-green">{COMPANY.email}</a></li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-brand-green" />{COMPANY.address}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-ink-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-ink-muted md:flex-row">
          <span>© {new Date().getFullYear()} RMP Tech Solutions. جميع الحقوق محفوظة.</span>
          <span dir="ltr">{COMPANY.website} • {COMPANY.social}</span>
        </div>
      </div>
    </footer>
  );
}
