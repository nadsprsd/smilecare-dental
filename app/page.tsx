import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmileCare Dental — Premium Dental Care in Tripunithura, Kerala",
  description: "Award-winning dental clinic in Tripunithura. Implants, cosmetic dentistry, orthodontics. Book your free consultation today.",
};

/* ── Real Unsplash images ── */
const HERO_IMG = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&q=85&fit=crop";
const CLINIC_IMG   = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=85&fit=crop";
const SMILE_IMG    = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&q=85&fit=crop";
const EQUIP_IMG    = "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=900&q=85&fit=crop";
const TEAM_IMG     = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=85&fit=crop";
const PATIENT_IMG  = "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=900&q=85&fit=crop";
const BLOG_1       = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&q=80&fit=crop";
const BLOG_2       = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&q=80&fit=crop";
const BLOG_3       = "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=700&q=80&fit=crop";

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
            alt="SmileCare Dental Clinic"
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
              <span className="italic text-[#C9A96E]">Crafted</span> for
              <br />
              Your Smile.
            </h1>

            <p
              className="text-white/65 mb-10 max-w-lg leading-relaxed"
              style={{ fontSize: "1.1rem", fontFamily: "var(--font-body)" }}
            >
              Combining advanced technology with a human touch — specialist dentists
              delivering world-class care at Tripunithura since 2014.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/appointment" className="btn-white text-sm">
                Book Free Consultation
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
              <a
                href="https://wa.me/919876543210"
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
                { num: "2,000+", label: "Patients Treated" },
                { num: "10+",    label: "Years of Excellence" },
                { num: "4.9★",   label: "Google Rating" },
                { num: "3",      label: "Specialist Doctors" },
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
                <div className="display-text text-4xl font-semibold text-[#C9A96E]">10+</div>
                <div className="text-white/60 text-xs mt-1 tracking-wide">Years Serving<br/>Tripunithura</div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:pl-8">
              <span className="gold-rule" />
              <span className="label-text block mb-4">About SmileCare</span>
              <h2
                className="display-text text-[#0D1117] mb-6"
                style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
              >
                Where Precision
                <br />
                Meets Compassion.
              </h2>
              <p className="text-[#4A5568] leading-relaxed mb-5 text-base">
                SmileCare was founded with one belief — that exceptional dental care should be
                accessible to every family in Kerala. We invested in technology that most clinics
                in Kochi still don't have, and built a team of specialists who genuinely love what they do.
              </p>
              <p className="text-[#4A5568] leading-relaxed mb-10 text-base">
                Over 2,000 patients later, we remain the most trusted dental clinic in Tripunithura —
                not because of advertising, but because patients send their families to us.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { heading: "Digital X-Ray",    sub: "Low radiation, instant results" },
                  { heading: "Laser Dentistry",  sub: "Painless, precise treatment" },
                  { heading: "3D Smile Preview", sub: "See results before treatment" },
                  { heading: "ISO Sterilised",   sub: "Hospital-grade hygiene" },
                ].map(item => (
                  <div key={item.heading} className="border-l-2 border-[#C9A96E] pl-4">
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
      <section className="section-pad bg-[#F4F7FA]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="gold-rule" />
              <span className="label-text block mb-4">Our Services</span>
              <h2 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
                Every Treatment,
                <br />
                <span className="italic text-[#C9A96E]">One Clinic.</span>
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
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&q=85&fit=crop"
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
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A96E] font-semibold text-sm">From ₹18,000</span>
                  <Link href="/services#implants"
                    className="bg-white/15 hover:bg-white/25 text-white text-xs px-4 py-2 border border-white/30 transition-all">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>

            {[
              { img:"https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80", title:"Teeth Whitening",   price:"From ₹3,000",  sub:"8 shades brighter, one session" },
              {
                img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=900&q=85&fit=crop",
                title: "Braces & Aligners",
                price: "From ₹25,000",
                sub: "Metal, ceramic, or invisible",
                },
              { img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80", title:"Root Canal",         price:"From ₹4,000",  sub:"Single-visit, painless RCT" },
              { img:"https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=600&q=80", title:"Kids Dentistry",     price:"From ₹500",    sub:"Gentle, stress-free care" },
            ].map((svc, i) => (
              <Link key={svc.title} href="/services"
                className={`relative img-zoom overflow-hidden min-h-[200px] group border-b border-gray-200 ${i % 2 === 0 ? "" : "border-l border-gray-200"} block`}>
                <Image src={svc.img} alt={svc.title} fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/75 via-[#0D1117]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="display-text text-white text-xl mb-0.5">{svc.title}</h3>
                  <p className="text-white/60 text-xs mb-2">{svc.sub}</p>
                  <span className="text-[#C9A96E] font-semibold text-xs">{svc.price}</span>
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
                <span className="italic text-[#C9A96E]">Listen First.</span>
              </h2>
            </div>
            <Link href="/doctors" className="btn-outline text-sm self-start">
              All Profiles <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Priya Menon",
                role: "Implantologist & Chief Dentist",
                exp:  "12 Years",
                edu:  "MDS Prosthodontics, AIMS Kochi",
                img:  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=85&fit=crop&crop=face",
                spec: ["Implants", "Crowns", "Full Mouth Rehab"],
              },
              {
                name: "Dr. Arjun Nair",
                role: "Orthodontist",
                exp:  "8 Years",
                edu:  "MDS Orthodontics, Govt. Dental College",
                img:  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=85&fit=crop&crop=face",
                spec: ["Braces", "Invisalign", "Cosmetics"],
              },
              {
                name: "Dr. Sreelakshmi R.",
                role: "Pediatric Dentist",
                exp:  "6 Years",
                edu:  "BDS Pedodontics, Amrita School",
                img:  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=85&fit=crop&crop=face",
                spec: ["Kids Dental", "Preventive", "Fillings"],
              },
            ].map((doc, i) => (
              <div key={doc.name} className="group">
                {/* Photo */}
                <div className="relative overflow-hidden img-zoom aspect-[3/4] mb-5 bg-[#F4F7FA]">
                  <Image
                    src={doc.img}
                    alt={doc.name}
                    fill
                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#0D1117]/0 group-hover:bg-[#0D1117]/20 transition-all duration-500" />
                  {/* Book button */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                    <Link
                      href={`/appointment?doctor=${encodeURIComponent(doc.name)}`}
                      className="block w-full bg-[#C9A96E] text-white text-sm font-medium py-3 text-center tracking-wide"
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
                      <p className="text-[#C9A96E] text-xs font-medium tracking-wide mt-0.5">{doc.role}</p>
                    </div>
                    <span className="text-[#0D1117]/40 text-xs border border-[#0D1117]/15 px-2 py-1">{doc.exp}</span>
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

      {/* ════════════════════════════════════════
          TESTIMONIALS — full width dark
      ════════════════════════════════════════ */}
      <section className="section-pad bg-[#0D1117] noise relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-10">
          <Image src={PATIENT_IMG} alt="" fill className="object-cover" sizes="100vw" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="gold-rule mx-auto" />
            <span className="label-text block mb-4">Patient Stories</span>
            <h2 className="display-text text-white" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              Real Results,
              <br />
              <span className="italic text-[#C9A96E]">Real People.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "I was terrified of dental procedures. Dr. Priya made my implant completely painless. Three months later, I can't even tell which is the implant — it's that natural.",
                name: "Ramesh Kumar", city: "Tripunithura", treatment: "Dental Implants",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
              },
              {
                text: "My daughter used to cry just hearing the word 'dentist'. After Dr. Sreelakshmi, she asks when she gets to go back. That transformation is priceless.",
                name: "Anitha Suresh", city: "Ernakulam", treatment: "Pediatric Dentistry",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
              },
              {
                text: "18 months of braces and the result is beyond what I imagined. Dr. Arjun showed me exactly what to expect before we started. Completely transparent, completely worth it.",
                name: "Mohammed Fasal", city: "Maradu", treatment: "Orthodontics",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
              },
            ].map(t => (
              <div key={t.name} className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C9A96E">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-6 text-sm italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={t.img} alt={t.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.city} · {t.treatment}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rating row */}
          <div className="mt-14 pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-12 text-center">
            <div>
              <div className="display-text text-5xl text-white font-semibold">4.9</div>
              <div className="flex gap-1 justify-center mt-2">
                {[1,2,3,4,5].map(i => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A96E"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <div className="text-white/40 text-xs mt-1">180+ Google Reviews</div>
            </div>
            <div className="w-px h-12 bg-white/15 hidden md:block" />
            <div>
              <div className="display-text text-5xl text-white font-semibold">2,000+</div>
              <div className="text-white/40 text-xs mt-2">Patients Treated</div>
            </div>
            <div className="w-px h-12 bg-white/15 hidden md:block" />
            <div>
              <div className="display-text text-5xl text-white font-semibold">10+</div>
              <div className="text-white/40 text-xs mt-2">Years of Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BLOG PREVIEW
      ════════════════════════════════════════ */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="gold-rule" />
              <span className="label-text block mb-4">Dental Insights</span>
              <h2 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
                Knowledge From
                <br />
                <span className="italic text-[#C9A96E]">Our Experts.</span>
              </h2>
            </div>
            <Link href="/blog" className="btn-outline text-sm self-start">
              All Articles <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: BLOG_1, date: "Apr 1, 2025", category: "Oral Health", title: "10 Habits Your Dentist Wishes You Had", read: "3 min" },
              { img: BLOG_2, date: "Mar 15, 2025", category: "Cosmetic", title: "Implants vs Dentures: The Complete Guide", read: "5 min" },
              { img: BLOG_3, date: "Feb 20, 2025", category: "Whitening", title: "What Actually Works for Teeth Whitening", read: "4 min" },
            ].map(post => (
              <Link key={post.title} href="/blog" className="group block">
                <div className="relative overflow-hidden img-zoom aspect-video mb-5 bg-[#F4F7FA]">
                  <Image src={post.img} alt={post.title} fill className="object-cover" sizes="33vw" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0D1117] text-white text-[10px] font-medium px-3 py-1 tracking-wider uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="text-[#4A5568] text-xs mb-2">{post.date} · {post.read} read</div>
                <h3
                  className="display-text text-[#0D1117] text-xl leading-snug group-hover:text-[#C9A96E] transition-colors mb-3"
                >
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-[#0D1117] text-xs font-medium group-hover:gap-3 transition-all">
                  Read Article <ArrowRight size={13} strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA — full bleed
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[500px] flex items-center">
        <div className="absolute inset-0 img-zoom">
          <Image src={TEAM_IMG} alt="SmileCare team" fill className="object-cover" sizes="100vw" />
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
            <span className="italic text-[#C9A96E]">Starts Here.</span>
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
              href="tel:+919876543210"
              className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white px-8 py-4 transition-all text-sm font-medium tracking-wide"
            >
              Call +91 98765 43210
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

