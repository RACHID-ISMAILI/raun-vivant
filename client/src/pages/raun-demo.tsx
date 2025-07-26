import LiveDemo from "@/components/raun-rachid/live-demo";
import SEOHead from "@/components/seo-head";

export default function RaunDemo() {
  return (
    <>
      <SEOHead 
        title="🚀 Démo Interactive - RAUN-RACHID"
        description="Découvrez l'interface Matrix de RAUN-RACHID avec sidebar capsules et interaction en temps réel"
        keywords="demo, raun, rachid, capsules, interface, matrix, sidebar, conscience"
      />
      <LiveDemo />
    </>
  );
}