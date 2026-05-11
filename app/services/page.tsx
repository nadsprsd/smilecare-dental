import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Services – SmileCare Tripunithura",
  description:
    "Complete dental services in Tripunithura. Implants, braces, whitening, root canal, kids dentistry and more. Specialist doctors, affordable prices.",
};

const SERVICES = [
  {
    id: "whitening",
    title: "Teeth Whitening",
    subtitle: "Professional In-Clinic Treatment",
    price: "From ₹3,000",
    duration: "90 minutes · Single session",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=85&fit=crop",
    description:
      "Years of coffee, tea, and daily wear leave their mark on your teeth. Our professional whitening system uses clinically proven bleaching agents — supervised by our doctors — to remove deep stains and lighten your smile by up to 8 shades in a single 90-minute visit. Unlike store-bought strips or charcoal pastes, our treatment delivers consistent, dramatic results with zero enamel damage.",
    whyItMatters:
      "A brighter smile is one of the first things people notice. Studies show people with whiter teeth are perceived as more confident, successful and approachable. This is one of the highest-return cosmetic treatments available.",
    includes: [
      "Pre-treatment sensitivity assessment",
      "Custom gum protection shield",
      "Professional-grade 35% hydrogen peroxide gel",
      "LED light acceleration for faster results",
      "Take-home maintenance kit included",
      "30-day results guarantee",
    ],
    ideal: "Anyone with stained, yellowed or dull teeth. Works best on natural teeth.",
  },
  {
    id: "implants",
    title: "Dental Implants",
    subtitle: "Swiss Titanium · Lifetime Durability",
    price: "From ₹18,000 per tooth",
    duration: "2–3 visits over 3 months",
    img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=900&q=85&fit=crop",
    description:
      "Dental implants are the gold standard for replacing missing teeth — and for good reason. A Swiss titanium post is placed directly into your jawbone, where it fuses naturally over 6–8 weeks. A custom porcelain crown is then fitted on top, creating a tooth that looks, feels and functions exactly like your natural one. Dr. Priya Menon has completed over 800 successful implant procedures at SmileCare.",
    whyItMatters:
      "Unlike dentures that slip or bridges that require grinding adjacent teeth, implants preserve your jawbone, protect neighbouring teeth, and last a lifetime with proper care. They are the only tooth replacement that actually prevents bone loss.",
    includes: [
      "3D CT scan and computerised treatment planning",
      "Swiss titanium implant post (Straumann/Nobel)",
      "Custom porcelain crown — natural colour match",
      "Bone grafting if required at no extra charge",
      "5-year implant warranty",
      "Free annual checkups for 2 years post-procedure",
    ],
    ideal:
      "Anyone with one or more missing teeth and sufficient jawbone density. Suitable from age 18+.",
  },
  {
    id: "braces",
    title: "Braces & Aligners",
    subtitle: "Metal · Ceramic · Invisible",
    price: "From ₹25,000",
    duration: "12–24 months",
    img:  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=900&q=85&fit=crop",
    description:
      "Crooked or crowded teeth affect more than your appearance — they are harder to clean, leading to cavities and gum disease over time. We offer all three types of orthodontic treatment: traditional metal braces (most economical), clear ceramic braces (less visible), and Invisalign-style clear aligners (completely invisible). Dr. Arjun Nair uses digital 3D simulation so you see your expected result before a single brace is placed.",
    whyItMatters:
      "Straight teeth are healthier teeth. Properly aligned teeth are significantly easier to brush and floss, reducing long-term dental costs. And the confidence boost from a straight smile is something patients consistently describe as life-changing.",
    includes: [
      "Digital 3D smile preview before treatment begins",
      "Choice of metal, ceramic or clear aligners",
      "Monthly monitoring appointments included",
      "Emergency adjustment visits at no extra cost",
      "Free retainers on completion of treatment",
      "Flexible EMI payment — 0% interest options",
    ],
    ideal: "Children from age 8, teenagers, and adults of any age. No upper age limit.",
  },
  {
    id: "rct",
    title: "Root Canal Treatment",
    subtitle: "Single-Visit · Completely Painless",
    price: "From ₹4,000",
    duration: "1–2 hours · Usually single visit",
    img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&q=85&fit=crop",
    description:
      "Root canal treatment has an unfair reputation — it's almost always blamed for pain it is actually treating. The infection inside the tooth causes the pain; the procedure eliminates it. Using modern rotary endodontic instruments and highly effective local anaesthesia, we remove the infected pulp, thoroughly clean the canals, and seal the tooth with a porcelain crown — all with no more discomfort than a routine filling.",
    whyItMatters:
      "A root canal saves your natural tooth, which is always preferable to extraction. Your natural tooth root keeps your jawbone stimulated and your bite aligned. Losing a tooth starts a chain reaction — shifting teeth, bone loss, and expensive future treatments.",
    includes: [
      "Digital X-ray for precise diagnosis",
      "Advanced rotary endodontic instruments",
      "Highly effective local anaesthesia",
      "Single-visit completion in most cases",
      "Custom ceramic crown included in package",
      "Post-treatment care kit and follow-up call",
    ],
    ideal: "Anyone with toothache, sensitivity to hot/cold, or swelling around a tooth.",
  },
  {
    id: "kids",
    title: "Pediatric Dentistry",
    subtitle: "Gentle · Stress-Free · Child-Friendly",
    price: "From ₹500",
    duration: "30–45 minutes",
    img: "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=900&q=85&fit=crop",
    description:
      "A child's first dental experience shapes their relationship with dental care for life. Dr. Sreelakshmi specialises in making that experience positive — even for children who arrive terrified. Our clinic environment uses child-friendly language, colourful decor, and a gentle step-by-step approach that demystifies every instrument before it's used. Children who visit SmileCare regularly grow up comfortable with dental care — which means fewer problems and lower costs as adults.",
    whyItMatters:
      "Childhood cavities left untreated cause pain, infection, and problems with adult teeth development. Early preventive care — fluoride treatments, fissure sealants, and habit guidance — prevents the vast majority of dental problems before they start.",
    includes: [
      "Child-friendly, low-anxiety clinic environment",
      "Fluoride treatments to strengthen enamel",
      "Fissure sealants to prevent cavities",
      "Space maintainers if baby teeth are lost early",
      "Parent guidance on brushing and diet",
      "Certified nitrous oxide sedation available if needed",
    ],
    ideal: "Children from 6 months (first tooth) through age 16.",
  },
  {
    id: "smile",
    title: "Smile Makeover",
    subtitle: "Complete Cosmetic Transformation",
    price: "Custom Quote — Free Consultation",
    duration: "Multiple visits over 4–8 weeks",
    img: "https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?w=900&q=85&fit=crop",
    description:
      "A smile makeover combines multiple cosmetic treatments into one coordinated plan — designed specifically around your face shape, skin tone, and personal goals. This might include porcelain veneers, composite bonding, teeth whitening, gum contouring, crown lengthening, or implants. Before any treatment begins, we use digital smile design software to show you a photorealistic preview of your new smile. You approve it. Then we build it.",
    whyItMatters:
      "For many patients, a smile makeover is genuinely transformative — not just aesthetically but in terms of confidence, social interaction, and professional perception. It is an investment that patients consistently describe as one of the best decisions of their life.",
    includes: [
      "Digital smile design — photorealistic preview",
      "Porcelain veneers (ultra-thin, no drilling in most cases)",
      "Composite bonding for minor corrections",
      "Gum contouring for perfect proportions",
      "Teeth whitening included in the plan",
      "Phased payment plan — flexible scheduling",
    ],
    ideal:
      "Anyone unhappy with the appearance of their smile — chipped, discoloured, uneven, or gummy smile.",
  },
  {
    id: "checkup",
    title: "Dental Checkup & Cleaning",
    subtitle: "Prevention Is Always Cheaper Than Cure",
    price: "₹300 only",
    duration: "45–60 minutes",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=85&fit=crop",
    description:
      "Most serious dental problems — cavities, gum disease, oral cancer — are completely preventable or easily treated when caught early. Our comprehensive checkup includes a full oral examination, digital X-rays, and professional scaling and polishing. In 45 minutes, we catch anything developing before it becomes expensive or painful. We recommend this every 6 months for all adults and every 3–4 months for children.",
    whyItMatters:
      "At ₹300, this is the best-value investment in your health. A cavity caught today is a ₹1,000 filling. Left for a year, it becomes a ₹4,000 root canal. Left longer, it's an extraction and implant. Prevention genuinely pays.",
    includes: [
      "Full oral examination by a qualified dentist",
      "Digital X-rays (low radiation) if required",
      "Professional scaling — removes tartar buildup",
      "Polishing for a clean, smooth finish",
      "Oral cancer screening",
      "Personalised oral hygiene advice to take home",
    ],
    ideal: "Everyone — recommended every 6 months from age 1 onwards.",
  },
  {
    id: "dentures",
    title: "Dentures & Bridges",
    subtitle: "Restore Function · Restore Confidence",
    price: "From ₹8,000",
    duration: "2–4 visits over 2–3 weeks",
    img: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=900&q=85&fit=crop",
    description:
      "For patients who need to replace multiple missing teeth, we offer complete and partial dentures as well as fixed dental bridges. Modern dentures are nothing like the loose, unnatural-looking appliances of the past — today's precision-fitted dentures are comfortable, stable and indistinguishable from natural teeth. Fixed bridges use adjacent teeth as anchors for a non-removable restoration that feels completely natural.",
    whyItMatters:
      "Missing teeth affect far more than appearance. They make eating difficult, cause speech changes, and lead to bone loss and shifting of remaining teeth over time. Restoring missing teeth protects your overall oral and physical health.",
    includes: [
      "Complete and partial denture options",
      "Fixed dental bridges — non-removable",
      "Precision colour matching to remaining teeth",
      "BPS (Biofunctional Prosthetic System) available",
      "Free adjustments for 3 months post-fitting",
      "Annual review appointments included",
    ],
    ideal: "Patients missing multiple teeth, or those with existing ill-fitting dentures.",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white">

      {/* ── Header ── */}
      <div className="relative h-80 overflow-hidden bg-[#0D1117]">
        <Image
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80"
          alt="SmileCare Services"
          fill
          className="object-cover opacity-40"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="label-text block mb-4">15+ Treatments Available</span>
          <h1
            className="display-text text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            Every Treatment,
            <br />
            <span className="italic text-[#C9A96E]">Under One Roof.</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-base">
            Specialist-led care for every dental need — from your child's first checkup to a complete smile transformation.
          </p>
        </div>
      </div>

      {/* ── Quick nav ── */}
      <div className="sticky top-[60px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap text-xs font-medium px-4 py-2 border border-gray-200 text-gray-600 hover:border-[#0D1117] hover:text-[#0D1117] transition-all"
            >
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-32">
        {SERVICES.map((svc, idx) => (
          <div
            key={svc.id}
            id={svc.id}
            className={`grid lg:grid-cols-2 gap-14 items-start scroll-mt-32 ${
              idx % 2 === 1 ? "lg:grid-flow-col-dense" : ""
            }`}
          >
            {/* Image */}
            <div className={idx % 2 === 1 ? "lg:col-start-2" : ""}>
              <div className="relative overflow-hidden aspect-[4/3]">
                <Image
                  src={svc.img}
                  alt={svc.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Price tag */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1117]/80 to-transparent p-6 flex items-end justify-between">
                  <div>
                    <div className="text-white/60 text-xs mb-1">{svc.duration}</div>
                    <div className="text-[#C9A96E] font-bold text-lg">{svc.price}</div>
                  </div>
                  <Link
                    href={`/appointment?service=${encodeURIComponent(svc.title)}`}
                    className="bg-white text-[#0D1117] text-xs font-semibold px-4 py-2.5 hover:bg-[#C9A96E] hover:text-white transition-all"
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
              <span className="label-text block mb-3">{svc.subtitle}</span>
              <span className="gold-rule" />
              <h2
                className="display-text text-[#0D1117] mb-5"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
              >
                {svc.title}
              </h2>

              <p className="text-[#4A5568] leading-relaxed mb-5 text-[15px]">
                {svc.description}
              </p>

              {/* Why it matters */}
              <div className="border-l-2 border-[#C9A96E] pl-4 mb-6 bg-[#C9A96E]/5 py-3 pr-3">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E] mb-1">
                  Why It Matters
                </div>
                <p className="text-[#4A5568] text-sm leading-relaxed">{svc.whyItMatters}</p>
              </div>

              {/* What's included */}
              <div className="mb-6">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-3">
                  What's Included
                </div>
                <ul className="space-y-2.5">
                  {svc.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#0D1117]">
                      <div className="w-5 h-5 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-[#C9A96E]" strokeWidth={2.5} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ideal for */}
              <div className="bg-[#F4F7FA] px-4 py-3 mb-7 border-l-2 border-[#0D1117]/20">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#0D1117]/50">
                  Ideal For
                </span>
                <p className="text-[#4A5568] text-sm mt-1">{svc.ideal}</p>
              </div>

              <Link
                href={`/appointment?service=${encodeURIComponent(svc.title)}`}
                className="btn-primary text-sm"
              >
                Book {svc.title} <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="bg-[#0D1117] py-24 text-center px-6">
        <span className="label-text block mb-4">Free Consultation</span>
        <h2
          className="display-text text-white mb-5"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          Not Sure Which Treatment?
          <br />
          <span className="italic text-[#C9A96E]">Let Us Guide You.</span>
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto text-base leading-relaxed">
          Book a free consultation. Our specialist will examine your teeth, answer every question, and recommend exactly what you need — with full price transparency, zero pressure.
        </p>
        <Link href="/appointment" className="btn-white text-sm">
          Book Free Consultation <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}

