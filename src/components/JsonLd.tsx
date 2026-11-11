export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // Safe serialized structured data for SEO & Agentic Search engines
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
