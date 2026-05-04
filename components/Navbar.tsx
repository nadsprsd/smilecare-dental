"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

const NAV = [
  { href: "/",        label: "Home" },
  {
    href: "/services", label: "Services",
    sub: [
      { href: "/services#whitening", label: "Teeth Whitening" },
      { href: "/services#implants",  label: "Dental Implants" },
      { href: "/services#braces",    label: "Braces & Aligners" },
      { href: "/services#rct",       label: "Root Canal" },
      { href: "/services#kids",      label: "Kids Dentistry" },
      { href: "/services#smile",     label: "Smile Makeover" },
    ],
  },
  { href: "/doctors", label: "Our Doctors" },
  { href: "/blog",    label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Top info bar */}
      <div className="bg-[#0A2540] text-white/75 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span>MG Road, Tripunithura, Ernakulam · Mon–Sat 9AM–7PM</span>
          <a
            href="tel:+917994072017"
            className="flex items-center gap-1.5 text-[#00C9B1] font-semibold hover:text-white transition-colors"
          >
            <Phone size={13} /> +91 7994072017
          </a>
        </div>
      </div>

      {/* Floating navbar */}
      <div className="sticky top-0 z-50 px-3 py-2 md:px-4 md:py-3 flex justify-center pointer-events-none">
        <nav
          className={`pointer-events-auto w-full max-w-6xl transition-all duration-500 ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(10,37,64,0.13)] rounded-2xl border border-white/50"
              : "bg-white shadow-[0_4px_20px_rgba(10,37,64,0.08)] rounded-2xl"
          }`}
        >
          <div className="px-4 py-3 flex items-center justify-between gap-2">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-[#00A3E0] to-[#0A2540] flex items-center justify-center shadow">
                <span className="text-white font-black text-sm" style={{ fontFamily: "Georgia,serif" }}>S</span>
              </div>
              <div className="leading-none">
                <div className="font-extrabold text-[#0A2540] text-[14px] tracking-tight">SmileCare</div>
                <div className="text-[8px] text-[#00A3E0] font-bold tracking-[0.18em] uppercase mt-0.5">Dental Clinic</div>
              </div>
            </Link>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {NAV.map((item) =>
                item.sub ? (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                        pathname.startsWith("/services")
                          ? "bg-[#00A3E0]/10 text-[#00A3E0]"
                          : "text-gray-600 hover:text-[#00A3E0] hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={13} className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-52
                      bg-white rounded-2xl shadow-[0_16px_48px_rgba(10,37,64,0.14)] border border-gray-100 py-2
                      transition-all duration-200 origin-top ${
                        servicesOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                      }`}>
                      {item.sub.map((s) => (
                        <Link key={s.href} href={s.href}
                          className="flex items-center px-4 py-2.5 mx-1 rounded-xl text-sm text-gray-600 hover:text-[#00A3E0] hover:bg-[#00A3E0]/5 transition-colors">
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href}
                      className={`block px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                        pathname === item.href
                          ? "bg-[#00A3E0]/10 text-[#00A3E0]"
                          : "text-gray-600 hover:text-[#00A3E0] hover:bg-gray-50"
                      }`}>
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <a href="tel:+917994072017"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#00A3E0] font-medium transition-colors px-2">
                <Phone size={14} /> Call
              </a>
              <Link href="/appointment"
                className="relative overflow-hidden bg-[#00A3E0] hover:bg-[#0087ba] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow hover:shadow-md transition-all duration-200 group whitespace-nowrap">
                <span className="relative z-10">Book Appointment</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
              </Link>
            </div>

            {/* Mobile toggle — FIXED */}
            <button
              type="button"
              onClick={() => setMobileOpen(prev => !prev)}
              className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors touch-manipulation"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile menu — slides down */}
          <div
            style={{
              maxHeight: mobileOpen ? "600px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
            className="lg:hidden"
          >
            <div className="border-t border-gray-100 px-4 pt-3 pb-4 space-y-1">

              {/* Phone number on mobile */}
              <a
                href="tel:+917994072017"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#00A3E0] bg-[#00A3E0]/5 rounded-xl mb-2"
              >
                <Phone size={14} /> +91 7994072017
              </a>

              {NAV.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href ?? "/services"}
                    className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-[#00A3E0]/10 text-[#00A3E0]"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.sub && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {item.sub.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="block px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-[#00A3E0] hover:bg-gray-50 transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-3 border-t border-gray-100">
                <Link
                  href="/appointment"
                  className="block w-full bg-[#00A3E0] hover:bg-[#0087ba] text-white text-sm font-semibold py-3.5 rounded-xl text-center transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

