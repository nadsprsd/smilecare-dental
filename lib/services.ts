// lib/services.ts
// Drives both the /services overview page and the individual
// /services/[slug] detail pages. Priority services (root canal, implants,
// clear aligners, smile design) carry fuller content since they're the
// primary target keywords; the rest have shorter but complete pages —
// still enough to rank for their own long-tail searches over time.

export interface FAQ {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  title: string;
  category: "priority" | "core" | "general" | "info";
  metaTitle: string;
  metaDescription: string;
  intro: string;       // 1–2 paragraphs, keyword-rich, for the detail page
  shortDesc: string;    // 1 line, for the overview grid card
  benefits: string[];
  faqs: FAQ[];
}

export const SERVICES: Service[] = [
  {
    slug: "root-canal",
    title: "Root Canal Treatment",
    category: "priority",
    metaTitle: "Root Canal Treatment in Tripunithura, Ernakulam — Vee Care",
    metaDescription:
      "Painless, single-visit root canal treatment in Tripunithura. Vee Care Dental Clinic, Kandanad, uses modern rotary endodontics for comfortable, long-lasting results.",
    intro:
      "Root canal treatment saves an infected or badly decayed tooth instead of extracting it. At Vee Care Dental Clinic in Kandanad, Tripunithura, we use modern rotary endodontic techniques and effective local anaesthesia to make the procedure comfortable — most patients are surprised at how painless it actually is compared to the tooth pain that brought them in. Patients across Tripunithura and Ernakulam trust us for root canal treatment because we explain every step, use precise digital X-rays to plan the treatment, and finish most cases in a single visit wherever possible.",
    shortDesc: "Painless, single-visit root canal treatment to save your natural tooth.",
    benefits: [
      "Modern rotary endodontics for a faster, gentler procedure",
      "Single-visit treatment in most cases",
      "Digital X-ray planning for precision",
      "Saves your natural tooth instead of extraction",
    ],
    faqs: [
      { q: "Is root canal treatment painful?", a: "With modern anaesthesia and rotary technique, most patients feel little to no pain during the procedure — often less discomfort than the toothache that brought them in." },
      { q: "How much does a root canal cost in Tripunithura?", a: "Cost depends on the tooth and case complexity. Book a free consultation at Vee Care Dental Clinic for a transparent, itemised quote." },
      { q: "How many visits does a root canal take?", a: "Most straightforward cases are completed in a single visit; more complex cases may need two visits." },
    ],
  },
  {
    slug: "dental-implants",
    title: "Dental Implants",
    category: "priority",
    metaTitle: "Dental Implants in Tripunithura & Kandanad — Vee Care Dental",
    metaDescription:
      "Long-lasting dental implants in Tripunithura, Ernakulam. Vee Care Dental Clinic, Kandanad, offers Swiss-standard titanium implants with a natural look and feel.",
    intro:
      "Dental implants are the gold-standard replacement for missing teeth — a titanium post is placed into the jawbone, where it fuses naturally over several weeks, before a custom crown is fitted on top. The result looks, feels, and functions like a natural tooth. At Vee Care Dental Clinic, patients from Tripunithura, Ernakulam, and nearby Kandanad choose us for implant treatment because of our careful planning, transparent pricing, and focus on long-term durability rather than the fastest possible fix.",
    shortDesc: "Permanent, natural-looking replacement for missing teeth.",
    benefits: [
      "Swiss-standard titanium implants",
      "Custom porcelain crowns for a natural look",
      "Detailed treatment planning before any surgery",
      "Long-term durability with proper care",
    ],
    faqs: [
      { q: "How much do dental implants cost in Ernakulam?", a: "Cost depends on the number of teeth and implant system used. We offer a free consultation with transparent, itemised pricing before treatment begins." },
      { q: "How long does an implant take to heal?", a: "The implant typically fuses with the jawbone over 6–8 weeks before the final crown is fitted, though this varies by case." },
      { q: "Am I a candidate for dental implants?", a: "Most adults with adequate jawbone density are candidates. We assess this with a digital X-ray during your consultation." },
    ],
  },
  {
    slug: "clear-aligners",
    title: "Clear Aligners",
    category: "priority",
    metaTitle: "Clear Aligners in Tripunithura, Ernakulam — Vee Care Dental",
    metaDescription:
      "Straighten your teeth discreetly with clear aligners in Tripunithura. Vee Care Dental Clinic, Kandanad, offers custom clear aligner treatment for teens and adults.",
    intro:
      "Clear aligners are a discreet, removable alternative to traditional metal braces — custom-made transparent trays that gradually shift your teeth into place. At Vee Care Dental Clinic in Kandanad, Tripunithura, we plan each clear aligner case digitally so you can see your expected result before committing, and support you with regular check-ins throughout treatment. It's an increasingly popular choice among working professionals and teens across Ernakulam who want straighter teeth without visible braces.",
    shortDesc: "Discreet, removable clear aligners for teens and adults.",
    benefits: [
      "Virtually invisible compared to metal braces",
      "Removable for eating and brushing",
      "Digital treatment planning so you see the outcome in advance",
      "Suitable for most mild-to-moderate alignment cases",
    ],
    faqs: [
      { q: "How long does clear aligner treatment take?", a: "Treatment time varies by case, typically ranging from a few months to over a year depending on how much correction is needed." },
      { q: "Are clear aligners as effective as braces?", a: "For many mild-to-moderate cases, yes. Our team will assess whether aligners or traditional braces suit your specific case best." },
      { q: "Can adults get clear aligners?", a: "Yes — clear aligners are popular with adults precisely because they're discreet enough for daily professional life." },
    ],
  },
  {
    slug: "smile-design",
    title: "Smile Design",
    category: "priority",
    metaTitle: "Smile Design & Makeover in Tripunithura — Vee Care Dental",
    metaDescription:
      "Complete smile design and makeover in Tripunithura, Ernakulam. Vee Care Dental Clinic, Kandanad, combines veneers, whitening & alignment for a natural, confident smile.",
    intro:
      "Smile design combines several cosmetic treatments — veneers, whitening, reshaping, and alignment — into one cohesive plan tailored to your face and goals, rather than treating each concern in isolation. At Vee Care Dental Clinic, we start every smile design case with a discussion of what you want to change, then use digital previews so you know what to expect before any irreversible step is taken. Patients across Tripunithura and Ernakulam come to us for smile makeovers ahead of weddings, big events, or simply because they're ready for a change.",
    shortDesc: "A complete, personalised cosmetic transformation for your smile.",
    benefits: [
      "Combines whitening, veneers, and reshaping into one plan",
      "Digital preview before treatment begins",
      "Personalised to your face and goals",
      "Popular for pre-wedding and pre-event makeovers",
    ],
    faqs: [
      { q: "What's included in a smile design consultation?", a: "We assess your teeth, gums, and facial proportions, discuss your goals, and propose a combination of treatments — whitening, veneers, alignment, or reshaping — as needed." },
      { q: "How long does a smile makeover take?", a: "It depends on which treatments are included; some cases are completed in a couple of visits, others take several weeks." },
    ],
  },
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    category: "core",
    metaTitle: "Professional Teeth Whitening in Tripunithura — Vee Care",
    metaDescription: "In-clinic professional teeth whitening at Vee Care Dental Clinic, Tripunithura, Ernakulam — safe, effective, and noticeably brighter in one session.",
    intro: "Professional in-clinic teeth whitening removes years of stains from tea, coffee, and everyday life far more effectively and safely than over-the-counter kits. At Vee Care Dental Clinic in Tripunithura, we use controlled, dentist-supervised whitening for a noticeably brighter smile without damaging enamel.",
    shortDesc: "Professional in-clinic whitening for a noticeably brighter smile.",
    benefits: ["Dentist-supervised for safety", "Noticeable results in one session", "Longer-lasting than at-home kits"],
    faqs: [{ q: "How long do whitening results last?", a: "With good oral hygiene and limiting staining foods/drinks, results typically last several months to a couple of years." }],
  },
  {
    slug: "dental-checkups",
    title: "Dental Check-ups",
    category: "core",
    metaTitle: "Dental Check-ups & Cleaning in Tripunithura — Vee Care",
    metaDescription: "Routine dental check-ups and cleaning at Vee Care Dental Clinic, Tripunithura, Ernakulam — prevention is always cheaper than a cure.",
    intro: "Regular dental check-ups catch small problems before they become expensive, painful ones. At Vee Care Dental Clinic, our check-ups include a full oral examination, professional cleaning, and honest guidance — we only recommend treatment you actually need.",
    shortDesc: "Routine check-ups and cleaning to catch problems early.",
    benefits: ["Early detection of cavities and gum issues", "Professional cleaning removes plaque and tartar", "Honest, no-pressure recommendations"],
    faqs: [{ q: "How often should I get a dental check-up?", a: "Most dentists recommend a check-up every six months, though your dentist may suggest a different interval based on your oral health." }],
  },
  {
    slug: "cosmetic-dentistry",
    title: "Cosmetic Procedures",
    category: "core",
    metaTitle: "Cosmetic Dentistry in Tripunithura, Ernakulam — Vee Care",
    metaDescription: "Cosmetic dental procedures at Vee Care Dental Clinic, Tripunithura — whitening, veneers, reshaping and more for a smile you're proud of.",
    intro: "From subtle refinements to complete transformations, our cosmetic dentistry options are tailored to what actually suits your face and goals rather than a one-size-fits-all approach. Vee Care Dental Clinic serves patients across Tripunithura and Ernakulam looking to improve their smile's appearance.",
    shortDesc: "Whitening, veneers, reshaping and more for your ideal smile.",
    benefits: ["Personalised treatment combinations", "Natural-looking results", "Options for every budget"],
    faqs: [{ q: "What's the difference between cosmetic dentistry and smile design?", a: "Cosmetic dentistry covers individual treatments; smile design combines several of them into one coordinated plan." }],
  },
  {
    slug: "dentures-bridges",
    title: "Dentures & Bridges",
    category: "core",
    metaTitle: "Dentures & Bridges in Tripunithura — Vee Care Dental Clinic",
    metaDescription: "Custom dentures and bridges at Vee Care Dental Clinic, Tripunithura, Ernakulam — restore function and confidence after tooth loss.",
    intro: "Dentures and bridges restore your ability to eat, speak, and smile with confidence after losing one or more teeth. At Vee Care Dental Clinic, each denture or bridge is custom-fitted for comfort and a natural appearance.",
    shortDesc: "Custom-fitted solutions to restore function after tooth loss.",
    benefits: ["Custom fit for comfort", "Natural appearance", "Restores chewing function"],
    faqs: [{ q: "How long do dentures last?", a: "With proper care, dentures typically last 5–10 years before needing replacement or relining." }],
  },
  {
    slug: "extractions",
    title: "Extractions",
    category: "general",
    metaTitle: "Tooth Extractions in Tripunithura — Vee Care Dental Clinic",
    metaDescription: "Safe, gentle tooth extractions at Vee Care Dental Clinic, Tripunithura, Ernakulam, including wisdom tooth removal.",
    intro: "When a tooth can't be saved, our team performs extractions as gently and safely as possible, with clear aftercare guidance to ensure smooth healing.",
    shortDesc: "Safe, gentle tooth extractions including wisdom teeth.",
    benefits: ["Minimally invasive technique", "Clear aftercare guidance", "Pain management support"],
    faqs: [{ q: "Does tooth extraction hurt?", a: "The area is fully numbed before extraction; some pressure may be felt, but not pain. Mild soreness afterward is normal and manageable." }],
  },
  {
    slug: "fillings-sealants",
    title: "Fillings and Sealants",
    category: "general",
    metaTitle: "Fillings & Sealants in Tripunithura — Vee Care Dental Clinic",
    metaDescription: "Tooth-coloured fillings and protective sealants at Vee Care Dental Clinic, Tripunithura, Ernakulam.",
    intro: "Composite fillings repair cavities with a natural, tooth-coloured material, while sealants protect healthy teeth — especially in children — from future decay.",
    shortDesc: "Tooth-coloured fillings and protective sealants for lasting health.",
    benefits: ["Natural tooth-coloured material", "Sealants help prevent future cavities", "Quick, comfortable procedure"],
    faqs: [{ q: "Are sealants only for children?", a: "Sealants are most commonly used on children's molars, but adults with cavity-prone teeth can benefit too." }],
  },
  {
    slug: "laser-dentistry",
    title: "Laser Dentistry",
    category: "general",
    metaTitle: "Laser Dentistry in Tripunithura — Vee Care Dental Clinic",
    metaDescription: "Precise, minimally invasive laser dentistry at Vee Care Dental Clinic, Tripunithura, Ernakulam.",
    intro: "Laser dentistry allows for more precise, often painless treatment of gum and soft-tissue procedures, with faster healing than traditional methods.",
    shortDesc: "Precise, minimally invasive treatment with faster healing.",
    benefits: ["Minimally invasive", "Often reduces need for anaesthesia", "Faster healing time"],
    faqs: [{ q: "What procedures use laser dentistry?", a: "Common uses include gum reshaping, treating gum disease, and certain soft-tissue procedures." }],
  },
  {
    slug: "oral-surgery",
    title: "Oral Surgery",
    category: "general",
    metaTitle: "Oral Surgery in Tripunithura, Ernakulam — Vee Care Dental",
    metaDescription: "Oral surgery procedures at Vee Care Dental Clinic, Tripunithura, Ernakulam, handled with careful planning and aftercare support.",
    intro: "From complex extractions to minor surgical procedures, our team plans each case carefully and provides thorough aftercare guidance for smooth recovery.",
    shortDesc: "Surgical dental procedures with careful planning and aftercare.",
    benefits: ["Careful pre-surgical planning", "Experienced surgical team", "Thorough aftercare guidance"],
    faqs: [{ q: "Is oral surgery covered by insurance?", a: "Coverage varies by provider and procedure — we recommend checking with your insurer, and we're happy to provide documentation to help." }],
  },
  {
    slug: "teeth-reshaping",
    title: "Teeth Reshaping",
    category: "general",
    metaTitle: "Teeth Reshaping in Tripunithura — Vee Care Dental Clinic",
    metaDescription: "Subtle teeth reshaping (contouring) at Vee Care Dental Clinic, Tripunithura, Ernakulam, for a more even, natural smile.",
    intro: "Teeth reshaping (contouring) makes small, precise adjustments to correct minor chips, unevenness, or overlaps — often completed in a single visit with no downtime.",
    shortDesc: "Subtle contouring for a more even, natural-looking smile.",
    benefits: ["Usually completed in one visit", "No downtime", "Subtle, natural-looking results"],
    faqs: [{ q: "Is teeth reshaping painful?", a: "No — it's a painless procedure since it only involves the outer enamel." }],
  },
  {
    slug: "veneers-crowns",
    title: "Veneers & Crowns",
    category: "general",
    metaTitle: "Veneers & Crowns in Tripunithura — Vee Care Dental Clinic",
    metaDescription: "Custom porcelain veneers and crowns at Vee Care Dental Clinic, Tripunithura, Ernakulam, for a durable, natural-looking smile.",
    intro: "Veneers and crowns restore damaged or discoloured teeth while blending naturally with the rest of your smile. Each is custom-shaped and shaded at Vee Care Dental Clinic to match your natural teeth.",
    shortDesc: "Custom veneers and crowns for a durable, natural-looking smile.",
    benefits: ["Custom shade-matched to your teeth", "Durable, long-lasting materials", "Restores both function and appearance"],
    faqs: [{ q: "What's the difference between a veneer and a crown?", a: "A veneer covers just the front surface of a tooth for cosmetic reasons; a crown covers the entire tooth, often for structural repair." }],
  },
  {
    slug: "x-ray",
    title: "Dental X-Ray",
    category: "general",
    metaTitle: "Digital Dental X-Ray in Tripunithura — Vee Care Dental",
    metaDescription: "Low-radiation digital dental X-rays at Vee Care Dental Clinic, Tripunithura, Ernakulam, for accurate diagnosis and treatment planning.",
    intro: "Digital X-rays let us diagnose issues below the surface — from cavities between teeth to bone density for implants — with lower radiation than traditional film X-rays and instant results.",
    shortDesc: "Low-radiation digital X-rays for accurate diagnosis.",
    benefits: ["Lower radiation than traditional film", "Instant results", "Essential for accurate treatment planning"],
    faqs: [{ q: "Are digital X-rays safe?", a: "Yes — digital X-rays use significantly less radiation than older film X-ray methods and are considered very safe." }],
  },
  {
    slug: "teeth-cleaning",
    title: "Teeth Cleaning",
    category: "general",
    metaTitle: "Professional Teeth Cleaning in Tripunithura — Vee Care",
    metaDescription: "Professional teeth cleaning (scaling & polishing) at Vee Care Dental Clinic, Tripunithura, Ernakulam.",
    intro: "Professional cleaning removes plaque and tartar buildup that brushing alone can't reach, keeping your gums healthy and your breath fresh.",
    shortDesc: "Professional scaling and polishing for healthier gums.",
    benefits: ["Removes plaque and tartar", "Freshens breath", "Helps prevent gum disease"],
    faqs: [{ q: "How often should I get my teeth professionally cleaned?", a: "Most dentists recommend professional cleaning every six months." }],
  },
];

export const PRIORITY_SERVICES = SERVICES.filter((s) => s.category === "priority");

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
