import { queryOptions } from "@tanstack/react-query";
import { getProduct, listProducts } from "./products.functions";

export type ProductFilters = {
  category?: string;
  system?: string;
  q?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest";
};

export const productsQuery = (filters: ProductFilters & { featured?: boolean; limit?: number }) =>
  queryOptions({
    queryKey: ["products", filters],
    queryFn: () => listProducts({ data: filters }),
    staleTime: 60_000,
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProduct({ data: { slug } }),
    staleTime: 60_000,
  });
