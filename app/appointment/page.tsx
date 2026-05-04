"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User, Phone, Calendar, Clock,
  MessageSquare, CheckCircle, ArrowLeft, ChevronRight
} from "lucide-react";

const SERVICES = [
  { label: "Dental Checkup & Cleaning",  price: "₹300" },
  { label: "Teeth Whitening",            price: "From ₹3,000" },
  { label: "Dental Implants",            price: "From ₹18,000" },
  { label: "Braces / Clear Aligners",    price: "From ₹25,000" },
  { label: "Root Canal Treatment",       price: "From ₹4,000" },
  { label: "Pediatric Dentistry",        price: "From ₹500" },
  { label: "Smile Makeover",             price: "Custom Quote" },
  { label: "Dentures & Bridges",         price: "From ₹8,000" },
  { label: "Other / Not Sure",           price: "Free Consult" },
];

const DOCTORS = [
  { name: "Dr. Priya Menon",    role: "Implantologist",    days: "Mon, Wed, Fri, Sat" },
  { name: "Dr. Arjun Nair",     role: "Orthodontist",      days: "Tue, Thu, Sat, Sun" },
  { name: "Dr. Sreelakshmi R.", role: "Pediatric Dentist", days: "Mon – Sat" },
  { name: "No Preference",      role: "First available",   days: "Any day" },
];

const TIME_SLOTS = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM",
  "2:00 PM","2:30 PM","3:00 PM","3:30 PM",
  "4:00 PM","4:30 PM","5:00 PM","6:00 PM",
];

type Form = {
  name: string; phone: string; service: string;
  doctor: string; date: string; time: string; notes: string;
};

