export type BlogCategoryId =
  | "all"
  | "permits-ul"
  | "channel-letters"
  | "cost-wholesale"
  | "install-care"
  | "faq-resources";

export type BlogPostCategoryId = Exclude<BlogCategoryId, "all">;

export const BLOG_POST_COUNT = 38;

export interface BlogCategoryMeta {
  id: BlogCategoryId;
  label: string;
  description: string;
}

export const BLOG_CATEGORIES: readonly BlogCategoryMeta[] = [
  {
    id: "all",
    label: "All Guides",
    description:
      "Complete library of BASISSIGN engineering, UL 48 code, pricing, and installation guides.",
  },
  {
    id: "permits-ul",
    label: "Permits & UL Code",
    description:
      "Municipal permit submittals, UL 48 (#E555259) inspections, NEC Article 600 disconnects, and landlord approvals.",
  },
  {
    id: "channel-letters",
    label: "Signage Guides",
    description:
      "Front-lit, halo-lit, dual-lit, push-thru light boxes, blade signs, and architectural marquee comparisons.",
  },
  {
    id: "cost-wholesale",
    label: "Cost & Wholesale",
    description:
      "2026 commercial pricing benchmarks, wholesale blind-shipping margins, and sign shop outsourcing ROI.",
  },
  {
    id: "install-care",
    label: "Installation & Care",
    description:
      "Raceway vs. flush mounting patterns, stucco/brick anchors, electrical sizing, and weatherproofing maintenance.",
  },
  {
    id: "faq-resources",
    label: "FAQ & Logistics",
    description:
      "Production lead times, crated LTL freight, warranties, artwork templates, and storefront visibility ratios.",
  },
] as const;

export interface BlogTextRun {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

export interface BlogLinkRun {
  type: "link";
  text: string;
  href: string;
  external?: boolean;
  bold?: boolean;
  italic?: boolean;
}

export type BlogInlineRun = BlogTextRun | BlogLinkRun;

export interface BlogHeadingBlock {
  type: "heading";
  level: 2 | 3 | 4;
  id: string;
  text: string;
}

export interface BlogParagraphBlock {
  type: "paragraph";
  runs: BlogInlineRun[];
}

export interface BlogListBlock {
  type: "list";
  ordered: boolean;
  items: BlogInlineRun[][];
}

export interface BlogTableBlock {
  type: "table";
  headers: BlogInlineRun[][];
  rows: BlogInlineRun[][][];
}

export interface BlogImageBlock {
  type: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface BlogCtaBlock {
  type: "cta";
  label: string;
  href: string;
}

export interface BlogFaqItem {
  question: string;
  answerRuns: BlogInlineRun[][];
}

export interface BlogFaqBlock {
  type: "faq";
  items: BlogFaqItem[];
}

export type BlogBlock =
  | BlogHeadingBlock
  | BlogParagraphBlock
  | BlogListBlock
  | BlogTableBlock
  | BlogImageBlock
  | BlogCtaBlock
  | BlogFaqBlock;

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  categoryId: BlogPostCategoryId;
  categoryLabel: string;
  wpCategories: string[];
  originalUrl: string;
  coverImage: string;
  coverWidth: number;
  coverHeight: number;
  coverAlt: string;
  pinterestUrl: string;
  readingMinutes: number;
  wordCount: number;
  linkCount: number;
  inlineImageCount: number;
  quoteTypeId: string;
  blocks: BlogBlock[];
}

export type BlogPostSummary = Omit<BlogPost, "blocks">;

export function formatBlogDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function sanitizeHref(rawHref: string): string | null {
  const trimmed = rawHref.trim();
  if (!trimmed) return null;

  // Reject any ASCII control characters (including NUL, tab, CR, LF)
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return null;
  }

  // Allow safe in-page fragment anchors
  if (trimmed.startsWith("#")) {
    return trimmed.includes("\\") ? null : trimmed;
  }

  // Allow strict relative paths only (reject //, /\, backslashes, or cross-origin resolution)
  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//") || trimmed.includes("\\")) {
      return null;
    }
    try {
      const resolved = new URL(trimmed, "https://basissign.invalid");
      if (resolved.origin !== "https://basissign.invalid") {
        return null;
      }
      return `${resolved.pathname}${resolved.search}${resolved.hash}`;
    } catch {
      return null;
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:" ||
      parsed.protocol === "mailto:" ||
      parsed.protocol === "tel:"
    ) {
      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}
