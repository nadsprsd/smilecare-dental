"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

const NAV = [
  { href: "/",          label: "Home" },
  { href: "/services",  label: "Services" },
  { href: "/doctors",   label: "Our Doctors" },
  { href: "/blog",      label: "Blog" },
  { href: "/gallery",   label: "Gallery" },
  { href: "/contact",   label: "Contact" },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#0A2540] text-white/70 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span>MG Road, Tripunithura · Mon–Sat 9AM–7PM</span>
          <a href="tel:+917994072017" className="text-[#00C9B1] font-semibold hover:text-white">
            +91 7994072017
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`mx-3 my-2 md:mx-4 md:my-3 rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(10,37,64,0.12)]"
            : "bg-white shadow-[0_4px_16px_rgba(10,37,64,0.08)]"
        }`}
      >
        <div className="px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A3E0] to-[#0A2540] flex items-center justify-center">
              <span className="text-white font-black text-base" style={{ fontFamily: "Georgia,serif" }}>S</span>
            </div>
            <div>
              <div className="font-extrabold text-[#0A2540] text-[15px] leading-tight">SmileCare</div>
              <div className="text-[9px] text-[#00A3E0] font-bold tracking-[0.15em] uppercase">Dental Clinic</div>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-[#00A3E0]/10 text-[#00A3E0]"
                      : "text-gray-600 hover:text-[#00A3E0] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+917994072017" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#00A3E0]">
              <Phone size={14} /> Call
            </a>
            <Link href="/appointment" className="bg-[#00A3E0] hover:bg-[#0087ba] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Book Appointment
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 px-4 pb-4 pt-2">
            
              href="tel:+917994072017"
              className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[#00A3E0] mb-1"
            >
              <Phone size={14} /> +91 7994072017
            </a>
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-[#00A3E0]/10 text-[#00A3E0]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Link
                href="/appointment"
                onClick={() => setOpen(false)}
                className="block w-full bg-[#00A3E0] text-white text-sm font-semibold py-3.5 rounded-xl text-center"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}