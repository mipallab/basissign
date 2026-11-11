import type { MetadataRoute } from "next";
import { getAllBlogSummaries } from "@/data/blog";
import { BRAND_FACTS, PRODUCT_CATALOG } from "@/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || BRAND_FACTS.domain).replace(
    /\/+$/,
    ""
  );
  const lastModified = new Date("2026-11-10T00:00:00Z");

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-11-11T00:00:00Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ul-48-compliance`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = PRODUCT_CATALOG.map((item) => ({
    url: `${baseUrl}/products/${item.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogSummaries().map((post) => {
    const parsedDate = new Date(`${post.modified || post.date}T00:00:00Z`);
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: Number.isNaN(parsedDate.getTime())
        ? lastModified
        : parsedDate,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [...coreRoutes, ...productRoutes, ...blogRoutes];
}
