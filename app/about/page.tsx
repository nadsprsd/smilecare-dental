import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Heart, Shield, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SmileCare Dental Clinic – Tripunithura, Kerala",
  description:
    "Learn about SmileCare Dental Clinic in Tripunithura. Founded in 2014, we are Ernakulam's most trusted dental clinic with 2,000+ happy patients.",
};

const MILESTONES = [
  { year: "2014", title: "Founded",         desc: "SmileCare opened its doors in Tripunithura with one doctor and a vision for accessible, premium dental care." },
  { year: "2016", title: "First 500 Patients", desc: "Within two years we had treated over 500 patients, earning a reputation for pain-free, transparent treatment." },
  { year: "2019", title: "Expanded Team",   desc: "Added Dr. Arjun Nair (orthodontist) and Dr. Sreelakshmi (pediatric dentist) to serve every family member." },
  { year: "2021", title: "Digital X-Ray",   desc: "Invested in digital X-ray technology — 90% less radiation, instant results, better diagnosis." },
  { year: "2023", title: "2,000 Patients",  desc: "Crossed 2,000 patients treated — a milestone built entirely on referrals and word of mouth." },
  { year: "2024", title: "4.9 Star Rating", desc: "Achieved 4.9 stars on Google with 180+ reviews — the highest-rated dental clinic in Tripunithura." },
];

