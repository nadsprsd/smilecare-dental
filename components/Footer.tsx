import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dental-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🦷</span>
              <div>
                <div className="font-bold text-lg">SmileCare</div>
                <div className="text-xs text-dental-teal">
                  DENTAL CLINIC
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Providing quality dental care to families in Tripunithura &
              Ernakulam since 2014. Your smile is our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-dental-teal">
              Quick Links
            </h4>
            <ul className="space-y-2 text-white/60 text-sm">
              {[
                ["Home", "/"],
                ["Services", "/services"],
                ["Our Doctors", "/doctors"],
                ["Blog", "/blog"],
                ["Book Appointment", "/appointment"],
                ["Privacy Policy", "/privacy"],
                ["Terms & Conditions", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-white transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-dental-teal">
              Services
            </h4>
            <ul className="space-y-2 text-white/60 text-sm">
              {[
                "Teeth Whitening",
                "Dental Implants",
                "Braces & Aligners",
                "Root Canal",
                "Smile Makeover",
                "Kids Dentistry",
              ].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-dental-teal">
              Contact Us
            </h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li className="flex gap-2">
                <MapPin
                  size={16}
                  className="shrink-0 mt-0.5 text-dental-teal"
                />
                MG Road, Tripunithura, Ernakulam, Kerala 682301
              </li>

              <li className="flex gap-2 hover:text-white">
                <Phone
                  size={16}
                  className="shrink-0 text-dental-teal"
                />
                <a href="tel:+919876543210">
                  +91 98765 43210
                </a>
              </li>

              <li className="flex gap-2 hover:text-white">
                <Mail
                  size={16}
                  className="shrink-0 text-dental-teal"
                />
                <a href="mailto:info@smilecare.in">
                  info@smilecare.in
                </a>
              </li>

              <li className="flex gap-2">
                <Clock
                  size={16}
                  className="shrink-0 text-dental-teal"
                />
                Mon–Sat: 9am–7pm
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6 text-center text-white/40 text-sm">
        <p>
          © {new Date().getFullYear()} SmileCare Dental Clinic,
          Tripunithura. All rights reserved.
        </p>

        <p className="mt-2">
          Developed by{" "}
          <a
            href="https://bizgrowonline.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dental-teal hover:underline"
          >
            BizGrowOnline
          </a>
        </p>
      </div>
    </footer>
  );
}