export interface BrandFacts {
  name: string;
  legalName: string;
  domain: string;
  phone: string;
  phoneHref: string;
  email: string;
  ulFileNumber: string;
  necReference: string;
  warrantyYears: number;
  leadTimeDays: string;
  businessesServed: string;
  freightDamageRate: string;
  driverBrand: string;
  addressCountry: string;
}

export const BRAND_FACTS: BrandFacts = {
  name: "BASISSIGN",
  legalName: "Basis Sign LLC",
  domain: "https://basissign.com",
  phone: "+1 (912) 304-4034",
  phoneHref: "tel:+19123044034",
  email: "support@basissign.com",
  ulFileNumber: "E555259",
  necReference: "UL Standard 48 & NEC Article 600",
  warrantyYears: 3,
  leadTimeDays: "8–10 business days",
  businessesServed: "5,000+",
  freightDamageRate: "<1%",
  driverBrand: "Mean Well®",
  addressCountry: "United States",
};

export type ProductVisualKind = "studio-front-lit" | "studio-halo-lit" | "photo";

export type ProductIconKey =
  | "front-lit"
  | "halo-lit"
  | "dual-lit"
  | "blade-lightbox";

export interface ProductGalleryPhoto {
  id: string;
  thumbLabel: string;
  onSrc: string;
  offSrc?: string;
  alt: string;
}

export interface ProductGalleryVideo {
  thumbLabel: string;
  src: string;
  poster: string;
  thumbSrc: string;
  alt: string;
  durationLabel: string;
}

export interface ProductOverviewStep {
  step: string;
  title: string;
  detail: string;
}

export interface ProductFeatureItem {
  title: string;
  benefit: string;
}

export interface ProductMaterialRow {
  component: string;
  spec: string;
}

export interface ProductCustomizationGroup {
  title: string;
  description: string;
  options: string[];
}

export interface ProductApplicationItem {
  sector: string;
  detail: string;
}

export interface ProductSpec {
  slug: string;
  quoteTypeId: string;
  iconKey: ProductIconKey;
  name: string;
  shortName: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  tagline: string;
  answerFirstSummary: string;
  description: string;
  visualKind: ProductVisualKind;
  image: string;
  offImage: string;
  imageAlt: string;
  gallery: ProductGalleryPhoto[];
  video: ProductGalleryVideo;
  supportsDayNightPreview: boolean;
  chapterCode: string;
  ulListed: boolean;
  leadTime: string;
  warranty: string;
  minStroke: string;
  sizeRangeNote: string;
  depthRange: string;
  faceMaterial: string;
  returnMaterial: string;
  illuminationStyle: string;
  ipRating: string;
  mountingOptions: string[];
  kelvinOptions: string[];
  finishingOptions: string[];
  idealFor: string[];
  deliverables: string[];
  overviewHeading: string;
  overviewParagraphs: string[];
  howItWorksSteps: ProductOverviewStep[];
  keyFeatures: ProductFeatureItem[];
  materialsBreakdown: ProductMaterialRow[];
  customizationGroups: ProductCustomizationGroup[];
  applications: ProductApplicationItem[];
  portfolioCategoryId: "front-lit" | "halo-lit" | "blade-cabinet" | null;
  portfolioGapNote?: string;
  faqs: Array<{ question: string; answer: string }>;
}

