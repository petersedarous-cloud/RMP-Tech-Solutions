import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Wifi, BatteryFull, Network, Hammer, Mic, Wallet, Home, Building2, Store, Lock, ToggleRight, Radar, Blinds } from "lucide-react";
import zigbeeImg from "@/assets/zigbee-home.jpg";
import { SystemPage } from "@/components/site/SystemPage";
import { ZigbeeMeshDiagram } from "@/components/site/SystemDiagrams";
import { productsQuery } from "@/lib/queries";

const zigbeeQ = productsQuery({ system: "zigbee", limit: 8 });

export const Route = createFileRoute("/systems/zigbee")({
  head: () => ({
    meta: [
      { title: "نظام Zigbee اللاسلكي للمنزل الذكي | RMP Tech" },
      { name: "description", content: "نظام Zigbee 3.0 من RMP Tech: منزل ذكي بدون تكسير، شبكة Mesh، تكامل مع الأقفال الذكية والمفاتيح والحساسات، وحالات استخدام للشقق والفلل والمحلات." },
      { property: "og:title", content: "نظام Zigbee اللاسلكي | RMP Tech" },
      { property: "og:description", content: "حوّل منزلك لمنزل ذكي بدون أسلاك مع بوابة وأجهزة Zigbee من RMP Tech." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(zigbeeQ);
  },
  component: ZigbeePage,
});

function ZigbeePage() {
  const { data } = useSuspenseQuery(zigbeeQ);
  return (
    <SystemPage
      tag="ZIGBEE 3.0"
      title={<>نظام <span className="text-brand-green">Zigbee</span> — منزل ذكي بدون أسلاك</>}
      intro="Zigbee بروتوكول لاسلكي منخفض الطاقة مصمم خصيصاً للمنازل الذكية. الأجهزة تكوّن شبكة Mesh: كل جهاز يقوي الإشارة لجاره، فتغطي كل أركان المنزل بثبات وبدون إثقال شبكة الواي فاي."
      image={zigbeeImg}
      imageAlt="منزل ذكي بأجهزة Zigbee"
      highlights={["بدون تكسير أو تمديدات", "بطاريات تدوم لسنوات", "يعمل حتى لو انقطع الإنترنت"]}
      features={[
        { icon: Hammer, title: "تركيب بدون تكسير", text: "مثالي للشقق والمنازل القائمة: الأجهزة تُركب في دقائق مكان المفاتيح أو باللاصق." },
        { icon: Network, title: "شبكة Mesh ذاتية", text: "كلما أضفت أجهزة أصبحت الشبكة أقوى وأوسع تغطية تلقائياً." },
        { icon: BatteryFull, title: "استهلاك طاقة منخفض", text: "الحساسات تعمل ببطارية صغيرة لمدة تصل إلى سنتين." },
        { icon: Wifi, title: "لا يثقل الواي فاي", text: "شبكة مستقلة عن الراوتر حتى لو كان عندك عشرات الأجهزة." },
        { icon: Mic, title: "تحكم صوتي", text: "يعمل مع Alexa و Google Assistant وتطبيق Tuya / Smart Life." },
        { icon: Wallet, title: "تكلفة مناسبة", text: "ابدأ ببوابة وأجهزة قليلة ثم توسع تدريجياً حسب ميزانيتك." },
      ]}
      diagram={<ZigbeeMeshDiagram />}
      diagramTitle="البوابة في المنتصف والأجهزة حولها"
      diagramText="البوابة الذكية تتصل بالراوتر وبالتطبيق، وكل الأجهزة تتصل بها لاسلكياً. الأجهزة الموصولة بالكهرباء (مفاتيح، موتور ستائر) تعمل كمكرر للإشارة للحساسات البعيدة."
      steps={[
        { title: "البوابة", text: "توصل بوابة Zigbee بالراوتر وتضيفها للتطبيق." },
        { title: "الإقران", text: "تضيف القفل والمفاتيح والحساسات بضغطة زر من التطبيق." },
        { title: "الأتمتة", text: "تنشئ سيناريوهات: إذا اكتشف الحساس حركة ليلاً أضئ الممر." },
        { title: "التحكم", text: "تتحكم من أي مكان بالموبايل أو بالصوت أو من شاشة التحكم." },
      ]}
      useCases={[
        { icon: Home, title: "الشقق والمنازل القائمة", text: "حوّل منزلك الحالي لمنزل ذكي في يوم واحد بدون أي أعمال تكسير.", points: ["مفاتيح لمس مكان المفاتيح القديمة", "حساسات أمان وتسرب مياه", "تحكم بالتكييف عبر IR"] },
        { icon: Building2, title: "الفلل والكمباوندات", text: "تغطية كاملة لكل الأدوار والحدائق بفضل شبكة Mesh.", points: ["موتور ستائر وشاشات تحكم", "أقفال ذكية للبوابات", "محابس مياه ذكية"] },
        { icon: Store, title: "المحلات والمكاتب الصغيرة", text: "أمان ومراقبة وتوفير طاقة بتكلفة بسيطة وإدارة من الموبايل.", points: ["حساسات أبواب وحركة", "جدولة الإضاءة واللافتات", "قواطع ذكية لقياس الاستهلاك"] },
      ]}
      integrations={[
        { icon: Lock, title: "الأقفال الذكية", text: "افتح الباب من الموبايل وشاهد سجل الدخول، واربطه بمشهد الوصول للمنزل.", category: "smart-locks" },
        { icon: ToggleRight, title: "المفاتيح والموديولات", text: "مفاتيح لمس زجاجية أو موديولات مخفية خلف المفاتيح التقليدية.", category: "switches" },
        { icon: Radar, title: "الحساسات", text: "باب، حركة، حرارة ورطوبة، دخان، غاز وتسرب مياه بتنبيهات فورية.", category: "sensors" },
        { icon: Blinds, title: "الستائر والشاشات", text: "موتور ستائر ذكي وشاشات تحكم مركزية لكل المنزل.", category: "curtains" },
      ]}
      productsTitle="أجهزة Zigbee المتوفرة"
      products={data}
      productsSearch={{ system: "zigbee" }}
      other={{ to: "/systems/knx", label: "نظام KNX السلكي" }}
    />
  );
}
