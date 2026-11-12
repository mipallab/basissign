import rawBlogPosts from "./blog-posts.json";
import type {
  BlogInlineRun,
  BlogPost,
  BlogPostSummary,
} from "./blog-shared";

export * from "./blog-shared";

const ALL_BLOG_POSTS = rawBlogPosts as unknown as BlogPost[];

function toSummary(post: BlogPost): BlogPostSummary {
  const { blocks: _blocks, ...summary } = post;
  void _blocks;
  return summary;
}

const ALL_BLOG_SUMMARIES: BlogPostSummary[] = ALL_BLOG_POSTS.map(toSummary);

export function getAllBlogPosts(): readonly BlogPost[] {
  return ALL_BLOG_POSTS;
}

export function getAllBlogSummaries(): BlogPostSummary[] {
  return ALL_BLOG_SUMMARIES;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return ALL_BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(
  slug: string,
  limit = 3
): BlogPostSummary[] {
  const current = ALL_BLOG_SUMMARIES.find((post) => post.slug === slug);
  if (!current) {
    return ALL_BLOG_SUMMARIES.slice(0, limit);
  }

  const sameCategory = ALL_BLOG_SUMMARIES.filter(
    (post) => post.slug !== slug && post.categoryId === current.categoryId
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const fallback = ALL_BLOG_SUMMARIES.filter(
    (post) => post.slug !== slug && post.categoryId !== current.categoryId
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}

export function getAdjacentBlogPosts(slug: string): {
  prev: BlogPostSummary | null;
  next: BlogPostSummary | null;
} {
  const index = ALL_BLOG_SUMMARIES.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? ALL_BLOG_SUMMARIES[index - 1] : null,
    next:
      index < ALL_BLOG_SUMMARIES.length - 1
        ? ALL_BLOG_SUMMARIES[index + 1]
        : null,
  };
}

export function getPostHeadings(
  post: BlogPost
): Array<{ id: string; text: string }> {
  const headings: Array<{ id: string; text: string }> = [];
  for (const block of post.blocks) {
    if (block.type === "heading" && block.level === 2 && block.id && block.text) {
      headings.push({ id: block.id, text: block.text });
    }
  }
  return headings;
}

export function runsToPlainText(runs: readonly BlogInlineRun[]): string {
  return runs.map((run) => run.text).join("");
}

export function extractBlogFaqs(
  post: BlogPost
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  for (const block of post.blocks) {
    if (block.type === "faq") {
      for (const item of block.items) {
        const answerText = item.answerRuns
          .map((paragraphRuns) => runsToPlainText(paragraphRuns))
          .filter(Boolean)
          .join(" ");
        if (item.question && answerText) {
          faqs.push({ question: item.question, answer: answerText });
        }
      }
    }
  }
  return faqs;
}
