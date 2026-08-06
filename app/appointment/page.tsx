"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowLeft, ChevronRight, Shield, Clock } from "lucide-react";
import { SERVICES } from "@/lib/doctors";

type DoctorSlot = {
  id: string;
  name: string;
  specialty: string;
  type: "full-time" | "on-call";
  availableSlots: string[];
};

type Form = {
  name:     string;
  phone:    string;
  service:  string;
  date:     string;
  doctorId: string;
  time:     string;
  notes:    string;
  consent:  boolean;
};

function formatSlot(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function AppointmentForm() {
  const searchParams = useSearchParams();
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [confirmedTier, setConfirmedTier] = useState<"confirmed" | "pending">("confirmed");
  const [form,    setForm]    = useState<Form>({
    name: "", phone: "", service: "", date: "", doctorId: "", time: "", notes: "", consent: false,
  });

  const [doctors, setDoctors]   = useState<DoctorSlot[]>([]);
  const [checking, setChecking] = useState(false);
  const [availError, setAvailError] = useState("");

  useEffect(() => {
    const service = searchParams.get("service");
    if (service) setForm(f => ({ ...f, service: decodeURIComponent(service) }));
  }, [searchParams]);

  const set = (k: keyof Form, v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v }));

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  // Fetch live availability whenever service + date are both chosen
  useEffect(() => {
    if (!form.service || !form.date) { setDoctors([]); return; }
    setChecking(true);
    setAvailError("");
    fetch(`/api/bookings/availability?service=${encodeURIComponent(form.service)}&date=${form.date}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setDoctors(data.doctors || []);
          if (data.message) setAvailError(data.message);
        } else {
          setAvailError("Could not check availability. Please try again.");
        }
      })
      .catch(() => setAvailError("Could not check availability. Please try again."))
      .finally(() => setChecking(false));
  }, [form.service, form.date]);

  const selectedDoctor = doctors.find(d => d.id === form.doctorId);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.service || !form.date || !form.time || !form.doctorId) {
      alert("Please fill all required fields.");
      return;
    }
    if (!form.consent) {
      alert("Please accept the consent to proceed.");
      return;
    }

    const phoneClean = form.phone.replace(/\D/g, "");
    if (phoneClean.length !== 10 || !/^[6-9]/.test(phoneClean)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/bookings", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          patientName: form.name.trim(),
          phone:       phoneClean,
          service:     form.service,
          doctorId:    form.doctorId,
          date:        form.date,
          time:        form.time,
          notes:       form.notes.trim(),
          consent:     true,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        alert(data.message || "That slot was just taken. Please pick another.");
        setForm(f => ({ ...f, time: "", doctorId: "" }));
        setLoading(false);
        return;
      }

      if (!data.success) {
        alert(data.message || "Could not save your booking. Please try again.");
        setLoading(false);
        return;
      }

      setConfirmedTier(data.booking?.confirmationStatus === "pending" ? "pending" : "confirmed");

      // WhatsApp notification to the clinic — plain text, no emojis
      const clinicPhone = process.env.NEXT_PUBLIC_CLINIC_WHATSAPP || "918075243127";
      const message =
        "New Booking - Vee Care\n\n" +
        "Patient: " + form.name + "\n" +
        "Phone: " + phoneClean + "\n" +
        "Service: " + form.service + "\n" +
        "Doctor: " + (selectedDoctor?.name || "") + "\n" +
        "Date: " + new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) + "\n" +
        "Time: " + formatSlot(form.time) + "\n" +
        "Status: " + (data.booking?.confirmationStatus === "pending" ? "PENDING - on-call doctor, needs confirmation" : "Confirmed") + "\n" +
        "Notes: " + (form.notes || "None") + "\n\n" +
        "Booked via Vee Care website";

      window.open(`https://wa.me/${clinicPhone}?text=${encodeURIComponent(message)}`, "_blank");

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
      <div className="min-h-screen bg-[#F2EDE3] flex items-center justify-center px-4 py-20">
        <div className="bg-white p-8 md:p-12 text-center max-w-md w-full shadow-[0_4px_24px_rgba(10,37,64,0.08)]">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="text-[#0D1117] text-2xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>
            {confirmedTier === "confirmed" ? "Appointment Confirmed!" : "Booking Received!"}
          </h2>
          <p className="text-[#4A5568] mb-6 leading-relaxed text-sm">
            {confirmedTier === "confirmed"
              ? "Your slot is locked in — we'll see you then."
              : "This is with an on-call specialist, so our team is confirming their availability for that day. We'll message you on WhatsApp to confirm shortly — please wait for that before making the trip."}
          </p>

          <div className="bg-[#F2EDE3] p-4 text-left space-y-2 text-sm mb-6">
            {[
              ["Service", form.service],
              ["Doctor",  selectedDoctor?.name || ""],
              ["Date",    new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
              ["Time",    formatSlot(form.time)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-[#4A5568]">{k}</span>
                <span className="font-semibold text-[#0D1117] text-right">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[#4A5568] text-xs mb-6">
            <Shield size={12} className="text-green-500" />
            Your data is stored securely and protected
          </div>

          <button
            onClick={() => {
              setDone(false); setStep(1);
              setForm({ name: "", phone: "", service: "", date: "", doctorId: "", time: "", notes: "", consent: false });
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
    <div className="min-h-screen bg-[#F2EDE3]">

      <div className="bg-[#0D1117] py-12 md:py-16 text-center px-4">
        <h1 className="text-white text-2xl md:text-4xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Book an Appointment
        </h1>
        <p className="text-white/60 text-sm">
          Free first consultation · Real-time availability · No hidden charges
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Step indicators */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs transition-all ${
                  step > i + 1 ? "bg-[#C1583B] text-white" : step === i + 1 ? "bg-[#0D1117] text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${step === i + 1 ? "text-[#0D1117]" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-1.5 mb-4 ${step > i + 1 ? "bg-[#C1583B]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white shadow-[0_4px_24px_rgba(10,37,64,0.08)]">

          {/* ── STEP 1 — Choose service ── */}
          {step === 1 && (
            <div className="p-5 md:p-8">
              <h2 className="text-[#0D1117] text-lg font-bold mb-5" style={{ fontFamily: "Georgia, serif" }}>
                What treatment do you need?
              </h2>
              <div className="space-y-2">
                {SERVICES.map(svc => (
                  <button
                    key={svc}
                    onClick={() => { set("service", svc); set("doctorId", ""); set("time", ""); setStep(2); }}
                    className="w-full flex items-center justify-between p-3.5 border-2 text-left transition-all active:bg-gray-50 hover:border-[#0D1117] touch-manipulation"
                    style={{ borderColor: form.service === svc ? "#0D1117" : "#F0F0F0" }}
                  >
                    <span className="font-medium text-[#0D1117] text-sm">{svc}</span>
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2 — Date, then live doctor + slot availability ── */}
          {step === 2 && (
            <div className="p-5 md:p-8">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[#C1583B] text-sm mb-4 hover:underline">
                <ArrowLeft size={14} /> Change service
              </button>

              <div className="bg-[#F2EDE3] px-4 py-3 mb-5 border-l-2 border-[#C1583B]">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#C1583B]">Selected Service</div>
                <div className="font-semibold text-[#0D1117] text-sm mt-0.5">{form.service}</div>
              </div>

              <h2 className="text-[#0D1117] text-lg font-bold mb-5" style={{ fontFamily: "Georgia, serif" }}>
                Choose Date, Doctor & Time
              </h2>

              <div className="mb-5">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Preferred Date *</label>
                <input
                  type="date"
                  value={form.date}
                  min={minDateStr}
                  onChange={e => { set("date", e.target.value); set("doctorId", ""); set("time", ""); }}
                  className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-[#0D1117] text-sm"
                  style={{ fontSize: "16px" }}
                />
              </div>

              {form.date && checking && (
                <p className="text-sm text-[#4A5568] mb-4">Checking availability…</p>
              )}

              {form.date && !checking && availError && (
                <p className="text-sm text-[#C1583B] mb-4">{availError}</p>
              )}

              {form.date && !checking && !availError && doctors.length === 0 && (
                <p className="text-sm text-[#4A5568] mb-4">No doctors available for this service on this date. Please try a different date.</p>
              )}

              {doctors.map(doc => (
                <div key={doc.id} className="mb-5">
                  <button
                    onClick={() => { set("doctorId", doc.id); set("time", ""); }}
                    className="w-full flex items-center justify-between p-3.5 border-2 text-left transition-all touch-manipulation mb-2"
                    style={{ borderColor: form.doctorId === doc.id ? "#0D1117" : "#F0F0F0" }}
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#0D1117]">{doc.name}</p>
                      <p className="text-xs text-[#4A5568] mt-0.5">
                        {doc.specialty}
                        {doc.type === "on-call" && <span className="text-[#C1583B] font-medium"> · Subject to confirmation</span>}
                      </p>
                    </div>
                    {form.doctorId === doc.id && <CheckCircle size={17} className="text-[#C1583B] shrink-0" />}
                  </button>

                  {form.doctorId === doc.id && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {doc.availableSlots.map(t => (
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
                          {formatSlot(t)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => {
                  if (!form.date || !form.doctorId || !form.time) {
                    alert("Please select a date, doctor, and time.");
                    return;
                  }
                  setStep(3);
                }}
                className="w-full bg-[#0D1117] hover:bg-[#C1583B] text-white font-semibold py-3.5 transition-colors text-sm mt-2"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 3 — Personal details ── */}
          {step === 3 && (
            <div className="p-5 md:p-8">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-[#C1583B] text-sm mb-4 hover:underline">
                <ArrowLeft size={14} /> Change date/time
              </button>

              <div className="bg-[#F2EDE3] p-4 mb-5 space-y-2 text-sm">
                {[
                  ["Service", form.service],
                  ["Doctor",  selectedDoctor?.name || ""],
                  ["Date",    new Date(form.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })],
                  ["Time",    formatSlot(form.time)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span className="text-[#4A5568]">{k}</span>
                    <span className="font-semibold text-[#0D1117] text-right">{v}</span>
                  </div>
                ))}
              </div>

              {selectedDoctor?.type === "on-call" && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 px-4 py-3 mb-5 text-xs text-amber-800">
                  <Clock size={14} className="shrink-0 mt-0.5" />
                  This doctor is an on-call specialist — we'll confirm their presence and message you on WhatsApp before your visit.
                </div>
              )}

              <h2 className="text-[#0D1117] text-lg font-bold mb-5" style={{ fontFamily: "Georgia, serif" }}>Your Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Full Name *</label>
                  <input
                    type="text" value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-sm"
                    style={{ fontSize: "16px" }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">WhatsApp Number *</label>
                  <input
                    type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="10-digit mobile number" maxLength={10}
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors text-sm"
                    style={{ fontSize: "16px" }}
                  />
                  <p className="text-[#4A5568] text-xs mt-1">We will send your confirmation to this number</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Additional Notes</label>
                  <textarea
                    value={form.notes} onChange={e => set("notes", e.target.value)}
                    rows={3} maxLength={500}
                    placeholder="Any specific concerns, pain, or questions? (optional)"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors resize-none text-sm"
                    style={{ fontSize: "16px" }}
                  />
                </div>

                <div className="bg-[#F2EDE3] border border-gray-200 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox" checked={form.consent} onChange={e => set("consent", e.target.checked)}
                      className="mt-1 w-4 h-4 shrink-0 accent-[#0D1117]"
                    />
                    <span className="text-xs text-[#4A5568] leading-relaxed">
                      I consent to Vee Care Dental Clinic storing my name, phone number
                      and appointment details for the purpose of confirming and managing
                      my appointment. My data will not be shared with third parties.
                      View our{" "}
                      <a href="/privacy" className="text-[#00A3E0] underline" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !form.consent}
                className="w-full bg-[#0D1117] hover:bg-[#C1583B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-colors mt-5 text-sm"
              >
                {loading ? "Booking..." : !form.consent ? "Please accept consent above" : "Confirm Booking"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[#4A5568] text-xs mt-3">
                <Shield size={12} className="text-green-500" />
                Your data is encrypted and stored securely
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: "🆓", t: "Free Consult", s: "No fee" },
            { icon: "⚡", t: "Real-Time Slots", s: "No double-booking" },
            { icon: "🔒", t: "Secure", s: "Data protected" },
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
        <div className="min-h-screen bg-[#F2EDE3] flex items-center justify-center">
          <div className="text-[#4A5568] text-sm">Loading...</div>
        </div>
      }
    >
      <AppointmentForm />
    </Suspense>
  );
}
