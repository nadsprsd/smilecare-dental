import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact SmileCare Dental Clinic – Tripunithura",
  description:
    "Get in touch with SmileCare Dental Clinic. Visit us at MG Road, Tripunithura or call +91 98765 43210.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dental-light">
      <div className="bg-dental-dark text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-white/70">
          We're here to help. Reach out any time.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-dental-dark">
            Visit Our Clinic
          </h2>
          {[
            {
              icon: MapPin,
              title: "Address",
              info: "MG Road, Tripunithura, Ernakulam, Kerala 682301",
            },
            {
              icon: Phone,
              title: "Phone",
              info: "+91 98765 43210",
              href: "tel:+919876543210",
            },
            {
              icon: Mail,
              title: "Email",
              info: "info@smilecare.in",
              href: "mailto:info@smilecare.in",
            },
            {
              icon: Clock,
              title: "Hours",
              info: "Mon–Sat: 9am–7pm | Sun: 10am–2pm",
            },
          ].map(({ icon: Icon, title, info, href }) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="bg-primary-100 p-3 rounded-xl shrink-0">
                <Icon size={20} className="text-primary-500" />
              </div>
              <div>
                <p className="font-semibold text-dental-dark">{title}</p>
                {href ? (
                  <a href={href} className="text-gray-500 hover:text-primary-500">
                    {info}
                  </a>
                ) : (
                  <p className="text-gray-500">{info}</p>
                )}
              </div>
            </div>
          ))}

          {/* Google Maps placeholder */}
          <div className="rounded-2xl overflow-hidden h-64 bg-gray-200 flex items-center justify-center mt-6">
            <div className="text-center text-gray-500">
              <MapPin size={40} className="mx-auto mb-2 text-primary-500" />
              <p className="font-medium">Paste Google Maps iframe here</p>
              
              <a
                href="https://maps.google.com/?q=Tripunithura+Kerala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 underline text-sm"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Quick WhatsApp contact */}
        <div className="bg-white rounded-3xl shadow-md p-8 flex flex-col justify-center text-center">
          <div className="text-6xl mb-6">💬</div>
          <h3 className="text-2xl font-bold text-dental-dark mb-3">
            Chat on WhatsApp
          </h3>
          <p className="text-gray-500 mb-8">
            The fastest way to reach us. Ask questions, get directions, or
            book an appointment instantly.
          </p>
          
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi SmileCare! I'd like to know more about your services.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full transition text-lg"
          >
            💬 Open WhatsApp Chat
          </a>
          <p className="mt-4 text-gray-400 text-sm">
            Usually replies within 10 minutes during clinic hours
          </p>
        </div>
      </div>
    </div>
  );
}