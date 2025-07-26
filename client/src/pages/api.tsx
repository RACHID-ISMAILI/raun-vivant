import ApiDocumentation from "@/components/api-documentation";
import SEOHead from "@/components/seo-head";

export default function ApiPage() {
  return (
    <>
      <SEOHead 
        title="API Publique - RAUN-RACHID"
        description="Documentation complète de l'API RAUN-RACHID pour intégrer les capsules de conscience dans vos applications"
        keywords="api, raun, rachid, integration, developpeur, webhooks, capsules, intentions"
      />
      <ApiDocumentation />
    </>
  );
}