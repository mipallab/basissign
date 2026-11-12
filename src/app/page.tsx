import { JsonLd } from "@/components/JsonLd";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroSection } from "@/components/HeroSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ProductChapters } from "@/components/ProductChapters";
import { ProductQuoteProvider } from "@/components/ProductQuoteModal";
import { SpecComparisonTable } from "@/components/SpecComparisonTable";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BRAND_FACTS, PRODUCT_CATALOG } from "@/data/catalog";
import { GLOBAL_FAQS } from "@/data/faqs";

export default function HomePage() {
  const siteUrl = BRAND_FACTS.domain;

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: BRAND_FACTS.name,
    legalName: BRAND_FACTS.legalName,
    url: siteUrl,
    telephone: BRAND_FACTS.phone,
    email: BRAND_FACTS.email,
    image: `${siteUrl}/images/hero/hero-01-on.webp`,
    description:
      "US factory-direct manufacturer of UL 48 listed (#E555259) custom front-lit, halo-lit, and dual-lit channel letters plus push-thru light boxes and double-sided blade signs.",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "UL Standard 48 Electric Signs (File #E555259)",
      "NEC Article 600 Signage Wiring",
      "Custom LED Channel Letters",
      "Wholesale Blind Trade Sign Fabrication",
      "Push-Thru Light Boxes & Double-Sided Blade Signs",
    ],
  };

  const catalogLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "BASISSIGN Architectural & Commercial Signage Systems",
    url: `${siteUrl}/#products`,
    itemListElement: PRODUCT_CATALOG.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: item.name,
        category: item.category,
        description: item.answerFirstSummary,
        url: `${siteUrl}/products/${item.slug}`,
        image: `${siteUrl}${item.image}`,
        brand: {
          "@type": "Brand",
          name: BRAND_FACTS.name,
        },
      },
    })),
  };

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Order Factory-Direct UL 48 Custom Channel Letters from BASISSIGN",
    description:
      "Three-step engineering, UL 48 fabrication, and crated nationwide delivery workflow.",
    totalTime: "P10D",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Submit Sign Copy, Dimensions & Facade Photo",
        text: "Complete the 5-step BASISSIGN quote configurator to receive itemized wholesale pricing and a complimentary scaled 3D Day/Night rendering within 1 business day.",
        url: `${siteUrl}/quote`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Precision CNC Fabrication & UL 48 Inspection",
        text: "Upon proof approval, letters are fabricated from marine-grade aluminum or 304/316 stainless steel, outfitted with Mean Well Class 2 LED drivers, and serialized under UL 48 File #E555259.",
        url: `${siteUrl}/ul-48-compliance`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Foam-Crated Nationwide Delivery With 1:1 Pattern",
        text: "Ships nationwide in custom protective crating (<1% freight damage rate) with a 1:1 CNC paper mounting pattern, stainless hardware, and NEC Article 600 disconnect switch.",
        url: `${siteUrl}/#process`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GLOBAL_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={organizationLd} />
      <JsonLd data={catalogLd} />
      <JsonLd data={howToLd} />
      <JsonLd data={faqLd} />

      <HeroSection />
      <ProductQuoteProvider defaultPlacement="home-product-modal">
        <ProductChapters />
        <SpecComparisonTable />
      </ProductQuoteProvider>
      <ProcessSection />
      <TestimonialsSection />
      <FaqAccordion id="faq" items={GLOBAL_FAQS} />
    </>
  );
}