// Inner component that uses useSearchParams
function AppointmentForm() {
  const searchParams = useSearchParams();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [form, setForm]       = useState<Form>({
    name: "", phone: "", service: "", doctor: "", date: "", time: "", notes: "",
  });

  // Pre-fill from URL params — "Book with Dr. Priya" passes ?doctor=Dr.+Priya+Menon
  useEffect(() => {
    const doctor  = searchParams.get("doctor");
    const service = searchParams.get("service");
    setForm(f => ({
      ...f,
      doctor:  doctor  ? decodeURIComponent(doctor)  : "",
      service: service ? decodeURIComponent(service) : "",
    }));
    // If doctor is pre-filled skip to step 2
    if (doctor) setStep(2);
  }, [searchParams]);

  const set = (k: keyof Form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      // Save to MongoDB via your existing API
      const res  = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        alert("Could not save appointment. Check terminal.");
        setLoading(false);
        return;
      }

      // Open WhatsApp with full booking details
      const phone = process.env.NEXT_PUBLIC_CLINIC_WHATSAPP || "917994072017";
     const msg = encodeURIComponent(
  `New Appointment -- SmileCare\n\n` +
  `Patient: ${form.name}\n` +
  `Phone: ${form.phone}\n` +
  `Service: ${form.service}\n` +
  `Doctor: ${form.doctor || "No preference"}\n` +
  `Date: ${new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}\n` +
  `Time: ${form.time}\n` +
  `Notes: ${form.notes || "None"}\n\n` +
  `Booked via SmileCare website`
);
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (done) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center px-6 py-20">
        <div className="bg-white p-12 text-center max-w-md w-full shadow-[0_4px_24px_rgba(10,37,64,0.08)]">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="display-text text-[#0D1117] text-2xl mb-3">
            Appointment Requested!
          </h2>
          <p className="text-[#4A5568] mb-6 leading-relaxed text-sm">
            Your request has been saved and sent to our team via WhatsApp.
            We'll confirm your appointment within <strong>30 minutes</strong> during clinic hours.
          </p>
          <div className="bg-[#F4F7FA] p-5 text-left space-y-2 text-sm mb-6">
            {[
              ["Service", form.service],
              ["Date",    new Date(form.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })],
              ["Time",    form.time],
              ["Doctor",  form.doctor || "No preference"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#4A5568]">{k}</span>
                <span className="font-semibold text-[#0D1117]">{v}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setDone(false); setStep(1); setForm({ name:"",phone:"",service:"",doctor:"",date:"",time:"",notes:"" }); }}
            className="btn-outline text-sm w-full"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  // ── Progress bar ──
  const steps = ["Service", "Date & Time", "Your Details"];

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      {/* Header */}
      <div className="bg-[#0D1117] py-16 text-center px-6">
        <span className="label-text block mb-3">Book an Appointment</span>
        <h1 className="display-text text-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          Your Best Smile
          <br />
          <span className="italic text-[#C9A96E]">Starts with One Step.</span>
        </h1>
        <p className="text-white/60 mt-3 text-sm">
          Free first consultation · Confirmed within 30 mins · No hidden charges
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Step indicators */}
        <div className="flex items-center mb-10">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 flex items-center justify-center font-bold text-sm transition-all ${
                  step > i + 1
                    ? "bg-[#C9A96E] text-white"
                    : step === i + 1
                    ? "bg-[#0D1117] text-white"
                    : "bg-gray-200 text-gray-400"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  step === i + 1 ? "text-[#0D1117]" : "text-gray-400"
                }`}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-px mx-2 mb-4 transition-all ${
                  step > i + 1 ? "bg-[#C9A96E]" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white shadow-[0_4px_24px_rgba(10,37,64,0.08)]">

          {/* ── STEP 1: Choose service ── */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="display-text text-[#0D1117] text-xl mb-6">
                What treatment do you need?
              </h2>
              <div className="space-y-2">
                {SERVICES.map(svc => (
                  <button
                    key={svc.label}
                    onClick={() => { set("service", svc.label); setStep(2); }}
                    className={`w-full flex items-center justify-between p-4 border-2 text-left transition-all hover:border-[#0D1117] ${
                      form.service === svc.label
                        ? "border-[#0D1117] bg-[#0D1117]/3"
                        : "border-gray-100"
                    }`}
                  >
                    <span className="font-medium text-[#0D1117] text-sm">{svc.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#C9A96E] text-xs font-semibold">{svc.price}</span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Date, time, doctor ── */}
          {step === 2 && (
            <div className="p-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-[#C9A96E] text-sm mb-5 hover:underline"
              >
                <ArrowLeft size={14} /> Change service
              </button>

              {/* Selected service */}
              <div className="bg-[#F4F7FA] px-4 py-3 mb-6 border-l-2 border-[#C9A96E]">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E]">Selected Service</div>
                <div className="font-semibold text-[#0D1117] mt-0.5">{form.service}</div>
              </div>

              <h2 className="display-text text-[#0D1117] text-xl mb-6">
                Choose Date & Time
              </h2>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-xs font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  min={minDateStr}
                  onChange={e => set("date", e.target.value)}
                  className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-[#0D1117]"
                />
              </div>

              {/* Time slots */}
              {form.date && (
                <div className="mb-6">
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#0D1117] mb-3">
                    Preferred Time
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        onClick={() => set("time", t)}
                        className={`text-xs py-2.5 border-2 font-medium transition-all ${
                          form.time === t
                            ? "bg-[#0D1117] text-white border-[#0D1117]"
                            : "border-gray-100 text-gray-600 hover:border-[#0D1117]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor preference */}
              <div className="mb-8">
                <label className="block text-xs font-bold tracking-widest uppercase text-[#0D1117] mb-3">
                  Preferred Doctor
                </label>
                <div className="space-y-2">
                  {DOCTORS.map(doc => (
                    <button
                      key={doc.name}
                      onClick={() => set("doctor", doc.name)}
                      className={`w-full flex items-center justify-between p-3.5 border-2 text-left transition-all ${
                        form.doctor === doc.name
                          ? "border-[#0D1117] bg-[#0D1117]/3"
                          : "border-gray-100 hover:border-[#0D1117]"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#0D1117]">{doc.name}</p>
                        <p className="text-xs text-[#4A5568] mt-0.5">{doc.role} · {doc.days}</p>
                      </div>
                      {form.doctor === doc.name && (
                        <CheckCircle size={17} className="text-[#C9A96E] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!form.date || !form.time) { alert("Please select date and time"); return; }
                  setStep(3);
                }}
                className="btn-primary w-full justify-center"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 3: Personal details ── */}
          {step === 3 && (
            <div className="p-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-[#C9A96E] text-sm mb-5 hover:underline"
              >
                <ArrowLeft size={14} /> Change date/time
              </button>

              {/* Summary */}
              <div className="bg-[#F4F7FA] p-4 mb-6 space-y-2 text-sm">
                {[
                  ["Service", form.service],
                  ["Date",    new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })],
                  ["Time",    form.time],
                  ["Doctor",  form.doctor || "No preference"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[#4A5568]">{k}</span>
                    <span className="font-semibold text-[#0D1117]">{v}</span>
                  </div>
                ))}
              </div>

              <h2 className="display-text text-[#0D1117] text-xl mb-6">Your Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="+91 79940 72017"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => set("notes", e.target.value)}
                    rows={3}
                    placeholder="Any specific concerns, pain, or questions?"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full justify-center mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                    </svg>
                    Saving & Sending...
                  </span>
                ) : "Confirm Appointment via WhatsApp"}
              </button>
              <p className="text-center text-[#4A5568] text-xs mt-3">
                Saves to our system · Sends WhatsApp to clinic · Confirmed within 30 mins
              </p>
            </div>
          )}
        </div>

        {/* Trust row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: "🆓", t: "Free Consult", s: "No consultation fee" },
            { icon: "⚡", t: "Quick Confirm", s: "Within 30 minutes" },
            { icon: "🔒", t: "Secure", s: "Data saved safely" },
          ].map(i => (
            <div key={i.t} className="bg-white p-4 text-center shadow-sm">
              <div className="text-xl mb-1">{i.icon}</div>
              <div className="font-bold text-[#0D1117] text-xs">{i.t}</div>
              <div className="text-[#4A5568] text-xs mt-0.5">{i.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams needs it
export default function AppointmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
        <div className="text-[#4A5568]">Loading...</div>
      </div>
    }>
      <AppointmentForm />
    </Suspense>
  );
}

