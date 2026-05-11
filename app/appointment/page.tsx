"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ChevronRight, Shield } from "lucide-react";

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
  name:    string;
  phone:   string;
  service: string;
  doctor:  string;
  date:    string;
  time:    string;
  notes:   string;
  consent: boolean;
};

function AppointmentForm() {
  const searchParams = useSearchParams();
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [form,    setForm]    = useState<Form>({
    name:    "",
    phone:   "",
    service: "",
    doctor:  "",
    date:    "",
    time:    "",
    notes:   "",
    consent: false,
  });

  // Pre-fill from URL params — ?doctor=Dr.+Priya+Menon or ?service=Teeth+Whitening
  useEffect(() => {
    const doctor  = searchParams.get("doctor");
    const service = searchParams.get("service");
    setForm(f => ({
      ...f,
      doctor:  doctor  ? decodeURIComponent(doctor)  : "",
      service: service ? decodeURIComponent(service) : "",
    }));
    if (doctor) setStep(2);
  }, [searchParams]);

  const set = (k: keyof Form, v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v }));

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      alert("Please fill all required fields.");
      return;
    }
    if (!form.consent) {
      alert("Please accept the consent to proceed.");
      return;
    }

    // Basic phone validation
    const phoneClean = form.phone.replace(/\D/g, "");
    if (phoneClean.length !== 10 || !/^[6-9]/.test(phoneClean)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/appointments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:    form.name.trim(),
          phone:   phoneClean,
          service: form.service,
          doctor:  form.doctor || "No Preference",
          date:    form.date,
          time:    form.time,
          notes:   form.notes.trim(),
          consent: true,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        alert("Too many requests. Please wait a minute and try again.");
        setLoading(false);
        return;
      }

      if (!data.success) {
        alert("Could not save appointment. Please try again.");
        setLoading(false);
        return;
      }

      // WhatsApp notification to clinic — plain text, no emojis
      const phone = process.env.NEXT_PUBLIC_CLINIC_WHATSAPP || "917994072017";
      const message =
        "New Appointment - SmileCare\n\n" +
        "Patient: " + form.name + "\n" +
        "Phone: " + phoneClean + "\n" +
        "Service: " + form.service + "\n" +
        "Doctor: " + (form.doctor || "No preference") + "\n" +
        "Date: " + new Date(form.date).toLocaleDateString("en-IN", {
          weekday: "long", day: "numeric", month: "long",
        }) + "\n" +
        "Time: " + form.time + "\n" +
        "Notes: " + (form.notes || "None") + "\n\n" +
        "Booked via SmileCare website";

      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

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
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center px-4 py-20">
        <div className="bg-white p-8 md:p-12 text-center max-w-md w-full shadow-[0_4px_24px_rgba(10,37,64,0.08)]">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2
            className="text-[#0D1117] text-2xl font-bold mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Appointment Requested!
          </h2>
          <p className="text-[#4A5568] mb-6 leading-relaxed text-sm">
            Your request has been saved and sent to our team via WhatsApp.
            We will confirm within <strong>30 minutes</strong> during clinic hours.
          </p>

          {/* Booking summary */}
          <div className="bg-[#F4F7FA] p-4 text-left space-y-2 text-sm mb-6">
            {[
              ["Service", form.service],
              ["Date",    new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
              ["Time",    form.time],
              ["Doctor",  form.doctor || "No preference"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-[#4A5568]">{k}</span>
                <span className="font-semibold text-[#0D1117] text-right">{v}</span>
              </div>
            ))}
          </div>

          {/* Privacy note */}
          <div className="flex items-center justify-center gap-1.5 text-[#4A5568] text-xs mb-6">
            <Shield size={12} className="text-green-500" />
            Your data is stored securely and protected
          </div>

          <button
            onClick={() => {
              setDone(false);
              setStep(1);
              setForm({
                name: "", phone: "", service: "", doctor: "",
                date: "", time: "", notes: "", consent: false,
              });
            }}
            className="w-full border-2 border-[#0D1117] text-[#0D1117] font-semibold py-3 transition-colors hover:bg-[#0D1117] hover:text-white text-sm"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  const steps = ["Service", "Date & Time", "Your Details"];

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      {/* Header */}
      <div className="bg-[#0D1117] py-12 md:py-16 text-center px-4">
        <h1
          className="text-white text-2xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Book an Appointment
        </h1>
        <p className="text-white/60 text-sm">
          Free first consultation · Confirmed within 30 mins · No hidden charges
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Step indicators */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center font-bold text-xs transition-all ${
                    step > i + 1
                      ? "bg-[#C9A96E] text-white"
                      : step === i + 1
                      ? "bg-[#0D1117] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                    step === i + 1 ? "text-[#0D1117]" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`flex-1 h-px mx-1.5 mb-4 ${
                    step > i + 1 ? "bg-[#C9A96E]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white shadow-[0_4px_24px_rgba(10,37,64,0.08)]">

          {/* ── STEP 1 — Choose service ── */}
          {step === 1 && (
            <div className="p-5 md:p-8">
              <h2
                className="text-[#0D1117] text-lg font-bold mb-5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                What treatment do you need?
              </h2>
              <div className="space-y-2">
                {SERVICES.map(svc => (
                  <button
                    key={svc.label}
                    onClick={() => { set("service", svc.label); setStep(2); }}
                    className="w-full flex items-center justify-between p-3.5 border-2 text-left transition-all active:bg-gray-50 hover:border-[#0D1117] touch-manipulation"
                    style={{
                      borderColor: form.service === svc.label ? "#0D1117" : "#F0F0F0",
                    }}
                  >
                    <span className="font-medium text-[#0D1117] text-sm">{svc.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[#C9A96E] text-xs font-semibold">{svc.price}</span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2 — Date, Time, Doctor ── */}
          {step === 2 && (
            <div className="p-5 md:p-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-[#C9A96E] text-sm mb-4 hover:underline"
              >
                <ArrowLeft size={14} /> Change service
              </button>

              {/* Selected service */}
              <div className="bg-[#F4F7FA] px-4 py-3 mb-5 border-l-2 border-[#C9A96E]">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E]">
                  Selected Service
                </div>
                <div className="font-semibold text-[#0D1117] text-sm mt-0.5">
                  {form.service}
                </div>
              </div>

              <h2
                className="text-[#0D1117] text-lg font-bold mb-5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Choose Date & Time
              </h2>

              {/* Date */}
              <div className="mb-5">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  min={minDateStr}
                  onChange={e => set("date", e.target.value)}
                  className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-[#0D1117] text-sm"
                  style={{ fontSize: "16px" }}
                />
              </div>

              {/* Time slots */}
              {form.date && (
                <div className="mb-5">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-3">
                    Preferred Time *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        onClick={() => set("time", t)}
                        className="py-2.5 border-2 text-xs font-medium transition-all touch-manipulation"
                        style={{
                          backgroundColor: form.time === t ? "#0D1117" : "white",
                          color:           form.time === t ? "white"   : "#374151",
                          borderColor:     form.time === t ? "#0D1117" : "#F0F0F0",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor preference */}
              <div className="mb-6">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-3">
                  Preferred Doctor
                </label>
                <div className="space-y-2">
                  {DOCTORS.map(doc => (
                    <button
                      key={doc.name}
                      onClick={() => set("doctor", doc.name)}
                      className="w-full flex items-center justify-between p-3.5 border-2 text-left transition-all touch-manipulation"
                      style={{
                        borderColor: form.doctor === doc.name ? "#0D1117" : "#F0F0F0",
                      }}
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#0D1117]">{doc.name}</p>
                        <p className="text-xs text-[#4A5568] mt-0.5">
                          {doc.role} · {doc.days}
                        </p>
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
                  if (!form.date || !form.time) {
                    alert("Please select a date and time.");
                    return;
                  }
                  setStep(3);
                }}
                className="w-full bg-[#0D1117] hover:bg-[#C9A96E] text-white font-semibold py-3.5 transition-colors text-sm"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 3 — Personal details ── */}
          {step === 3 && (
            <div className="p-5 md:p-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-[#C9A96E] text-sm mb-4 hover:underline"
              >
                <ArrowLeft size={14} /> Change date/time
              </button>

              {/* Summary */}
              <div className="bg-[#F4F7FA] p-4 mb-5 space-y-2 text-sm">
                {[
                  ["Service", form.service],
                  ["Date",    new Date(form.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })],
                  ["Time",    form.time],
                  ["Doctor",  form.doctor || "No preference"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span className="text-[#4A5568]">{k}</span>
                    <span className="font-semibold text-[#0D1117] text-right">{v}</span>
                  </div>
                ))}
              </div>

              <h2
                className="text-[#0D1117] text-lg font-bold mb-5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Your Details
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-sm"
                    style={{ fontSize: "16px" }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-sm"
                    style={{ fontSize: "16px" }}
                  />
                  <p className="text-[#4A5568] text-xs mt-1">
                    We will send your confirmation to this number
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widests uppercase text-[#0D1117] mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => set("notes", e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Any specific concerns, pain, or questions? (optional)"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors resize-none text-sm"
                    style={{ fontSize: "16px" }}
                  />
                </div>

                {/* ── Consent checkbox ── */}
                <div className="bg-[#F4F7FA] border border-gray-200 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={e => set("consent", e.target.checked)}
                      className="mt-1 w-4 h-4 shrink-0 accent-[#0D1117]"
                    />
                    <span className="text-xs text-[#4A5568] leading-relaxed">
                      I consent to SmileCare Dental Clinic storing my name, phone number
                      and appointment details for the purpose of confirming and managing
                      my appointment. My data will not be shared with third parties.
                      View our{" "}
                      <a
                        href="/privacy"
                        className="text-[#00A3E0] underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !form.consent}
                className="w-full bg-[#0D1117] hover:bg-[#C9A96E] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-colors mt-5 text-sm"
              >
                {loading
                  ? "Saving..."
                  : !form.consent
                  ? "Please accept consent above"
                  : "Confirm Appointment via WhatsApp"}
              </button>

              {/* Security note */}
              <div className="flex items-center justify-center gap-1.5 text-[#4A5568] text-xs mt-3">
                <Shield size={12} className="text-green-500" />
                Your data is encrypted and stored securely
              </div>
            </div>
          )}
        </div>

        {/* Trust row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: "🆓", t: "Free Consult",   s: "No fee" },
            { icon: "⚡", t: "30 Min Confirm", s: "Clinic hours" },
            { icon: "🔒", t: "Secure",          s: "Data protected" },
          ].map(i => (
            <div key={i.t} className="bg-white p-3 text-center shadow-sm">
              <div className="text-xl mb-1">{i.icon}</div>
              <div className="font-bold text-[#0D1117] text-[11px]">{i.t}</div>
              <div className="text-[#4A5568] text-[10px] mt-0.5">{i.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
          <div className="text-[#4A5568] text-sm">Loading...</div>
        </div>
      }
    >
      <AppointmentForm />
    </Suspense>
  );
}

