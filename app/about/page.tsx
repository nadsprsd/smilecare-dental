import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Heart, Shield, Users } from "lucide-react";
import type { Metadata } from "next";
import CertificatesSection from "@/components/CertificatesSection";

export const metadata: Metadata = {
  title: "About Vee Care Dental Clinic – Tripunithura, Kerala",
  description:
    "Vee Care Dental Clinic in Tripunithura, Udayamperoor — a full-time doctor plus a team of specialists across orthodontics, oral surgery, prosthodontics and implantology. Book a free consultation.",
};


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
            alt="Vee Care Dental Clinic"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 w-full">
          <span className="text-[#C1583B] text-[10px] font-bold tracking-widest uppercase block mb-4">
            Our Story
          </span>
          <h1
            className="text-white font-bold leading-tight mb-5"
            style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            Dental Care, Done
            <br />
            <span className="italic text-[#C1583B]">Properly.</span>
          </h1>
          <p className="text-white/60 max-w-xl text-base leading-relaxed">
            Built around a simple belief — that every family in Tripunithura and
            Ernakulam deserves access to world-class dental care close to home.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#0D1117] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "8",  label: "Doctors on Our Team"     },
              { num: "6",  label: "Specialities Covered"    },
              { num: "17", label: "Services Offered"        },
              { num: "1",  label: "Clinic, Tripunithura"    },
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
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C1583B] block mb-3">
              Who We Are
            </span>
            <div className="w-10 h-0.5 bg-[#C1583B] mb-5" />
            <h2
              className="text-[#0D1117] font-bold mb-6 leading-tight"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              More Than a Clinic.
              <br />
              <span className="italic text-[#C1583B]">A Family Commitment.</span>
            </h2>
            <p className="text-[#4A5568] leading-relaxed mb-5">
              Vee Care Dental Clinic was built around one belief — that families in
              Tripunithura and Ernakulam deserve dental care that doesn't ask them to
              compromise, whether that's on the quality of treatment, the comfort of
              the visit, or the honesty of what they're told.
            </p>
            <p className="text-[#4A5568] leading-relaxed mb-5">
              Our team combines a full-time doctor always on hand for everyday care
              with a bench of specialists, in orthodontics, oral surgery, prosthodontics,
              and implantology, brought in specifically for the cases that need them.
              It means patients get the right doctor for the job, not just whoever's
              available.
            </p>
            <p className="text-[#4A5568] leading-relaxed mb-8">
              Every treatment plan starts with a real conversation, and every patient
              leaves knowing exactly what was done and why. That's the standard we hold
              ourselves to, visit after visit.
            </p>
            <Link href="/doctors" className="inline-flex items-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white font-semibold px-6 py-3.5 transition-all duration-300 text-sm">
              Meet Our Doctors <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/photos/clinic-team-hero.webp"
                  alt="Vee Care Dental Clinic team at work"
                  fill
                  className="object-cover object-top"
                  sizes="300px"
                />
              </div>
              <div className="space-y-3 mt-8">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src="/photos/clinic-storefront.webp"
                    alt="Vee Care Dental Clinic"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src="/photos/clinic-technology.webp"
                    alt="Dental Equipment"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-[#F2EDE3] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C1583B] block mb-3">
              What We Stand For
            </span>
            <div className="w-10 h-0.5 bg-[#C1583B] mx-auto mb-5" />
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
                <div className="w-11 h-11 bg-[#C1583B]/10 flex items-center justify-center mb-5">
                  <v.icon size={20} className="text-[#C1583B]" />
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

      {/* ── Certificates & Qualifications ── */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <span className="gold-rule mx-auto" />
          <span className="label-text block mb-4">Our Credentials</span>
          <h2 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Certificates &amp; Qualifications
          </h2>
        </div>
        <CertificatesSection variant="full" />
      </section>

      {/* ── Why choose us ── */}
      <section className="py-16 bg-[#F2EDE3] px-6 md:px-12">
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
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#C1583B] block mb-4">
          Experience the Difference
        </span>
        <h2
          className="text-white font-bold mb-5"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          Come See Us in Tripunithura.
          <br />
          <span className="italic text-[#C1583B]">First visit is free.</span>
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto text-base leading-relaxed">
          Book a free consultation. No pressure, no obligation — just honest advice
          from a specialist who wants to help.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/appointment"
            className="inline-flex items-center gap-2 bg-white text-[#0D1117] hover:bg-[#C1583B] hover:text-white font-semibold px-8 py-4 transition-all duration-300 text-sm">
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

