import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Clock, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Doctors – SmileCare Dental Clinic Tripunithura",
  description:
    "Meet our specialist dental team in Tripunithura. Implantologist, orthodontist and pediatric dentist with combined 26 years of experience.",
};

const DOCTORS = [
  {
    name: "Dr. Priya Menon",
    role: "Chief Dentist & Implantologist",
    exp: "12 Years",
    rating: "4.9",
    reviews: "120+",
    milestone: "800+ implants completed",
    available: "Mon, Wed, Fri & Sat",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=90&fit=crop&crop=face,top",
    education: [
      {
        degree: "BDS",
        institute: "Government Dental College, Trivandrum",
        year: "2007",
      },
      {
        degree: "MDS – Prosthodontics & Crown Bridge",
        institute: "AIMS, Kochi",
        year: "2012",
      },
      {
        degree: "Fellowship in Implantology",
        institute: "ICOI (International Congress of Oral Implantologists)",
        year: "2015",
      },
    ],
    specialties: [
      "Dental Implants (Single & Full Arch)",
      "Crowns & Bridges",
      "Full Mouth Rehabilitation",
      "Smile Design & Veneers",
      "Fixed & Removable Prosthodontics",
    ],
    about:
      "Dr. Priya Menon is the founder of SmileCare and the driving force behind its reputation as Tripunithura's most trusted dental clinic. After completing her postgraduate training in prosthodontics at AIMS Kochi, she pursued advanced implantology training at institutes in Mumbai and Chennai before establishing SmileCare in 2014.",
    aboutExtended:
      "Over the past 12 years, she has completed more than 800 successful implant procedures — a milestone that places her among the most experienced implantologists in Ernakulam district. Her approach combines surgical precision with an exceptional ability to put anxious patients completely at ease. Patients who arrived terrified of needles regularly describe their experience with Dr. Priya as 'nothing like what I expected — completely painless.'",
    philosophy:
      "I believe every patient deserves to understand their treatment completely before we begin. No surprises, no pressure — just honest guidance and the best possible care.",
    languages: ["Malayalam", "English", "Hindi", "Tamil"],
    achievements: [
      "Best Dentist — Ernakulam Dental Association Awards 2022",
      "800+ successful implant procedures",
      "Featured speaker at Kerala Dental Conference 2021",
      "Trained 12 junior dentists in implant techniques",
    ],
  },
  {
    name: "Dr. Arjun Nair",
    role: "Orthodontist & Cosmetic Dentist",
    exp: "8 Years",
    rating: "4.8",
    reviews: "85+",
    milestone: "400+ orthodontic cases",
    available: "Tue, Thu, Sat & Sun",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=90&fit=crop&crop=face,top",
    education: [
      {
        degree: "BDS",
        institute: "Amrita School of Dentistry, Kochi",
        year: "2011",
      },
      {
        degree: "MDS – Orthodontics & Dentofacial Orthopedics",
        institute: "Government Dental College, Trivandrum",
        year: "2016",
      },
      {
        degree: "Invisalign Certified Provider",
        institute: "Align Technology",
        year: "2018",
      },
    ],
    specialties: [
      "Metal & Ceramic Braces",
      "Invisalign & Clear Aligners",
      "Jaw Correction & Bite Alignment",
      "Teeth Whitening",
      "Composite Bonding & Cosmetic Work",
    ],
    about:
      "Dr. Arjun Nair is one of the few Invisalign-certified orthodontists in Ernakulam and has built a reputation for two things: exceptional results and complete transparency. Every patient receives a digital 3D simulation of their expected result before treatment begins — so there are no surprises at the end of 18 months.",
    aboutExtended:
      "With over 400 orthodontic cases completed across all age groups — from 8-year-olds with early bite issues to adults in their 50s getting braces for the first time — Dr. Arjun brings both technical skill and genuine patience to every consultation. He is particularly passionate about helping adult patients who were told as teenagers that braces weren't worth it.",
    philosophy:
      "Orthodontics isn't just about straight teeth. It's about giving someone the confidence to smile without thinking about it. That outcome is worth every adjustment appointment.",
    languages: ["Malayalam", "English", "Hindi"],
    achievements: [
      "Invisalign Certified Provider — Ernakulam",
      "Young Achiever Award — Kerala Dental Council 2021",
      "400+ successful orthodontic transformations",
      "Digital smile simulation for every patient since 2019",
    ],
  },
  {
    name: "Dr. Sreelakshmi R.",
    role: "Pediatric & General Dentist",
    exp: "6 Years",
    rating: "5.0",
    reviews: "95+",
    milestone: "Most loved doctor 2023",
    available: "Monday to Saturday",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=90&fit=crop&crop=face,top",
    education: [
      {
        degree: "BDS",
        institute: "Government Dental College, Trivandrum",
        year: "2014",
      },
      {
        degree: "Postgraduate Diploma – Pedodontics",
        institute: "Amrita Institute of Medical Sciences, Kochi",
        year: "2017",
      },
      {
        degree: "Certification – Nitrous Oxide Sedation for Children",
        institute: "Indian Academy of Pediatric Dentistry",
        year: "2019",
      },
    ],
    specialties: [
      "Pediatric Dentistry (6 months – 16 years)",
      "Preventive Care & Fluoride Treatments",
      "Fissure Sealants",
      "Space Maintainers",
      "General Dentistry — Fillings, Extractions, Gum Care",
    ],
    about:
      "Dr. Sreelakshmi has a rare gift — she makes children genuinely comfortable in the dental chair. Her specialised training in pediatric behaviour management, combined with her naturally warm and playful manner, means that children who arrive in tears routinely leave laughing.",
    aboutExtended:
      "Parents across Tripunithura describe the same experience: their child was terrified, Dr. Sreelakshmi turned it into an adventure, and now the child asks when they get to go back to the dentist. This transformation in a child's attitude toward dental care is one of the most valuable things we offer — because a child who is comfortable with dental visits becomes an adult who keeps their teeth healthy for life. Dr. Sreelakshmi also handles general dentistry for adult patients, with particular expertise in preventive care and gum disease treatment.",
    philosophy:
      "The most important thing I do isn't the filling or the fluoride treatment — it's making sure the child leaves feeling proud and brave. That experience is what determines whether they'll take care of their teeth for the rest of their life.",
    languages: ["Malayalam", "English"],
    achievements: [
      "Most Loved Doctor — SmileCare Patient Choice Awards 2023",
      "Child Dental Health Awareness Volunteer — 3 schools",
      "Perfect 5.0 Google rating across all reviews",
      "Nitrous oxide sedation certified for anxiety management",
    ],
  },
];

