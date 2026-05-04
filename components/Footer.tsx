import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const SOCIAL = [
  {
    name: "Facebook",
    href: "https://facebook.com/smilecaretripunithura",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/smilecaretripunithura",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@smilecaretripunithura",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "Google Maps",
    href: "https://maps.google.com/?q=SmileCare+Dental+Tripunithura",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C8.102 0 4.967 3.066 4.967 6.878c0 5.159 7.033 17.122 7.033 17.122S19.033 12.037 19.033 6.878C19.033 3.066 15.898 0 12 0zm0 9.878a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0D1117] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand + Social */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#C9A96E] flex items-center justify-center shrink-0">
                <span className="text-[#0D1117] font-black text-base" style={{ fontFamily: "Georgia,serif" }}>S</span>
              </div>
              <div>
                <div className="font-bold text-base leading-tight">SmileCare</div>
                <div className="text-[10px] text-[#00C9B1] font-bold tracking-widest uppercase">Dental Clinic</div>
              </div>
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Providing quality dental care to families in Tripunithura and
              Ernakulam since 2014. Your smile is our priority.
            </p>

            {/* Social icons */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-9 h-9 bg-white/5 hover:bg-[#C9A96E] border border-white/10 hover:border-[#C9A96E] flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 rounded-lg"
                    title={s.name}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-5 text-[#00C9B1] text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-white/55 text-sm">
              {[
                ["Home",              "/"],
                ["Services",          "/services"],
                ["Our Doctors",       "/doctors"],
                ["Gallery",           "/gallery"],
                ["Blog",              "/blog"],
                ["Book Appointment",  "/appointment"],
                ["Contact",           "/contact"],
                ["Privacy Policy",    "/privacy"],
                ["Terms & Conditions","/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-5 text-[#00C9B1] text-sm uppercase tracking-wider">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-white/55 text-sm">
              {[
                ["Teeth Whitening",   "/services#whitening"],
                ["Dental Implants",   "/services#implants"],
                ["Braces & Aligners", "/services#braces"],
                ["Root Canal",        "/services#rct"],
                ["Smile Makeover",    "/services#smile"],
                ["Kids Dentistry",    "/services#kids"],
                ["Dental Checkup",    "/services#checkup"],
                ["Dentures",          "/services#dentures"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-[#00C9B1] text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4 text-white/55 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="shrink-0 mt-0.5 text-[#C9A96E]" />
                <span>MG Road, Tripunithura,<br />Ernakulam, Kerala 682301</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="shrink-0 text-[#C9A96E]" />
                <a href="tel:+917994072017" className="hover:text-white transition-colors">
                  +91 7994072017
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="shrink-0 text-[#C9A96E]" />
                <a href="mailto:info@smilecare.in" className="hover:text-white transition-colors">
                  info@smilecare.in
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="shrink-0 text-[#C9A96E]" />
                <span>Mon–Sat: 9AM–7PM<br /><span className="text-white/30">Sunday: Closed</span></span>
              </li>
            </ul>

            {/* Book CTA */}
            <Link
              href="/appointment"
              className="inline-block mt-6 bg-[#C9A96E] hover:bg-[#b8935a] text-white text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              Book Appointment →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} SmileCare Dental Clinic, Tripunithura. All rights reserved.</p>
          <p>
            Designed & Developed by{" "}
            <a
              href="https://bizgrowonline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A96E] hover:text-white transition-colors"
            >
              BizGrowOnline
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

