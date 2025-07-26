import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  image = "/icon-512.svg",
  url 
}: SEOHeadProps) {
  const { t, language } = useTranslation();

  useEffect(() => {
    // Dynamic title
    const pageTitle = title ? `${title} | RAUN-RACHID` : "RAUN-RACHID - Réseau d'Éveil Spirituel";
    document.title = pageTitle;

    // Dynamic description
    const pageDescription = description || "RAUN-RACHID - Réseau d'éveil spirituel avec capsules de conscience et intentions vivantes. Interface Matrix pour l'exploration spirituelle.";
    
    // Dynamic keywords
    const pageKeywords = keywords || "spiritualité, éveil, conscience, méditation, intentions, raun, rachid";

    // Update meta tags
    updateMetaTag("description", pageDescription);
    updateMetaTag("keywords", pageKeywords);
    updateMetaTag("author", "RAUN-RACHID");
    
    // Update language
    document.documentElement.lang = language;
    
    // Update Open Graph tags
    updateMetaProperty("og:title", pageTitle);
    updateMetaProperty("og:description", pageDescription);
    updateMetaProperty("og:image", image);
    updateMetaProperty("og:type", "website");
    
    if (url) {
      updateMetaProperty("og:url", url);
    }

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", pageTitle);
    updateMetaTag("twitter:description", pageDescription);
    updateMetaTag("twitter:image", image);

    // Structured Data (JSON-LD)
    updateStructuredData({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "RAUN-RACHID",
      "description": pageDescription,
      "url": url || window.location.origin,
      "applicationCategory": "Lifestyle",
      "operatingSystem": "All",
      "author": {
        "@type": "Person",
        "name": "RAUN-RACHID"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      }
    });

  }, [title, description, keywords, image, url, language]);

  return null; // This component doesn't render anything visible
}

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateMetaProperty(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateStructuredData(data: any) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}