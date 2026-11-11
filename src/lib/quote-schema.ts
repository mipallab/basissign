import { z } from "zod";
import type { ProductIconKey } from "@/data/catalog";

export const SIGN_TYPE_OPTIONS: ReadonlyArray<{
  id:
    | "front-lit"
    | "halo-lit"
    | "dual-lit"
    | "full-lit"
    | "push-thru"
    | "blade-sign"
    | "led-neon"
    | "metal-ada";
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
  catalogSlug: string;
  iconKey: ProductIconKey;
}> = [
  {
    id: "front-lit",
    label: "Front-Lit Channel Letters",
    shortLabel: "Front-Lit",
    badge: "8–10 Days · UL 48",
    description: "Glowing 3/16\" acrylic face with welded aluminum returns.",
    catalogSlug: "front-lit-channel-letters",
    iconKey: "front-lit",
  },
  {
    id: "halo-lit",
    label: "Back / Halo-Lit Letters",
    shortLabel: "Halo-Lit",
    badge: "8–10 Days · UL 48",
    description: "Solid aluminum or stainless face casting rear wall halo.",
    catalogSlug: "halo-lit-channel-letters",
    iconKey: "halo-lit",
  },
  {
    id: "dual-lit",
    label: "Front & Back Dual-Lit",
    shortLabel: "Dual-Lit",
    badge: "9–10 Days · UL 48",
    description: "High-punch acrylic front face plus contrasting rear halo.",
    catalogSlug: "dual-lit-channel-letters",
    iconKey: "dual-lit",
  },
  {
    id: "full-lit",
    label: "Full-Lit Acrylic Letters",
    shortLabel: "Full-Lit",
    badge: "9–10 Days · UL 48",
    description: "360° seamless opal or edge-glow fabricated acrylic shell.",
    catalogSlug: "front-lit-channel-letters",
    iconKey: "front-lit",
  },
  {
    id: "push-thru",
    label: "Push-Thru Light Box",
    shortLabel: "Push-Thru Box",
    badge: "10–12 Days · UL 48",
    description: "Routed metal cabinet with 3/4\" protruding lit acrylic copy.",
    catalogSlug: "blade-signs-light-boxes",
    iconKey: "blade-lightbox",
  },
  {
    id: "blade-sign",
    label: "Double-Sided Blade Sign",
    shortLabel: "Blade Sign",
    badge: "10–12 Days · UL 48",
    description: "Projecting pedestrian cabinet with engineered gusset bracket.",
    catalogSlug: "blade-signs-light-boxes",
    iconKey: "blade-lightbox",
  },
  {
    id: "led-neon",
    label: "Commercial LED Flex Neon",
    shortLabel: "LED Flex Neon",
    badge: "6–8 Days · UL Class 2",
    description: "Unbreakable optical silicone neon mounted on CNC acrylic backer.",
    catalogSlug: "commercial-led-neon",
    iconKey: "led-neon",
  },
  {
    id: "metal-ada",
    label: "Solid Metal / ADA Signs",
    shortLabel: "Metal & ADA",
    badge: "6–8 Days · Code Ready",
    description: "Laser-cut stainless, brass, aluminum & Grade-2 Braille ADA.",
    catalogSlug: "metal-ada-signs",
    iconKey: "metal-ada",
  },
];

export const SIGN_TYPE_IDS = [
  "front-lit",
  "halo-lit",
  "dual-lit",
  "full-lit",
  "push-thru",
  "blade-sign",
  "led-neon",
  "metal-ada",
] as const;

export type ProductQuoteTypeId = (typeof SIGN_TYPE_IDS)[number];

export const ENVIRONMENT_OPTIONS = [
  {
    id: "exterior-ul48",
    label: "Exterior Facade (UL 48 Wet-Location)",
    description: "IP67 sealed LEDs, drain holes, NEC Article 600 disconnect.",
  },
  {
    id: "interior",
    label: "Interior Lobby / Reception",
    description: "Dry-location architectural detailing & concealed wiring.",
  },
] as const;

export const MOUNTING_OPTIONS = [
  {
    id: "raceway",
    label: "UL Pre-Wired Raceway",
    description: "Fewer fascia holes; painted to match building wall.",
  },
  {
    id: "flush",
    label: "Flush-Mount Direct",
    description: "Clean individual letters pinned directly with 1:1 pattern.",
  },
  {
    id: "standoffs",
    label: "Standoff Stud Spacers (1\"–1.5\")",
    description: "Required for halo glow & raised architectural depth.",
  },
  {
    id: "blade-bracket",
    label: "90° Projecting Blade / Backer",
    description: "Engineered side-bracket or aluminum backer panel.",
  },
] as const;

export const LETTER_HEIGHT_OPTIONS = [
  "Under 10\" (Metal / Halo / ADA)",
  "10\" – 14\" (Retail Standard)",
  "15\" – 20\" (Plaza Primary)",
  "21\" – 30\" (Highway / Anchor)",
  "31\" – 48\"+ (Monumental)",
  "Need Recommendation",
] as const;

