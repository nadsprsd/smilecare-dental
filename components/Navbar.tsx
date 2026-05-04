"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  {
    href: "/services",
    label: "Services",
    sub: [
      { href: "/services#whitening", label: "Teeth Whitening" },
      { href: "/services#implants", label: "Dental Implants" },
      { href: "/services#braces", label: "Braces & Aligners" },
      { href: "/services#rct", label: "Root Canal" },
      { href: "/services#kids", label: "Kids Dentistry" },
      { href: "/services#smile", label: "Smile Makeover" },
    ],
  },
  { href: "/doctors", label: "Our Doctors" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0A2540] text-white/75 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span>MG Road, Tripunithura · Mon–Sat 9AM–7PM</span>

          <a
            href="tel:+917994072017"
            className="flex items-center gap-1.5 text-[#00C9B1] font-semibold hover:text-white transition-colors"
          >
            <Phone size={13} />
            +91 7994072017
          </a>
        </div>
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 px-4 py-3 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-6xl bg-white shadow rounded-2xl">
          <div className="px-5 py-3 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="font-bold text-lg">
              SmileCare
            </Link>

            {/* Desktop Links */}
            <ul className="hidden lg:flex items-center gap-4">
              {NAV.map((item) =>
                item.sub ? (
                  <li
                    key={item.label}
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    className="relative"
                  >
                    <button className="flex items-center gap-1">
                      {item.label}
                      <ChevronDown size={14} />
                    </button>

                    {servicesOpen && (
                      <div className="absolute bg-white shadow rounded-lg mt-2">
                        {item.sub.map((s) => (
                          <Link key={s.href} href={s.href} className="block px-4 py-2 hover:bg-gray-100">
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                )
              )}
            </ul>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">

              <a
                href="tel:+917994072017"
                className="flex items-center gap-1 text-sm"
              >
                <Phone size={14} /> Call
              </a>

              <Link
                href="/appointment"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Book
              </Link>
            </div>

            {/* Mobile button */}
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}