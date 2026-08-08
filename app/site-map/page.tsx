import Link from "next/link";
import type { Metadata } from "next";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Sitemap – Vee Care Dental Clinic",
  description: "A complete list of every page on the Vee Care Dental Clinic website.",
};

const MAIN_PAGES = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "All Services" },
  { href: "/doctors", label: "Our Doctors" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/appointment", label: "Book an Appointment" },
];

const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default function SitemapPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">

        <div className="text-center mb-16">
          <span className="gold-rule mx-auto" />
          <span className="label-text block mb-4">Site Directory</span>
          <h1 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
            Sitemap
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#C1583B] mb-4">
              Main Pages
            </h2>
            <ul className="space-y-2.5">
              {MAIN_PAGES.map(p => (
                <li key={p.href}>
                  <Link href={p.href} className="text-sm text-[#0D1117] hover:text-[#C1583B] transition-colors">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#C1583B] mb-4 mt-10">
              Legal
            </h2>
            <ul className="space-y-2.5">
              {LEGAL_PAGES.map(p => (
                <li key={p.href}>
                  <Link href={p.href} className="text-sm text-[#0D1117] hover:text-[#C1583B] transition-colors">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#C1583B] mb-4">
              All Services
            </h2>
            <ul className="space-y-2.5">
              {SERVICES.map(s => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-[#0D1117] hover:text-[#C1583B] transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
