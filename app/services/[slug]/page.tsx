import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/services";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return notFound();

  return (
    <div className="pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Link href="/services" className="text-xs text-[#4A5568] hover:text-[#C1583B]">
          ← All Services
        </Link>

        <h1
          className="display-text text-[#0D1117] mt-6 mb-6"
          style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
        >
          {service.title}
        </h1>

        <p className="text-[#4A5568] leading-relaxed text-base mb-10">{service.intro}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {service.benefits.map((b) => (
            <div key={b} className="flex items-start gap-2.5 text-sm text-[#0D1117]">
              <Check size={16} className="text-[#C1583B] mt-0.5 shrink-0" strokeWidth={2.5} />
              {b}
            </div>
          ))}
        </div>

        <Link
          href={`/appointment?service=${encodeURIComponent(service.title)}`}
          className="btn-primary text-sm inline-flex mb-16"
        >
          Book Free Consultation <ArrowRight size={16} strokeWidth={1.5} />
        </Link>

        {service.faqs.length > 0 && (
          <div>
            <h2 className="display-text text-[#0D1117] mb-6" style={{ fontSize: "1.8rem" }}>
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-[#E7EAF0]">
              {service.faqs.map((faq) => (
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
        )}
      </div>
    </div>
  );
}
