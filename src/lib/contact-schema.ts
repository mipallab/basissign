import { z } from "zod";

export const CONTACT_TOPIC_OPTIONS = [
  "General Sales Inquiry",
  "Wholesale / Sign Shop Partnership",
  "UL 48 & NEC 600 Permit Documentation",
  "Existing Order / Freight Support",
  "Sample Box Request",
  "Quick Sign Quote / Blog Inquiry",
] as const;

export const ALL_CONTACT_TOPICS = [
  ...CONTACT_TOPIC_OPTIONS,
  "Product Page Short Inquiry",
] as const;

export const contactPayloadSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name.")
      .max(100, "Keep full name under 100 characters."),
    companyName: z
      .string()
      .trim()
      .max(120, "Keep company name under 120 characters.")
      .optional()
      .default(""),
    email: z
      .string()
      .trim()
      .email("Enter a valid business email address.")
      .max(160),
    phone: z
      .string()
      .trim()
      .max(30, "Keep phone number under 30 characters.")
      .optional()
      .default(""),
    inquiryTopic: z.enum(ALL_CONTACT_TOPICS, {
      error: "Select an engineering or sales inquiry topic.",
    }),
    signSystem: z
      .string()
      .trim()
      .max(80, "Keep sign system label under 80 characters.")
      .optional(),
    message: z
      .string()
      .trim()
      .min(10, "Please share at least 10 characters about your project or question.")
      .max(3000, "Keep message under 3,000 characters."),
    consent: z.literal(true, {
      error:
        "Please confirm permission for BASISSIGN engineers to respond to your inquiry.",
    }),
    placement: z
      .string()
      .trim()
      .max(160, "Keep placement identifier under 160 characters.")
      .optional(),
    // Honeypot anti-spam trap — must remain empty
    websiteUrl: z.string().max(0).optional().default(""),
  })
  .superRefine((data, ctx) => {
    const isProductShort = data.inquiryTopic === "Product Page Short Inquiry";

    if (!isProductShort) {
      if (data.companyName.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["companyName"],
          message: "Enter your company or sign shop name.",
        });
      }
      if (!/^[+\d\s().-]{7,30}$/.test(data.phone)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message:
            "Enter a valid phone number (7–30 digits, spaces, parentheses, +, or hyphens).",
        });
      } else if (!/(?=(?:\D*\d){7})/.test(data.phone)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Include at least 7 numeric digits in the phone number.",
        });
      }
    } else if (data.companyName.length > 0 && data.companyName.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["companyName"],
        message: "If provided, enter at least 2 characters for company name.",
      });
    }
  });

export type ContactPayload = z.infer<typeof contactPayloadSchema>;