export const LED_KELVIN_OPTIONS = [
  "6500K Crisp Cool White",
  "5000K Neutral Daylight",
  "4000K Architectural Warm White",
  "3000K Warm Gold Halo",
  "Custom Pantone (PMS) Face Color",
  "Non-Illuminated Metal / ADA Finish",
] as const;

export const TARGET_TIMELINE_OPTIONS = [
  "ASAP / Express Rush (1–2 Weeks)",
  "Standard Production (2–4 Weeks)",
  "Upcoming Build-Out (1–2 Months)",
  "Budgeting / Landlord Permit Stage",
] as const;

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB per file
export const MAX_UPLOAD_FILES = 3;
export const ALLOWED_UPLOAD_EXTENSIONS = [
  ".pdf",
  ".ai",
  ".eps",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
] as const;

export const ALLOWED_MIME_BY_EXT: Record<
  (typeof ALLOWED_UPLOAD_EXTENSIONS)[number],
  readonly string[]
> = {
  ".pdf": ["application/pdf"],
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".svg": ["image/svg+xml"],
  ".ai": [
    "application/pdf",
    "application/postscript",
    "application/illustrator",
    "application/octet-stream",
    "",
  ],
  ".eps": [
    "application/postscript",
    "image/x-eps",
    "application/eps",
    "application/octet-stream",
    "",
  ],
};

export const quotePayloadSchema = z.object({
  signType: z.enum(SIGN_TYPE_IDS, {
    error: "Select a signage type to continue.",
  }),
  environment: z.enum(["exterior-ul48", "interior"], {
    error: "Select exterior or interior placement.",
  }),
  mounting: z.enum(["raceway", "flush", "standoffs", "blade-bracket"], {
    error: "Select a mounting configuration.",
  }),
  tradeBlindShipping: z.boolean().default(false),
  signText: z
    .string()
    .trim()
    .min(1, "Enter your sign copy or brand name.")
    .max(160, "Keep sign text concise (under 160 characters)."),
  letterHeight: z.enum(LETTER_HEIGHT_OPTIONS, {
    error: "Select an estimated letter or cabinet height.",
  }),
  totalWidthInches: z
    .string()
    .trim()
    .max(40, "Keep width description under 40 characters.")
    .optional()
    .default(""),
  ledFinish: z.enum(LED_KELVIN_OPTIONS, {
    error: "Select lighting color temperature or finish.",
  }),
  free3dMockup: z.boolean().default(true),
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(100),
  companyName: z
    .string()
    .trim()
    .min(2, "Enter your company or sign shop name.")
    .max(120),
  email: z
    .string()
    .trim()
    .email("Enter a valid business email address.")
    .max(160),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+\d\s().-]{7,30}$/,
      "Enter a valid phone number (7–30 digits, spaces, parentheses, +, or hyphens)."
    )
    .regex(/(?=(?:\D*\d){7})/, "Include at least 7 numeric digits in the phone number."),
  zipCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9\-\s]{3,12}$/, "Enter a valid US ZIP or postal code."),
  targetTimeline: z.enum(TARGET_TIMELINE_OPTIONS, {
    error: "Select your target installation timeline.",
  }),
  notes: z
    .string()
    .trim()
    .max(2000, "Keep project notes under 2,000 characters.")
    .optional()
    .default(""),
  consent: z.literal(true, {
    error: "Please confirm permission for BASISSIGN engineers to send your quote and mockup.",
  }),
  // Honeypot anti-spam field — must remain empty
  websiteUrl: z.string().max(0).optional().default(""),
});

export type QuotePayload = z.infer<typeof quotePayloadSchema>;

export function normalizeQuoteTypeParam(raw?: string | null): (typeof SIGN_TYPE_IDS)[number] {
  if (!raw) return "front-lit";
  const value = raw.toLowerCase().trim();
  const aliasMap: Record<string, (typeof SIGN_TYPE_IDS)[number]> = {
    "front-lit": "front-lit",
    "front-lit-channel-letters": "front-lit",
    "halo-lit": "halo-lit",
    "halo-lit-channel-letters": "halo-lit",
    "back-lit": "halo-lit",
    "dual-lit": "dual-lit",
    "dual-lit-channel-letters": "dual-lit",
    "full-lit": "full-lit",
    "push-thru": "push-thru",
    "blade-sign": "blade-sign",
    "blade-lightbox": "blade-sign",
    "blade-signs-light-boxes": "blade-sign",
    "led-neon": "led-neon",
    "commercial-led-neon": "led-neon",
    "neon": "led-neon",
    "led-flex-neon": "led-neon",
    "metal-ada": "metal-ada",
    "metal-ada-signs": "metal-ada",
  };
  return aliasMap[value] ?? "front-lit";
}
