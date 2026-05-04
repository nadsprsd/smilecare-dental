"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

const NAV = [
  { href: "/",         label: "Home" },
  { href: "/about",   label: "About" },  
  { href: "/services", label: "Services" },
  { href: "/doctors",  label: "Our Doctors" },
  { href: "/blog",     label: "Blog" },
  { href: "/gallery",  label: "Gallery" },
  { href: "/contact",  label: "Contact" },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
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
          <a href="tel:+917994072017" className="text-[#00C9B1] font-semibold hover:text-white transition-colors">
            +91 7994072017
          </a>
        </div>
      </div>

      {/* Nav pill */}
      <div className="px-3 py-2 md:px-4 md:py-3">
        <div className={`rounded-2xl transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg" : "bg-white shadow-md"
        }`}>

          <div className="px-4 py-3 flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A3E0] to-[#0A2540] flex items-center justify-center">
                <span className="text-white font-black text-base" style={{ fontFamily: "Georgia,serif" }}>S</span>
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-[#0A2540] text-sm tracking-tight">SmileCare</div>
                <div className="text-[9px] text-[#00A3E0] font-bold tracking-widest uppercase">Dental Clinic</div>
              </div>
            </Link>

            {/* ── Desktop links (hidden below lg) ── */}
            <ul className="hidden lg:flex items-center gap-1 flex-1 justify-center">
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

            {/* ── Desktop CTA (hidden below lg) ── */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <a href="tel:+917994072017"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#00A3E0] font-medium px-2">
                <Phone size={14} /> Call
              </a>
              <Link href="/appointment"
                className="bg-[#00A3E0] hover:bg-[#0087ba] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
                Book Appointment
              </Link>
            </div>

            {/* ── Mobile right side (hidden above lg) ── */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <Link href="/appointment"
                className="bg-[#00A3E0] text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap">
                Book
              </Link>
              <button
                onClick={() => setOpen(o => !o)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border-0 cursor-pointer"
                aria-label="Toggle menu"
              >
                {open ? <X size={20} color="#374151" /> : <Menu size={20} color="#374151" />}
              </button>
            </div>

          </div>

          {/* ── Mobile menu ── */}
          {open && (
            <div className="lg:hidden border-t border-gray-100 px-4 pb-5 pt-3">
              <a href="tel:+917994072017"
                className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[#00A3E0] border border-[#00A3E0]/20 rounded-xl mb-3">
                <Phone size={15} /> +91 7994072017
              </a>
              {NAV.map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-colors ${
                    pathname === item.href
                      ? "bg-[#00A3E0]/10 text-[#00A3E0]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Link href="/appointment" onClick={() => setOpen(false)}
                  className="block w-full bg-[#00A3E0] text-white text-sm font-bold py-4 rounded-xl text-center">
                  Book Appointment
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