export const PRODUCT_CATALOG: ProductSpec[] = [
  {
    slug: "front-lit-channel-letters",
    quoteTypeId: "front-lit",
    iconKey: "front-lit",
    name: "Front-Lit LED Channel Letters",
    shortName: "Front-Lit Letters",
    category: "UL 48 Channel Letters",
    seoTitle:
      "Front-Lit LED Channel Letters | UL 48 (#E555259) Custom Storefront Signs",
    seoDescription:
      "Factory-direct UL 48 (#E555259) front-lit LED channel letters with 3/16\" cast acrylic faces, 0.040\"–0.063\" welded aluminum returns, Mean Well Class 2 drivers, and 8–10 day delivery.",
    tagline: "Maximum daylight and midnight storefront legibility.",
    answerFirstSummary:
      "Front-lit LED channel letters combine CNC-routed 3/16\" UV-stabilized acrylic faces with welded 0.040\"–0.063\" aluminum returns, UL 48 (#E555259) high-CRI LED modules, and Mean Well® Class 2 power supplies for 8–10 business day factory-direct delivery.",
    description:
      "Engineered for retail plazas, national franchises, hospitality facades, and commercial strip centers requiring sharp daytime color fidelity and high-lumen nighttime throw. Each letter is seam-welded in powder-coated or Pantone-matched polyurethane finish with Jewelite trim caps and factory-installed drain holes.",
    visualKind: "photo",
    image: "/images/products/front-lit-channel-letters-01-on.webp",
    offImage: "/images/products/front-lit-channel-letters-01-off.webp",
    imageAlt:
      "Front-lit LED channel letters with two-tone acrylic faces illuminated above commercial retail facade",
    gallery: [
      {
        id: "front-lit-01",
        thumbLabel: "Retail Facade",
        onSrc: "/images/products/front-lit-channel-letters-01-on.webp",
        offSrc: "/images/products/front-lit-channel-letters-01-off.webp",
        alt: "Front-lit LED channel letters with two-tone acrylic faces illuminated above commercial retail facade",
      },
      {
        id: "front-lit-02",
        thumbLabel: "Red Acrylic",
        onSrc: "/images/products/front-lit-channel-letters-02-on.webp",
        offSrc: "/images/products/front-lit-channel-letters-02-off.webp",
        alt: "Bold red cast-acrylic front-lit channel letters with dark aluminum returns on architectural fascia",
      },
      {
        id: "front-lit-03",
        thumbLabel: "Script Glassfront",
        onSrc: "/images/products/front-lit-channel-letters-03-on.webp",
        offSrc: "/images/products/front-lit-channel-letters-03-off.webp",
        alt: "Warm white cursive script front-lit channel letters mounted over modern black storefront framing",
      },
    ],
    video: {
      thumbLabel: "Bench Test Video",
      src: "/videos/front-lit-channel-letters.mp4",
      poster: "/videos/front-lit-channel-letters-poster.webp",
      thumbSrc: "/videos/front-lit-channel-letters-thumb.webp",
      alt: "Front-lit cobalt-blue acrylic channel letters illuminated on 1:1 CNC mounting template paper in workshop inspection",
      durationLabel: "0:10",
    },
    supportsDayNightPreview: true,
    chapterCode: "01 / FRONT-LIT",
    ulListed: true,
    leadTime: "8–10 business days",
    warranty: "3-Year Full Electrical & Structural",
    minStroke: "1.25\" stroke width (10\"+ letter height)",
    sizeRangeNote:
      "10\"+ standard minimum letter height (1\" height per 10 ft viewing distance rule: e.g., 10\" for 100 ft, 15\" for 150 ft, 30\" for 300 ft; larger architectural sizes confirmed on CAD proof).",
    depthRange: "3\", 4\", or 5\" aluminum return depth",
    faceMaterial: "3/16\" Cast Acrylic (3M™ / Acrylite® diffuser) + 1\" Trim Cap",
    returnMaterial: "0.040\"–0.063\" 3003 Marine-Grade Aluminum",
    illuminationStyle: "Forward face illumination (3000K–6500K or PMS film)",
    ipRating: "IP67 Wet-Location LEDs & Mean Well® Drivers",
    mountingOptions: [
      "UL Pre-Wired Aluminum Raceway",
      "Flush-Mount Direct to Facade",
      "Custom Wireway / Backer Panel",
    ],
    kelvinOptions: [
      "3000K Warm White",
      "4000K Neutral",
      "5000K Daylight",
      "6500K Cool White",
      "Pantone PMS Vinyl",
    ],
    finishingOptions: [
      "Powder-Coated Aluminum Returns (Black, Bronze, White, Silver)",
      "Custom Pantone PMS / RAL Automotive Polyurethane Paint",
      "1\" Jewelite Trim Cap Matched to Acrylic Face or Return",
      "Pigmented Cast Acrylic or 3M™ Translucent / Day-Night Film Faces",
    ],
    idealFor: [
      "Commercial Buildings & Multi-Tenant Plazas",
      "Retail Storefronts & Shopping Centers",
      "Restaurants, Franchises & QSR Locations",
      "Sign Shops Needing UL 48 White-Label Fulfillment",
    ],
    deliverables: [
      "UL 48 serialized hologram label (#E555259) + NEC Article 600 disconnect switch",
      "Mean Well® IP67 Class 2 LED power supply(s) sized to exact wattage",
      "Full-scale 1:1 CNC-plotted mounting paper pattern & non-corrosive stainless hardware",
      "Foam-in-place / custom wooden crating (<1% freight damage track record)",
    ],
    overviewHeading: "High-Contrast Forward Illumination Built for Permit Speed",
    overviewParagraphs: [
      "Front-lit LED channel letters are the commercial benchmark for exterior storefront identification. Each individual three-dimensional letter housing acts as a sealed aluminum light chamber that directs internal wide-angle LED output exclusively forward through a pigmented or translucent 3/16\" cast acrylic face.",
      "Because every letter face emits crisp, uniform luminance both directly straight-on and from off-axis highway angles, front-lit letters deliver maximum long-distance legibility across sunlit shopping centers and high-traffic commercial corridors while staying strictly aligned with landlord sign criteria and municipal UL 48 electrical codes.",
    ],
    howItWorksSteps: [
      {
        step: "01",
        title: "CNC Aluminum Channel Shell",
        detail:
          "Computer-notched 0.040\"–0.063\" marine-grade aluminum returns are formed to exact letter contours and welded to a rigid aluminum back with bottom weep holes.",
      },
      {
        step: "02",
        title: "Calibrated LED Layout & Diffuser",
        detail:
          "IP67 wet-location LED modules (3000K–6500K) are arranged inside the letter cavity to eliminate dark spots or hot spotting behind the 3/16\" acrylic face.",
      },
      {
        step: "03",
        title: "Jewelite Trim Cap Closure & Class 2 Power",
        detail:
          "A UV-stabilized 1\" trim cap locks the acrylic face cleanly onto the return and routes low-voltage wiring to UL Class 2 Mean Well® drivers (120–277VAC) with an NEC 600.6 disconnect.",
      },
    ],
    keyFeatures: [
      {
        title: "Superior Roadside & Nighttime Readability",
        benefit:
          "Direct forward light projection cuts cleanly through rain, glare, and competing shopping-center illumination so brand typography remains sharp from parking lots and highways.",
      },
      {
        title: "Eliminates Hot Spots & Face Yellowing",
        benefit:
          "UL-recognized 3M™ / Acrylite® 3/16\" cast acrylic diffusers paired with uniform internal LED module spacing distribute light smoothly across bold or serif strokes.",
      },
      {
        title: "Raceway or Flush-Mount Flexibility",
        benefit:
          "Order pre-wired onto a color-matched aluminum UL raceway (typically 3–4 facade anchor holes total) or flush-mounted individually (3–5 holes per letter) for upscale clean facades.",
      },
      {
        title: "Inspector-Ready UL Standard 48 Compliance",
        benefit:
          "Every assembly ships bench-tested with serialized Basis Sign LLC UL 48 File #E555259 labels, Class 2 drivers, and load-sized amperage sheets for rapid municipal approval.",
      },
    ],
    materialsBreakdown: [
      {
        component: "Illuminated Face",
        spec: "3/16\" UV-stabilized cast acrylic (3M™ / Acrylite® diffuser) in standard colors or PMS translucent vinyl overlay",
      },
      {
        component: "Trim Retainer",
        spec: "1\" Jewelite trim cap chemically bonded to acrylic face; removable screws allow future service access",
      },
      {
        component: "Side Returns & Backs",
        spec: "0.040\"–0.063\" 3003 marine-grade seam-welded aluminum with white reflective interior coat and bottom drain holes",
      },
      {
        component: "Electrical & Drivers",
        spec: "UL 879 / UL 8750 IP67 LED modules + Mean Well® UL 1310 Class 2 IP67 drivers (120–277VAC) + NEC 600 disconnect",
      },
    ],
    customizationGroups: [
      {
        title: "Custom Dimensions & Profile Depth",
        description:
          "Engineered to match your facade viewing setback, municipal max square-footage allowance, and stroke geometry.",
        options: [
          "Standard 10\"+ letter heights (scaled per 1\" per 10 ft viewing rule)",
          "3\", 4\", or 5\" aluminum return depths to tune stroke brightness and side reveal",
          "Minimum 1.25\" stroke width (narrower scripts reviewed at engineering proof)",
        ],
      },
      {
        title: "Colors & Architectural Finishes",
        description:
          "Exact brand fidelity during daylight hours when internal LEDs are powered off, as well as illuminated evening color accuracy.",
        options: [
          "Custom Pantone (PMS), RAL, or architectural paint matching on returns and raceways",
          "Color-matched or contrasting matte black/bronze Jewelite trim caps",
          "Day/Night perforated vinyl options (dark black by day, bright white at night)",
        ],
      },
      {
        title: "Fonts, Scripts & Logo Shapes",
        description:
          "CNC coil bending and laser cutting reproduce custom wordmarks, geometric icons, and multi-piece cabinet clouds.",
        options: [
          "Bold sans-serif, serif, connected cursive scripts, and custom brand typography",
          "Contour-routed emblem clouds paired beside individual channel letters",
          "Free 24-hour scaled 3D Day/Night facade proof verifying letter stroke feasibility",
        ],
      },
      {
        title: "Lighting & Mounting Configurations",
        description:
          "Pre-engineered electrical and mounting hardware tailored to stucco, brick, tilt-up concrete, EIFS, or ACM fascias.",
        options: [
          "3000K Warm, 4000K Neutral, 5000K Daylight, or 6500K Cool White LEDs",
          "UL pre-wired aluminum raceway, slim wireway panel, or individual flush stud mounts",
          "Blind white-label crating option for US sign shops and general contractors",
        ],
      },
    ],
    applications: [
      {
        sector: "Retail Stores",
        detail:
          "Delivers instant storefront recognition in competitive inline retail rows where bold daytime color and high-output night readability drive walk-in foot traffic.",
      },
      {
        sector: "Shopping Centers",
        detail:
          "Meets national strip-plaza sign criteria with pre-wired UL raceways that cut landlord facade penetrations to 3–4 holes total.",
      },
      {
        sector: "Commercial Buildings",
        detail:
          "Large-format 18\" to 36\"+ letters provide crisp anchor-tenant visibility across deep parking setbacks and multi-lane arterial roadways.",
      },
      {
        sector: "Corporate Environments",
        detail:
          "Flush wireway-mounted front-lit logos unify multi-tenant office parks, medical campuses, and regional banking branches.",
      },
      {
        sector: "Hospitality & QSR Franchises",
        detail:
          "Consistent PMS face colors, grease/UV-resistant finishes, and drive-thru visibility across multi-unit franchise rollouts.",
      },
    ],
    portfolioCategoryId: "front-lit",
    faqs: [
      {
        question: "Do BASISSIGN front-lit channel letters ship with UL 48 labels?",
        answer:
          "Yes. Every illuminated front-lit channel letter set is inspected and labeled under Basis Sign LLC UL 48 File #E555259 with NEC Article 600 compliant wiring and watertight disconnect switches ready for municipal inspection.",
      },
      {
        question: "Should I choose raceway mount or flush mount for front-lit letters?",
        answer:
          "Choose a pre-wired UL raceway (painted to match your building fascia) when shopping-center landlords limit wall penetrations—it typically requires just 3 to 4 mounting bolts total. Choose flush direct mount (3 to 5 holes per letter with rear wire pass-through) when you want clean floating letters with no bar behind them.",
      },
      {
        question: "What minimum letter height and stroke width are required?",
        answer:
          "Standard front-lit channel letters require a minimum 1.25\" stroke width (typically 10\"+ letter height) so IP67 LED modules fit inside the return without shadowing. Send your vector logo for a free 24-hour engineering check if your font has fine serifs or thin script transitions.",
      },
      {
        question: "How do I choose the right letter height for my storefront?",
        answer:
          "A proven rule of thumb is roughly 1 inch of letter height per 10 feet of viewing distance (10\" for 100 ft, 15\" for 150 ft, 20\" for 200 ft). If traffic passes above 30 mph, step up one size and keep 20–25% vertical breathing margin inside your sign band.",
      },
      {
        question: "What is included inside the crate and how quickly do they ship?",
        answer:
          "Standard factory-direct production takes 8–10 business days after proof approval. Every foam-crated shipment includes the UL-labeled letters, load-sized Mean Well® Class 2 power supplies (120–277VAC), NEC 600 disconnect switch, stainless installation hardware, and a 1:1 CNC paper drill pattern.",
      },
    ],
  },
  {
    slug: "halo-lit-channel-letters",
    quoteTypeId: "halo-lit",
    iconKey: "halo-lit",
    name: "Back / Halo-Lit Channel Letters",
    shortName: "Halo-Lit Letters",
    category: "Architectural Channel Letters",
    seoTitle:
      "Halo-Lit & Reverse-Lit Channel Letters | Stainless & Aluminum Architectural Signs",
    seoDescription:
      "Architectural reverse halo-lit channel letters crafted from solid welded 0.080\" aluminum or 304/316 stainless steel with Lexan® backs, stainless standoffs, and UL 48 (#E555259).",
    tagline: "Soft architectural wall-wash glow with solid metal precision.",
    answerFirstSummary:
      "Halo-lit (reverse-lit) channel letters feature solid welded 0.080\" aluminum or 304/316 stainless steel faces with clear polycarbonate backs and stainless standoff spacers that project an even architectural halo onto stone, brick, or ACM facades.",
    description:
      "Designed for Class-A office lobbies, luxury boutiques, financial institutions, and historic municipal districts that prohibit plastic faces. Lights wash backward across the facade surface at calibrated 1.0\"–1.5\" standoffs for crisp depth without hot spots.",
    visualKind: "photo",
    image: "/images/products/halo-lit-channel-letters-01-on.webp",
    offImage: "/images/products/halo-lit-channel-letters-01-off.webp",
    imageAlt:
      "Back-lit halo script channel letters with dark painted returns casting warm architectural glow on facade",
    gallery: [
      {
        id: "halo-lit-01",
        thumbLabel: "Script Halo",
        onSrc: "/images/products/halo-lit-channel-letters-01-on.webp",
        offSrc: "/images/products/halo-lit-channel-letters-01-off.webp",
        alt: "Back-lit halo script channel letters with dark painted returns casting warm architectural glow on facade",
      },
      {
        id: "halo-lit-02",
        thumbLabel: "Brick Wall-Wash",
        onSrc: "/images/products/halo-lit-channel-letters-02-on.webp",
        offSrc: "/images/products/halo-lit-channel-letters-02-off.webp",
        alt: "Reverse halo-lit metal channel letters spaced off dark brick masonry on 1.25-inch standoffs",
      },
      {
        id: "halo-lit-03",
        thumbLabel: "Brushed Gold",
        onSrc: "/images/products/halo-lit-channel-letters-03-on.webp",
        offSrc: "/images/products/halo-lit-channel-letters-03-off.webp",
        alt: "Brushed gold reverse-lit logo emblem and architectural letters projecting warm rear halo glow",
      },
    ],
    video: {
      thumbLabel: "Halo Bench Video",
      src: "/videos/halo-lit-channel-letters.mp4",
      poster: "/videos/halo-lit-channel-letters-poster.webp",
      thumbSrc: "/videos/halo-lit-channel-letters-thumb.webp",
      alt: "Reverse halo-lit stainless channel letters powered during factory bench illumination quality inspection",
      durationLabel: "0:10",
    },
    supportsDayNightPreview: true,
    chapterCode: "02 / HALO-LIT",
    ulListed: true,
    leadTime: "8–10 business days",
    warranty: "3-Year Full Electrical & Structural",
    minStroke: "0.75\" stroke width (6\"+ letter height)",
    sizeRangeNote:
      "6\"+ minimum letter height with 0.75\" minimum stroke width. Note: halo lighting reads subtly against dark masonry, so stepping up one letter height is recommended for setback roadside buildings.",
    depthRange: "1.5\", 2\", or 3\" welded metal return depth",
    faceMaterial: "0.080\" Welded Aluminum or 16ga Brushed 304/316 Stainless Steel",
    returnMaterial: "0.063\" Aluminum or Brushed / Mirror Stainless Steel",
    illuminationStyle: "Reverse 160° wide-angle halo projection via clear Lexan® back",
    ipRating: "IP67 Wet-Location UL 48 Modules",
    mountingOptions: [
      "1.0\" or 1.5\" Stainless Standoff Stud Mounts",
      "Flush Wireway Backer Panel",
      "Interior Architectural Drywall Studs",
    ],
    kelvinOptions: [
      "2700K Warm Gold",
      "3000K Architectural Warm",
      "4000K Neutral",
      "6500K Crisp White",
      "RGBW Smart",
    ],
    finishingOptions: [
      "Brushed #4 Satin 304 / Marine-Grade 316 Stainless Steel",
      "Mirror-Polished or Titanium Gold / Bronze Brushed Metal",
      "Matte Architectural Dark Bronze & Textured Black Powder Coat",
      "Custom Pantone PMS / RAL Automotive Polyurethane Paint",
    ],
    idealFor: [
      "Class-A Corporate Headquarters & Reception Walls",
      "Historic District Storefronts & Boutique Hotels",
      "Law Firms, Dental Studios & Architectural Offices",
      "Luxury Retail & Hospitality Entrances",
    ],
    deliverables: [
      "UL 48 #E555259 serialization & UL Class 2 Mean Well® power supply",
      "Clear UV-stabilized polycarbonate rear diffusers + threaded brass/SS bosses",
      "1:1 paper mounting drill template & stainless stud spacers",
      "Optional brushed, anodized gold/bronze, or Pantone powder-coat finishes",
    ],
    overviewHeading: "Architectural Wall-Wash Luminance Without Plastic Faces",
    overviewParagraphs: [
      "Halo-lit (reverse-lit) channel letters deliver understated luxury by projecting illumination backward onto the wall surface rather than through a plastic front face. Because the front and sides are fabricated from solid 0.080\" aluminum or 16ga 304/316 stainless steel, the letter silhouettes remain refined brushed or matte metal by day and float over a soft glowing corona by night.",
      "This construction makes halo-lit channel letters the preferred solution for historic downtown overlays, Class-A commercial offices, architectural reception walls, and upscale hospitality properties where municipal codes prohibit illuminated acrylic faces.",
    ],
    howItWorksSteps: [
      {
        step: "01",
        title: "Solid Metal Face & Welded Return Shell",
        detail:
          "0.080\" aluminum or 16ga 304/316 stainless steel faces are laser-cut and TIG/seam-welded to 1.5\"–3\" deep returns with ground smooth edges—zero plastic trim cap seams.",
      },
      {
        step: "02",
        title: "160° Reverse LED Projection & Lexan® Back",
        detail:
          "Wide-angle 160° LEDs mount facing rearwards behind a sealed clear UV-stabilized polycarbonate backing plate that protects optics while maximizing rear beam spread.",
      },
      {
        step: "03",
        title: "Calibrated Standoff Wall Offset",
        detail:
          "Threaded stainless steel standoff spacers offset each letter 1.0\" to 1.5\" off brick, stone, stucco, or walnut walls so light blooms evenly around every stroke.",
      },
    ],
    keyFeatures: [
      {
        title: "Zero Plastic Seam Retainers (Seamless Metal)",
        benefit:
          "Hand-ground welded seams between solid metal face and returns deliver jewel-like architectural crispness impossible with trim-capped acrylic faces.",
      },
      {
        title: "Coastal-Ready 316 Stainless Steel Option",
        benefit:
          "Upgrade from 304 interior stainless to 316 marine-grade stainless steel or powder-coated aluminum for oceanfront resorts, marinas, and de-icing salt climates.",
      },
      {
        title: "Slender Stroke Capability Down to 0.75\"",
        benefit:
          "Solid metal construction accommodates delicate serifs, luxury boutique wordmarks, and fine 6\"+ reception typography down to a 0.75\" stroke width.",
      },
      {
        title: "Even Wall Wash With Tuned Color Temperature",
        benefit:
          "Match 2700K–3000K warm gold halos to timber and limestone, or pair 4000K–6500K crisp white halos with slate, charcoal ACM, and glass curtainwalls.",
      },
    ],
    materialsBreakdown: [
      {
        component: "Front Metal Face",
        spec: "0.080\" aircraft/marine aluminum or 16ga 304/316 stainless steel (brushed, mirror, or PMS painted)",
      },
      {
        component: "Sides & Welds",
        spec: "0.063\" aluminum or matching stainless steel returns (1.5\"–3\" deep), laser/seam welded and dressed smooth",
      },
      {
        component: "Rear Light Window",
        spec: "Clear UV-stabilized Lexan® polycarbonate rear backing sealed against moisture & insects with brass/SS bosses",
      },
      {
        component: "Standoffs & Power",
        spec: "1.0\"–1.5\" stainless threaded stud spacers + 160° UL IP67 LEDs + Mean Well® Class 2 UL 48 (#E555259) drivers",
      },
    ],
    customizationGroups: [
      {
        title: "Custom Dimensions & Letter Depth",
        description:
          "Fine-tuned letter profile height, metal thickness, and standoff offset to match indoor walls or exterior facades.",
        options: [
          "Minimum 6\" letter height & 0.75\" stroke width for crisp executive typography",
          "1.5\", 2\", or 3\" metal return depth paired with 1.0\" or 1.5\" stainless standoffs",
          "Optional flush-mounted wireway backer panel when rear wall wiring access is unavailable",
        ],
      },
      {
        title: "Colors & Architectural Metal Finishes",
        description:
          "Architectural metals and two-part coatings engineered to harmonize with building hardware and interior millwork.",
        options: [
          "Brushed #4 satin or mirror stainless steel (natural silver, titanium gold, champagne, bronze)",
          "Matte black, oil-rubbed bronze, or custom Pantone/Sherwin-Williams polyurethane paint",
          "Contrast testing recommendation: light/matte stone reflects halos widest; dark surfaces favor 4000K–6500K",
        ],
      },
      {
        title: "Fonts, Emblems & Logo Geometry",
        description:
          "Fiber-laser cutting captures razor-sharp hairline serifs, fine script curves, and architectural monograms.",
        options: [
          "Serif, high-fashion display typefaces, connected scripts, and custom brand crests",
          "Concealed rear mounting studs aligned strictly via 1:1 CNC paper template",
          "Free 24h Day/Night rendering checking nighttime halo bloom on your exact wall texture",
        ],
      },
      {
        title: "Lighting & Driver Configurations",
        description:
          "Calibrated spectral warmth and controllable voltage architecture for exterior facades or dimmed interior lobbies.",
        options: [
          "2700K Warm Gold, 3000K Architectural Warm, 4000K Neutral, 6500K Crisp White, or RGBW",
          "120–277VAC Mean Well® UL Class 2 remote power supplies (remote mount inside wall or wireway)",
          "UL 48 File #E555259 serialization & NEC Article 600 disconnect switches",
        ],
      },
    ],
    applications: [
      {
        sector: "Corporate Environments",
        detail:
          "Ideal for Class-A executive headquarters, law firms, financial offices, and marble or acoustic wood reception walls.",
      },
      {
        sector: "Commercial Buildings",
        detail:
          "Widely approved in historic preservation districts, luxury medical campuses, and strict municipal overlay zones that disallow translucent plastic faces.",
      },
      {
        sector: "Retail Stores",
        detail:
          "Projects unmistakable high-end craftsmanship for jewelry boutiques, apparel flagships, salons, and specialty wine or culinary venues.",
      },
      {
        sector: "Shopping Centers",
        detail:
          "Lifestyle centers and upscale mixed-use retail promenades commonly mandate reverse halo-lit metal signage on stone or brick pilasters.",
      },
      {
        sector: "Boutique Hotels & Fine Dining",
        detail:
          "Warm 2700K–3000K halos create an inviting hospitality atmosphere at porte-cocheres, valet entries, and restaurant facades.",
      },
    ],
    portfolioCategoryId: "halo-lit",
    faqs: [
      {
        question: "What standoff distance produces the cleanest halo effect?",
        answer:
          "We supply 1.0\" to 1.5\" threaded stainless steel standoff sleeves as standard. Lighter matte walls (limestone, stucco, warm brick) reflect a soft 3000K halo cleanly at 1.25\"–1.5\", while darker walls pair well with 1.0\"–1.25\" standoffs and higher-output 4000K–6500K modules so light doesn't dissipate.",
      },
      {
        question: "Are stainless steel halo-lit letters available for coastal climates?",
        answer:
          "Yes. We fabricate 316 marine-grade brushed or titanium-coated stainless steel returns and faces specifically engineered for salt-air coastal properties and poolside hospitality environments.",
      },
      {
        question: "Can halo-lit letters be installed on an interior drywall reception wall?",
        answer:
          "Yes. Halo-lit letters are frequently mounted onto interior reception drywall, walnut slats, or marble walls. Low-voltage 12VDC/24VDC leads route cleanly through pinholes to a remote Mean Well® Class 2 driver placed behind the wall or inside an adjacent utility closet.",
      },
      {
        question: "Why do landlords or historic districts sometimes require halo-lit signs?",
        answer:
          "Architectural guidelines in historic downtowns and upscale lifestyle shopping centers often ban exposed plastic faces. Because reverse halo-lit letters showcase solid painted aluminum or brushed stainless faces by day, they satisfy strict aesthetic codes while still providing UL 48 night visibility.",
      },
      {
        question: "What if we cannot drill individual wire holes for each letter behind the wall?",
        answer:
          "If behind-wall wiring access is blocked (e.g., solid tilt-up concrete or tenant lease restrictions), order our slim factory wireway backer panel painted to match your facade color—wires conceal inside the slim bar cleanly.",
      },
    ],
  },
  {
    slug: "dual-lit-channel-letters",
    quoteTypeId: "dual-lit",
    iconKey: "dual-lit",
    name: "Front & Back Dual-Lit Channel Letters",
    shortName: "Dual-Lit Letters",
    category: "Flagship Architectural Signage",
    seoTitle:
      "Front & Back Dual-Lit Channel Letters | Combination Halo & Face Illuminated Signs",
    seoDescription:
      "Flagship UL 48 (#E555259) front and back dual-lit channel letters combining vivid 3/16\" cast acrylic faces with reverse polycarbonate halo illumination and internal aluminum baffles.",
    tagline: "Crisp front readability paired with dramatic rear wall illumination.",
    answerFirstSummary:
      "Dual-lit (combination-lit) channel letters deliver dual-direction UL 48 illumination—emitting high-contrast light through a pigmented 3/16\" acrylic face while casting a secondary 3000K or contrasting color halo onto the mounting wall.",
    description:
      "Built for flagship retail locations, medical campuses, and competitive urban corridors where brands want both long-distance highway readability and refined architectural depth. Dual-channel internal baffles allow matching or split Kelvin temperatures (for example, 6500K cool white face with 3000K warm amber or magenta halo).",
    visualKind: "photo",
    image: "/images/products/dual-lit-channel-letters-01-on.webp",
    offImage: "/images/products/dual-lit-channel-letters-01-off.webp",
    imageAlt:
      "Front and back dual-lit architectural channel letters glowing forward with warm rear wall-wash halo",
    gallery: [
      {
        id: "dual-lit-01",
        thumbLabel: "Modern Facade",
        onSrc: "/images/products/dual-lit-channel-letters-01-on.webp",
        offSrc: "/images/products/dual-lit-channel-letters-01-off.webp",
        alt: "Front and back dual-lit architectural channel letters glowing forward with warm rear wall-wash halo",
      },
      {
        id: "dual-lit-02",
        thumbLabel: "Warm Face + Halo",
        onSrc: "/images/products/dual-lit-channel-letters-02-on.webp",
        offSrc: "/images/products/dual-lit-channel-letters-02-off.webp",
        alt: "Dual-lit clinic channel letters combining warm amber acrylic faces with bright rear wall halo on dark tile",
      },
      {
        id: "dual-lit-03",
        thumbLabel: "Stone Architectural",
        onSrc: "/images/products/dual-lit-channel-letters-03-on.webp",
        offSrc: "/images/products/dual-lit-channel-letters-03-off.webp",
        alt: "Architectural dual-lit serif channel letters combining illuminated front edge contour with rear wall glow",
      },
    ],
    video: {
      thumbLabel: "Split-Color Video",
      src: "/videos/dual-lit-channel-letters.mp4",
      poster: "/videos/dual-lit-channel-letters-poster.webp",
      thumbSrc: "/videos/dual-lit-channel-letters-thumb.webp",
      alt: "Split-color dual-lit channel letter set on shop inspection table with warm front face and cobalt rear halo",
      durationLabel: "0:10",
    },
    supportsDayNightPreview: true,
    chapterCode: "03 / DUAL-LIT",
    ulListed: true,
    leadTime: "9–10 business days",
    warranty: "3-Year Full Electrical & Structural",
    minStroke: "1.25\" stroke width (10\"+ letter height)",
    sizeRangeNote:
      "10\"+ standard minimum letter height (1.25\" minimum stroke) to house the internal opaque aluminum divider baffle alongside forward and rear LED arrays.",
    depthRange: "3\", 4\", or 5\" deep aluminum shell + 1\" standoffs",
    faceMaterial: "3/16\" Cast Acrylic Face + Slimline Trim Cap",
    returnMaterial: "0.063\" CNC-Notched & TIG-Welded Aluminum",
    illuminationStyle: "Simultaneous forward acrylic face + reverse polycarbonate halo",
    ipRating: "IP67 Sealed Wet-Location UL 48 Assembly",
    mountingOptions: [
      "1.0\"–1.5\" Standoff Stud Mount (Recommended for Halo)",
      "Custom Recessed Wireway",
      "Interior Feature Wall Studs",
    ],
    kelvinOptions: [
      "6500K Face + 3000K Halo",
      "6500K Face + Signature Magenta Halo",
      "Matched 4000K Front & Back",
      "Custom PMS Face + Warm Halo",
    ],
    finishingOptions: [
      "0.063\" Powder-Coated or Pantone Polyurethane Aluminum Returns",
      "Slimline Jewelite Trim Cap Matched to Acrylic or Facade Return",
      "Two-Tone Split Lighting (Contrasting Acrylic Face & Rear Halo Color)",
      "Clear UV-Stabilized Polycarbonate Rear Halo Lens",
    ],
    idealFor: [
      "Flagship Retail & Automotive Dealerships",
      "Restaurants, Lounges & Multi-Location Brands",
      "Corporate Campuses & Medical Centers",
      "Projects Requiring Distinct Nighttime Depth",
    ],
    deliverables: [
      "Dual-circuit or unified Mean Well® Class 2 UL power system",
      "UL 48 File #E555259 listing & inspection-ready labeling",
      "Full-scale 1:1 installation blueprint + standoff stud hardware",
      "Free 3D Day/Night facade rendering prior to production",
    ],
    overviewHeading: "Simultaneous Forward Clarity & Architectural Halo Depth",
    overviewParagraphs: [
      "Dual-lit (front and back illuminated) channel letters eliminate the trade-off between long-distance front-lit punch and architectural rear halo sophistication. Each letter projects high-contrast brand copy forward through a 3/16\" cast acrylic face while simultaneously framing the dark return outline with a glowing rear wall wash.",
      "Because BASISSIGN fabricates every dual-lit shell from heavy 0.063\" TIG-welded aluminum with an internal opaque divider plate, light from the front and rear chambers stays cleanly separated—enabling matched monochrome illumination or striking two-color combinations that anchor flagship commercial properties after dark.",
    ],
    howItWorksSteps: [
      {
        step: "01",
        title: "Internal Opaque Divider Architecture",
        detail:
          "Each 0.063\" welded aluminum channel letter integrates an internal opaque aluminum baffle dividing the letter body into independent front and rear optical chambers.",
      },
      {
        step: "02",
        title: "Forward Acrylic Face + Rear Lexan® Halo",
        detail:
          "Forward LEDs illuminate the 3/16\" cast acrylic face for long-range legibility while reverse 160° modules shine backward through a clear polycarbonate lens onto the facade.",
      },
      {
        step: "03",
        title: "1.0\"–1.5\" Standoff Suspension & Power",
        detail:
          "Stainless standoff studs suspend each letter shell ahead of the wall surface and route concealed low-voltage feeds to unified or dual-circuit Mean Well® Class 2 drivers.",
      },
    ],
    keyFeatures: [
      {
        title: "Split-Color Branding Without Light Bleed",
        benefit:
          "Internal opaque dividers keep contrasting combinations—such as crisp 6500K white faces over 3000K warm amber or magenta halos—clean and intentional.",
      },
      {
        title: "Maximum Presence at Any Viewing Distance",
        benefit:
          "Captures roadside drivers from hundreds of feet via the bright acrylic face while rewarding up-close pedestrians and lobby visitors with warm dimensional depth.",
      },
      {
        title: "Heavy-Gauge 0.063\" TIG-Welded Rigidity",
        benefit:
          "Thicker 0.063\" aluminum shells prevent thermal flex and support cantilevered standoff stud loads reliably across multi-story or windy commercial exteriors.",
      },
      {
        title: "UL 48 #E555259 Certified Single or Dual Circuit",
        benefit:
          "Shipped ready for city inspection with factory NEC Article 600 disconnects, weather-sealed rear polycarbonate lenses, and 1:1 CNC paper templates.",
      },
    ],
    materialsBreakdown: [
      {
        component: "Forward Face & Retainer",
        spec: "3/16\" cast acrylic diffuser (white, colored, or PMS film) bordered by slimline Jewelite trim cap",
      },
      {
        component: "Housing & Internal Baffle",
        spec: "0.063\" CNC-notched & TIG-welded marine-grade aluminum return shell with internal opaque separator plate",
      },
      {
        component: "Rear Halo Diffuser",
        spec: "Clear UV-stabilized polycarbonate backing plate seated into return with bottom weep/drainage",
      },
      {
        component: "Hardware & Power System",
        spec: "1.0\"–1.5\" stainless standoff stud mounts + IP67 dual-direction LEDs + Mean Well® UL Class 2 drivers (#E555259)",
      },
    ],
    customizationGroups: [
      {
        title: "Custom Dimensions & Profile Depth",
        description:
          "Proportioned to carry dual internal optics without looking boxy against refined facades.",
        options: [
          "10\"+ letter heights with 1.25\" minimum stroke width for uniform dual illumination",
          "3\", 4\", or 5\" deep aluminum shell paired with 1.0\"–1.5\" stainless standoffs",
          "Scaled letter band layout keeping 20–25% facade breathing margin",
        ],
      },
      {
        title: "Two-Tone Colors & Metal Finishes",
        description:
          "Combine return finishes, face films, and rear halo colors for signature flagship impact.",
        options: [
          "Custom PMS / RAL polyurethane paint or brushed anodized metallic return finishes",
          "Matching or contrasting Jewelite trim cap and translucent acrylic face colorways",
          "Recommended facade pairings tested via complimentary 24h Day/Night 3D mockup",
        ],
      },
      {
        title: "Fonts, Emblems & Mounting Styles",
        description:
          "Built for statement wordmarks, architectural emblems, and illuminated logo icons.",
        options: [
          "Bold sans-serif, architectural serif, and custom brand symbol fabrications",
          "Flush standoff stud mounts (maximum halo bloom) or custom recessed wireway bars",
          "Full-scale 1:1 CNC paper template mapping every standoff & wire exit point",
        ],
      },
      {
        title: "Dual-Direction Lighting Configurations",
        description:
          "Independent front and rear LED tuning to balance signage brightness and ordinance limits.",
        options: [
          "6500K Face + 3000K Halo, 6500K Face + Magenta Halo, Matched 4000K, or PMS Face + Halo",
          "Single unified circuit or dual-circuit control (allowing independent dimming/switching)",
          "UL Class 2 Mean Well® IP67 drivers (120–277VAC) + NEC 600 disconnect",
        ],
      },
    ],
    applications: [
      {
        sector: "Retail Stores",
        detail:
          "Stand-out flagship identity for automotive showrooms, luxury fitness studios, electronics stores, and regional retail anchors.",
      },
      {
        sector: "Shopping Centers",
        detail:
          "Draws immediate attention on end-cap retail suites and lifestyle center pads competing with bright neighboring facades.",
      },
      {
        sector: "Commercial Buildings",
        detail:
          "Delivers unmistakable 24-hour highway identification paired with architectural halo warmth on stone, dark ACM, or glass curtainwalls.",
      },
      {
        sector: "Corporate Environments",
        detail:
          "Elevates healthcare campuses, medical specialty hubs, and multi-building corporate plazas with balanced prestige and visibility.",
      },
      {
        sector: "Dining & Nightlife Destinations",
        detail:
          "Creates signature dual-tone ambiance for restaurants, lounges, entertainment venues, and hospitality landmarks.",
      },
    ],
    portfolioCategoryId: null,
    portfolioGapNote:
      "Dual-Lit studio facade photography and split-color inspection video are displayed above. Standalone Dual-Lit client installation case studies are currently pending addition to our public portfolio archive.",
    faqs: [
      {
        question: "Can the front face and rear halo be different colors?",
        answer:
          "Yes. An internal opaque aluminum divider plate separates the front and rear chambers, letting us illuminate a crisp 6500K or Pantone-matched acrylic face while projecting an independent 3000K warm gold, magenta, or brand-accent halo onto the wall.",
      },
      {
        question: "Can dual-lit letters be mounted on a raceway?",
        answer:
          "Individual standoff stud mounting (1.0\"–1.5\" spacers) produces the cleanest 360-degree halo bloom. However, if behind-wall wiring access is restricted, we can fabricate a custom recessed wireway panel painted to match your facade so the halo remains visible.",
      },
      {
        question: "How do dual-lit channel letters compare in cost and lead time to front-lit?",
        answer:
          "Dual-lit letters require an internal aluminum baffle, thicker 0.063\" TIG-welded shells, double LED arrays, and polycarbonate rear lenses, making them our premium tier (9–10 business day production vs. 8–10 days for single-lit sets).",
      },
      {
        question: "What wall surfaces showcase the rear halo best on dual-lit signs?",
        answer:
          "Lighter matte stone, painted stucco, brick, and satin architectural panels reflect the rear halo widest. Dark black or glossy glass facades will still display a tight outline corona, which we preview accurately in your free 24-hour 3D Day/Night mockup before fabrication.",
      },
      {
        question: "Are both illumination circuits covered under one UL 48 label?",
        answer:
          "Yes. Both forward and reverse LED circuits are factory-wired under Basis Sign LLC UL 48 File #E555259 using Mean Well® UL Class 2 IP67 drivers (120–277VAC) and NEC Article 600 disconnect switching.",
      },
    ],
  },
  {
    slug: "blade-signs-light-boxes",
    quoteTypeId: "blade-sign",
    iconKey: "blade-lightbox",
    name: "Blade Signs & Push-Thru Light Boxes",
    shortName: "Blade & Light Boxes",
    category: "Cabinet & Projecting Signage",
    seoTitle:
      "Projecting Blade Signs & Push-Thru Light Boxes | UL 48 Custom Sign Cabinets",
    seoDescription:
      "Heavy-gauge 6063-T5 extruded aluminum double-sided blade signs and 0.125\" routed push-thru acrylic light boxes with UL 48 (#E555259) listing, NEC 600 disconnect, and welded brackets.",
    tagline:
      "Double-sided pedestrian visibility and precision CNC push-thru cabinets.",
    answerFirstSummary:
      "BASISSIGN fabricates heavy-gauge welded aluminum blade signs and routed ACM/aluminum push-thru light boxes with 1/2\"–3/4\" protruding acrylic letters, UL 48 wet-location certification (#E555259), and engineered mounting brackets.",
    description:
      "Ideal for walkable downtown streetscapes, mixed-use developments, and multi-tenant architectural bands. Choose between double-sided projecting blade cabinets for sidewalk traffic or ultra-clean routed aluminum faces where solid 3/4\" push-thru acrylic copy illuminates cleanly without visible plastic seam retainers.",
    visualKind: "photo",
    image: "/images/products/blade-signs-light-boxes-01-on.webp",
    offImage: "/images/products/blade-signs-light-boxes-01-off.webp",
    imageAlt:
      "Double-sided round projecting illuminated blade sign mounted to stone storefront with welded steel wall bracket",
    gallery: [
      {
        id: "blade-01",
        thumbLabel: "Round Blade",
        onSrc: "/images/products/blade-signs-light-boxes-01-on.webp",
        offSrc: "/images/products/blade-signs-light-boxes-01-off.webp",
        alt: "Double-sided round projecting illuminated blade sign mounted to stone storefront with welded steel wall bracket",
      },
      {
        id: "blade-02",
        thumbLabel: "Streetlight Cabinet",
        onSrc: "/images/products/blade-signs-light-boxes-02-on.webp",
        offSrc: "/images/products/blade-signs-light-boxes-02-off.webp",
        alt: "Extruded dark bronze round blade light box illuminated against daylight architectural limestone column",
      },
      {
        id: "blade-03",
        thumbLabel: "Evening Blade",
        onSrc: "/images/products/blade-signs-light-boxes-03-on.webp",
        offSrc: "/images/products/blade-signs-light-boxes-03-off.webp",
        alt: "Nighttime double-sided cafe blade cabinet sign projecting perpendicular to urban sidewalk",
      },
    ],
    video: {
      thumbLabel: "Fabrication Video",
      src: "/videos/blade-signs-light-boxes.mp4",
      poster: "/videos/blade-signs-light-boxes-poster.webp",
      thumbSrc: "/videos/blade-signs-light-boxes-thumb.webp",
      alt: "Factory shop floor inspection of welded double-sided round blade light box cabinet and steel mounting bracket",
      durationLabel: "0:10",
    },
    supportsDayNightPreview: true,
    chapterCode: "04 / BLADE & CABINET",
    ulListed: true,
    leadTime: "10–12 business days",
    warranty: "3-Year Full Electrical & Structural",
    minStroke: "0.75\" push-thru acrylic CNC detail",
    sizeRangeNote:
      "12\"+ standard architectural cabinet and round blade formats; exact maximum cabinet span without splicing, structural wind-load engineering, and bracket plate footprint are confirmed on CAD proof.",
    depthRange: "4\" to 8\" welded extruded aluminum cabinet",
    faceMaterial: "0.125\" Routed Aluminum w/ 1/2\"–3/4\" Push-Thru Cast Acrylic",
    returnMaterial: "Extruded Structural 6063-T5 Aluminum Cabinet + Gusset Bracket",
    illuminationStyle: "Internal uniform high-density LED grid (single or double sided)",
    ipRating: "IP67 Sealed Cabinet w/ Concealed Drainage & Disconnect",
    mountingOptions: [
      "90° Heavy-Duty Gusseted Blade Wall Bracket",
      "Flush Monument / Fascia Cabinet Mount",
      "Overhead Canopy Suspension Mount",
    ],
    kelvinOptions: [
      "3000K Warm",
      "4000K Neutral",
      "5000K Daylight",
      "6500K High-Contrast",
      "PMS Vinyl Overlays",
    ],
    finishingOptions: [
      "Extruded Dark Bronze, Matte Charcoal, PVD Brushed Gold, or Black Cabinets",
      "Custom Pantone PMS / RAL Polyurethane Painted Aluminum Cabinet Shells",
      "CNC-Machined 1/2\"–3/4\" Clear or Translucent Acrylic Push-Thru Copy",
      "2nd-Surface Opaque Aluminum or Vinyl Diffuser Overlays (Edge-Lit Push-Thru Glow)",
    ],
    idealFor: [
      "Downtown Streetfronts & Pedestrian Corridors",
      "Shopping Centers, Cafes & Boutiques",
      "Commercial Buildings & Monument Retrofits",
      "Architectural Strip Malls With Uniform Sign Criteria",
    ],
    deliverables: [
      "UL 48 #E555259 serialized cabinet & Mean Well® internal drivers",
      "Watertight integrated NEC disconnect switch",
      "CNC-machined push-thru acrylic with crisp 2nd-surface diffuser",
      "Custom crating built for safe LTL freight delivery (<1% damage rate)",
    ],
    overviewHeading:
      "Perpendicular Pedestrian Visibility & Precision Push-Thru Cabinets",
    overviewParagraphs: [
      "Blade signs and push-thru light boxes solve two distinct architectural signage challenges that flat facade letters cannot cover alone. Double-sided projecting blade cabinets mount perpendicular to sidewalks—capturing foot traffic approaching from both directions down dense urban streets and covered shopping promenades.",
      "Flush push-thru light boxes combine an opaque CNC-routed 0.125\" aluminum cabinet face with thick 1/2\" to 3/4\" solid cast acrylic letters pushed directly through precision cutouts. Instead of lighting an entire plastic rectangle, only your dimensional brand copy and polished acrylic edges glow—giving commercial buildings, banks, and multi-tenant monuments a tailored architectural finish.",
    ],
    howItWorksSteps: [
      {
        step: "01",
        title: "Extruded 6063-T5 Aluminum Cabinet",
        detail:
          "Structural 6063-T5 aluminum extrusions (4\" to 8\" cabinet depth) are mitered, seam-welded, outfitted with concealed bottom drainage, and paired with gusseted mounting brackets.",
      },
      {
        step: "02",
        title: "CNC-Routed Face & 1/2\"–3/4\" Push-Thru Acrylic",
        detail:
          "Solid 0.125\" aluminum plates are CNC-routed to exact vector openings; stepped 1/2\"–3/4\" cast acrylic letters protrude cleanly through the face with internal light-diffusing retainers.",
      },
      {
        step: "03",
        title: "Internal LED Grid & NEC 600 Disconnect",
        detail:
          "High-density IP67 LED grids powered by internal Mean Well® Class 2 drivers provide even single- or double-sided illumination with an integrated UL 48 disconnect switch.",
      },
    ],
    keyFeatures: [
      {
        title: "3D Illuminated Edges Without Plastic Boxes",
        benefit:
          "Opaque routed aluminum blocks light everywhere except your 1/2\"–3/4\" push-thru acrylic copy, projecting luminous beveled edges and upscale brand clarity.",
      },
      {
        title: "Double-Sided Two-Way Sidewalk Capture",
        benefit:
          "Projecting 90° blade cabinets catch pedestrians and slow urban drivers moving along the sidewalk before they ever pass your doorway.",
      },
      {
        title: "Gusseted Structural Mounting Hardware",
        benefit:
          "Includes heavy-duty welded mounting plates and internal gussets engineered for masonry, brick, CMU, steel stud, or monument column fastening.",
      },
      {
        title: "Self-Contained UL 48 Cabinet Assembly",
        benefit:
          "Drivers, wiring harnesses, wet-location seals, and an externally operable NEC Article 600 disconnect switch arrive pre-installed inside the UL 48 (#E555259) cabinet.",
      },
    ],
    materialsBreakdown: [
      {
        component: "Routed Cabinet Face",
        spec: "0.125\" CNC-routed architectural aluminum (or ACM face option) finished in matte/satin polyurethane or dark bronze",
      },
      {
        component: "Push-Thru Copy",
        spec: "1/2\" to 3/4\" thick cast acrylic letters machined with rear flange shoulder & 2nd-surface diffuser/vinyl option",
      },
      {
        component: "Structural Shell & Bracket",
        spec: "4\"–8\" deep extruded 6063-T5 aluminum cabinet with welded 90° gusseted wall plate or monument frame",
      },
      {
        component: "Electrical & Weatherproof",
        spec: "Uniform internal IP67 LED matrix + internal Mean Well® UL Class 2 drivers (120–277VAC) + integrated NEC 600 disconnect",
      },
    ],
    customizationGroups: [
      {
        title: "Cabinet Silhouette & Depth",
        description:
          "Tailored round, square, rectangular, or custom architectural cabinet profiles to fit historic piers and modern fascias.",
        options: [
          "Circular projecting blades, vertical skyscrapers, rectangular cabinets, and custom contour shapes",
          "4\" to 8\" cabinet depths engineered to balance side profile weight and internal diffusion",
          "0.75\" minimum push-thru acrylic detail width; custom monument retrofit sizes on CAD proof",
        ],
      },
      {
        title: "Cabinet Colors, PVD & Acrylic Finishes",
        description:
          "Cohesive metal finishes matched to storefront window mullions, awnings, and architectural bronze trim.",
        options: [
          "Dark bronze, matte black, brushed silver, PVD brushed gold, or custom PMS polyurethane",
          "White translucent push-thru acrylic, PMS film face overlays, or dark-day/white-night films",
          "Optional opaque metal caps on 3/4\" push-thru letters so only the glowing crystal edges illuminate",
        ],
      },
      {
        title: "Typography, Logos & Double-Sided Copy",
        description:
          "Single-sided fascia cabinets or matched double-sided projecting graphics cut from thick cast acrylic.",
        options: [
          "Precision CNC-routed taglines, crests, caffeine/hospitality icons, and multi-line copy",
          "Crisp 2nd-surface color graphics or full-face diffused graphic panels inside cabinet frames",
          "Complimentary 24h Day/Night 3D mockup verifying projection angle & readability",
        ],
      },
      {
        title: "Mounting & Lighting Configurations",
        description:
          "Purpose-built mounting geometry for projecting walls, canopy soffits, or freestanding masonry monuments.",
        options: [
          "90° heavy-duty gusseted blade wall bracket (concealed or exposed bolt plate)",
          "Flush fascia wall mount, monument pocket fitment, or overhead canopy suspension",
          "3000K Warm, 4000K Neutral, 5000K Daylight, or 6500K LED grid under UL 48 #E555259",
        ],
      },
    ],
    applications: [
      {
        sector: "Retail Stores",
        detail:
          "Double-sided projecting blade cabinets give boutiques, coffee shops, bakeries, and pharmacies instant sidewalk visibility ahead of adjacent storefronts.",
      },
      {
        sector: "Shopping Centers",
        detail:
          "Walkable lifestyle villages, arcade walkways, and multi-tenant pylons rely on push-thru light boxes for uniform, glare-free upscale aesthetics.",
      },
      {
        sector: "Commercial Buildings",
        detail:
          "Routed push-thru cabinets cleanly retrofit older strip-plaza sign cans or elevate exterior entrance monuments without replacing structural pylons.",
      },
      {
        sector: "Corporate Environments",
        detail:
          "Delivers executive exterior campus wayfinding, tenant directories, and understated bank or law-firm identification cabinets.",
      },
      {
        sector: "Historic Main Streets & Cafes",
        detail:
          "Compact circular or vintage bronze blade signs satisfy downtown historic overlay rules prohibiting large oversize fascia boards.",
      },
    ],
    portfolioCategoryId: "blade-cabinet",
    faqs: [
      {
        question:
          "What is the difference between a push-thru light box and a standard pan-face cabinet?",
        answer:
          "A push-thru sign uses a solid routed 0.125\" aluminum face with thick 1/2\" to 3/4\" cast acrylic letters pushed through from behind—so only your brand typography and glowing crystal edges illuminate, delivering a refined architectural look instead of an entire glowing rectangular plastic panel.",
      },
      {
        question: "Do projecting blade signs include structural mounting plates?",
        answer:
          "Yes. Double-sided blade signs ship with welded heavy-duty aluminum gusset plates engineered for brick, CMU block, concrete columns, or structural steel stud anchoring. Exact anchor bolt schedules are shown on your CAD engineering drawing (PE stamps, if mandated by local ordinance, are coordinated separately).",
      },
      {
        question: "Can blade signs or light boxes be mounted overhead under a canopy?",
        answer:
          "Yes. We fabricate blade and light box cabinets with custom top suspension brackets for covered retail arcades and walkways, alongside 90° wall-projecting blade mounts and flush monument cabinet configurations.",
      },
      {
        question: "Are the Mean Well® drivers and disconnect switches internal to the cabinet?",
        answer:
          "Yes. Because our 4\" to 8\" welded 6063-T5 aluminum cabinets have ample internal cavity space, your Mean Well® UL Class 2 power supplies and watertight NEC Article 600 disconnect switch are mounted and pre-wired inside the UL 48 (#E555259) cabinet before crating.",
      },
      {
        question: "What is the factory turnaround time for blade signs and push-thru cabinets?",
        answer:
          "Welded structural blade signs and push-thru light boxes ship in 10–12 business days after drawing approval in custom foam-lined wooden crates (<1% nationwide freight damage rate).",
      },
    ],
  },
];

