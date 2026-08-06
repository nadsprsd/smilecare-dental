import Link from "next/link";
import { ArrowRight, GraduationCap, Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import { DOCTORS } from "@/lib/doctors";

export const metadata: Metadata = {
  title: "Our Doctors – Vee Care Dental Clinic Tripunithura",
  description:
    "Meet the dental team at Vee Care Dental Clinic, Tripunithura — a full-time chief dentist and visiting specialists across implants, orthodontics, oral surgery, and prosthodontics.",
};

export default function DoctorsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="text-center mb-16">
          <span className="gold-rule mx-auto" />
          <span className="label-text block mb-4">Our Team</span>
          <h1 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
            Doctors Who
            <br />
            <span className="italic text-[#C1583B]">Listen First.</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {DOCTORS.map(doc => (
            <div key={doc.id} className="bg-white border border-[#E7EAF0] p-6 flex gap-5">
              <div className="w-16 h-16 shrink-0 rounded-full bg-[#0F2E2E]/10 flex items-center justify-center">
                <Stethoscope size={26} className="text-[#0F2E2E]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-[#0D1117]">{doc.name}</h2>
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 ${doc.type === "full-time" ? "bg-[#0F2E2E]/10 text-[#0F2E2E]" : "bg-[#C1583B]/10 text-[#C1583B]"}`}>
                    {doc.type === "full-time" ? "Full-Time" : "On-Call Specialist"}
                  </span>
                </div>
                <div className="text-sm text-[#C1583B] font-medium mt-1">{doc.specialty}</div>
                <div className="flex items-center gap-1.5 text-xs text-[#4A5568] mt-2">
                  <GraduationCap size={13} /> {doc.degree}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {doc.services.map(s => (
                    <span key={s} className="text-[10px] text-[#4A5568] border border-[#E7EAF0] px-2 py-1">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/appointment" className="btn-primary text-sm inline-flex">
            Book Free Consultation <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
