import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProtocolBadge } from "./ProtocolBadge";
import { categoryLabel, discountPercent, formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const off = discountPercent(product.price, product.compare_at_price);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-card"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            width={600}
            height={600}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full circuit-grid-light" />
        )}
        <div className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
          <ProtocolBadge system={product.system} className="bg-card/90 backdrop-blur" />
        </div>
        {off > 0 && (
          <span className="absolute end-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
            خصم {off}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 border-t p-4">
        <span className="text-xs font-medium text-muted-foreground">{categoryLabel(product.category)}</span>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 min-h-[2.75rem] font-bold leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        {product.model && <span className="font-mono text-xs text-muted-foreground" dir="ltr">{product.model}</span>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
            {off > 0 && product.compare_at_price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
          <Button
            size="icon"
            variant="brand"
            aria-label="أضف إلى السلة"
            disabled={product.stock <= 0}
            onClick={() => {
              add({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                model: product.model,
                price: product.price,
                image: product.image_url,
              });
              toast.success("تمت الإضافة إلى السلة", { description: product.name });
            }}
          >
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </article>
  );
}
