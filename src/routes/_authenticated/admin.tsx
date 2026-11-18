import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, ClipboardList, ExternalLink, LogOut, ShieldAlert, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | RMP Tech" },
      { name: "description", content: "إدارة منتجات وطلبات متجر RMP Tech." },
      { property: "og:title", content: "لوحة التحكم | RMP Tech" },
      { property: "og:description", content: "إدارة منتجات وطلبات متجر RMP Tech." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (role.isLoading) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (!role.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <ShieldAlert className="size-14 text-destructive" />
        <h1 className="text-2xl font-black">لا تملك صلاحية الدخول للوحة التحكم</h1>
        <p className="max-w-md text-muted-foreground">الحساب <b dir="ltr">{user.email}</b> ليس حساب المدير. سجّل الدخول بحساب المدير المعتمد.</p>
        <div className="flex gap-2">
          <Button onClick={signOut}><LogOut /> تسجيل الخروج</Button>
          <Button asChild variant="outline"><Link to="/">العودة للموقع</Link></Button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "المنتجات", icon: Package, exact: true },
    { to: "/admin/orders", label: "الطلبات", icon: ClipboardList, exact: false },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-surface md:flex-row">
      <aside className="flex shrink-0 flex-col bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-64">
        <div className="flex items-center gap-3 border-b border-sidebar-border p-5">
          <Logo variant="white" className="h-12" />
          <div className="leading-tight">
            <p className="font-extrabold">RMP Tech</p>
            <p className="text-xs text-ink-muted">لوحة التحكم</p>
          </div>
        </div>
        <nav className="flex gap-1 p-3 md:flex-col">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-sidebar-foreground/80 hover:bg-sidebar-accent data-[status=active]:bg-sidebar-primary data-[status=active]:text-sidebar-primary-foreground"
            >
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden flex-col gap-1 border-t border-sidebar-border p-3 md:flex">
          <Link to="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-sidebar-foreground/80 hover:bg-sidebar-accent">
            <ExternalLink className="size-4" /> عرض الموقع
          </Link>
          <button onClick={signOut} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-bold text-sidebar-foreground/80 hover:bg-sidebar-accent">
            <LogOut className="size-4" /> تسجيل الخروج
          </button>
          <p className="truncate px-3 pt-2 text-xs text-ink-muted" dir="ltr">{user.email}</p>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
