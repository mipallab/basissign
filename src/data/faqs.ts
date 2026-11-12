export interface FaqEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const GLOBAL_FAQS: FaqEntry[] = [
  {
    id: "ul48-certified",
    category: "UL 48 Compliance",
    question: "Are BASISSIGN illuminated signs UL 48 listed for US city & landlord permits?",
    answer:
      "Yes. Basis Sign LLC manufactures illuminated signs under UL Standard 48 (UL File #E555259) and NEC Article 600 requirements. Every illuminated sign ships with serialized UL labels, UL-recognized IP67 LED modules, Mean Well® Class 2 power supplies, and watertight disconnect switches ready for Authority Having Jurisdiction (AHJ) inspection.",
  },
  {
    id: "lead-time",
    category: "Production & Shipping",
    question: "What is your standard production lead time and freight damage rate?",
    answer:
      "Most custom channel letter orders ship factory-direct in 8–10 business days after drawing approval, with blade signs and push-thru light boxes shipping in 10–12 business days. Custom engineered foam and wood crating keeps our nationwide freight damage rate below 1%.",
  },
  {
    id: "free-mockup",
    category: "Quoting & Proofs",
    question: "Do I get a free 3D Day/Night mockup before paying or entering production?",
    answer:
      "Yes. Request a quote with your sign text, logo file, or storefront photo and our engineering team provides a factory-direct quote plus a complimentary scaled 3D Day/Night facade rendering and engineering proof within 1 business day.",
  },
  {
    id: "trade-blind",
    category: "Sign Shops & Contractors",
    question: "Do you offer trade wholesale pricing and blind white-label shipping for sign shops?",
    answer:
      "Yes. We partner directly with US sign companies, electrical contractors, and design-build agencies. Toggle Trade / Blind Shipping in our quote configurator to ship in unbranded crates with zero BASISSIGN invoices or markings inside.",
  },
  {
    id: "installation-hardware",
    category: "Installation",
    question: "What comes inside the crate for installation?",
    answer:
      "Every shipment includes your UL 48 labeled signage, correctly sized Mean Well® Class 2 power supplies, a full-scale 1:1 CNC-plotted paper mounting template, stainless steel mounting studs/spacers, wiring diagram, and NEC disconnect switch where required.",
  },
  {
    id: "warranty",
    category: "Warranty",
    question: "What does the BASISSIGN 3-Year Warranty cover?",
    answer:
      "All BASISSIGN fabricated signage carries a 3-year warranty covering LED modules, Mean Well® power supplies, structural aluminum welds, acrylic colorfastness, and finish adhesion across all 50 US states.",
  },
];