export interface SpecComparisonRow {
  slug: string;
  iconKey: ProductIconKey;
  product: string;
  ul48Certified: string;
  illumination: string;
  minHeight: string;
  leadTime: string;
  bestUseCase: string;
}

export const SPEC_COMPARISON_ROWS: SpecComparisonRow[] = [
  {
    slug: "front-lit-channel-letters",
    iconKey: "front-lit",
    product: "Front-Lit Channel Letters",
    ul48Certified: "Yes — UL 48 #E555259",
    illumination: "Forward acrylic face",
    minHeight: "10\"+ (1.25\" stroke)",
    leadTime: "8–10 business days",
    bestUseCase: "Retail facades, franchises, high-visibility strip plazas",
  },
  {
    slug: "halo-lit-channel-letters",
    iconKey: "halo-lit",
    product: "Back / Halo-Lit Letters",
    ul48Certified: "Yes — UL 48 #E555259",
    illumination: "Reverse wall-wash halo",
    minHeight: "6\"+ (0.75\" stroke)",
    leadTime: "8–10 business days",
    bestUseCase: "Corporate offices, stone/brick facades, upscale boutiques",
  },
  {
    slug: "dual-lit-channel-letters",
    iconKey: "dual-lit",
    product: "Front & Back Dual-Lit",
    ul48Certified: "Yes — UL 48 #E555259",
    illumination: "Forward face + rear halo",
    minHeight: "10\"+ (1.25\" stroke)",
    leadTime: "9–10 business days",
    bestUseCase: "Flagship storefronts wanting distance punch + halo depth",
  },
  {
    slug: "blade-signs-light-boxes",
    iconKey: "blade-lightbox",
    product: "Blade & Push-Thru Light Box",
    ul48Certified: "Yes — UL 48 #E555259",
    illumination: "1/2\"–3/4\" push-thru / double-sided",
    minHeight: "12\"+ cabinet formats",
    leadTime: "10–12 business days",
    bestUseCase: "Walkable downtown streets, multi-tenant monuments",
  },
];

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  companyType: string;
  location: string;
  productUsed: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    quote:
      "We switched our wholesale channel letter outsourcing to BASISSIGN last year. Every set arrives in blind crating with UL 48 labels, Mean Well power supplies, and dead-on 1:1 patterns—saving our install crew two hours per job.",
    author: "Marcus Delgado",
    role: "Operations Director",
    companyType: "Regional Commercial Sign Shop",
    location: "Austin, TX",
    productUsed: "Front-Lit & Raceway Channel Letters",
  },
  {
    id: "t2",
    quote:
      "Our municipal inspector walked up, scanned the UL 48 File #E555259 label and NEC disconnect switch, and signed off in under three minutes. The 3000K halo on brushed bronze completely transformed our downtown clinic facade.",
    author: "Dr. Elena Vance",
    role: "Managing Partner",
    companyType: "Vance Aesthetic & Dental Group",
    location: "Charlotte, NC",
    productUsed: "Halo-Lit Brushed Bronze Letters",
  },
  {
    id: "t3",
    quote:
      "Getting a free 3D day-and-night facade mockup within 24 hours sold our landlord immediately. Production took nine business days and the custom foam-crated shipment landed with zero scuffs.",
    author: "Devon Patel",
    role: "VP of Development",
    companyType: "Multi-Unit Hospitality Group",
    location: "Orlando, FL",
    productUsed: "Dual-Lit Letters & Push-Thru Blade",
  },
];

export function getProductBySlug(slug: string): ProductSpec | undefined {
  return PRODUCT_CATALOG.find((item) => item.slug === slug);
}
