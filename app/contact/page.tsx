"use client";

import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSend = () => {
    if (!form.name || !form.phone || !form.message) {
      alert("Please fill your name, phone and message.");
      return;
    }

    const msg =
      "Hello SmileCare,\n\n" +
      "Name: " + form.name + "\n" +
      "Phone: " + form.phone + "\n" +
      "Subject: " + (form.subject || "General Enquiry") + "\n\n" +
      "Message:\n" + form.message + "\n\n" +
      "-- Sent via SmileCare website contact form";

    window.open(
      `https://wa.me/917994072017?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      {/* Header */}
      <div className="bg-[#0D1117] text-white py-16 text-center px-6">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E] block mb-3">
          Get In Touch
        </span>
        <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Contact Us
        </h1>
        <p className="text-white/60">
          We are here to help. Reach out any time.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Left — Info + Map ── */}
          <div className="space-y-8">

            {/* Contact info cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: MapPin,
                  title: "Address",
                  info: "MG Road, Tripunithura\nErnakulam, Kerala 682301",
                  href: "https://maps.google.com/?q=Tripunithura+Kerala",
                  color: "text-[#C9A96E]",
                  bg:    "bg-[#C9A96E]/10",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  info: "+91 7994072017",
                  href: "tel:+917994072017",
                  color: "text-[#00A3E0]",
                  bg:    "bg-[#00A3E0]/10",
                },
                {
                  icon: Mail,
                  title: "Email",
                  info: "info@smilecare.in",
                  href: "mailto:info@smilecare.in",
                  color: "text-green-500",
                  bg:    "bg-green-50",
                },
                {
                  icon: Clock,
                  title: "Clinic Hours",
                  info: "Mon–Sat: 9AM–7PM\nSunday: Closed",
                  href: null,
                  color: "text-purple-500",
                  bg:    "bg-purple-50",
                },
              ].map(({ icon: Icon, title, info, href, color, bg }) => (
                <div key={title} className="bg-white p-5 shadow-sm">
                  <div className={`w-10 h-10 ${bg} flex items-center justify-center mb-3`}>
                    <Icon size={18} className={color} />
                  </div>
                  <p className="font-bold text-[#0D1117] text-sm mb-1">{title}</p>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`text-sm ${color} hover:underline whitespace-pre-line`}>
                      {info}
                    </a>
                  ) : (
                    <p className="text-sm text-[#4A5568] whitespace-pre-line">{info}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Google Maps embed */}
            <div className="bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-[#0D1117] text-sm flex items-center gap-2">
                  <MapPin size={15} className="text-[#C9A96E]" />
                  Find Us on Map
                </h3>
                <a
                  href="https://maps.google.com/?q=Tripunithura+Ernakulam+Kerala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00A3E0] text-xs hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
              <div className="relative h-72">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.4!2d76.3486!3d9.9474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0872f0c1c4cc45%3A0x4a8a9ad8d0e8c0f!2sTripunithura%2C%20Kerala!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SmileCare Dental Clinic Location"
                  className="absolute inset-0"
                />
              </div>
              <div className="px-5 py-3 bg-[#F4F7FA] text-xs text-[#4A5568] flex items-center gap-2">
                <MapPin size={12} className="text-[#C9A96E]" />
                MG Road, Tripunithura, Ernakulam, Kerala 682301
              </div>
            </div>

            {/* WhatsApp card */}
            <div className="bg-[#0D1117] p-6 flex items-center gap-5">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Fastest response via WhatsApp</p>
                <p className="text-white/50 text-xs mt-0.5">Usually replies within 10 minutes during clinic hours</p>
              </div>
              <a
                href="https://wa.me/917994072017?text=Hi%20SmileCare!%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2.5 transition-colors shrink-0"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* ── Right — Contact Form ── */}
          <div>
            <div className="bg-white shadow-sm p-8">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={36} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D1117] mb-2"
                    style={{ fontFamily: "Georgia, serif" }}>
                    Message Sent!
                  </h3>
                  <p className="text-[#4A5568] text-sm mb-6">
                    Your message has been sent via WhatsApp. We will get back to you shortly.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name:"", phone:"", subject:"", message:"" }); }}
                    className="text-[#00A3E0] text-sm font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="text-2xl font-bold text-[#0D1117]"
                      style={{ fontFamily: "Georgia, serif" }}>
                      Send Us a Message
                    </h2>
                    <p className="text-[#4A5568] text-sm mt-1">
                      Fill the form below and we'll get back to you via WhatsApp.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => set("name", e.target.value)}
                          placeholder="Ramesh Kumar"
                          className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-sm"
                          style={{ fontSize: "16px" }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-widests uppercase text-[#0D1117] mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => set("phone", e.target.value)}
                          placeholder="+91 79940 72017"
                          className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-sm"
                          style={{ fontSize: "16px" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                        Subject
                      </label>
                      <select
                        value={form.subject}
                        onChange={e => set("subject", e.target.value)}
                        className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-sm text-[#4A5568] bg-white"
                        style={{ fontSize: "16px" }}
                      >
                        <option value="">Select a subject</option>
                        <option>Book an Appointment</option>
                        <option>Treatment Enquiry</option>
                        <option>Pricing Information</option>
                        <option>Emergency Dental Care</option>
                        <option>General Question</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                        Message *
                      </label>
                      <textarea
                        value={form.message}
                        onChange={e => set("message", e.target.value)}
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors resize-none text-sm"
                        style={{ fontSize: "16px" }}
                      />
                    </div>

                    <button
                      onClick={handleSend}
                      className="w-full bg-[#0D1117] hover:bg-[#C9A96E] text-white font-semibold py-4 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <Send size={16} />
                      Send Message via WhatsApp
                    </button>

                    <p className="text-center text-[#4A5568] text-xs">
                      Your message will open in WhatsApp · We reply within 10 minutes
                    </p>
                  </div>

                  {/* OR divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-gray-300 text-xs font-medium">OR</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* Book appointment CTA */}
                  <Link
                    href="/appointment"
                    className="block w-full border-2 border-[#0D1117] text-[#0D1117] hover:bg-[#0D1117] hover:text-white font-semibold py-3.5 text-center transition-all text-sm"
                  >
                    Book a Full Appointment Instead →
                  </Link>
                </>
              )}
            </div>

            {/* Emergency note */}
            <div className="mt-4 bg-red-50 border border-red-100 p-4 flex items-start gap-3">
              <span className="text-red-400 text-lg shrink-0">⚠</span>
              <div>
                <p className="font-bold text-red-700 text-sm">Dental Emergency?</p>
                <p className="text-red-500 text-xs mt-0.5">
                  Call us immediately at{" "}
                  <a href="tel:+917994072017" className="font-bold underline">
                    +91 7994072017
                  </a>
                  {" "}— we accommodate same-day emergency appointments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

