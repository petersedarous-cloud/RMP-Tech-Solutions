import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "دخول الإدارة | RMP Tech" },
      { name: "description", content: "تسجيل دخول مدير متجر RMP Tech." },
      { property: "og:title", content: "دخول الإدارة | RMP Tech" },
      { property: "og:description", content: "لوحة تحكم متجر RMP Tech." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width={18} height={18}><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/admin", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) toast.error("تعذر تسجيل الدخول", { description: error.message === "Invalid login credentials" ? "البريد أو كلمة المرور غير صحيحة" : error.message });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setLoading(false);
    if (error) {
      toast.error("تعذر إنشاء الحساب", { description: error.message });
      return;
    }
    if (!data.session) toast.success("تم إنشاء الحساب", { description: "افتح بريدك الإلكتروني واضغط رابط التأكيد ثم سجّل الدخول." });
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) toast.error("تعذر الدخول بجوجل");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-gradient lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute inset-0 circuit-grid opacity-60" aria-hidden />
        <Logo variant="white" className="relative h-64" />
        <p className="relative mt-8 text-xl font-bold text-ink-foreground">لوحة تحكم متجر RMP Tech</p>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary">
            <ArrowRight className="size-4" /> العودة للموقع
          </Link>
          <Logo className="mb-6 h-16 lg:hidden" />
          <h1 className="text-3xl font-black">دخول الإدارة</h1>
          <p className="mt-2 text-sm text-muted-foreground">خاص بمدير المتجر لإدارة المنتجات والطلبات.</p>

          <Button type="button" variant="google" className="mt-6 h-11 w-full" onClick={google}>
            <GoogleIcon /> Continue with Google
          </Button>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />أو بالبريد<span className="h-px flex-1 bg-border" /></div>

          <Tabs defaultValue="signin" dir="rtl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            </TabsList>
            {(["signin", "signup"] as const).map((mode) => (
              <TabsContent key={mode} value={mode}>
                <form onSubmit={mode === "signin" ? signIn : signUp} className="mt-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" autoComplete="email" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>كلمة المرور</Label>
                    <Input type="password" dir="ltr" required minLength={mode === "signup" ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" autoComplete={mode === "signin" ? "current-password" : "new-password"} />
                  </div>
                  <Button type="submit" size="xl" disabled={loading}>
                    {loading && <Loader2 className="animate-spin" />} {mode === "signin" ? "دخول" : "إنشاء الحساب"}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
