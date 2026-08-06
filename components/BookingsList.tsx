"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Check, X, MessageCircle } from "lucide-react";

type Booking = {
  _id: string; patientName: string; phone: string; service: string;
  doctorId: string; doctorName: string; date: string; time: string;
  notes: string; confirmationStatus: "pending" | "confirmed" | "cancelled"; createdAt: string;
};

function formatSlot(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"pending" | "confirmed" | "all">("pending");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const q = filter === "all" ? "" : `?status=${filter}`;
    fetch(`/api/bookings${q}`)
      .then(r => r.json())
      .then(data => { if (data.success) setBookings(data.bookings); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id: string, confirmationStatus: "confirmed" | "cancelled") => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmationStatus }),
    });
    load();
  };

  const notifyLink = (b: Booking, message: string) =>
    `https://wa.me/${toWaNumber(b.phone)}?text=${encodeURIComponent(message)}`;

  const confirmMessage = (b: Booking) => [
    `*VEE CARE DENTAL CLINIC*`,
    ``,
    `Hi ${b.patientName}, your appointment is *confirmed*.`,
    ``,
    `Doctor: ${b.doctorName}`,
    `Date: ${new Date(b.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`,
    `Time: ${formatSlot(b.time)}`,
    ``,
    `See you then! Reply to this message if you need to reschedule.`,
  ].join("\n");

  const cancelMessage = (b: Booking) => [
    `*VEE CARE DENTAL CLINIC*`,
    ``,
    `Hi ${b.patientName}, we're sorry — ${b.doctorName} is unavailable on ${new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}.`,
    ``,
    `Please call us or reply to this message to reschedule. Sorry for the inconvenience.`,
  ].join("\n");

  const reminderMessage = (b: Booking) => [
    `*VEE CARE DENTAL CLINIC*`,
    ``,
    `Hi ${b.patientName}, just confirming your upcoming appointment:`,
    ``,
    `Doctor: ${b.doctorName}`,
    `Date: ${new Date(b.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`,
    `Time: ${formatSlot(b.time)}`,
  ].join("\n");

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <div className="bg-[#0D1117] px-6 md:px-10 py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin" className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs mb-3">
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <h1 className="text-white font-bold text-xl flex items-center gap-2">
            <Calendar size={18} /> Bookings
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-8">
        <div className="flex gap-2 mb-6">
          {(["pending", "confirmed", "all"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-bold uppercase tracking-wide px-4 py-2 transition-colors ${
                filter === f ? "bg-[#0D1117] text-white" : "bg-white text-[#4A5568] border border-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-[#4A5568]">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-[#4A5568]">No {filter !== "all" ? filter : ""} bookings.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b._id} className="bg-white border border-gray-100 p-5 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="font-semibold text-[#0D1117]">{b.patientName} <span className="text-xs text-[#4A5568]">· {b.phone}</span></div>
                  <div className="text-sm text-[#4A5568] mt-1">{b.service} with {b.doctorName}</div>
                  <div className="text-xs text-[#4A5568] mt-1">
                    {new Date(b.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · {formatSlot(b.time)}
                  </div>
                  {b.notes && <div className="text-xs text-[#4A5568] mt-1 italic">{b.notes}</div>}
                  <span className={`inline-block mt-2 text-[10px] font-bold uppercase px-2 py-1 ${
                    b.confirmationStatus === "confirmed" ? "bg-green-100 text-green-700" :
                    b.confirmationStatus === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {b.confirmationStatus}
                  </span>
                </div>

                <div className="flex gap-2">
                  {b.confirmationStatus === "pending" && (
                    <>
                      <a
                        href={notifyLink(b, confirmMessage(b))}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => updateStatus(b._id, "confirmed")}
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-2"
                      >
                        <Check size={13} /> Confirm
                      </a>
                      <a
                        href={notifyLink(b, cancelMessage(b))}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => updateStatus(b._id, "cancelled")}
                        className="flex items-center gap-1.5 border border-gray-200 text-[#4A5568] hover:text-red-600 text-xs font-medium px-3 py-2"
                      >
                        <X size={13} /> Cancel
                      </a>
                    </>
                  )}
                  {b.confirmationStatus === "confirmed" && (
                    <a
                      href={notifyLink(b, reminderMessage(b))}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-2"
                    >
                      <MessageCircle size={13} /> Message
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
