import { NextResponse } from "next/server";
import { getAllBlogSummaries } from "@/data/blog";
import { BRAND_FACTS, PRODUCT_CATALOG } from "@/data/catalog";

export function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || BRAND_FACTS.domain).replace(
    /\/+$/,
    ""
  );
  const blogSummaries = getAllBlogSummaries();

  const lines = [
    `# ${BRAND_FACTS.name} (${BRAND_FACTS.legalName})`,
    "",
    `> Factory-direct US custom business signage & UL Standard 48 (File #${BRAND_FACTS.ulFileNumber}) channel letter manufacturer serving ${BRAND_FACTS.businessesServed} storefronts, sign shops, and commercial contractors.`,
    "",
    "## Verified Company Facts",
    `- Canonical Site: ${baseUrl}`,
    `- Legal Entity: ${BRAND_FACTS.legalName}`,
    `- UL Listing: UL Standard 48 Electric Signs — File #${BRAND_FACTS.ulFileNumber}`,
    `- Electrical Code: ${BRAND_FACTS.necReference} (Factory Disconnects & Class 2 Power)`,
    `- Power Supplies: ${BRAND_FACTS.driverBrand} IP67 Class 2 LED Drivers`,
    `- Production Lead Time: ${BRAND_FACTS.leadTimeDays} (Metal & ADA: 6–8 business days)`,
    `- Freight Damage Track Record: ${BRAND_FACTS.freightDamageRate} via custom foam-in-place wood crating`,
    `- Warranty: ${BRAND_FACTS.warrantyYears}-Year Full Electrical & Structural`,
    `- Phone: ${BRAND_FACTS.phone}`,
    `- Email: ${BRAND_FACTS.email}`,
    "",
    "## Key Pages & Endpoints",
    `- [Homepage & Sign Catalog](${baseUrl}/): Full architectural showcase & spec matrix`,
    `- [Commercial Signage Portfolio](${baseUrl}/portfolio): 35 verified custom channel letter, halo, blade, LED flex neon & metal installations`,
    `- [Signage Blog & Engineering Guides](${baseUrl}/blog): ${blogSummaries.length} in-depth guides on sign permits, UL 48 code, pricing, installation & wholesale fulfillment`,
    `- [5-Step Quote Configurator & Free 24h 3D Mockup](${baseUrl}/quote): Interactive wholesale & commercial quote intake`,
    `- [UL 48 (#${BRAND_FACTS.ulFileNumber}) & NEC 600 Compliance](${baseUrl}/ul-48-compliance): Municipal AHJ & electrical inspection documentation`,
    `- [Contact Engineering & Trade Desk](${baseUrl}/contact): Direct B2B sales, wholesale account & freight inquiry form`,
    `- [Full Engineering Spec Sheet (Markdown)](${baseUrl}/llms-full.txt): Exhaustive technical tables, tolerances, and FAQs`,
    `- [XML Sitemap](${baseUrl}/sitemap.xml): Complete indexable route inventory`,
    "",
    "## Product Catalog",
    ...PRODUCT_CATALOG.map(
      (item) =>
        `- [${item.name}](${baseUrl}/products/${item.slug}): ${item.tagline} (${item.leadTime}; quote prefill: ${baseUrl}/quote?type=${item.quoteTypeId})`
    ),
    "",
    `## Technical Signage & Permit Guides (${blogSummaries.length} Articles)`,
    ...blogSummaries.map(
      (post) =>
        `- [${post.title}](${baseUrl}/blog/${post.slug}): ${post.categoryLabel} · ${post.readingMinutes} min read (${post.date})`
    ),
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
