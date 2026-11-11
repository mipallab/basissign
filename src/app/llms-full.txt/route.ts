import { NextResponse } from "next/server";
import { getAllBlogSummaries } from "@/data/blog";
import {
  BRAND_FACTS,
  PRODUCT_CATALOG,
  SPEC_COMPARISON_ROWS,
} from "@/data/catalog";
import { GLOBAL_FAQS } from "@/data/faqs";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";

export function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || BRAND_FACTS.domain).replace(
    /\/+$/,
    ""
  );
  const blogSummaries = getAllBlogSummaries();

  const sections: string[] = [
    `# ${BRAND_FACTS.name} — Complete Engineering & Product Specification Sheet`,
    "",
    `Entity: ${BRAND_FACTS.legalName} (${baseUrl})`,
    `Certification: UL Standard 48 Electric Signs — File #${BRAND_FACTS.ulFileNumber} | ${BRAND_FACTS.necReference}`,
    `Contact: ${BRAND_FACTS.phone} | ${BRAND_FACTS.email} | Direct Form: ${baseUrl}/contact`,
    `Portfolio: ${PORTFOLIO_ITEMS.length} completed installations showcased at ${baseUrl}/portfolio`,
    `Engineering Blog: ${blogSummaries.length} technical signage & permit guides indexed at ${baseUrl}/blog`,
    `B2B Metrics: ${BRAND_FACTS.businessesServed} US businesses served | ${BRAND_FACTS.leadTimeDays} standard lead time | ${BRAND_FACTS.freightDamageRate} freight damage | ${BRAND_FACTS.warrantyYears}-year full warranty`,
    "",
    "---",
    "",
    "## 1. Comparison Matrix",
    "",
    "| Sign System | UL / Code Status | Illumination | Min Size / Stroke | Lead Time | Ideal Use Case |",
    "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ...SPEC_COMPARISON_ROWS.map(
      (row) =>
        `| [${row.product}](${baseUrl}/products/${row.slug}) | ${row.ul48Certified} | ${row.illumination} | ${row.minHeight} | ${row.leadTime} | ${row.bestUseCase} |`
    ),
    "",
    "---",
    "",
    "## 2. Detailed Product Engineering Specifications",
    "",
  ];

  for (const item of PRODUCT_CATALOG) {
    sections.push(
      `### ${item.name} (${item.chapterCode})`,
      `- URL: ${baseUrl}/products/${item.slug}`,
      `- Quote Link: ${baseUrl}/quote?type=${item.quoteTypeId}`,
      `- Summary: ${item.answerFirstSummary}`,
      `- UL Listed: ${item.ulListed ? `Yes — UL 48 File #${BRAND_FACTS.ulFileNumber}` : "Non-electrical / ADA Code Compliant"}`,
      `- Lead Time: ${item.leadTime}`,
      `- Warranty: ${item.warranty}`,
      `- Minimum Stroke: ${item.minStroke}`,
      `- Return Depth: ${item.depthRange}`,
      `- Face Material: ${item.faceMaterial}`,
      `- Return Material: ${item.returnMaterial}`,
      `- Illumination Style: ${item.illuminationStyle}`,
      `- Environmental / IP Rating: ${item.ipRating}`,
      `- Mounting Options: ${item.mountingOptions.join("; ")}`,
      `- Illumination / Finish Options: ${item.kelvinOptions.join("; ")}`,
      `- Crate Deliverables: ${item.deliverables.join("; ")}`,
      ""
    );

    if (item.faqs.length > 0) {
      sections.push("**Product FAQs:**");
      for (const f of item.faqs) {
        sections.push(`- **Q: ${f.question}**\n  A: ${f.answer}`);
      }
      sections.push("");
    }
  }

  sections.push(
    "---",
    "",
    "## 3. Turnkey B2B & Trade Blind Shipping FAQ",
    ""
  );

  for (const faq of GLOBAL_FAQS) {
    sections.push(
      `### [${faq.category}] ${faq.question}`,
      faq.answer,
      ""
    );
  }

  sections.push(
    "---",
    "",
    `## 4. Technical Signage & Permit Guides Index (${blogSummaries.length} Articles — ${baseUrl}/blog)`,
    ""
  );

  for (const post of blogSummaries) {
    sections.push(
      `- [${post.title}](${baseUrl}/blog/${post.slug})`,
      `  Category: ${post.categoryLabel} | Published: ${post.date} | Length: ${post.wordCount} words (${post.readingMinutes} min read) | Quote Configurator: ${baseUrl}/quote?type=${post.quoteTypeId}`,
      `  Summary: ${post.excerpt}`,
      ""
    );
  }

  return new NextResponse(sections.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
