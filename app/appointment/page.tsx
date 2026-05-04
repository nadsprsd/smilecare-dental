"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ChevronRight } from "lucide-react";

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

function AppointmentForm() {
  const searchParams = useSearchParams();
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [form,    setForm]    = useState<Form>({
    name: "", phone: "", service: "", doctor: "",
    date: "", time: "", notes: "",
  });

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
      const res  = await fetch("/api/appointments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        alert("Could not save appointment. Please try again.");
        setLoading(false);
        return;
      }

      // WhatsApp notification to clinic
      const phone = process.env.NEXT_PUBLIC_CLINIC_WHATSAPP || "917994072017";
      const message =
        "New Appointment - SmileCare\n\n" +
        "Patient: " + form.name + "\n" +
        "Phone: " + form.phone + "\n" +
        "Service: " + form.service + "\n" +
        "Doctor: " + (form.doctor || "No preference") + "\n" +
        "Date: " + new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) + "\n" +
        "Time: " + form.time + "\n" +
        "Notes: " + (form.notes || "None") + "\n\n" +
        "Booked via SmileCare website";

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center px-4 py-20">
        <div className="bg-white p-8 md:p-12 text-center max-w-md w-full shadow-[0_4px_24px_rgba(10,37,64,0.08)]">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="text-[#0D1117] text-2xl font-bold mb-3" style={{ fontFamily: "Georgia,serif" }}>
            Appointment Requested!
          </h2>
          <p className="text-[#4A5568] mb-6 leading-relaxed text-sm">
            Your request has been saved and sent to our team via WhatsApp.
            We'll confirm within <strong>30 minutes</strong> during clinic hours.
          </p>
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
          <button
            onClick={() => {
              setDone(false);
              setStep(1);
              setForm({ name:"",phone:"",service:"",doctor:"",date:"",time:"",notes:"" });
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
        <h1 className="text-white text-2xl md:text-4xl font-bold mb-2" style={{ fontFamily: "Georgia,serif" }}>
          Book an Appointment
        </h1>
        <p className="text-white/60 text-sm">
          Free first consultation · Confirmed within 30 mins
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Step indicators */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs transition-all ${
                  step > i + 1 ? "bg-[#C9A96E] text-white" :
                  step === i + 1 ? "bg-[#0D1117] text-white" :
                  "bg-gray-200 text-gray-400"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                  step === i + 1 ? "text-[#0D1117]" : "text-gray-400"
                }`}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-px mx-1.5 mb-4 ${step > i + 1 ? "bg-[#C9A96E]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white shadow-[0_4px_24px_rgba(10,37,64,0.08)]">

          {/* STEP 1 — Service */}
          {step === 1 && (
            <div className="p-5 md:p-8">
              <h2 className="text-[#0D1117] text-lg font-bold mb-5" style={{ fontFamily: "Georgia,serif" }}>
                What treatment do you need?
              </h2>
              <div className="space-y-2">
                {SERVICES.map(svc => (
                  <button
                    key={svc.label}
                    onClick={() => { set("service", svc.label); setStep(2); }}
                    className="w-full flex items-center justify-between p-3.5 border-2 text-left transition-all active:bg-gray-50 hover:border-[#0D1117] touch-manipulation"
                    style={{ borderColor: form.service === svc.label ? "#0D1117" : "#F0F0F0" }}
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

          {/* STEP 2 — Date, Time, Doctor */}
          {step === 2 && (
            <div className="p-5 md:p-8">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[#C9A96E] text-sm mb-4 hover:underline">
                <ArrowLeft size={14} /> Change service
              </button>

              <div className="bg-[#F4F7FA] px-4 py-3 mb-5 border-l-2 border-[#C9A96E]">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#C9A96E]">Selected</div>
                <div className="font-semibold text-[#0D1117] text-sm mt-0.5">{form.service}</div>
              </div>

              <h2 className="text-[#0D1117] text-lg font-bold mb-5" style={{ fontFamily: "Georgia,serif" }}>
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

              {/* Time */}
              {form.date && (
                <div className="mb-5">
                  <label className="block text-[10px] font-bold tracking-widests uppercase text-[#0D1117] mb-3">
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
                          color:           form.time === t ? "white" : "#374151",
                          borderColor:     form.time === t ? "#0D1117" : "#F0F0F0",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor */}
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
                      style={{ borderColor: form.doctor === doc.name ? "#0D1117" : "#F0F0F0" }}
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
                className="w-full bg-[#0D1117] hover:bg-[#C9A96E] text-white font-semibold py-3.5 transition-colors text-sm"
              >
                Continue →
              </button>
            </div>
          )}

          {/* STEP 3 — Personal details */}
          {step === 3 && (
            <div className="p-5 md:p-8">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-[#C9A96E] text-sm mb-4 hover:underline">
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

              <h2 className="text-[#0D1117] text-lg font-bold mb-5" style={{ fontFamily: "Georgia,serif" }}>
                Your Details
              </h2>

              <div className="space-y-4">
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
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    WhatsApp Number *
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
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => set("notes", e.target.value)}
                    rows={3}
                    placeholder="Any specific concerns or questions?"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors resize-none text-sm"
                    style={{ fontSize: "16px" }}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#0D1117] hover:bg-[#C9A96E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-colors mt-6 text-sm"
              >
                {loading ? "Saving..." : "Confirm Appointment via WhatsApp"}
              </button>
              <p className="text-center text-[#4A5568] text-xs mt-3">
                Saves to our system · Sends WhatsApp to clinic · Free first consultation
              </p>
            </div>
          )}
        </div>

        {/* Trust row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: "🆓", t: "Free Consult",  s: "No fee" },
            { icon: "⚡", t: "30 Min Confirm", s: "Clinic hours" },
            { icon: "🔒", t: "Secure",         s: "Data safe" },
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
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
        <div className="text-[#4A5568] text-sm">Loading...</div>
      </div>
    }>
      <AppointmentForm />
    </Suspense>
  );
}