const VALUES = [
  {
    icon: Heart,
    title:  "Patient First",
    desc:   "Every decision we make starts with one question: what is best for the patient? Not what is most convenient, not what is most profitable — what is best for you.",
  },
  {
    icon: Shield,
    title:  "Zero Compromise",
    desc:   "We use hospital-grade sterilisation, imported materials, and proven techniques. We would rather tell you a treatment isn't needed than recommend something unnecessary.",
  },
  {
    icon: Users,
    title:  "Specialist Care",
    desc:   "Every treatment is performed by a specialist trained specifically for that procedure — not a general dentist doing everything. Your implant is done by an implantologist.",
  },
  {
    icon: Award,
    title:  "Transparency",
    desc:   "You receive a complete cost breakdown before treatment begins. No surprise charges. No hidden fees. The price we quote is the price you pay.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-[#0D1117]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80"
            alt="SmileCare Dental Clinic"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 w-full">
          <span className="text-[#C9A96E] text-[10px] font-bold tracking-widest uppercase block mb-4">
            Our Story
          </span>
          <h1
            className="text-white font-bold leading-tight mb-5"
            style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            A Decade of Smiles
            <br />
            <span className="italic text-[#C9A96E]">in Tripunithura.</span>
          </h1>
          <p className="text-white/60 max-w-xl text-base leading-relaxed">
            Founded in 2014 with a simple belief — that every family in Kerala
            deserves access to world-class dental care without travelling to the city.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#0D1117] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "2,000+", label: "Patients Treated"    },
              { num: "10+",    label: "Years of Excellence" },
              { num: "4.9★",   label: "Google Rating"       },
              { num: "3",      label: "Specialist Doctors"  },
            ].map(s => (
              <div key={s.label}>
                <div className="text-white font-bold text-3xl md:text-4xl" style={{ fontFamily: "Georgia, serif" }}>
                  {s.num}
                </div>
                <div className="text-white/40 text-xs mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E] block mb-3">
              Who We Are
            </span>
            <div className="w-10 h-0.5 bg-[#C9A96E] mb-5" />
            <h2
              className="text-[#0D1117] font-bold mb-6 leading-tight"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              More Than a Clinic.
              <br />
              <span className="italic text-[#C9A96E]">A Family Commitment.</span>
            </h2>
            <p className="text-[#4A5568] leading-relaxed mb-5">
              SmileCare was born from a frustration. Our founder, Dr. Priya Menon,
              watched families in Tripunithura travel 45 minutes to Kochi for basic
              dental procedures — not because better care wasn't possible locally,
              but because no one had invested in bringing it here.
            </p>
            <p className="text-[#4A5568] leading-relaxed mb-5">
              In 2014, she changed that. SmileCare opened with imported equipment,
              a team trained at the best institutes in Kerala, and one uncompromising
              rule: the same standard of care for every patient, regardless of budget.
            </p>
            <p className="text-[#4A5568] leading-relaxed mb-8">
              Ten years later, we have treated over 2,000 patients — nearly all of
              them referred by someone who had been treated here before. That is the
              only metric we care about.
            </p>
            <Link href="/doctors" className="inline-flex items-center gap-2 bg-[#0D1117] hover:bg-[#C9A96E] text-white font-semibold px-6 py-3.5 transition-all duration-300 text-sm">
              Meet Our Doctors <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=85&fit=crop&crop=face,top"
                  alt="Dr. Priya Menon"
                  fill
                  className="object-cover object-top"
                  sizes="300px"
                />
              </div>
              <div className="space-y-3 mt-8">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=85&fit=crop"
                    alt="SmileCare Clinic"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=85&fit=crop"
                    alt="Dental Equipment"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 bg-[#C9A96E] text-white p-5 shadow-xl">
              <div className="text-3xl font-bold" style={{ fontFamily: "Georgia, serif" }}>10+</div>
              <div className="text-xs opacity-80 mt-0.5">Years Serving<br />Tripunithura</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-[#F4F7FA] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E] block mb-3">
              What We Stand For
            </span>
            <div className="w-10 h-0.5 bg-[#C9A96E] mx-auto mb-5" />
            <h2
              className="text-[#0D1117] font-bold"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Our Values
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-[#C9A96E]/10 flex items-center justify-center mb-5">
                  <v.icon size={20} className="text-[#C9A96E]" />
                </div>
                <h3 className="font-bold text-[#0D1117] mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  {v.title}
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E] block mb-3">
              Our Journey
            </span>
            <div className="w-10 h-0.5 bg-[#C9A96E] mx-auto mb-5" />
            <h2
              className="text-[#0D1117] font-bold"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              A Decade of Growth
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[60px] md:left-1/2 top-0 bottom-0 w-px bg-gray-100" />

            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-start`}
                >
                  {/* Year bubble */}
                  <div className="relative z-10 flex-shrink-0 w-[60px] md:w-auto md:flex-1 flex md:justify-end">
                    <div className={`${i % 2 === 0 ? "md:mr-8" : "md:ml-8 md:mr-0"}`}>
                      <div className="w-16 h-16 bg-[#0D1117] flex items-center justify-center shrink-0">
                        <span className="text-[#C9A96E] font-bold text-sm">{m.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-2 ${i % 2 !== 0 ? "md:text-right" : ""}`}>
                    <h3 className="font-bold text-[#0D1117] mb-1" style={{ fontFamily: "Georgia, serif" }}>
                      {m.title}
                    </h3>
                    <p className="text-[#4A5568] text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="py-16 bg-[#F4F7FA] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🏥", title: "ISO Sterilised",      desc: "Hospital-grade sterilisation on every instrument, every session." },
              { icon: "📡", title: "Digital X-Ray",        desc: "90% less radiation than conventional X-ray. Results in seconds." },
              { icon: "👁",  title: "3D Smile Preview",    desc: "See your expected result before treatment begins." },
              { icon: "💳", title: "0% EMI Available",     desc: "Split your treatment cost over 3–12 months with zero interest." },
              { icon: "🚨", title: "Same-Day Emergency",   desc: "Toothache? Call us — we accommodate same-day emergency cases." },
              { icon: "🌍", title: "Multilingual Team",    desc: "We speak Malayalam, English, Hindi and Tamil fluently." },
            ].map(f => (
              <div key={f.title} className="bg-white p-6 flex items-start gap-4 shadow-sm">
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <h4 className="font-bold text-[#0D1117] text-sm mb-1">{f.title}</h4>
                  <p className="text-[#4A5568] text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0D1117] py-20 text-center px-6">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E] block mb-4">
          Experience the Difference
        </span>
        <h2
          className="text-white font-bold mb-5"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          Come See Us in Tripunithura.
          <br />
          <span className="italic text-[#C9A96E]">First visit is free.</span>
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto text-base leading-relaxed">
          Book a free consultation. No pressure, no obligation — just honest advice
          from a specialist who wants to help.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/appointment"
            className="inline-flex items-center gap-2 bg-white text-[#0D1117] hover:bg-[#C9A96E] hover:text-white font-semibold px-8 py-4 transition-all duration-300 text-sm">
            Book Free Consultation <ArrowRight size={16} />
          </Link>
          <Link href="/doctors"
            className="inline-flex items-center gap-2 border border-white/20 text-white hover:border-white px-8 py-4 transition-all text-sm font-medium">
            Meet Our Doctors
          </Link>
        </div>
      </section>

    </div>
  );
}

