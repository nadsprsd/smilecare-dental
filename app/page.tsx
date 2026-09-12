export const dynamic    = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play, Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import CertificatesSection from "@/components/CertificatesSection";
import VideoTestimonials from "@/components/VideoTestimonials";
import FAQSection from "@/components/FAQSection";
import HomeBlogSection from "@/components/HomeBlogSection";
import { DOCTORS } from "@/lib/doctors";

// Homepage features 3 doctors: both full-time doctors (always relevant, always
// bookable) plus one real specialist — pulled directly from the same roster
// used everywhere else, never hardcoded separately again.
const HOMEPAGE_DOCTORS = DOCTORS.filter(d => ["vineeth", "anumuthu", "sreeja"].includes(d.id))
  .map(d => ({
    name: d.name,
    role: d.specialty,
    edu:  d.degree,
    img:  d.photo ?? null,
    spec: d.services.slice(0, 3),
  }));

export const metadata: Metadata = {
  title: "Best Dental Clinic in Tripunithura, Ernakulam — Vee Care",
  description:
    "Vee Care Dental Clinic, Kandanad — root canal, dental implants, clear aligners & smile design in Tripunithura, Ernakulam. Evening & Sunday OP available. Book a free consultation.",
};

/* ── Real Unsplash images ── */
const HERO_IMG      = "/photos/clinic-team-hero.webp";
const CLINIC_IMG    = "/photos/clinic-storefront.webp";
const SMILE_IMG     = "/photos/clinic-procedure-1.webp";
const EQUIP_IMG     = "/photos/clinic-technology.webp";
const TEAM_IMG      = "/photos/clinic-procedure-2.webp";

