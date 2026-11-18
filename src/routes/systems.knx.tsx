import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Infinity as InfinityIcon,
  Cable,
  Layers,
  ShieldCheck,
  Gauge,
  Building2,
  Hotel,
  Home,
  Building,
  Lock,
  ToggleRight,
  Radar,
  MonitorSmartphone,
} from "lucide-react";
import knxImg from "@/assets/knx-cabinet.jpg";
import { SystemPage } from "@/components/site/SystemPage";
import { KnxBusDiagram } from "@/components/site/SystemDiagrams";
import { productsQuery } from "@/lib/queries";

const knxQ = productsQuery({ system: "knx", limit: 8 });

export const Route = createFileRoute("/systems/knx")({
  head: () => ({
    meta: [
      { title: "نظام KNX للمنازل والفنادق | RMP Tech" },
      { name: "description", content: "نظام KNX السلكي من RMP Tech: فوائده ومميزاته، آلية عمله، حالات الاستخدام في الفلل والفنادق، وتكامله مع الأقفال الذكية والمفاتيح." },
      { property: "og:title", content: "نظام KNX للمنازل والفنادق | RMP Tech" },
      { property: "og:description", content: "المعيار العالمي للأتمتة الاحترافية — تصميم وتركيب وبرمجة من RMP Tech." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(knxQ);
  },
  component: KnxPage,
});

function KnxPage() {
  const { data } = useSuspenseQuery(knxQ);
  return (
    <SystemPage
      tag="KNX CERTIFIED"
      title={<>نظام <span className="text-brand-green">KNX</span> — المعيار العالمي للأتمتة الاحترافية</>}
      intro="KNX هو البروتوكول العالمي المفتوح للتحكم في المباني، يستخدمه أكثر من 500 مصنع حول العالم. كل الأجهزة تتصل عبر كابل واحد وتتحدث مع بعضها مباشرة، فيعطيك استقراراً مطلقاً وعمراً افتراضياً يمتد لعقود."
      image={knxImg}
      imageAlt="لوحة تحكم KNX"
      highlights={["معتمد عالمياً ISO/IEC 14543", "بدون اعتماد على الإنترنت", "عمر افتراضي +25 سنة"]}
      features={[
        { icon: ShieldCheck, title: "استقرار مطلق", text: "نظام سلكي لا مركزي: إذا تعطل جهاز تستمر باقي الأجهزة في العمل بدون أي تأثير." },
        { icon: InfinityIcon, title: "عمر افتراضي طويل", text: "أجهزة صناعية مصممة للعمل لعقود، مع توافق دائم بين الإصدارات القديمة والجديدة." },
        { icon: Layers, title: "توافق بين العلامات", text: "أجهزة من مصنعين مختلفين تعمل معاً على نفس الخط، فلا تكون مقيداً بشركة واحدة." },
        { icon: Cable, title: "كابل واحد لكل شيء", text: "الإضاءة والستائر والتكييف والحساسات على ناقل واحد، مما يقلل التمديدات ويسهل التوسعة." },
        { icon: Gauge, title: "توفير الطاقة", text: "حساسات الحضور وجدولة الأحمال وإيقاف الخدمات تلقائياً تقلل فاتورة الكهرباء حتى 30%." },
        { icon: Building2, title: "قابل للتوسع", text: "من شقة صغيرة إلى برج كامل أو فندق بمئات الغرف بنفس البنية التحتية." },
      ]}
      diagram={<KnxBusDiagram />}
      diagramTitle="ناقل واحد يربط كل الأجهزة"
      diagramText="يتم تمديد كابل KNX (زوج مجدول أخضر) بجانب كهرباء المبنى. مزود الطاقة يغذي الخط، والمفاتيح والحساسات ترسل أوامرها مباشرة للمشغلات في لوحة الكهرباء."
      steps={[
        { title: "الأوامر", text: "تضغط زر في لوحة المفاتيح أو يكتشف الحساس وجود شخص." },
        { title: "الناقل", text: "يرسل الجهاز رسالة صغيرة على خط KNX لكل الأجهزة المعنية." },
        { title: "التنفيذ", text: "المشغل في اللوحة يشغل الإضاءة أو يحرك الستارة أو يضبط التكييف فوراً." },
        { title: "التحكم عن بعد", text: "راوتر IP يربط النظام بالتطبيق وبأنظمة الفنادق وبالمساعدات الصوتية." },
      ]}
      useCases={[
        { icon: Home, title: "الفلل والقصور", text: "تحكم كامل في كل غرفة بمشاهد مخصصة وتكامل مع الصوتيات والكاميرات.", points: ["مشاهد استقبال وسينما ونوم", "تحكم مركزي من شاشة لمس", "أمان وإنذار متكامل"] },
        { icon: Hotel, title: "الفنادق والمنتجعات", text: "إدارة ذكية للغرف من الكارت حتى خدمة الغرف مع ربط مباشر بنظام PMS.", points: ["تفعيل الغرفة بالكارت", "Do Not Disturb / Make Up Room", "توفير الطاقة عند خروج النزيل"] },
        { icon: Building, title: "المكاتب والمباني", text: "إضاءة وتكييف حسب الإشغال وجدولة كاملة للمبنى من غرفة تحكم واحدة.", points: ["حساسات حضور وإضاءة نهارية", "جدولة ساعات العمل", "تقارير استهلاك الطاقة"] },
      ]}
      integrations={[
        { icon: Lock, title: "الأقفال الذكية", text: "فتح القفل يفعّل مشهد الترحيب: إضاءة المدخل والتكييف والستائر.", category: "smart-locks" },
        { icon: ToggleRight, title: "لوحات المفاتيح", text: "لوحات زجاجية KNX بأزرار قابلة للبرمجة لأي وظيفة أو مشهد.", category: "knx" },
        { icon: Radar, title: "الحساسات", text: "حساسات الحضور والحرارة تدير الإضاءة والتكييف تلقائياً.", category: "sensors" },
        { icon: MonitorSmartphone, title: "أنظمة الفنادق", text: "وحدات تحكم الغرف ومفاتيح الكارت مع أقفال الفنادق.", category: "hotel" },
      ]}
      productsTitle="أجهزة KNX المتوفرة"
      products={data}
      productsSearch={{ system: "knx" }}
      other={{ to: "/systems/zigbee", label: "نظام Zigbee اللاسلكي" }}
    />
  );
}
