"use client";

const FAQS = [
  {
    q: "What is the cost of a root canal in Tripunithura?",
    a: "Root canal treatment cost depends on the tooth and case complexity. Book a free consultation at Vee Care Dental Clinic for an exact quote — no hidden charges.",
  },
  {
    q: "Do you offer clear aligners in Tripunithura?",
    a: "Yes, we offer clear aligner treatment as an alternative to traditional braces, suitable for most teens and adults. Our team will assess your case during a consultation.",
  },
  {
    q: "How much do dental implants cost in Ernakulam?",
    a: "Implant cost depends on the number of teeth and the implant system used. We offer a free consultation and transparent, itemised pricing before any treatment begins.",
  },
  {
    q: "Is Vee Care Dental Clinic open on weekends?",
    a: "Please call or WhatsApp us directly to confirm current weekend and holiday hours, as timings may vary.",
  },
  {
    q: "Do you treat children at Vee Care Dental Clinic?",
    a: "Yes, we offer dedicated pediatric dental care in a friendly, low-anxiety environment for children of all ages.",
  },
];

export default function FAQSection() {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="gold-rule mx-auto" />
          <span className="label-text block mb-4">Common Questions</span>
          <h2 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
            Frequently Asked
            <br />
            <span className="italic text-[#C1583B]">Questions.</span>
          </h2>
        </div>

        <div className="divide-y divide-[#E7EAF0]">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-[#0D1117] text-base">
                {faq.q}
                <span className="text-[#C1583B] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#4A5568] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
