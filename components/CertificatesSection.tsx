"use client";

import Image from "next/image";
import { Award, GraduationCap } from "lucide-react";
import { CERTIFICATES } from "@/lib/certificates";

export default function CertificatesSection({
  variant = "highlight",
}: {
  variant?: "highlight" | "full";
}) {
  const items = variant === "highlight" ? CERTIFICATES.slice(0, 3) : CERTIFICATES;

  return (
    <section className={variant === "highlight" ? "section-pad bg-[#F2EDE3]" : "py-12"}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {variant === "highlight" && (
          <div className="text-center mb-16">
            <span className="gold-rule mx-auto" />
            <span className="label-text block mb-4">Qualified & Certified</span>
            <h2
              className="display-text text-[#0D1117]"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
            >
              Credentials You
              <br />
              <span className="italic text-[#C1583B]">Can Trust.</span>
            </h2>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#E7EAF0] p-6 flex gap-4 items-start"
            >
              {c.image ? (
                <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden bg-[#F2EDE3]">
                  <Image src={c.image} alt={c.doctorName} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 shrink-0 rounded-full bg-[#0F2E2E]/10 flex items-center justify-center">
                  <GraduationCap size={28} className="text-[#0F2E2E]" strokeWidth={1.5} />
                </div>
              )}

              <div>
                <div className="font-semibold text-[#0D1117]">{c.doctorName}</div>
                <div className="text-sm text-[#4A5568] mb-2">{c.degree}</div>

                <ul className="space-y-1.5">
                  {c.certifications.map((cert) => (
                    <li key={cert} className="flex items-start gap-1.5 text-xs text-[#4A5568]">
                      <Award size={13} className="text-[#C1583B] mt-0.5 shrink-0" strokeWidth={2} />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