export default function DoctorsPage() {
  return (
    <div className="bg-white">

      {/* ── Header ── */}
      <div className="relative h-80 overflow-hidden bg-[#0D1117]">
        <Image
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80"
          alt="Our Doctors"
          fill
          className="object-cover opacity-35"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="label-text block mb-4">Our Specialist Team</span>
          <h1
            className="display-text text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            Doctors Who
            <br />
            <span className="italic text-[#C9A96E]">Truly Care.</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-base">
            26 combined years of specialist experience. Three doctors, one shared goal — your best dental health.
          </p>
        </div>
      </div>

      {/* ── Team overview strip ── */}
      <div className="bg-[#F4F7FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
          {[
            { num: "26+", label: "Combined Experience" },
            { num: "3",   label: "Specialists" },
            { num: "800+",label: "Implants Done" },
            { num: "400+",label: "Ortho Cases" },
            { num: "4.9", label: "Average Rating" },
            { num: "300+",label: "Patient Reviews" },
          ].map((s) => (
            <div key={s.label}>
              <div className="display-text text-[#0D1117] text-2xl font-semibold">{s.num}</div>
              <div className="text-[#4A5568] text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Doctor profiles ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-32">
        {DOCTORS.map((doc, idx) => (
          <div
            key={doc.name}
            className={`grid lg:grid-cols-5 gap-12 items-start ${
              idx % 2 === 1 ? "lg:grid-flow-col-dense" : ""
            }`}
          >
            {/* Photo column — 2 of 5 */}
            <div className={`lg:col-span-2 ${idx % 2 === 1 ? "lg:col-start-4" : ""}`}>
              {/* Photo */}
              <div className="relative overflow-hidden aspect-[3/4]">
                <Image
                  src={doc.img}
                  alt={doc.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              {/* Stats card */}
              <div className="bg-[#F4F7FA] border border-gray-100 p-5 mt-0">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="display-text text-[#0D1117] text-2xl">{doc.exp}</div>
                    <div className="text-[#4A5568] text-xs mt-0.5">Experience</div>
                  </div>
                  <div>
                    <div className="display-text text-[#C9A96E] text-2xl">{doc.rating}★</div>
                    <div className="text-[#4A5568] text-xs mt-0.5">{doc.reviews} reviews</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 text-xs text-[#4A5568] flex items-center gap-1.5">
                  <Clock size={12} className="text-[#C9A96E]" />
                  Available: {doc.available}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="inline-block bg-[#0D1117] text-white text-[10px] font-semibold px-3 py-1 tracking-wider uppercase">
                    {doc.milestone}
                  </div>
                </div>
              </div>

              {/* Book button */}
              <Link
                href={`/appointment?doctor=${encodeURIComponent(doc.name)}`}
                className="btn-primary text-sm w-full mt-4 justify-center"
              >
                Book with {doc.name.split(" ")[1]} <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            </div>

            {/* Content column — 3 of 5 */}
            <div className={`lg:col-span-3 ${idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
              <span className="label-text block mb-3">{doc.role}</span>
              <span className="gold-rule" />
              <h2
                className="display-text text-[#0D1117] mb-5"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                {doc.name}
              </h2>

              <p className="text-[#4A5568] leading-relaxed text-[15px] mb-4">{doc.about}</p>
              <p className="text-[#4A5568] leading-relaxed text-[15px] mb-8">{doc.aboutExtended}</p>

              {/* Philosophy quote */}
              <div className="border-l-2 border-[#C9A96E] pl-5 mb-8 py-2">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E] mb-2">
                  Dr. {doc.name.split(" ")[1]}'s Philosophy
                </div>
                <p className="text-[#0D1117] text-base italic leading-relaxed">
                  "{doc.philosophy}"
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                {/* Education */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap size={16} className="text-[#C9A96E]" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#0D1117]">
                      Education
                    </span>
                  </div>
                  <ul className="space-y-4">
                    {doc.education.map((e) => (
                      <li key={e.degree} className="pl-3 border-l border-gray-200">
                        <div className="font-semibold text-[#0D1117] text-sm">{e.degree}</div>
                        <div className="text-[#4A5568] text-xs mt-0.5">{e.institute}</div>
                        <div className="text-[#C9A96E] text-[10px] mt-0.5 font-medium">{e.year}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialties */}
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-4">
                    Specialties
                  </div>
                  <ul className="space-y-2">
                    {doc.specialties.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-[#4A5568]">
                        <span className="w-1 h-1 rounded-full bg-[#C9A96E] shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                      Languages
                    </div>
                    <p className="text-sm text-[#4A5568]">{doc.languages.join(", ")}</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={14} className="text-[#C9A96E]" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#0D1117]">
                    Achievements
                  </span>
                </div>
                <ul className="space-y-2">
                  {doc.achievements.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-[#4A5568]">
                      <span className="text-[#C9A96E] text-xs mt-0.5 shrink-0">★</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Join team ── */}
      <div className="bg-[#F4F7FA] border-t border-gray-100 py-20 text-center px-6">
        <span className="label-text block mb-3">Join Our Team</span>
        <h3
          className="display-text text-[#0D1117] mb-4"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
        >
          Are You a Qualified Dentist?
        </h3>
        <p className="text-[#4A5568] mb-8 max-w-md mx-auto text-base leading-relaxed">
          We're always looking for passionate dental professionals who share our commitment to
          exceptional patient care. SmileCare offers a collaborative, well-equipped environment in Tripunithura.
        </p>
        <a href="mailto:careers@smilecare.in" className="btn-outline text-sm">
          Send Your CV to careers@smilecare.in
        </a>
      </div>
    </div>
  );
}