export default function HomePage() {
  return ( 
    <div className="bg-white">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#0D1117]">
        {/* Full bleed background image */}
        <div className="absolute inset-0 img-zoom">
          <Image
            src={HERO_IMG}
            alt="Vee Care Dental Clinic"
            fill
            className="object-cover object-center opacity-50"
            priority
            sizes="100vw"
          />
        </div>

        {/* Gradient overlay — strong at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <div className="max-w-3xl">
            <span className="label-text block mb-6">Tripunithura · Ernakulam · Kerala</span>

            <h1
              className="display-text text-white mb-6"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 1.0 }}
            >
              Dental Care
              <br />
              <span className="italic text-[#C1583B]">Crafted</span> for
              <br />
              Your Smile.
            </h1>

            <p
              className="text-white/65 mb-10 max-w-lg leading-relaxed"
              style={{ fontSize: "1.1rem", fontFamily: "var(--font-body)" }}
            >
              Combining advanced technology with a human touch — a full-time doctor
              and a team of specialists delivering real care in Tripunithura.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/appointment" className="btn-white text-sm">
                Book Free Consultation
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
              <a
                href="https://wa.me/918075243127"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white/70 px-8 py-4 transition-all duration-300 text-sm font-medium tracking-wide"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-10 border-t border-white/15 pt-10">
              {[
                { num: "8",  label: "Doctors on Our Team" },
                { num: "6",  label: "Specialities Covered" },
                { num: "17", label: "Services Offered" },
                { num: "1",  label: "Chair, No Double-Booking" },
              ].map(s => (
                <div key={s.label}>
                  <div className="display-text text-white text-3xl font-semibold">{s.num}</div>
                  <div className="text-white/50 text-xs mt-1 tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-12 z-10 hidden md:flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/40" />
          <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center mt-6">Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ABOUT STRIP — asymmetric layout
      ════════════════════════════════════════ */}
      <section className="section-pad bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Image collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded-none overflow-hidden img-zoom aspect-[3/4]">
                  <Image src={CLINIC_IMG} alt="Our Clinic" fill className="object-cover" sizes="300px" />
                </div>
                <div className="space-y-3 mt-10">
                  <div className="relative rounded-none overflow-hidden img-zoom aspect-[4/3]">
                    <Image src={EQUIP_IMG} alt="Equipment" fill className="object-cover" sizes="300px" />
                  </div>
                  <div className="relative rounded-none overflow-hidden img-zoom aspect-[4/3]">
                    <Image src={SMILE_IMG} alt="Patient Smile" fill className="object-cover" sizes="300px" />
                  </div>
                </div>
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-4 bg-[#0D1117] text-white p-6 shadow-2xl">
                <div className="display-text text-4xl font-semibold text-[#C1583B]">2025</div>
                <div className="text-white/60 text-xs mt-1 tracking-wide">Established in<br/>Udayamperoor</div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:pl-8">
              <span className="gold-rule" />
              <span className="label-text block mb-4">About Vee Care</span>
              <h2
                className="display-text text-[#0D1117] mb-6"
                style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
              >
                Where Precision
                <br />
                Meets Compassion.
              </h2>
              <p className="text-[#4A5568] leading-relaxed mb-5 text-base">
                Vee Care Dental Clinic was founded in June 2025 by Dr. Vineeth N.H, with one
                simple goal — to bring specialist-level dental care to Udayamperoor and
                Tripunithura, close to home, without patients having to travel into Kochi for it.
              </p>
              <p className="text-[#4A5568] leading-relaxed mb-10 text-base">
                We're a growing clinic built on a full-time doctor plus a bench of visiting
                specialists across implants, orthodontics, oral surgery and prosthodontics —
                so patients get the right doctor for the job, every time.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { heading: "Digital X-Ray",    sub: "Low radiation, instant results" },
                  { heading: "Laser Dentistry",  sub: "Painless, precise treatment" },
                  { heading: "3D Smile Preview", sub: "See results before treatment" },
                  { heading: "ISO Sterilised",   sub: "Hospital-grade hygiene" },
                ].map(item => (
                  <div key={item.heading} className="border-l-2 border-[#C1583B] pl-4">
                    <div className="font-semibold text-[#0D1117] text-sm">{item.heading}</div>
                    <div className="text-[#4A5568] text-xs mt-0.5">{item.sub}</div>
                  </div>
                ))}
              </div>
              <Link href="/doctors" className="btn-primary text-sm">
                Meet Our Doctors <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICES — editorial grid
      ════════════════════════════════════════ */}
      <section className="section-pad bg-[#F2EDE3]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="gold-rule" />
              <span className="label-text block mb-4">Our Services</span>
              <h2 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
                Every Treatment,
                <br />
                <span className="italic text-[#C1583B]">One Clinic.</span>
              </h2>
            </div>
            <Link href="/services" className="btn-outline text-sm self-start md:self-auto">
              View All Services <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </div>

          {/* Services grid — magazine layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200">

            {/* Large featured service */}
            <div className="md:col-span-2 md:row-span-2 relative img-zoom overflow-hidden min-h-[400px] group border-r border-b border-gray-200">
              <Image
                src="/photos/clinic-procedure-1.webp"
                alt="Dental Implants"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="label-text block mb-2">Most Requested</span>
                <h3 className="display-text text-white text-3xl mb-2">Dental Implants</h3>
                <p className="text-white/70 text-sm mb-5 max-w-xs">Permanent, natural-looking tooth replacement. Swiss titanium, lifetime warranty.</p>
                <Link href="/services#implants"
                  className="inline-block bg-white/15 hover:bg-white/25 text-white text-xs px-4 py-2 border border-white/30 transition-all">
                  Learn More →
                </Link>
              </div>
            </div>

            {[
              { img:"https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80", title:"Teeth Whitening",   sub:"8 shades brighter, one session" },
              {
                img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=900&q=85&fit=crop",
                title: "Braces & Aligners",
                sub: "Metal, ceramic, or invisible",
              },
              { img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80", title:"Root Canal",       sub:"Single-visit, painless RCT" },
              { img:"https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=600&q=80", title:"Kids Dentistry",     sub:"Gentle, stress-free care" },
            ].map((svc, i) => (
              <Link key={svc.title} href="/services"
                className={`relative img-zoom overflow-hidden min-h-[200px] group border-b border-gray-200 ${i % 2 === 0 ? "" : "border-l border-gray-200"} block`}>
                <Image src={svc.img} alt={svc.title} fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/75 via-[#0D1117]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="display-text text-white text-xl mb-0.5">{svc.title}</h3>
                  <p className="text-white/60 text-xs">{svc.sub}</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={14} className="text-white" strokeWidth={1.5} />
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SPECIAL SERVICES — highlight strip
      ════════════════════════════════════════ */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="label-text block mb-5 text-center md:text-left">Also Specialising In</span>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {[
              { label: "Single-Visit Root Canal", href: "/services#rct" },
              { label: "Veneers",                 href: "/services#smile" },
              { label: "Smile Design",             href: "/services#smile" },
              { label: "Clear Aligner Treatment",  href: "/services#braces" },
              { label: "Laser Dentistry",          href: "/services" },
              { label: "Kids Dental Treatments",   href: "/services#kids" },
              { label: "Tooth Whitening",          href: "/services#whitening" },
              { label: "Tooth Cleaning",           href: "/services#checkup" },
              { label: "Digital X-Ray",            href: "/services" },
              { label: "Intra-Oral Camera",        href: "/services" },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-medium text-[#4A5568] hover:text-white hover:bg-[#C1583B] border border-gray-200 hover:border-[#C1583B] px-4 py-2 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TEAM PREVIEW
      ════════════════════════════════════════ */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="gold-rule" />
              <span className="label-text block mb-4">Our Specialists</span>
              <h2 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
                Doctors Who
                <br />
                <span className="italic text-[#C1583B]">Listen First.</span>
              </h2>
            </div>
            <Link href="/doctors" className="btn-outline text-sm self-start">
              All Profiles <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOMEPAGE_DOCTORS.map((doc) => (
              <div key={doc.name} className="group">
                {/* Photo */}
                <div className="relative overflow-hidden img-zoom aspect-[3/4] mb-5 bg-[#F2EDE3]">
                  {doc.img ? (
                    <Image
                      src={doc.img}
                      alt={doc.name}
                      fill
                      className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0F2E2E]/10">
                      <Stethoscope size={48} className="text-[#0F2E2E]" strokeWidth={1.25} />
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#0D1117]/0 group-hover:bg-[#0D1117]/20 transition-all duration-500" />
                  {/* Book button */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                    <Link
                      href={`/appointment?doctor=${encodeURIComponent(doc.name)}`}
                      className="block w-full bg-[#C1583B] text-white text-sm font-medium py-3 text-center tracking-wide"
                    >
                      Book with {doc.name.split(" ")[1]}
                    </Link>
                  </div>
                </div>
                {/* Info */}
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="display-text text-[#0D1117] text-xl">{doc.name}</h3>
                      <p className="text-[#C1583B] text-xs font-medium tracking-wide mt-0.5">{doc.role}</p>
                    </div>
                  </div>
                  <p className="text-[#4A5568] text-xs mb-3">{doc.edu}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.spec.map(s => (
                      <span key={s} className="text-[10px] tracking-wide border border-[#0D1117]/15 px-2.5 py-1 text-[#4A5568]">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CertificatesSection variant="highlight" />
      <VideoTestimonials />

      {/* ════════════════════════════════════════
          BLOG PREVIEW
      ════════════════════════════════════════ */}
      <HomeBlogSection />

      {/* ════════════════════════════════════════
          FINAL CTA — full bleed
      ════════════════════════════════════════ */}
      <FAQSection />

      <section className="relative overflow-hidden min-h-[500px] flex items-center">
        <div className="absolute inset-0 img-zoom">
          <Image src={TEAM_IMG} alt="Vee Care team" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-[#0D1117]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
          <span className="label-text block mb-6">Book Today</span>
          <h2
            className="display-text text-white mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            Your Best Smile
            <br />
            <span className="italic text-[#C1583B]">Starts Here.</span>
          </h2>
          <p className="text-white/65 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
            Free first consultation. No hidden charges. Same-day appointments available.
            Serving Tripunithura, Ernakulam, and surrounding areas.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/appointment" className="btn-white text-sm">
              Book Free Consultation <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <a
              href="tel:+918075243127"
              className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white px-8 py-4 transition-all text-sm font-medium tracking-wide"
            >
              Call +91 80752 43127
            </a>
          </div>

          {/* Embedded map — swap the query below for the clinic's exact address once confirmed */}
          <div className="mt-14 max-w-3xl mx-auto aspect-video border border-white/10">
            <iframe
              src="https://www.google.com/maps?q=Vee+Care+Dental+Clinic+Tripunithura&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              style={{ border: 0 }}
              title="Vee Care Dental Clinic location map"
            />
          </div>
        </div>
      </section>

    </div>
  );
}